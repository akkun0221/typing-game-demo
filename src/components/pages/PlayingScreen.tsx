import React, { useState, useEffect, useRef, useCallback } from "react";
import type { FallingWordType } from "../../types/game";
import { HUD } from "../organisms/HUD";
import { GameField } from "../organisms/GameField";
import { StarBackground } from "../atoms/StarBackground";
import { useGameLoop } from "../../hooks/useGameLoop";
import { useTyping } from "../../hooks/useTyping";
import type { TypingCallbacks } from "../../hooks/useTyping";
import type { MissileData, EffectData } from "../../types/game";
import "../../style/PlayingScreen.css";

interface PlayingScreenProps {
  score: number;
  lives: number;
  words: FallingWordType[];
  currentInput: string;
  targetWordId: string | null;
  maxLives: number;

  setScore: React.Dispatch<React.SetStateAction<number>>;
  setLives: React.Dispatch<React.SetStateAction<number>>;
  setWords: React.Dispatch<React.SetStateAction<FallingWordType[]>>;
  setCurrentInput: React.Dispatch<React.SetStateAction<string>>;
  setTargetWordId: React.Dispatch<React.SetStateAction<string | null>>;

  gameOver: () => void;
  gameClear?: () => void;
  isDemo?: boolean;
}

export const PlayingScreen: React.FC<PlayingScreenProps> = ({
  score,
  lives,
  words,
  currentInput,
  targetWordId,
  maxLives,
  setScore,
  setLives,
  setWords,
  setCurrentInput,
  setTargetWordId,
  gameOver,
  gameClear,
  isDemo,
}) => {
  const [missiles, setMissiles] = useState<MissileData[]>([]);
  const [effects, setEffects] = useState<EffectData[]>([]);
  const [cutInVisible, setCutInVisible] = useState(false);
  const cutInTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isDemo && score >= 10000 && gameClear) {
      gameClear();
    }
  }, [score, isDemo, gameClear]);

  useEffect(() => {
    return () => {
      if (cutInTimerRef.current) clearTimeout(cutInTimerRef.current);
    };
  }, []);

  const onEarthHit = useCallback((x: number, y: number) => {
    const effectId = Math.random().toString(36).substring(2, 9);
    setEffects(prev => [...prev, {
      id: effectId,
      x: x,
      y: (y / window.innerHeight) * 100, // pxをvhに変換
      type: 'explosion'
    }]);
  }, []);

  useGameLoop(
    true,
    score,
    setWords,
    setLives,
    setTargetWordId,
    setCurrentInput,
    gameOver,
    onEarthHit
  );

  const callbacks: TypingCallbacks = {
    onHit: (word, isFirstLetter) => {
      const missileId = Math.random().toString(36).substring(2, 9);
      setMissiles(prev => [...prev, {
        id: missileId,
        startX: 50,
        startY: window.innerHeight * 0.85, // 地表の高さ(px)
        targetX: word.x,
        targetY: word.y,
        wordId: word.id,
        isFirstLetter,
        isExplosion: false,
      }]);
    },
    onDestroy: (word) => {
      setCutInVisible(true);
      if (cutInTimerRef.current) clearTimeout(cutInTimerRef.current);
      cutInTimerRef.current = setTimeout(() => {
        setCutInVisible(false);
      }, 700);

      const missileId = Math.random().toString(36).substring(2, 9);
      setMissiles(prev => [...prev, {
        id: missileId,
        startX: 50,
        startY: window.innerHeight * 0.85, // 地表の高さ(px)
        targetX: word.x,
        targetY: word.y,
        wordId: word.id,
        isFirstLetter: false,
        isExplosion: true,
      }]);
    },
    onMiss: () => {
      const effectId = Math.random().toString(36).substring(2, 9);
      setEffects(prev => [...prev, {
        id: effectId,
        x: 50,
        y: 85, // 発射台のすこし上
        type: 'misfire'
      }]);
    }
  };

  useTyping(
    true,
    targetWordId,
    currentInput,
    setWords,
    setTargetWordId,
    setCurrentInput,
    setScore,
    callbacks
  );

  const wordsRef = useRef(words);
  const targetWordIdRef = useRef(targetWordId);
  const currentInputRef = useRef(currentInput);

  useEffect(() => {
    wordsRef.current = words;
    targetWordIdRef.current = targetWordId;
    currentInputRef.current = currentInput;
  }, [words, targetWordId, currentInput]);

  useEffect(() => {
    if (!isDemo) return;

    // AI bot uses setInterval to avoid re-renders cancelling timeouts
    const botInterval = setInterval(() => {
      const currentWords = wordsRef.current;
      const currentTarget = targetWordIdRef.current;
      const currentText = currentInputRef.current;

      if (currentWords.length === 0) return;

      let nextChar = '';
      
      if (currentTarget) {
        const target = currentWords.find(w => w.id === currentTarget);
        if (target) {
          const untyped = target.text.slice(currentText.length);
          if (untyped.length > 0) {
            nextChar = untyped[0];
          }
        }
      } else {
        const available = [...currentWords].sort((a, b) => b.y - a.y);
        if (available.length > 0) {
          nextChar = available[0].text[0];
        }
      }

      if (nextChar) {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: nextChar }));
      }
    }, 150); // デモプレイのタイピング速度

    return () => clearInterval(botInterval);
  }, [isDemo]);

  const [isTakingDamage, setIsTakingDamage] = useState(false);
  const prevLivesRef = useRef(lives);

  useEffect(() => {
    if (lives < prevLivesRef.current) {
      const takeDamageTimer = setTimeout(() => setIsTakingDamage(true), 0);
      const timer = setTimeout(() => setIsTakingDamage(false), 300);
      prevLivesRef.current = lives;
      return () => {
        clearTimeout(takeDamageTimer);
        clearTimeout(timer);
      };
    } else {
      prevLivesRef.current = lives;
    }
  }, [lives]);

  const isDanger = lives === 1;

  return (
    <>
      <StarBackground />
      {cutInVisible && (
        <div className="destroy-cut-in">
          <img src="/image/destroy.png" alt="DESTROYED" />
        </div>
      )}
      <div className={`damage-overlay ${isTakingDamage ? 'flash' : ''} ${isDanger ? 'danger' : ''}`} />
      {isDemo && <div className="demo-text-overlay">- DEMO PLAY -</div>}
      <HUD score={score} lives={lives} maxLives={maxLives} />
      <GameField
        words={words}
        targetWordId={targetWordId}
        currentInput={currentInput}
        missiles={missiles}
        effects={effects}
        setMissiles={setMissiles}
        setEffects={setEffects}
      />
    </>
  );
};
