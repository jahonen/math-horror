// src/contexts/SoundContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Howl } from 'howler';

// Define sound types
type SoundType = 
  | 'background'
  | 'gameStart'
  | 'correct'
  | 'incorrect'
  | 'timeWarning'
  | 'timeOut'
  | 'lifeGained'
  | 'lifeLost'
  | 'gameOver'
  | 'highScore'
  | 'buttonClick';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (sound: SoundType) => void;
  stopSound: (sound: SoundType) => void;
  stopAllSounds: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [sounds, setSounds] = useState<Record<SoundType, Howl | null>>({
    background: null,
    gameStart: null,
    correct: null,
    incorrect: null,
    timeWarning: null,
    timeOut: null,
    lifeGained: null,
    lifeLost: null,
    gameOver: null,
    highScore: null,
    buttonClick: null
  });

  // Initialize sounds
  useEffect(() => {
    const soundFiles: Record<SoundType, string> = {
      background: '/assets/sounds/horror_background.wav',
      gameStart: '/assets/sounds/game_start.wav',
      correct: '/assets/sounds/correct_answer.wav',
      incorrect: '/assets/sounds/incorrect_answer.wav',
      timeWarning: '/assets/sounds/time_warning.flac',
      timeOut: '/assets/sounds/time_out.wav',
      lifeGained: '/assets/sounds/life_gained.wav',
      lifeLost: '/assets/sounds/life_lost.wav',
      gameOver: '/assets/sounds/game_over.wav',
      highScore: '/assets/sounds/high_score.wav',
      buttonClick: '/assets/sounds/button_click.wav'
    };

    const loadedSounds: Record<SoundType, Howl> = {} as Record<SoundType, Howl>;

    Object.entries(soundFiles).forEach(([key, path]) => {
      const soundType = key as SoundType;
      loadedSounds[soundType] = new Howl({
        src: [path],
        volume: soundType === 'background' ? 0.3 : 0.5,
        loop: soundType === 'background',
        autoplay: soundType === 'background'
      });
    });

    setSounds(loadedSounds);

    // Start background music
    if (!isMuted) {
      loadedSounds.background.play();
    }

    // Clean up
    return () => {
      Object.values(loadedSounds).forEach(sound => sound.stop());
    };
  }, []);

  // Update sound state when mute changes
  useEffect(() => {
    Object.values(sounds).forEach(sound => {
      if (sound) {
        sound.mute(isMuted);
      }
    });
  }, [isMuted, sounds]);

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  // Play a sound
  const playSound = (sound: SoundType) => {
    if (sounds[sound]) {
      sounds[sound]?.play();
    }
  };

  // Stop a sound
  const stopSound = (sound: SoundType) => {
    if (sounds[sound]) {
      sounds[sound]?.stop();
    }
  };

  // Stop all sounds
  const stopAllSounds = () => {
    Object.values(sounds).forEach(sound => {
      if (sound) sound.stop();
    });
    
    // Restart background music if not muted
    if (!isMuted && sounds.background) {
      sounds.background.play();
    }
  };

  return (
    <SoundContext.Provider
      value={{
        isMuted,
        toggleMute,
        playSound,
        stopSound,
        stopAllSounds
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSoundContext = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSoundContext must be used within a SoundProvider');
  }
  return context;
};