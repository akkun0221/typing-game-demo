import React from 'react';
import { GameModal } from '../organisms/GameModal';

interface EndingScreenProps {
  onReturnTitle: () => void;
  score: number;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({ onReturnTitle, score }) => {
  return (
    <GameModal
      title="MISSION ACCOMPLISHED"
      score={score}
      buttonText="RETURN TITLE"
      onButtonClick={onReturnTitle}
      bgImage="/image/end.png"
    />
  );
};
