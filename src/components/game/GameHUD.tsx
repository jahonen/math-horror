// src/components/game/GameHUD.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGameContext } from '../../contexts/GameContext';
import '../../styles/components/GameHUD.scss';

const GameHUD: React.FC = () => {
  const { t } = useTranslation('game');
  const { 
    level, 
    score, 
    lives, 
    streak, 
    timeLeft, 
    currentQuestionIndex, 
    questions 
  } = useGameContext();

  return (
    <div className="game-hud">
      <div className="hud-item level">
        {t('hud.levelLabel', { level })}
      </div>
      <div className="hud-item score">
        {t('hud.score', { score })}
      </div>
      <div className="hud-item lives">
        {t('hud.lives', { lives })}
        <div className="lives-icons">
          {"❤️".repeat(lives)}
          {"🖤".repeat(3 - lives)}
        </div>
      </div>
      <div className="hud-item question-counter">
        {t('hud.question', { current: currentQuestionIndex + 1, total: questions.length })}
      </div>
      <div className="hud-item streak">
        {t('hud.streak', { streak })}
      </div>
      <div className={`hud-item timer ${timeLeft <= 10 ? 'warning' : ''}`}>
        {t('hud.timeLeft', { time: timeLeft })}
      </div>
    </div>
  );
};

export default GameHUD;
