import React, { useCallback } from 'react';
import type { FallingWordType, MissileData, EffectData } from '../../types/game';
import { FallingWord } from '../molecules/FallingWord';
import { EarthLauncher } from './EarthLauncher';
import { Missile } from '../atoms/Missile';
import { EffectParticle } from '../atoms/EffectParticle';
import "../../style/GameField.css";

interface GameFieldProps {
  words: FallingWordType[];
  targetWordId: string | null;
  currentInput: string;
  missiles: MissileData[];
  effects: EffectData[];
  setMissiles: React.Dispatch<React.SetStateAction<MissileData[]>>;
  setEffects: React.Dispatch<React.SetStateAction<EffectData[]>>;
}

export const GameField: React.FC<GameFieldProps> = ({ 
  words, targetWordId, currentInput, missiles, effects, setMissiles, setEffects 
}) => {
  const handleMissileArrive = useCallback((id: string, isExplosion: boolean, tx: number, ty: number) => {
    setMissiles(prev => prev.filter(m => m.id !== id));
    
    // 着弾エフェクトの生成
    const effectId = Math.random().toString(36).substring(2, 9);
    setEffects(prev => [...prev, {
      id: effectId,
      x: tx,
      y: (ty / window.innerHeight) * 100, // pxをvhに変換
      type: isExplosion ? 'explosion' : 'hit'
    }]);
  }, [setMissiles, setEffects]);

  const handleEffectComplete = useCallback((id: string) => {
    setEffects(prev => prev.filter(e => e.id !== id));
  }, [setEffects]);

  return (
    <div className="game-area">
      {words.map((w) => (
        <FallingWord
          key={w.id}
          word={w}
          isTargeted={w.id === targetWordId}
          currentInput={w.id === targetWordId ? currentInput : ''}
        />
      ))}
      
      {missiles.map(m => (
        <Missile
          key={m.id}
          id={m.id}
          startX={m.startX}
          startY={m.startY}
          targetX={m.targetX}
          targetY={m.targetY}
          wordId={m.wordId}
          isFirstLetter={m.isFirstLetter}
          isExplosion={m.isExplosion}
          onArrive={handleMissileArrive}
        />
      ))}

      {effects.map(e => (
        <EffectParticle
          key={e.id}
          id={e.id}
          x={e.x}
          y={e.y}
          type={e.type}
          onComplete={handleEffectComplete}
        />
      ))}

      <EarthLauncher />
    </div>
  );
};
