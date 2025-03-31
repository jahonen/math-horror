// src/services/questionService.ts
import i18next from 'i18next';

interface Question {
    id: number;
    text: string;
    answer: string;
    explanation: string;
    type: string;
  }
  
  // Generate a random integer between min and max (inclusive)
  const randomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  // Select random questions from the pool
  const generateQuestions = (level: number, count: number): Question[] => {
    const selectedQuestions: Question[] = [];
    const usedQuestionIds = new Set<string>(); // To prevent duplicate questions
    const generator = questionGenerators[level - 1]; // Use the array

    if (!generator) {
      console.error(`Invalid level: ${level}. Cannot generate questions.`);
      return [];
    }

    while (selectedQuestions.length < count) {
      const id = selectedQuestions.length;
      const newQuestion = generator(id);
      
      // Simple check to avoid direct duplicates based on text and answer
      const questionKey = `${newQuestion.text}-${newQuestion.answer}`;
      if (!usedQuestionIds.has(questionKey)) {
          selectedQuestions.push(newQuestion);
          usedQuestionIds.add(questionKey);
      } else {
          // Optional: Add logging or retry logic if duplicate avoidance is strict
          console.warn("Duplicate question generated, retrying...");
          // Potentially add a limit to retries to avoid infinite loops
      }
    }
    return selectedQuestions;
  };
  
  // Helper function to get translated text, handling fallbacks
  const getTranslatedQuestion = (fullKey: string, params?: Record<string, any>): string => {
    // Check if the key exists in the current language
    const translationExists = i18next.exists(fullKey, { ns: 'game' });
    
    if (translationExists) {
      return i18next.t(fullKey, { ...params, ns: 'game' });
    } else {
      // Fallback logic based on the intended key structure
      const keyParts = fullKey.split('.'); // e.g., ['questions', 'addition']
      const keyType = keyParts[0]; // e.g., 'questions'
      const specificKey = keyParts[1]; // e.g., 'addition'

      if (keyType === 'questions') {
        // 1. Math expression fallback
        if (params && (params.a !== undefined && params.b !== undefined)) {
          const operator = specificKey.includes('addition') ? '+' : 
                          specificKey.includes('subtraction') ? '-' : 
                          specificKey.includes('multiplication') ? '×' : 
                          specificKey.includes('division') ? '÷' : '?';
          return `${params.a} ${operator} ${params.b} = ?`;
        }
        // 2. Fraction question fallback
        if (params && params.fraction1 && params.fraction2) {
          return `${params.fraction1} + ${params.fraction2} = ?`;
        }
        // 3. Decimal operation fallback
        if (params && params.num1 && params.num2 && params.operator) {
          return `${params.num1} ${params.operator} ${params.num2} = ?`;
        }
        // 4. Other question types (return key for debugging)
        return `${fullKey}: ${params ? JSON.stringify(params) : ''}`;
      } else if (keyType === 'explanations') {
        // Fallback for explanations (could be more specific)
        return `Explanation for ${specificKey}`; 
      } else if (keyType === 'shapes') {
         // Fallback for shape names
         return specificKey; // Just return the shape name itself
      }
      
      // Generic fallback
      return `${fullKey}`; // Return the full key if no other fallback matches
    }
  };
  
  // Level 1 Questions (Grade 1)
  const generateLevel1Question = (id: number): Question => {
    const types = ['addition', 'subtraction', 'shapes', 'counting'];
    const type = types[randomInt(0, types.length - 1)];
    
    switch (type) {
      case 'addition': {
        const a = randomInt(1, 10);
        const b = randomInt(1, 10);
        return {
          id,
          text: getTranslatedQuestion('questions.addition', { a, b }), // Restore full key
          answer: (a + b).toString(),
          explanation: getTranslatedQuestion('explanations.addition'), // Restore full key
          type: 'addition'
        };
      }
      case 'subtraction': {
        const b = randomInt(1, 9);
        const a = randomInt(b, 10); 
        return {
          id,
          text: getTranslatedQuestion('questions.subtraction', { a, b }), // Restore full key
          answer: (a - b).toString(),
          explanation: getTranslatedQuestion('explanations.subtraction'), // Restore full key
          type: 'subtraction'
        };
      }
      case 'shapes': {
        const shapes = [
          { name: getTranslatedQuestion('shapes.circle'), sides: '0' }, // Restore full key
          { name: getTranslatedQuestion('shapes.triangle'), sides: '3' }, // Restore full key
          { name: getTranslatedQuestion('shapes.square'), sides: '4' }, // Restore full key
          { name: getTranslatedQuestion('shapes.rectangle'), sides: '4' } // Restore full key
        ];
        const shape = shapes[randomInt(0, shapes.length - 1)];
        return {
          id,
          text: getTranslatedQuestion('questions.shapeSides', { shape: shape.name }), // Restore full key
          answer: shape.sides,
          explanation: getTranslatedQuestion('explanations.geometry'), // Restore full key
          type: 'shapes'
        };
      }
      case 'counting': {
        const count = randomInt(5, 20);
        return {
          id,
          text: getTranslatedQuestion('questions.counting', { objects: '🎃'.repeat(count) }), // Restore full key
          answer: count.toString(),
          explanation: getTranslatedQuestion('explanations.counting'), // Restore full key
          type: 'counting'
        };
      }
      default:
        return generateLevel1Question(id);
    }
  };
  
  // Level 2 Questions (Grade 2)
  const generateLevel2Question = (id: number): Question => {
    const types = ['addition', 'subtraction', 'multiplication', 'time', 'money'];
    const type = types[randomInt(0, types.length - 1)];
    
    switch (type) {
      case 'addition': {
        const a = randomInt(10, 50);
        const b = randomInt(10, 50);
        return {
          id,
          text: getTranslatedQuestion('questions.addition', { a, b }), // Restore full key
          answer: (a + b).toString(),
          explanation: getTranslatedQuestion('explanations.addition'), // Restore full key
          type: 'addition'
        };
      }
      case 'subtraction': {
        const b = randomInt(10, 50);
        const a = randomInt(b, 99); 
        return {
          id,
          text: getTranslatedQuestion('questions.subtraction', { a, b }), // Restore full key
          answer: (a - b).toString(),
          explanation: getTranslatedQuestion('explanations.subtraction'), // Restore full key
          type: 'subtraction'
        };
      }
      case 'multiplication': {
        const a = randomInt(1, 10);
        const b = randomInt(1, 10);
        return {
          id,
          text: getTranslatedQuestion('questions.multiplication', { a, b }), // Restore full key
          answer: (a * b).toString(),
          explanation: getTranslatedQuestion('explanations.multiplication'), // Restore full key
          type: 'multiplication'
        };
      }
      case 'time': {
        const hour = randomInt(1, 12);
        const minuteType = randomInt(0, 3); 
        let minutes = 0;
        let timeKey = 'questions.timeOClock'; // Use full key
        let answerKey = 'answers.timeOClock';

        if (minuteType === 1) { minutes = 30; timeKey = 'questions.timeHalfPast'; answerKey = 'answers.timeHalfPast'; }
        if (minuteType === 2) { minutes = 15; timeKey = 'questions.timeQuarterPast'; answerKey = 'answers.timeQuarterPast'; }
        if (minuteType === 3) { minutes = 45; timeKey = 'questions.timeQuarterTo'; answerKey = 'answers.timeQuarterTo'; }

        const displayMinutes = minutes === 0 ? '00' : minutes.toString();
        const nextHour = (hour % 12) + 1;
        const answerParam = minuteType === 3 ? nextHour : hour;

        return {
          id,
          text: getTranslatedQuestion(timeKey, { hour, minutes: displayMinutes }), // Use full key variable
          // Direct lookup for answer is fine, i18next handles namespaces
          answer: i18next.t(answerKey, { hour: answerParam, ns: 'game' }), 
          explanation: getTranslatedQuestion('explanations.time'), // Restore full key
          type: 'time'
        };
      }
      case 'money': {
        const dollars = randomInt(1, 10);
        const cents = randomInt(0, 99);
        const totalCents = dollars * 100 + cents;
        return {
          id,
          text: getTranslatedQuestion('questions.money', { dollars, cents: cents.toString().padStart(2, '0') }), // Restore full key
          answer: totalCents.toString(),
          explanation: getTranslatedQuestion('explanations.money'), // Restore full key
          type: 'money'
        };
      }
      default:
        return generateLevel2Question(id);
    }
  };
  
  // Level 3 Questions (Grade 3)
  const generateLevel3Question = (id: number): Question => {
    const types = ['addition', 'subtraction', 'multiplication', 'division', 'fractions', 'measurement'];
    const type = types[randomInt(0, types.length - 1)];
    
    switch (type) {
      case 'addition':
      case 'subtraction': {
        const a = randomInt(100, 500);
        const b = randomInt(50, 200);
        const isAddition = type === 'addition';
        const questionKey = isAddition ? 'questions.addition' : 'questions.subtraction';
        const explanationKey = isAddition ? 'explanations.addition' : 'explanations.subtraction';
        return {
          id,
          text: getTranslatedQuestion(questionKey, { a, b }), // Use full key variable
          answer: (isAddition ? a + b : a - b).toString(),
          explanation: getTranslatedQuestion(explanationKey), // Use full key variable
          type
        };
      }
      case 'multiplication': {
        const a = randomInt(2, 12);
        const b = randomInt(2, 12);
        return {
          id,
          text: getTranslatedQuestion('questions.multiplication', { a, b }), // Restore full key
          answer: (a * b).toString(),
          explanation: getTranslatedQuestion('explanations.multiplication'), // Restore full key
          type: 'multiplication'
        };
      }
      case 'division': {
        const b = randomInt(2, 10);
        const result = randomInt(2, 10);
        const a = b * result;
        return {
          id,
          text: getTranslatedQuestion('questions.division', { a, b }), // Restore full key
          answer: result.toString(),
          explanation: getTranslatedQuestion('explanations.division'), // Restore full key
          type: 'division'
        };
      }
      case 'fractions': {
        const denominator = randomInt(2, 10);
        const numerator = randomInt(1, denominator - 1);
        const whole = randomInt(10, 50);
        if (whole % denominator !== 0) return generateLevel3Question(id);
        
        return {
          id,
          text: getTranslatedQuestion('questions.fractionOf', { numerator, denominator, total: whole }), // Restore full key
          answer: ((numerator / denominator) * whole).toString(),
          explanation: getTranslatedQuestion('explanations.fractions'), // Restore full key
          type: 'fractions'
        };
      }
      case 'measurement': { 
        const meters = randomInt(1, 5);
        return {
          id,
          // TODO: Add 'questions.measurement.m_to_cm' key to locales
          text: getTranslatedQuestion('questions.measurement.m_to_cm', { value: meters }), 
          answer: (meters * 100).toString(),
          explanation: getTranslatedQuestion('explanations.measurement'), // Restore full key
          type: 'measurement'
        };
      }
      default:
        return generateLevel3Question(id);
    }
  };
  
  // Level 4 Questions (Grade 4)
  const generateLevel4Question = (id: number): Question => {
    const types = ['multiplication', 'division', 'fractions', 'decimals', 'geometry', 'measurement'];
    const type = types[randomInt(0, types.length - 1)];

    switch (type) {
      case 'multiplication': {
        const a = randomInt(10, 50);
        const b = randomInt(10, 50);
        return {
          id,
          text: getTranslatedQuestion('questions.multiplication', { a, b }), // Restore full key
          answer: (a * b).toString(),
          explanation: getTranslatedQuestion('explanations.multiplication'), // Restore full key
          type: 'multiplication'
        };
      }
      case 'division': { 
        const divisor = randomInt(2, 9);
        const quotient = randomInt(10, 50);
        const dividend = divisor * quotient;
        return {
          id,
          text: getTranslatedQuestion('questions.division', { a: dividend, b: divisor }), // Restore full key
          answer: quotient.toString(),
          explanation: getTranslatedQuestion('explanations.division'), // Restore full key
          type: 'division'
        };
      }
      case 'fractions': { 
        const denominator = randomInt(3, 10);
        const num1 = randomInt(1, denominator - 1);
        const num2 = randomInt(1, denominator - num1);
        return {
          id,
          text: getTranslatedQuestion('questions.addFractions', { fraction1: `${num1}/${denominator}`, fraction2: `${num2}/${denominator}` }), // Restore full key
          answer: `${(num1 + num2)}/${denominator}`,
          explanation: getTranslatedQuestion('explanations.fractions'), // Restore full key
          type: 'fractions'
        };
      }
      case 'decimals': { 
        const a = (randomInt(10, 500) / 100).toFixed(2);
        const b = (randomInt(10, 500) / 100).toFixed(2);
        const isAddition = Math.random() > 0.5;
        return {
          id,
          text: getTranslatedQuestion('questions.decimalOperation', { num1: a, num2: b, operator: isAddition ? '+' : '-' }), // Restore full key
          answer: isAddition ? (parseFloat(a) + parseFloat(b)).toFixed(2) : (parseFloat(a) - parseFloat(b)).toFixed(2),
          explanation: getTranslatedQuestion('explanations.decimals'), // Restore full key
          type: 'decimals'
        };
      }
      case 'geometry': { 
        const width = randomInt(5, 20);
        const height = randomInt(5, 20);
        const isArea = Math.random() > 0.5;
        const questionKey = isArea ? 'questions.rectangleArea' : 'questions.rectanglePerimeter';
        const explanationKey = isArea ? 'explanations.area' : 'explanations.perimeter';
        return {
          id,
          text: getTranslatedQuestion(questionKey, { width, height }), // Use full key variable
          answer: (isArea ? width * height : 2 * (width + height)).toString(),
          explanation: getTranslatedQuestion(explanationKey), // Use full key variable
          type: 'geometry'
        };
      }
      case 'measurement': { 
        const value = randomInt(1, 5);
        const isWeight = Math.random() > 0.5;
        // TODO: Add 'questions.measurement.kg_to_g' and 'questions.measurement.L_to_mL' keys
        const questionKey = isWeight ? 'questions.measurement.kg_to_g' : 'questions.measurement.L_to_mL';
        return {
          id,
          text: getTranslatedQuestion(questionKey, { value }), // Use full key variable
          answer: (value * 1000).toString(),
          explanation: getTranslatedQuestion('explanations.measurement'), // Restore full key
          type: 'measurement'
        };
      }
      default:
        return generateLevel4Question(id);
    }
  };
  
  // Level 5 Questions (Grade 5)
  const generateLevel5Question = (id: number): Question => {
    const types = ['decimals', 'fractions', 'volume', 'percentages', 'algebra'];
    const type = types[randomInt(0, types.length - 1)];

    switch (type) {
      case 'decimals': { 
        const a = (randomInt(1, 100) / 10).toFixed(1);
        const b = randomInt(2, 9);
        return {
          id,
          text: getTranslatedQuestion('questions.decimalMultiplication', { decimal: a, multiplier: b }), // Restore full key
          answer: (parseFloat(a) * b).toFixed(1),
          explanation: getTranslatedQuestion('explanations.decimals'), // Restore full key
          type: 'decimals'
        };
      }
      case 'fractions': { 
        const den1 = randomInt(2, 5);
        const den2 = randomInt(den1 + 1, 10);
        const num1 = randomInt(1, den1 - 1);
        const num2 = randomInt(1, den2 - 1);
        
        const lcm = (a: number, b: number): number => { 
          let multiple = Math.max(a, b);
          while (multiple % a !== 0 || multiple % b !== 0) { multiple++; }
          return multiple;
        };
        const commonDenominator = lcm(den1, den2);
        const frac1Equivalent = num1 * (commonDenominator / den1);
        const frac2Equivalent = num2 * (commonDenominator / den2);
        const resultNumerator = frac1Equivalent + frac2Equivalent;
        
        const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
        const commonDivisor = gcd(resultNumerator, commonDenominator);
        const simplifiedNumerator = resultNumerator / commonDivisor;
        const simplifiedDenominator = commonDenominator / commonDivisor;
        
        return {
          id,
          text: getTranslatedQuestion('questions.addFractions', { fraction1: `${num1}/${den1}`, fraction2: `${num2}/${den2}` }), // Restore full key
          answer: simplifiedDenominator === 1 ? simplifiedNumerator.toString() : `${simplifiedNumerator}/${simplifiedDenominator}`,
          explanation: getTranslatedQuestion('explanations.fractions'), // Restore full key
          type: 'fractions'
        };
      }
      case 'volume': { 
        const length = randomInt(2, 10);
        const width = randomInt(2, 10);
        const height = randomInt(2, 10);
        return {
          id,
          text: getTranslatedQuestion('questions.volume', { length, width, height }), // Restore full key
          answer: (length * width * height).toString(),
          explanation: getTranslatedQuestion('explanations.volume'), // Restore full key
          type: 'volume'
        };
      }
      case 'percentages': {
        const number = randomInt(20, 200);
        const percentage = [10, 20, 25, 50, 75][randomInt(0, 4)];
        return {
          id,
          text: getTranslatedQuestion('questions.percentageOf', { percentage, number }), // Restore full key
          answer: ((percentage / 100) * number).toString(),
          explanation: getTranslatedQuestion('explanations.percentages'), // Restore full key
          type: 'percentages'
        };
      }
      case 'algebra': { 
        const b = randomInt(2, 10);
        const result = randomInt(5, 50);
        const isMultiplication = Math.random() > 0.5;
        const a = isMultiplication ? result / b : result * b;
        if (!Number.isInteger(a)) return generateLevel5Question(id); 
        
        // Need a better key for algebra with operator included
        const questionKey = isMultiplication ? 'questions.algebra_mult' : 'questions.algebra_div';
        
        return {
          id,
          // TODO: Update locale keys to support operator: 'questions.algebra' -> 'questions.algebra_mult/div'
          text: getTranslatedQuestion(questionKey, { a: isMultiplication ? '?' : a, b, result }), 
          answer: (isMultiplication ? a : result).toString(), // Answer is the missing number 'a' or 'result' depending on op
          explanation: getTranslatedQuestion('explanations.algebra'), // Restore full key
          type: 'algebra'
        };
      }
      default:
        return generateLevel5Question(id);
    }
  };
  
  // Level 6 Questions (Grade 6)
  const generateLevel6Question = (id: number): Question => {
    const types = ['ratios', 'percentages', 'algebra', 'statistics', 'squareRoot'];
    const type = types[randomInt(0, types.length - 1)];

    switch (type) {
      case 'ratios': {
        const a = randomInt(1, 5);
        const b = randomInt(a + 1, 10);
        const multiplier = randomInt(2, 5);
        const newA = a * multiplier;
        const newB = b * multiplier;
        return {
          id,
          text: getTranslatedQuestion('questions.ratio', { a, b, newA }), // Restore full key
          answer: newB.toString(),
          explanation: getTranslatedQuestion('explanations.ratios'), // Restore full key
          type: 'ratios'
        };
      }
      case 'percentages': { 
        const initial = randomInt(50, 200);
        const percentage = [10, 20, 25, 50][randomInt(0, 3)];
        const isIncrease = Math.random() > 0.5;
        const change = (percentage / 100) * initial;
        const final = isIncrease ? initial + change : initial - change;
        // TODO: Add 'questions.percentage_increase' and 'questions.percentage_decrease' keys
        const questionKey = isIncrease ? 'questions.percentage_increase' : 'questions.percentage_decrease';
        return {
          id,
          text: getTranslatedQuestion(questionKey, { initial, percentage }), // Use full key variable
          answer: final.toFixed(2), // Use toFixed for potential decimals
          explanation: getTranslatedQuestion('explanations.percentages'), // Restore full key
          type: 'percentages'
        };
      }
      case 'algebra': { 
        const a = randomInt(2, 5);
        const x = randomInt(3, 10);
        const b = randomInt(5, 20);
        const result = a * x + b;
        return {
          id,
          text: getTranslatedQuestion('questions.twoStepAlgebra', { a, b, result }), // Restore full key
          answer: x.toString(),
          explanation: getTranslatedQuestion('explanations.algebra'), // Restore full key
          type: 'algebra'
        };
      }
      case 'statistics': { 
        const count = randomInt(4, 7);
        const numbers: number[] = [];
        let sum = 0;
        for (let i = 0; i < count; i++) {
          const num = randomInt(1, 50);
          numbers.push(num);
          sum += num;
        }
        const mean = sum / count;
        // Recalculate if mean is not a simple decimal (e.g. ends in .0 or .5)
        if (mean % 1 !== 0 && mean * 10 % 1 !== 0) { 
          return generateLevel6Question(id);
        } 
        return {
          id,
          text: getTranslatedQuestion('questions.mean', { numbers: numbers.join(', ') }), // Restore full key
          answer: mean.toFixed(1), // Use toFixed(1) for consistency
          explanation: getTranslatedQuestion('explanations.statistics'), // Restore full key
          type: 'statistics'
        };
      }
      case 'squareRoot': {
        const base = randomInt(2, 12);
        const number = base * base;
        return {
          id,
          text: getTranslatedQuestion('questions.squareRoot', { number }), // Restore full key
          answer: base.toString(),
          explanation: getTranslatedQuestion('explanations.squareRoot'), // Restore full key
          type: 'squareRoot'
        };
      }
      default:
        return generateLevel6Question(id);
    }
  };
  
  // Combine generation functions
  const questionGenerators = [
    generateLevel1Question,
    generateLevel2Question,
    generateLevel3Question,
    generateLevel4Question,
    generateLevel5Question,
    generateLevel6Question
  ];

// Create the service object
const questionService = {
  generateQuestions
};

export default questionService;