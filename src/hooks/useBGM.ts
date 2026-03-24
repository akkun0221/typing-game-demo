import { useEffect, useRef, useState, useCallback } from 'react';
import type { GameState } from '../types/game';

export const useBGM = (gameState: GameState) => {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('isMuted');
    // 初期状態はOFF（ミュート）とし、ユーザーが切り替えた場合は以降それを引き継ぐ
    return saved === null ? true : saved === 'true';
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      localStorage.setItem('isMuted', String(next));
      return next;
    });
  }, []);

  // Audioインスタンスの初期化と、コンポーネント完全破棄時（HMR等を含む）のクリーンアップ
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5; // ゲームBGMとしての適切な音量
    }
    return () => {
      // HMR等による再描画時、以前のAudioが鳴りっぱなしになる「ファントム再生」を防止
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // BGMのシーン切り替えと再生・一時停止の制御
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let src = '';
    if (gameState === 'START_SCREEN' || gameState === 'ENDING') src = '/bgm/title.mp3';
    else if (gameState === 'PLAYING' || gameState === 'DEMO') src = '/bgm/playing.mp3';
    else if (gameState === 'GAME_OVER') src = '/bgm/gameover.mp3';

    if (src) {
      const targetUrl = new URL(src, window.location.href).href;
      if (audio.src !== targetUrl) {
        // 音源切り替えのエラー（AbortError）を防ぐため、明示的に止めて読み込み直す
        audio.pause();
        audio.src = src;
        audio.load();
      }
    }

    if (isMuted) {
      audio.pause();
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Autoplay prevented or interrupted:", error);
        });
      }
    }
  }, [gameState, isMuted]);

  // グローバルなスペースキーでのミュート切り替え
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        // スペースキー押下時のブラウザのデフォルトスクロール挙動を防止
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
        }
        toggleMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleMute]);

  return { isMuted, toggleMute };
};
