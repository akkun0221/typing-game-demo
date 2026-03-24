import React from "react";
import { GameModal } from "../organisms/GameModal";

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
  onReturnTitle: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  onRestart,
  onReturnTitle,
}) => {
  return (
    <GameModal
      isGameOver={true}
      score={score}
      buttonText="PLAY AGAIN"
      onButtonClick={onRestart}
      secondaryButtonText="RETURN TITLE"
      onSecondaryButtonClick={onReturnTitle}
      bgImage="/image/gameover.png"
    />
  );
};
