export type GameState = 'START_SCREEN' | 'INTRODUCTION' | 'PLAYING' | 'GAME_OVER' | 'DEMO' | 'ENDING';

export interface FallingWordType {
  id: string;
  text: string;
  x: number;
  y: number;
  speed: number;
}

export interface MissileData {
  id: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  wordId: string;
  isFirstLetter: boolean;
  isExplosion: boolean;
}

export interface EffectData {
  id: string;
  x: number;
  y: number;
  type: 'hit' | 'explosion' | 'misfire';
}