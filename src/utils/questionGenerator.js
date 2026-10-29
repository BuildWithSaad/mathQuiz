/**
 * Comprehensive Question Generation System for Math Relay
 * Adheres strictly to difficulty rules, number ranges, whole-number division,
 * non-negative subtraction, plausible distractors, and deduplication.
 */

export const OPERATIONS = {
  ADD: '+',
  SUBTRACT: '-',
  MULTIPLY: '*',
  DIVIDE: '/'
};

export const DISPLAY_SYMBOLS = {
  [OPERATIONS.ADD]: '+',
  [OPERATIONS.SUBTRACT]: '−',
  [OPERATIONS.MULTIPLY]: '×',
  [OPERATIONS.DIVIDE]: '÷'
};

/**
 * Helper to get random integer between min and max (inclusive)
 */
const getRandomInt = (min, max) => {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
};

/**
 * Fisher-Yates array shuffle
 */
const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * Parse range string like '1-10', '1-50', '1-100'
 */
export const parseRange = (rangeStr) => {
  switch (rangeStr) {
    case '1-50':
      return { min: 1, max: 50 };
    case '1-100':
      return { min: 1, max: 100 };
    case '1-10':
    default:
      return { min: 1, max: 10 };
  }
};

/**
 * Generate a single question based on operator, range, and difficulty
 */
const generateRawQuestion = (operator, rangeConfig, difficulty) => {
  const { min, max } = rangeConfig;
  let operandA, operandB, correctAnswer;

  // Adjust bounds based on difficulty
  switch (operator) {
    case OPERATIONS.ADD: {
      if (difficulty === 'easy') {
        const top = Math.min(max, rangeConfig.max === 10 ? 10 : Math.round(max * 0.4));
        operandA = getRandomInt(min, top);
        operandB = getRandomInt(min, top);
      } else if (difficulty === 'medium') {
        const low = Math.max(min, Math.round(max * 0.15));
        const top = Math.min(max, Math.round(max * 0.75));
        operandA = getRandomInt(low, top);
        operandB = getRandomInt(min, top);
      } else {
        // hard
        const low = Math.max(min, Math.round(max * 0.3));
        operandA = getRandomInt(low, max);
        operandB = getRandomInt(low, max);
      }
      correctAnswer = operandA + operandB;
      break;
    }

    case OPERATIONS.SUBTRACT: {
      let a, b;
      if (difficulty === 'easy') {
        const top = Math.min(max, rangeConfig.max === 10 ? 10 : Math.round(max * 0.4));
        a = getRandomInt(min, top);
        b = getRandomInt(min, top);
      } else if (difficulty === 'medium') {
        const top = Math.min(max, Math.round(max * 0.8));
        a = getRandomInt(min + 2, top);
        b = getRandomInt(min, a);
      } else {
        // hard
        a = getRandomInt(Math.max(min + 5, Math.round(max * 0.4)), max);
        b = getRandomInt(min, a);
      }
      // Ensure operandA >= operandB (no negative answers)
      operandA = Math.max(a, b);
      operandB = Math.min(a, b);
      correctAnswer = operandA - operandB;
      break;
    }

    case OPERATIONS.MULTIPLY: {
      let tableLimitA, tableLimitB;
      if (rangeConfig.max <= 10) {
        if (difficulty === 'easy') {
          tableLimitA = [1, 2, 3, 4, 5, 10];
          tableLimitB = [1, 2, 3, 4, 5, 10];
        } else if (difficulty === 'medium') {
          tableLimitA = [2, 3, 4, 5, 6, 7, 8, 9];
          tableLimitB = [2, 3, 4, 5, 6, 7, 8, 9];
        } else {
          tableLimitA = [6, 7, 8, 9, 10];
          tableLimitB = [6, 7, 8, 9, 10];
        }
        operandA = tableLimitA[getRandomInt(0, tableLimitA.length - 1)];
        operandB = tableLimitB[getRandomInt(0, tableLimitB.length - 1)];
      } else if (rangeConfig.max <= 50) {
        if (difficulty === 'easy') {
          operandA = getRandomInt(2, 9);
          operandB = getRandomInt(2, 5);
        } else if (difficulty === 'medium') {
          operandA = getRandomInt(3, 12);
          operandB = getRandomInt(3, 8);
        } else {
          operandA = getRandomInt(6, 15);
          operandB = getRandomInt(4, 12);
        }
      } else {
        // 1-100 range
        if (difficulty === 'easy') {
          operandA = getRandomInt(2, 10);
          operandB = getRandomInt(2, 10);
        } else if (difficulty === 'medium') {
          operandA = getRandomInt(4, 15);
          operandB = getRandomInt(3, 12);
        } else {
          operandA = getRandomInt(7, 25);
          operandB = getRandomInt(4, 15);
        }
      }
      correctAnswer = operandA * operandB;
      break;
    }

    case OPERATIONS.DIVIDE: {
      // Whole-number division: generate divisor B (>=1) and quotient C, then dividend A = B * C
      let divisor, quotient;
      if (rangeConfig.max <= 10) {
        if (difficulty === 'easy') {
          divisor = getRandomInt(1, 4);
          quotient = getRandomInt(1, 4);
        } else if (difficulty === 'medium') {
          divisor = getRandomInt(2, 5);
          quotient = getRandomInt(2, 5);
        } else {
          divisor = getRandomInt(2, 5);
          quotient = getRandomInt(3, 6);
        }
      } else if (rangeConfig.max <= 50) {
        if (difficulty === 'easy') {
          divisor = getRandomInt(2, 6);
          quotient = getRandomInt(2, 8);
        } else if (difficulty === 'medium') {
          divisor = getRandomInt(3, 8);
          quotient = getRandomInt(3, 10);
        } else {
          divisor = getRandomInt(4, 12);
          quotient = getRandomInt(4, 12);
        }
      } else {
        // 100 range
        if (difficulty === 'easy') {
          divisor = getRandomInt(2, 8);
          quotient = getRandomInt(2, 10);
        } else if (difficulty === 'medium') {
          divisor = getRandomInt(3, 12);
          quotient = getRandomInt(4, 14);
        } else {
          divisor = getRandomInt(4, 16);
          quotient = getRandomInt(5, 20);
        }
      }

      operandB = divisor;
      correctAnswer = quotient;
      operandA = divisor * quotient;
      break;
    }

    default:
      operandA = 5;
      operandB = 5;
      correctAnswer = 10;
  }

  return { operandA, operator, operandB, correctAnswer };
};

