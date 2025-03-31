// src/pages/HighScoreScreen.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSoundContext } from '../contexts/SoundContext';
import HighScoreList from '../components/HighScoreList';
import '../styles/pages/HighScoreScreen.scss';

interface HighScore {
  initials: string;
  score: number;
  date: number;
}

const HighScoreScreen: React.FC = () => {
  const { level } = useParams<{ level: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { playSound } = useSoundContext();
  
  const [userScore, setUserScore] = useState<number | null>(null);
  const [initials, setInitials] = useState<string>('');
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [showInitialsEntry, setShowInitialsEntry] = useState<boolean>(false);
  const [scoreSubmitted, setScoreSubmitted] = useState<boolean>(false);
  
  // Get the level number
  const levelNum = level ? parseInt(level, 10) : 1;
  
  // Extract score from URL query params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const score = searchParams.get('score');
    if (score) {
      const scoreNum = parseInt(score, 10);
      setUserScore(scoreNum);
      
      // Load high scores
      const storedScores = localStorage.getItem(`highScores_${levelNum}`);
      const scores: HighScore[] = storedScores ? JSON.parse(storedScores) : [];
      setHighScores(scores);
      
      // Check if this score has already been submitted
      const submissionKey = `score_submitted_${levelNum}_${scoreNum}`;
      const alreadySubmitted = localStorage.getItem(submissionKey) === 'true';
      setScoreSubmitted(alreadySubmitted);
      
      // Check if this is a high score and hasn't been submitted yet
      if (!alreadySubmitted && (scores.length < 20 || scoreNum > scores[scores.length - 1]?.score)) {
        setShowInitialsEntry(true);
        playSound('highScore');
      } else {
        setShowInitialsEntry(false);
      }
    }
  }, [location.search, levelNum, playSound]);
  
  // Handle initials input (enforce 3 capital letters)
  const handleInitialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
    setInitials(value);
  };
  
  // Submit high score
  const submitHighScore = () => {
    if (initials.length !== 3 || userScore === null) return;
    
    // Add to high scores
    const newScore: HighScore = {
      initials,
      score: userScore,
      date: Date.now()
    };
    
    const updatedScores = [...highScores, newScore];
    
    // Sort by score (descending)
    updatedScores.sort((a, b) => b.score - a.score);
    
    // Keep only top 20
    const topScores = updatedScores.slice(0, 20);
    
    // Save to localStorage
    localStorage.setItem(`highScores_${levelNum}`, JSON.stringify(topScores));
    
    // Mark this score as submitted in localStorage
    const submissionKey = `score_submitted_${levelNum}_${userScore}`;
    localStorage.setItem(submissionKey, 'true');
    
    // Update state
    setHighScores(topScores);
    setShowInitialsEntry(false);
    setScoreSubmitted(true);
    playSound('buttonClick');
    
    console.log('High score submitted:', { initials, score: userScore, date: Date.now() });
    console.log('All high scores:', topScores);
  };
  
  // Handle form submission with Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && initials.length === 3) {
      submitHighScore();
    }
  };
  
  // Return to main menu
  const returnToMain = () => {
    playSound('buttonClick');
    navigate('/');
  };
  
  return (
    <div className="high-score-screen">
      <h1>{t('highScore.title')}</h1>
      
      {userScore !== null && (
        <div className="your-score">
          <h2>{t('highScore.yourScore', { score: userScore })}</h2>
        </div>
      )}
      
      {showInitialsEntry ? (
        <div className="initials-entry">
          <h2 className="new-high-score">{t('highScore.newHighScore')}</h2>
          <p>{t('highScore.enterInitials')}</p>
          <div className="initials-input-container">
            <input
              type="text"
              value={initials}
              onChange={handleInitialsChange}
              onKeyDown={handleKeyDown}
              maxLength={3}
              autoFocus
              className="initials-input"
            />
            <button 
              onClick={submitHighScore} 
              disabled={initials.length !== 3}
              className="submit-button"
            >
              {t('highScore.submit')}
            </button>
          </div>
        </div>
      ) : (
        <div className="high-scores-container">
          <HighScoreList level={levelNum} userScore={userScore} scoreSubmitted={scoreSubmitted} />
          <button onClick={returnToMain} className="return-button">
            {t('highScore.backToMain')}
          </button>
        </div>
      )}
    </div>
  );
};

export default HighScoreScreen;