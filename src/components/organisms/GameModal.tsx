import React from "react";
import { Typography } from "../atoms/Typography";
import { Button } from "../atoms/Button";
import "../../style/GameModal.css";

interface GameModalProps {
  title?: string;
  isGameOver?: boolean;
  score?: number;
  description?: string;
  buttonText: string;
  onButtonClick: () => void;
  bgImage?: string;
  secondaryButtonText?: string;
  onSecondaryButtonClick?: () => void;
}

export const GameModal: React.FC<GameModalProps> = ({
  title,
  isGameOver = false,
  score,
  description,
  buttonText,
  onButtonClick,
  bgImage,
  secondaryButtonText,
  onSecondaryButtonClick,
}) => {
  return (
    <div 
      className="overlay"
      style={bgImage ? {
        backgroundImage: `url("${bgImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } : {}}
    >
      <div className={`modal ${isGameOver ? "game-over" : ""} ${bgImage ? "bg-image-mode" : ""}`}>
        {title && <Typography variant="h1">{title}</Typography>}
        {description && <Typography variant="p">{description}</Typography>}
        {score !== undefined && (
          <Typography variant="score">SCORE: {score}</Typography>
        )}
        <div className="button-group">
          <Button onClick={onButtonClick}>{buttonText}</Button>
          {secondaryButtonText && onSecondaryButtonClick && (
            <Button onClick={onSecondaryButtonClick}>{secondaryButtonText}</Button>
          )}
        </div>
      </div>
    </div>
  );
};