/**
 * Generate 3 plausible and unique distractors for a question
 */
const generateDistractors = (operandA, operator, operandB, correctAnswer) => {
  const distractors = new Set();
  const candidates = [];

  // 1. Off-by-one and off-by-two
  candidates.push(correctAnswer + 1);
  if (correctAnswer - 1 >= 0) candidates.push(correctAnswer - 1);
  candidates.push(correctAnswer + 2);
  if (correctAnswer - 2 >= 0) candidates.push(correctAnswer - 2);

  // 2. Off-by-ten (common carry error)
  if (correctAnswer + 10 > 0) candidates.push(correctAnswer + 10);
  if (correctAnswer - 10 >= 0) candidates.push(correctAnswer - 10);

  // 3. Alternative operator confusion
  if (operator === OPERATIONS.ADD) {
    if (operandA * operandB !== correctAnswer) candidates.push(operandA * operandB);
    if (operandA - operandB >= 0 && operandA - operandB !== correctAnswer) {
      candidates.push(operandA - operandB);
    }
  } else if (operator === OPERATIONS.MULTIPLY) {
    candidates.push(operandA + operandB);
    candidates.push(correctAnswer + operandB); // Missing one group
    if (correctAnswer - operandB >= 0) candidates.push(correctAnswer - operandB);
  } else if (operator === OPERATIONS.SUBTRACT) {
    candidates.push(operandA + operandB);
  } else if (operator === OPERATIONS.DIVIDE) {
    candidates.push(operandA - operandB);
    candidates.push(correctAnswer + 1);
  }

  // 4. Inversion / Digit Swap if 2 digits (e.g. 72 -> 27)
  if (correctAnswer >= 12 && correctAnswer <= 98) {
    const tens = Math.floor(correctAnswer / 10);
    const ones = correctAnswer % 10;
    if (tens !== ones && ones > 0) {
      candidates.push(ones * 10 + tens);
    }
  }

  // Filter candidates: must be >= 0, distinct, not equal to correctAnswer
  for (const c of candidates) {
    if (c >= 0 && c !== correctAnswer && !distractors.has(c)) {
      distractors.add(c);
      if (distractors.size === 3) break;
    }
  }

  // If still need more distractors, generate mathematically close offsets
  let offset = 3;
  while (distractors.size < 3 && offset < 50) {
    const higher = correctAnswer + offset;
    const lower = correctAnswer - offset;

    if (!distractors.has(higher) && higher !== correctAnswer) {
      distractors.add(higher);
    }
    if (distractors.size < 3 && lower >= 0 && !distractors.has(lower) && lower !== correctAnswer) {
      distractors.add(lower);
    }
    offset += getRandomInt(1, 4);
  }

  // Ultimate fallback to guarantee 3 distractors
  let fallback = 1;
  while (distractors.size < 3) {
    const val = correctAnswer + fallback * 3 + 1;
    if (val !== correctAnswer && !distractors.has(val)) {
      distractors.add(val);
    }
    fallback++;
  }

  return Array.from(distractors).slice(0, 3);
};

