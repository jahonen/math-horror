// src/components/game/QuestionDisplay.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/QuestionDisplay.scss';

interface Question {
  id: number;
  text: string;
  answer: string;
  explanation: string;
  type: string;
}

interface QuestionDisplayProps {
  question: Question;
  userAnswer: string;
  feedback: string;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ 
  question, 
  userAnswer, 
  feedback 
}) => {
  const { t } = useTranslation('game');
  
  return (
    <div className="question-display">
      <div className="question-text">
        <h3>{question.text}</h3>
      </div>
      
      {question.explanation && (
        <div className="explanation">
          <p>{question.explanation}</p>
        </div>
      )}
      
      <div className="answer-area">
        <div className="answer-label">{t('actions.answer', { defaultValue: 'Your Answer:' })}</div>
        <div className="answer-display">
          {userAnswer || '_'}
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;
