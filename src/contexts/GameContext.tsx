// src/contexts/GameContext.tsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSoundContext } from './SoundContext';
import questionService from '../services/questionService';

interface Question {
  id: number;
  text: string;
  answer: string;
  explanation: string;
  type: string;
}

interface GameContextType {
  level: number;
  score: number;
  lives: number;
  streak: number;
  currentQuestionIndex: number;
  questions: Question[];
  timeLeft: number;
  isGameActive: boolean;
  isGameOver: boolean;
  userAnswer: string;
  feedback: string;
  startGame: (level: number) => void;
  submitAnswer: () => void;
  nextQuestion: () => void;
  setUserAnswer: (answer: string) => void;
  quitGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [streak, setStreak] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(90);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  
  const navigate = useNavigate();
  const { t } = useTranslation('game');
  const { playSound } = useSoundContext();

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);
  
  // Function to check if a score qualifies for high scores
  const checkForHighScore = useCallback((finalScore: number) => {
    const highScoresJSON = localStorage.getItem(`highScores_${level}`);
    const highScores = highScoresJSON ? JSON.parse(highScoresJSON) : [];
    
    if (highScores.length < 20 || finalScore > highScores[highScores.length - 1]?.score) {
      setTimeout(() => {
        navigate(`/highscores/${level}?score=${finalScore}`);
      }, 3000);
    }
  }, [level, navigate]);
  
  // End game function
  const endGame = useCallback(() => {
    setIsGameActive(false);
    setIsGameOver(true);
    if (timerInterval) clearInterval(timerInterval);
    
    // Calculate final score with life bonus
    const lifeBonus = lives * 111;
    const finalScore = score + lifeBonus;
    
    // Update the score state with the life bonus
    setScore(finalScore);
    
    playSound('gameOver');
    
    // Check for high score with the final score including life bonus
    checkForHighScore(finalScore);
  }, [checkForHighScore, lives, playSound, score, timerInterval]);
  
  // Handle losing a life
  const loseLife = useCallback(() => {
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        endGame();
        return 0;
      }
      return newLives;
    });
    
    setStreak(0);
    playSound('lifeLost');
  }, [endGame, playSound]);
  
  // Handle time out
  const handleTimeOut = useCallback(() => {
    if (timerInterval) clearInterval(timerInterval);
    
    setFeedback(t('feedback.timeout'));
    loseLife();
    playSound('timeOut');
  }, [loseLife, playSound, t, timerInterval]);
  
  // Update UI when time changes
  useEffect(() => {
    if (timeLeft <= 0 && isGameActive) {
      handleTimeOut();
    }
  }, [timeLeft, isGameActive, handleTimeOut]);
  
  // Start a new game
  const startGame = (selectedLevel: number) => {
    // Generate questions for the selected level
    const newQuestions = questionService.generateQuestions(selectedLevel, 10);
    
    setLevel(selectedLevel);
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setLives(3);
    setStreak(0);
    setUserAnswer('');
    setFeedback('');
    setIsGameActive(true);
    setIsGameOver(false);
    
    // Reset and start the timer
    setTimeLeft(90); // 90 seconds per question
    startTimer();
    
    playSound('gameStart');
  };
  
  // Start the countdown timer
  const startTimer = () => {
    // Clear any existing timer
    if (timerInterval) clearInterval(timerInterval);
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        // Only decrease if game is active
        if (isGameActive && prev > 0) {
          return prev - 1;
        }
        return prev;
      });
    }, 1000);
    
    setTimerInterval(interval);
  };
  
  // Normalize answer format for comparison
  const normalizeAnswer = (answer: string): string => {
    // Replace comma with period for decimal numbers
    let normalized = answer.replace(',', '.');
    
    // Handle fractions by ensuring they have consistent spacing
    normalized = normalized.replace(/\s+/g, '');
    
    // If it's a decimal ending with .0, also accept the integer version
    if (normalized.endsWith('.0')) {
      normalized = normalized.replace('.0', '');
    }
    
    return normalized.trim();
  };
  
  // Check if answers are equivalent
  const areAnswersEquivalent = (userAns: string, correctAns: string): boolean => {
    const normalizedUser = normalizeAnswer(userAns);
    const normalizedCorrect = normalizeAnswer(correctAns);
    
    // Direct string comparison of normalized answers
    if (normalizedUser === normalizedCorrect) {
      return true;
    }
    
    // Check if one is a decimal and one is a fraction
    if (normalizedUser.includes('/') || normalizedCorrect.includes('/')) {
      try {
        // Convert fraction to decimal if possible
        const convertFractionToDecimal = (frac: string): number => {
          if (!frac.includes('/')) {
            return parseFloat(frac);
          }
          const [numerator, denominator] = frac.split('/').map(Number);
          return numerator / denominator;
        };
        
        const userDecimal = convertFractionToDecimal(normalizedUser);
        const correctDecimal = convertFractionToDecimal(normalizedCorrect);
        
        // Compare the decimal values with some tolerance for floating-point errors
        return Math.abs(userDecimal - correctDecimal) < 0.001;
      } catch (e) {
        // If conversion fails, fall back to direct comparison
        return false;
      }
    }
    
    return false;
  };
  
  // Submit an answer
  const submitAnswer = () => {
    // Don't do anything if there's already feedback showing
    // This prevents double-submission
    if (feedback) return;
    
    if (timerInterval) clearInterval(timerInterval);
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = areAnswersEquivalent(userAnswer, currentQuestion.answer);
    
    if (isCorrect) {
      // Add points for correct answer (time bonus)
      const timeBonus = timeLeft;
      setScore(prev => prev + timeBonus);
      
      // Increase streak
      setStreak(prev => {
        const newStreak = prev + 1;
        // Gain a life after 10 consecutive correct answers
        if (newStreak === 10 && lives < 3) {
          setLives(prev => prev + 1);
          playSound('lifeGained');
          setFeedback(t('feedback.lifeGained'));
          return 0; // Reset streak after gaining a life
        }
        return newStreak;
      });
      
      setFeedback(t('feedback.correct'));
      playSound('correct');
    } else {
      setFeedback(`${t('feedback.incorrect', { answer: currentQuestion.answer })}`);
      loseLife();
      playSound('incorrect');
    }
  };
  
  // Move to the next question
  const nextQuestion = () => {
    setUserAnswer('');
    setFeedback('');
    
    // Reset the timer
    setTimeLeft(90);
    
    // Move to the next question or end the game if all questions are answered
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      startTimer();
    } else {
      endGame();
    }
  };
  
  // Quit the game early
  const quitGame = () => {
    if (timerInterval) clearInterval(timerInterval);
    setIsGameActive(false);
    setIsGameOver(true);
    navigate('/');
  };
  
  const value = {
    level,
    score,
    lives,
    streak,
    currentQuestionIndex,
    questions,
    timeLeft,
    isGameActive,
    isGameOver,
    userAnswer,
    feedback,
    startGame,
    submitAnswer,
    nextQuestion,
    setUserAnswer,
    quitGame
  };
  
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

export default GameContext;