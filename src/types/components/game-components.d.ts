// src/types/components/game-components.d.ts

declare module '../components/game/QuestionDisplay' {
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
  
  const QuestionDisplay: React.FC<QuestionDisplayProps>;
  export default QuestionDisplay;
}

declare module '../components/game/NumericKeypad' {
  interface NumericKeypadProps {
    onInput: (value: string) => void;
  }
  
  const NumericKeypad: React.FC<NumericKeypadProps>;
  export default NumericKeypad;
}

declare module '../components/game/GameHUD' {
  const GameHUD: React.FC;
  export default GameHUD;
}

declare module '../components/game/GameOver' {
  interface GameOverProps {
    onReturn: () => void;
  }
  
  const GameOver: React.FC<GameOverProps>;
  export default GameOver;
}
