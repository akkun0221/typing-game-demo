import React, { useState } from "react";
import type { FallingWordType } from "../../types/game";
import { PlayingScreen } from "./PlayingScreen";

export const DemoScreen: React.FC = () => {
  // デモ画面専用の独立したゲーム状態を持たせることで、App.tsxのグローバルステートを汚染しない
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [words, setWords] = useState<FallingWordType[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [targetWordId, setTargetWordId] = useState<string | null>(null);

  return (
    <PlayingScreen
      score={score}
      lives={lives}
      maxLives={5}
      words={words}
      currentInput={currentInput}
      targetWordId={targetWordId}
      setScore={setScore}
      setLives={setLives}
      setWords={setWords}
      setCurrentInput={setCurrentInput}
      setTargetWordId={setTargetWordId}
      gameOver={() => setLives(5)} // デモ画面は無限ループ（ゲームオーバーしない）
      gameClear={() => {}} // デモ画面はクリアしない
      isDemo={true}
    />
  );
};
