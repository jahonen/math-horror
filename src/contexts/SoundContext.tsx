// src/contexts/SoundContext.tsx
import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
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

// Define sound categories for volume normalization
type SoundCategory = 'music' | 'feedback' | 'ui' | 'alert';

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

  // Map sounds to categories for volume normalization using useMemo
  const soundCategories = useMemo<Record<SoundType, SoundCategory>>(() => ({
    background: 'music',
    gameStart: 'feedback',
    correct: 'feedback',
    incorrect: 'feedback',
    timeWarning: 'alert',
    timeOut: 'alert',
    lifeGained: 'feedback',
    lifeLost: 'alert',
    gameOver: 'alert',
    highScore: 'feedback',
    buttonClick: 'ui'
  }), []);

  // Set volume levels for each category using useMemo
  const categoryVolumes = useMemo<Record<SoundCategory, number>>(() => ({
    music: 0.3,
    feedback: 0.5,
    ui: 0.3,
    alert: 0.6
  }), []);

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
      const category = soundCategories[soundType];
      const volume = categoryVolumes[category];
      
      loadedSounds[soundType] = new Howl({
        src: [path],
        volume: volume,
        loop: soundType === 'background',
        autoplay: soundType === 'background' && !isMuted
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
  }, [isMuted, soundCategories, categoryVolumes]);

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
      // Stop the sound first if it's already playing to prevent overlapping
      if (sounds[sound]?.playing()) {
        sounds[sound]?.stop();
      }
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