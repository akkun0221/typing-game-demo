import React from "react";
import type { FallingWordType } from "../../types/game";
import "../../style/Word.css";

interface FallingWordProps {
  word: FallingWordType;
  isTargeted: boolean;
  currentInput: string;
}

export const FallingWord: React.FC<FallingWordProps> = ({
  word,
  isTargeted,
  currentInput,
}) => {
  const typedPart = isTargeted ? currentInput : "";
  const untypedPart = word.text.slice(typedPart.length);

  // 1-2文字: 0, 3-4文字: 1, 5-6文字: 2, 7-8文字: 3, 9-10文字: 4
  const meteorIndex = React.useMemo(() => {
    const len = word.text.length;
    if (len <= 2) return 0;
    if (len <= 4) return 1;
    if (len <= 6) return 2;
    if (len <= 8) return 3;
    return 4;
  }, [word.text.length]);

  // 隕石の大きさを文字数に比例させる (基準の長さを5とする)
  const scale = 1 + (word.text.length - 5) * 0.15;

  return (
    <div
      className={`falling-word meteorite-container ${isTargeted ? 'locked' : ''}`}
      style={{ 
        left: `${word.x}%`, 
        top: `${word.y}px`,
        transform: `translateX(-50%) scale(${scale})`
      }}
    >
      <div className={`meteorite-body type-${meteorIndex}`} />
      <div className="word-text">
        <span className="typed">{typedPart}</span>
        <span className="untyped">{untypedPart}</span>
      </div>
    </div>
  );
};
