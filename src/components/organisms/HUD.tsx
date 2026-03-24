import React from "react";
import { ScoreBoard } from "../molecules/ScoreBoard";
import { LifeContainer } from "../molecules/LifeContainer";
import { Typography } from "../atoms/Typography";
import "../../style/HUD.css";

interface HUDProps {
  score: number;
  lives: number;
  maxLives: number;
}

export const HUD: React.FC<HUDProps> = ({ score, lives, maxLives }) => {
  return (
    <div className="hud">
      <ScoreBoard score={score} />
      <div className="hud-panel">
        <Typography variant="label">LIVES</Typography>
        <LifeContainer lives={lives} maxLives={maxLives} />
      </div>
    </div>
  );
};
