// src/components/game/NumericKeypad.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/NumericKeypad.scss';

interface NumericKeypadProps {
  onInput: (value: string) => void;
}

const NumericKeypad: React.FC<NumericKeypadProps> = ({ onInput }) => {
  const { t } = useTranslation('game');
  
  const keypadButtons = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '/', '0', ',',
    'backspace', 'submit'
  ];
  
  const getButtonLabel = (value: string) => {
    if (value === 'backspace') return '⌫';
    if (value === 'submit') return t('actions.submit');
    if (value === '/') return '/';
    if (value === ',') return ',';
    return value;
  };
  
  const getButtonClass = (value: string) => {
    if (value === 'backspace') return 'keypad-button special backspace';
    if (value === 'submit') return 'keypad-button special submit';
    if (value === '/' || value === ',') return 'keypad-button special symbol';
    return 'keypad-button';
  };
  
  return (
    <div className="numeric-keypad">
      {keypadButtons.map(button => (
        <button 
          key={button}
          className={getButtonClass(button)}
          onClick={() => onInput(button)}
        >
          {getButtonLabel(button)}
        </button>
      ))}
    </div>
  );
};

export default NumericKeypad;