/**
 * Generate a complete sequence of questions for the race
 */
export const generateRaceQuestions = ({
  count = 10,
  operations = [OPERATIONS.ADD, OPERATIONS.SUBTRACT, OPERATIONS.MULTIPLY, OPERATIONS.DIVIDE],
  range = '1-10',
  difficulty = 'easy'
}) => {
  const safeOperations = operations.length > 0 
    ? operations 
    : [OPERATIONS.ADD, OPERATIONS.SUBTRACT, OPERATIONS.MULTIPLY, OPERATIONS.DIVIDE];

  const rangeConfig = parseRange(range);
  const questions = [];
  const seenSignatures = new Set();

  // Distribute operations evenly across total questions
  const opDistribution = [];
  for (let i = 0; i < count; i++) {
    opDistribution.push(safeOperations[i % safeOperations.length]);
  }
  const shuffledOps = shuffle(opDistribution);

  for (let i = 0; i < count; i++) {
    const op = shuffledOps[i];
    let candidate = null;
    let attempts = 0;

    // Attempt to find a unique question within range
    while (attempts < 25) {
      const q = generateRawQuestion(op, rangeConfig, difficulty);
      const signature = `${q.operandA}${q.operator}${q.operandB}`;
      if (!seenSignatures.has(signature)) {
        seenSignatures.add(signature);
        candidate = q;
        break;
      }
      attempts++;
    }

    // If narrow range ran out of unique signatures, still generate valid question
    if (!candidate) {
      candidate = generateRawQuestion(op, rangeConfig, difficulty);
    }

    const distractors = generateDistractors(
      candidate.operandA,
      candidate.operator,
      candidate.operandB,
      candidate.correctAnswer
    );

    const options = shuffle([candidate.correctAnswer, ...distractors]);

    questions.push({
      id: `question-${i + 1}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      questionNumber: i + 1,
      totalQuestions: count,
      operandA: candidate.operandA,
      operator: candidate.operator,
      displayOperator: DISPLAY_SYMBOLS[candidate.operator] || candidate.operator,
      operandB: candidate.operandB,
      correctAnswer: candidate.correctAnswer,
      options,
      difficulty,
      displayText: `${candidate.operandA} ${DISPLAY_SYMBOLS[candidate.operator] || candidate.operator} ${candidate.operandB}`
    });
  }

  return questions;
};
