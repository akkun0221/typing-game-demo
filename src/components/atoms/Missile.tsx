import React, { useEffect, useState } from "react";
import "../../style/MissileDefense.css";

interface MissileProps {
  id: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  onArrive: (id: string, isExplosion: boolean, tx: number, ty: number) => void;
  wordId: string;
  isFirstLetter: boolean;
  isExplosion: boolean;
}

export const Missile: React.FC<MissileProps> = ({
  id,
  startX,
  startY,
  targetX,
  targetY,
  onArrive,
  wordId,
  isExplosion,
}) => {
  const [position, setPosition] = useState({ x: startX, y: startY });

  useEffect(() => {
    // わずかに遅らせてCSS Transitionを発動させる
    const timer = setTimeout(() => {
      setPosition({ x: targetX, y: targetY });
    }, 20);

    // ミサイルの着弾時間
    const arriveTimer = setTimeout(() => {
      onArrive(id, isExplosion, targetX, targetY);
    }, 200);

    return () => {
      clearTimeout(timer);
      clearTimeout(arriveTimer);
    };
  }, [startX, startY, targetX, targetY, onArrive, id, isExplosion, wordId]);

  // ターゲットへの角度を計算（上が0度）
  const dx = targetX - startX;
  const dy = targetY - startY;
  // vhと%の単位の違いを雑に補正（完全なピクセル計算ではないが視覚的には十分）
  const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

  return (
    <div
      className="missile"
      style={{
        left: `${position.x}%`,
        top: `${position.y}px`,
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
      }}
    >
      ■
    </div>
  );
};
