import { useState, useCallback, useEffect } from "react";
import type { GameState, FallingWordType } from "./types/game";
import { StartScreen } from "./components/pages/StartScreen";
import { PlayingScreen } from "./components/pages/PlayingScreen";
import { GameOverScreen } from "./components/pages/GameOverScreen";
import { EndingScreen } from "./components/pages/EndingScreen";
import { DemoScreen } from "./components/pages/DemoScreen";
import { useBGM } from "./hooks/useBGM";
import "./App.css";

const INIT_LIVES = 5;

function App() {
  const [gameState, setGameState] = useState<GameState>("START_SCREEN");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INIT_LIVES);
  const [words, setWords] = useState<FallingWordType[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [targetWordId, setTargetWordId] = useState<string | null>(null);

  const { isMuted, toggleMute } = useBGM(gameState);

  useEffect(() => {
    if (gameState !== "START_SCREEN") return;

    let timer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setGameState("DEMO");
      }, 5000);
    };

    resetTimer();

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("mousedown", resetTimer);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("mousedown", resetTimer);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "DEMO") return;

    const handleInterrupt = (e: Event) => {
      if (e instanceof KeyboardEvent && !e.isTrusted) return; // AIのキー入力は無視
      setGameState("START_SCREEN");
    };

    window.addEventListener("keydown", handleInterrupt);
    window.addEventListener("mousedown", handleInterrupt);

    return () => {
      window.removeEventListener("keydown", handleInterrupt);
      window.removeEventListener("mousedown", handleInterrupt);
    };
  }, [gameState]);

  const startGame = () => {
    setGameState("PLAYING");
    setScore(0);
    setLives(INIT_LIVES);
    setWords([]);
    setCurrentInput("");
    setTargetWordId(null);
  };

  const gameOver = useCallback(() => {
    setGameState("GAME_OVER");
  }, []);

  const gameClear = useCallback(() => {
    setGameState("ENDING");
  }, []);

  return (
    <div className="app-container">
      {gameState === "START_SCREEN" && (
        <StartScreen 
          onStart={startGame} 
          isMuted={isMuted} 
          toggleMute={toggleMute} 
        />
      )}

      {gameState === "DEMO" && <DemoScreen />}

      {gameState === "PLAYING" && (
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
          gameOver={gameOver}
          gameClear={gameClear}
        />
      )}

      {gameState === "GAME_OVER" && (
        <GameOverScreen 
          score={score} 
          onRestart={startGame} 
          onReturnTitle={() => setGameState("START_SCREEN")}
        />
      )}

      {gameState === "ENDING" && (
        <EndingScreen 
          score={score} 
          onReturnTitle={() => setGameState("START_SCREEN")}
        />
      )}
    </div>
  );
}

export default App;
