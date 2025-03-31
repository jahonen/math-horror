// src/components/game/GameOver.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../../contexts/GameContext';
import '../../styles/components/GameOver.scss';

interface GameOverProps {
  onReturn: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ onReturn }) => {
  const { t } = useTranslation(['game', 'main']);
  const { score, level } = useGameContext();
  const navigate = useNavigate();
  
  return (
    <div className="game-over">
      <div className="game-over-content">
        <h1 className="game-over-title">{t('feedback.gameOver')}</h1>
        
        <div className="game-over-score">
          <p>{t('hud.score', { score })}</p>
          <p className="level-info">{t(`levels.${level}`, { ns: 'main' })}</p>
        </div>
        
        <div className="game-over-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            {t('actions.playAgain', { defaultValue: 'Play Again' })}
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={onReturn}
          >
            {t('actions.quit')}
          </button>
          
          <button 
            className="btn btn-return" 
            onClick={() => navigate('/')}
          >
            {t('actions.returnToMenu', { defaultValue: 'Return to Menu' })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
