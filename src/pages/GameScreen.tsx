// src/pages/GameScreen.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGameContext } from '../contexts/GameContext';
import { useSoundContext } from '../contexts/SoundContext';
import QuestionDisplay from '../components/game/QuestionDisplay';
import NumericKeypad from '../components/game/NumericKeypad';
import GameHUD from '../components/game/GameHUD';
import GameOver from '../components/game/GameOver';
import '../styles/pages/GameScreen.scss';

const GameScreen: React.FC = () => {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(['game', 'main']);
  const [gameStarted, setGameStarted] = useState(false);
  const { 
    startGame, 
    isGameActive, 
    isGameOver, 
    questions, 
    currentQuestionIndex,
    userAnswer, 
    setUserAnswer,
    submitAnswer,
    nextQuestion,
    feedback,
    quitGame,
    score
  } = useGameContext();
  const { playSound } = useSoundContext();

  // Start game when component mounts - ONLY ONCE
  useEffect(() => {
    if (level && !gameStarted) {
      const levelNum = parseInt(level, 10);
      if (levelNum >= 1 && levelNum <= 6) {
        startGame(levelNum);
        setGameStarted(true);
      } else {
        // Invalid level, navigate back to main
        navigate('/');
      }
    }
  }, [level, gameStarted, startGame, navigate]);

  // Handle keyboard input for answer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;

      // If feedback is showing, Enter key advances to next question
      if (feedback && e.key === 'Enter') {
        nextQuestion();
        return;
      }

      // Only process numeric input if the game is active and no feedback is showing
      if (!isGameActive) return;

      if (e.key >= '0' && e.key <= '9') {
        setUserAnswer(userAnswer + e.key);
      } else if (e.key === 'Backspace') {
        setUserAnswer(userAnswer.slice(0, -1));
      } else if (e.key === 'Enter') {
        submitAnswer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isGameActive, isGameOver, setUserAnswer, submitAnswer, userAnswer, feedback, nextQuestion]);

  // Handle game over
  useEffect(() => {
    if (isGameOver) {
      // Save to local storage for high score handling later
    }
  }, [isGameOver, score]);

  const handleKeypadInput = (value: string) => {
    if (value === 'backspace') {
      setUserAnswer(userAnswer.slice(0, -1));
    } else if (value === 'submit') {
      submitAnswer();
    } else {
      setUserAnswer(userAnswer + value);
    }
    playSound('buttonClick');
  };

  // If game hasn't started yet (loading questions)
  if (!questions.length) {
    return (
      <div className="game-screen loading">
        <h2>{t('app.loading', { ns: 'main' })}</h2>
      </div>
    );
  }

  // If game is over
  if (isGameOver) {
    return <GameOver onReturn={() => navigate('/')} />;
  }

  // Current question
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="game-screen">
      <GameHUD />
      
      <div className="game-content">
        <QuestionDisplay 
          question={currentQuestion}
          userAnswer={userAnswer}
          feedback={feedback}
        />
        
        {feedback ? (
          <div className="feedback-container">
            <p className="feedback-text">{feedback}</p>
            <button className="next-button" onClick={nextQuestion}>
              {t('actions.next', { ns: 'game' })}
            </button>
          </div>
        ) : (
          <NumericKeypad onInput={handleKeypadInput} />
        )}
      </div>
      
      <button className="quit-button" onClick={quitGame}>
        {t('actions.quit', { ns: 'game' })}
      </button>
    </div>
  );
};

export default GameScreen;