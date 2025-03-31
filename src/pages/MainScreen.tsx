// src/pages/MainScreen.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HighScoreList from '../components/HighScoreList';
import '../styles/pages/MainScreen.scss';

const MainScreen = () => {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Handle level selection
  const handleLevelSelect = (level: number) => {
    setSelectedLevel(level);
  };

  // Start the game with the selected level
  const startGame = () => {
    navigate(`/game/${selectedLevel}`);
  };

  return (
    <div className="main-screen">
      <div className="main-screen__header">
        <h1 className="main-screen__title">{t('app.title')}</h1>
        <p className="main-screen__subtitle">{t('app.subtitle')}</p>
      </div>

      <div className="main-screen__content">
        <div className="main-screen__levels">
          <h2>{t('app.selectLevel')}</h2>
          <div className="level-buttons">
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <button
                key={level}
                className={`level-button ${selectedLevel === level ? 'selected' : ''}`}
                onClick={() => handleLevelSelect(level)}
              >
                {t(`levels.${level}`)}
              </button>
            ))}
          </div>
          <button className="start-button" onClick={startGame}>
            {t('app.startGame')}
          </button>
        </div>

        <div className="main-screen__highscores">
          <h2>{t('app.highScores')}</h2>
          <HighScoreList level={selectedLevel} />
        </div>
      </div>
    </div>
  );
};

export default MainScreen;