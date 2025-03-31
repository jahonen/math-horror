// src/components/HighScoreList.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/components/HighScoreList.scss';

interface HighScore {
  initials: string;
  score: number;
  date: number;
}

interface HighScoreListProps {
  level: number;
  userScore?: number | null;
  scoreSubmitted?: boolean;
}

const HighScoreList: React.FC<HighScoreListProps> = ({ level, userScore = null, scoreSubmitted = false }) => {
  const [scores, setScores] = useState<HighScore[]>([]);
  const { t } = useTranslation();
  
  // Load high scores from localStorage
  const loadScores = useCallback(() => {
    const storedScores = localStorage.getItem(`highScores_${level}`);
    if (storedScores) {
      setScores(JSON.parse(storedScores));
    } else {
      setScores([]);
    }
  }, [level]);
  
  // Load high scores when component mounts or level changes
  useEffect(() => {
    loadScores();
    
    // Add storage event listener to refresh scores when localStorage changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === `highScores_${level}` || event.key === null) {
        loadScores();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Only set up interval refresh if the score hasn't been submitted yet
    // This prevents overwriting the user's submitted score with stale data
    let intervalId: NodeJS.Timeout | null = null;
    
    if (!scoreSubmitted) {
      intervalId = setInterval(loadScores, 1000);
    }
    
    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (intervalId) clearInterval(intervalId);
    };
  }, [level, loadScores, scoreSubmitted]);
  
  // Highlight the user's score in the list if it exists
  const getUserScoreClass = (score: HighScore): string => {
    if (userScore && score.score === userScore && scoreSubmitted) {
      return 'user-score';
    }
    return '';
  };
  
  return (
    <div className="high-score-list">
      <h3>{t('highScore.title')} - {t(`levels.${level}`, { ns: 'main' })}</h3>
      
      {scores.length > 0 ? (
        <table className="score-table">
          <thead>
            <tr>
              <th className="rank">{t('highScore.headerRank', { defaultValue: 'Rank' })}</th>
              <th className="initials">{t('highScore.headerName', { defaultValue: 'Initials' })}</th>
              <th className="score">{t('highScore.headerScore', { defaultValue: 'Score' })}</th>
            </tr>
          </thead>
          <tbody>
            {scores
              .sort((a, b) => b.score - a.score)
              .slice(0, 10)
              .map((score, index) => (
                <tr 
                  key={`${score.initials}-${score.date}`} 
                  className={`${index === 0 ? 'top-score' : ''} ${getUserScoreClass(score)}`}
                >
                  <td className="rank">{index + 1}</td>
                  <td className="initials">{score.initials}</td>
                  <td className="score">{score.score}</td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <div className="no-scores">
          {t('highScore.noScores', { defaultValue: 'No high scores yet for this level!' })}
        </div>
      )}
    </div>
  );
};

export default HighScoreList;
