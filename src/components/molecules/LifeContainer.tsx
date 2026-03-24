import React from "react";
import { Icon } from "../atoms/Icon";

interface LifeContainerProps {
  lives: number;
  maxLives: number;
}

export const LifeContainer: React.FC<LifeContainerProps> = ({
  lives,
  maxLives,
}) => {
  return (
    <div className="lives-container">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          symbol="❤️"
          className={`life-icon ${i >= lives ? "lost" : ""}`}
          style={{ display: i < maxLives ? "inline-block" : "none" }}
        />
      ))}
    </div>
  );
};
