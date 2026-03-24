import React from "react";
import { Typography } from "../atoms/Typography";

interface ScoreBoardProps {
  score: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ score }) => {
  return (
    <div className="hud-panel">
      <Typography variant="label">SCORE</Typography>
      <div className="hud-value">{score}</div>
    </div>
  );
};
