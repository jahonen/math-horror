import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MainScreen from './pages/MainScreen';
import GameScreen from './pages/GameScreen';
import HighScoreScreen from './pages/HighScoreScreen';
// import CustomLevelScreen from './pages/CustomLevelScreen'; // Assuming you'll create this
import LanguageSelector from './components/LanguageSelector';
import mathHorrorLogo from './assets/images/math-horror-logo.png';
import './App.css';
import { useTranslation } from 'react-i18next';
import { GameProvider } from './contexts/GameContext'; 
import { SoundProvider } from './contexts/SoundContext';

function App() {
  const { t } = useTranslation(); // Hook to access translations

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to="/" className="logo-link">
            <img src={mathHorrorLogo} alt="Math Horror Logo" className="header-logo" />
          </Link>
          <h1>{t('app.title')}</h1>
          <p>{t('app.subtitle')}</p>
          <LanguageSelector />
        </header>
        <main>
          <SoundProvider>
            <GameProvider>
              <Routes>
                <Route path="/" element={<MainScreen />} />
                <Route path="/game/:level" element={<GameScreen />} />
                <Route path="/highscores/:level" element={<HighScoreScreen />} />
                {/* Add route for CustomLevelScreen here */}
              </Routes>
            </GameProvider>
          </SoundProvider>
        </main>
        <footer>
          <p>Math Horror &copy; 2025 Arete Nexus, dedicated to Els4Hi and Zelma</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;