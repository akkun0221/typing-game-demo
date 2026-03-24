import React, { useEffect } from 'react';

export type EffectType = 'hit' | 'explosion' | 'misfire';

interface EffectParticleProps {
  id: string;
  x: number;
  y: number;
  type: EffectType;
  onComplete: (id: string) => void;
}

export const EffectParticle: React.FC<EffectParticleProps> = ({ id, x, y, type, onComplete }) => {
  useEffect(() => {
    // 種類によってエフェクトの表示時間を変える
    const duration = type === 'explosion' ? 500 : 300;
    const timer = setTimeout(() => onComplete(id), duration);
    return () => clearTimeout(timer);
  }, [type, onComplete, id]);

  return (
    <div 
      className={`particle-effect ${type}`}
      style={{ left: `${x}%`, top: `${y}vh` }}
    />
  );
};
