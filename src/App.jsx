import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { GameSetup } from './components/GameSetup';
import { GameHUD } from './components/GameHUD';
import { RaceTrack } from './components/RaceTrack';
import { QuestionCard } from './components/QuestionCard';
import { ResultsScreen } from './components/ResultsScreen';
import { HowToPlayModal } from './components/HowToPlayModal';

import { generateRaceQuestions, OPERATIONS } from './utils/questionGenerator';
import { useGameTimer } from './hooks/useGameTimer';
import {
  calculateAccuracy,
  calculateCompletionRate,
  calculateMaxScore
} from './utils/scoring';
import {
  getPersonalBest,
  savePersonalBest,
  getSoundPreference,
  saveSoundPreference,
  getSavedSettings,
  saveSettings
} from './utils/storage';
import { playSound } from './utils/soundEffects';

const DEFAULT_SETTINGS = {
  difficulty: 'easy',
  questionCount: 10,
  operations: [
    OPERATIONS.ADD,
    OPERATIONS.SUBTRACT,
    OPERATIONS.MULTIPLY,
    OPERATIONS.DIVIDE
  ],
  numberRange: '1-10',
  gameMode: 'timed', // 'timed' | 'practice'
  timerDuration: 60
};

export default function App() {
  // Navigation & Modal states
  const [gameState, setGameState] = useState('home'); // 'home' | 'setup' | 'playing' | 'results'
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(getSoundPreference);
  const [personalBest, setPersonalBest] = useState(getPersonalBest);

  // Settings
  const [settings, setSettings] = useState(() => {
    const saved = getSavedSettings();
    return saved ? { ...DEFAULT_SETTINGS, ...saved } : DEFAULT_SETTINGS;
  });

  // Gameplay state
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [scoreDelta, setScoreDelta] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [runnerPosition, setRunnerPosition] = useState(0);
  const [runnerState, setRunnerState] = useState('idle'); // 'idle' | 'running' | 'stumble' | 'celebrate'
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null); // { isCorrect: boolean, correctAnswer: number }
  const [userAnswers, setUserAnswers] = useState([]); // Array of question review objects
  const [raceOutcome, setRaceOutcome] = useState('completed'); // 'completed' | 'timeout'
  const [isNewPersonalBest, setIsNewPersonalBest] = useState(false);

  // Reference to prevent stale timeout handling during transitions
  const transitionTimeoutRef = useRef(null);

  // Sound toggle handler
  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    saveSoundPreference(nextVal);
    if (nextVal) playSound('click', true);
  };

  // Timer callbacks
  const handleTimeUp = useCallback(() => {
    playSound('finish', soundEnabled);
    setRunnerState('idle');
    setIsAnswerLocked(true);

    // Conclude race due to timeout
    setQuestions((currentQuestions) => {
      setUserAnswers((prevAnswers) => {
        // Find which questions were not answered
        const answeredIds = new Set(prevAnswers.map((a) => a.id));
        const missingAnswers = currentQuestions
          .filter((q) => !answeredIds.has(q.id))
          .map((q) => ({
            id: q.id,
            questionNumber: q.questionNumber,
            displayText: q.displayText,
            operandA: q.operandA,
            operator: q.operator,
            operandB: q.operandB,
            correctAnswer: q.correctAnswer,
            userAnswer: null,
            isCorrect: false,
            status: 'unanswered'
          }));

        const finalReview = [...prevAnswers, ...missingAnswers];

        // Evaluate personal best
        setScore((finalScore) => {
          const correct = finalReview.filter((r) => r.status === 'correct').length;
          const answered = finalReview.filter((r) => r.status !== 'unanswered').length;
          const accuracy = calculateAccuracy(correct, answered);
          const isNewRecord = savePersonalBest(finalScore, accuracy, {
            difficulty: settings.difficulty,
            totalQuestions: settings.questionCount,
            mode: settings.gameMode
          });

          if (isNewRecord) {
            setIsNewPersonalBest(true);
            setPersonalBest(getPersonalBest());
          }

          return finalScore;
        });

        return finalReview;
      });

      return currentQuestions;
    });

    setRaceOutcome('timeout');
    setGameState('results');
  }, [soundEnabled, settings]);

  const handleTimerTick = useCallback((seconds) => {
    if (seconds <= 5 && seconds > 0) {
      playSound('tick', soundEnabled);
    }
  }, [soundEnabled]);

  // Game timer hook
  const {
    timeLeft,
    elapsedTime,
    startTimer,
    stopTimer,
    resetTimer,
    getRecordedElapsedTime
  } = useGameTimer({
    mode: settings.gameMode,
    duration: settings.timerDuration,
    onTimeUp: handleTimeUp,
    onTick: handleTimerTick
  });

  // Clean up any pending timeouts on unmount or navigation
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Initialize and start a new race
  const startRaceWithConfig = (config) => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // Save settings
    setSettings(config);
    saveSettings(config);

    // Generate questions defensively
    const newQuestions = generateRaceQuestions({
      count: config.questionCount,
      operations: config.operations,
      range: config.numberRange,
      difficulty: config.difficulty
    });

    // Reset game state
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setScoreDelta(0);
    setStreak(0);
    setBestStreak(0);
    setRunnerPosition(0);
    setRunnerState('idle');
    setSelectedAnswer(null);
    setIsAnswerLocked(false);
    setCurrentFeedback(null);
    setUserAnswers([]);
    setRaceOutcome('completed');
    setIsNewPersonalBest(false);

    // Switch screen to playing
    setGameState('playing');

    // Reset and start timer
    resetTimer(config.timerDuration);
    startTimer();
    playSound('click', soundEnabled);
  };

  // Quick start from Welcome Screen
  const handleStartFromHome = () => {
    setGameState('setup');
    playSound('click', soundEnabled);
  };

  // Submit Answer Logic
  const handleSelectOption = (option) => {
    if (isAnswerLocked || gameState !== 'playing') return;

    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;

    setIsAnswerLocked(true);
    setSelectedAnswer(option);

    const isCorrect = option === currentQ.correctAnswer;
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    // Record review item
    const reviewItem = {
      id: currentQ.id,
      questionNumber: currentQ.questionNumber,
      displayText: currentQ.displayText,
      operandA: currentQ.operandA,
      operator: currentQ.operator,
      operandB: currentQ.operandB,
      correctAnswer: currentQ.correctAnswer,
      userAnswer: option,
      isCorrect,
      status: isCorrect ? 'correct' : 'incorrect'
    };

    setUserAnswers((prev) => [...prev, reviewItem]);

    // Handle Scoring & Animations
    if (isCorrect) {
      playSound('correct', soundEnabled);
      setScore((s) => s + 10);
      setScoreDelta(10);
      setStreak((st) => {
        const next = st + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });

      // Runner advances one checkpoint
      setRunnerPosition((pos) => Math.min(questions.length, pos + 1));
      setRunnerState('running');
      playSound('checkpoint', soundEnabled);

      setCurrentFeedback({ isCorrect: true, correctAnswer: currentQ.correctAnswer });
    } else {
      playSound('incorrect', soundEnabled);
      setStreak(0);
      setRunnerState('stumble');
      setCurrentFeedback({ isCorrect: false, correctAnswer: currentQ.correctAnswer });
    }

    // Schedule transition to next question or results
    const delay = isCorrect ? 900 : 1200;

    transitionTimeoutRef.current = setTimeout(() => {
      // Revert runner back to idle unless celebrating
      if (isLastQuestion && isCorrect) {
        setRunnerState('celebrate');
      } else {
        setRunnerState('idle');
      }

      if (isLastQuestion) {
        // Race is finished!
        stopTimer();
        playSound('finish', soundEnabled);

        // Calculate and save personal best
        setScore((finalScore) => {
          const updatedAnswers = [...userAnswers, reviewItem];
          const correctCount = updatedAnswers.filter((a) => a.isCorrect).length;
          const answeredCount = updatedAnswers.length;
          const accuracy = calculateAccuracy(correctCount, answeredCount);

          const isNewRecord = savePersonalBest(finalScore, accuracy, {
            difficulty: settings.difficulty,
            totalQuestions: settings.questionCount,
            mode: settings.gameMode
          });

          if (isNewRecord) {
            setIsNewPersonalBest(true);
            setPersonalBest(getPersonalBest());
          }

          return finalScore;
        });

        setRaceOutcome('completed');
        setGameState('results');
      } else {
        // Advance to next question
        setCurrentQuestionIndex((idx) => idx + 1);
        setSelectedAnswer(null);
        setCurrentFeedback(null);
        setIsAnswerLocked(false);
      }
    }, delay);
  };

  // Replay actions
  const handlePlayAgain = () => {
    startRaceWithConfig(settings);
  };

  const handleChangeSettings = () => {
    stopTimer();
    setGameState('setup');
    playSound('click', soundEnabled);
  };

  const handleGoHome = () => {
    stopTimer();
    setGameState('home');
    playSound('click', soundEnabled);
  };

  // Compute final statistics for results screen
  const correctCount = userAnswers.filter((a) => a.status === 'correct').length;
  const incorrectCount = userAnswers.filter((a) => a.status === 'incorrect').length;
  const unansweredCount = userAnswers.filter((a) => a.status === 'unanswered').length;
  const answeredCount = correctCount + incorrectCount;
  const accuracy = calculateAccuracy(correctCount, answeredCount);
  const completionRate = calculateCompletionRate(answeredCount, questions.length || settings.questionCount);
  const timeTaken = getRecordedElapsedTime();

  return (
    <div className="app-wrapper">
      {/* Top Persistent Header */}
      <Header
        personalBest={personalBest}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        gameState={gameState}
        onNavigateHome={handleGoHome}
      />

      <main className="main-content">
        <div className="container">
          {/* SCREEN A: WELCOME / HOME */}
          {gameState === 'home' && (
            <WelcomeScreen
              personalBest={personalBest}
              onStartRace={handleStartFromHome}
              onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
            />
          )}

          {/* SCREEN B: GAME SETUP */}
          {gameState === 'setup' && (
            <GameSetup
              initialSettings={settings}
              onStartRace={startRaceWithConfig}
              onBack={handleGoHome}
            />
          )}

          {/* SCREEN C: ACTIVE GAMEPLAY */}
          {gameState === 'playing' && (
            <div className="active-gameplay-wrapper">
              {/* AREA 1 — GAME HUD */}
              <GameHUD
                score={score}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                mode={settings.gameMode}
                timeLeft={timeLeft}
                elapsedTime={elapsedTime}
                streak={streak}
                scoreDelta={scoreDelta}
              />

              {/* AREA 2 — RACE TRACK */}
              <RaceTrack
                totalCheckpoints={questions.length}
                currentPosition={runnerPosition}
                runnerState={runnerState}
              />

              {/* AREA 3 — QUESTION CARD */}
              <QuestionCard
                question={questions[currentQuestionIndex]}
                questionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                selectedAnswer={selectedAnswer}
                hasAnswered={isAnswerLocked}
                isCorrect={currentFeedback?.isCorrect ?? null}
                disabled={isAnswerLocked}
                onSelectOption={handleSelectOption}
              />
            </div>
          )}

          {/* SCREEN D: RESULTS SCREEN */}
          {gameState === 'results' && (
            <ResultsScreen
              score={score}
              maxScore={calculateMaxScore(questions.length || settings.questionCount)}
              correctCount={correctCount}
              incorrectCount={incorrectCount}
              unansweredCount={unansweredCount}
              answeredCount={answeredCount}
              totalQuestions={questions.length || settings.questionCount}
              accuracy={accuracy}
              completionRate={completionRate}
              timeTaken={timeTaken}
              bestStreak={bestStreak}
              isNewPersonalBest={isNewPersonalBest}
              raceOutcome={raceOutcome}
              reviewItems={userAnswers}
              onPlayAgain={handlePlayAgain}
              onChangeSettings={handleChangeSettings}
              onGoHome={handleGoHome}
            />
          )}
        </div>
      </main>

      {/* Global How to Play Modal */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />
    </div>
  );
}
