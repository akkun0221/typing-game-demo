import { useEffect, useCallback, useRef, useState } from 'react';
import type { FallingWordType } from "../types/game";

const FALL_SPEED_BASE = 1;
const SPAWN_RATE_MS = 2000;

export const useGameLoop = (
  isPlaying: boolean,
  score: number,
  setWords: React.Dispatch<React.SetStateAction<FallingWordType[]>>,
  setLives: React.Dispatch<React.SetStateAction<number>>,
  setTargetWordId: React.Dispatch<React.SetStateAction<string | null>>,
  setCurrentInput: React.Dispatch<React.SetStateAction<string>>,
  gameOver: () => void,
  onEarthHit?: (tx: number, ty: number) => void
) => {
  const [wordList, setWordList] = useState<string[]>([]);
  const lastSpawnTime = useRef<number>(0);
  const droppedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/togakangaroo/tech-terms/master/terms.org')
      .then(res => res.text())
      .then(text => {
        const rawTerms = text.split('\n')
          .filter(line => line.startsWith('|') && !line.includes('---'))
          .map(line => line.split('|')[1]?.trim() || '');

        const validWords = new Set<string>();
        rawTerms.forEach(term => {
          // () や / で区切ってエイリアスや略語も抽出
          const aliases = term.split(/[/()]/).map(s => s.trim());
          aliases.forEach(alias => {
            // アルファベット以外を取り除く（空白含む）
            const w = alias.toLowerCase().replace(/[^a-z]/g, '');
            // 2文字以上10文字以下のものを抽出
            if (w.length >= 2 && w.length <= 10) {
              validWords.add(w);
            }
          });
        });

        const termsArray = Array.from(validWords);
        if (termsArray.length > 0) {
          setWordList(termsArray);
        }
      })
      .catch(err => {
        console.error('Failed to fetch terms:', err);
      });
  }, []);

  const updateGame = useCallback((time: number) => {
    if (!isPlaying) return;

    setWords((prevWords) => {
      let droppedCount = 0;
      const newDrops: string[] = [];
      const newDropsCoords: { x: number, y: number }[] = [];
      const alive: FallingWordType[] = [];

      // 地球の地表の高さ（画面の85%付近）
      const earthHeight = window.innerHeight * 0.85;

      for (const w of prevWords) {
        const nextY = w.y + w.speed;
        
        if (nextY > earthHeight) {
          if (!droppedIdsRef.current.has(w.id)) {
            droppedIdsRef.current.add(w.id);
            droppedCount++;
            newDrops.push(w.id);
            newDropsCoords.push({ x: w.x, y: earthHeight });
          }
        } else {
          alive.push({ ...w, y: nextY });
        }
      }

      if (droppedCount > 0) {
        setTimeout(() => {
          setLives(prev => {
            const newLives = prev - droppedCount;
            if (newLives <= 0) gameOver();
            return newLives;
          });

          setTargetWordId(prevId => {
            if (prevId && newDrops.includes(prevId)) {
              setCurrentInput('');
              return null;
            }
            return prevId;
          });

          // 着弾エフェクト発火
          if (onEarthHit) {
            newDropsCoords.forEach(coord => onEarthHit(coord.x, coord.y));
          }
        }, 0);
      }
      
      return alive;
    });

    if (time - lastSpawnTime.current > SPAWN_RATE_MS) {
      if (wordList.length === 0) return;

      const text = wordList[Math.floor(Math.random() * wordList.length)];
      // 画面右端で見切れないように、X座標の最大値を70%程度に制限
      const x = 5 + Math.random() * 70;

      // スコア500点ごとに落下速度を +0.5 する
      const speedBonus = Math.floor(score / 500) * 0.5;

      setWords((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          text,
          x,
          y: -50,
          speed: FALL_SPEED_BASE + speedBonus + (Math.random() * 0.5)
        }
      ]);
      lastSpawnTime.current = time;
    }
  }, [isPlaying, score, gameOver, setWords, setLives, setTargetWordId, setCurrentInput, wordList, onEarthHit]);

  useEffect(() => {
    let animationFrameId: number;
    const loop = (time: number) => {
      updateGame(time);
      animationFrameId = requestAnimationFrame(loop);
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, updateGame]);
};