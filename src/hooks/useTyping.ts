import { useEffect } from 'react';
import type { FallingWordType } from "../types/game";

export interface TypingCallbacks {
  onHit?: (word: FallingWordType, isFirstLetter: boolean) => void;
  onMiss?: () => void;
  onDestroy?: (word: FallingWordType) => void;
}

export const useTyping = (
  isPlaying: boolean,
  targetWordId: string | null,
  currentInput: string,
  setWords: React.Dispatch<React.SetStateAction<FallingWordType[]>>,
  setTargetWordId: React.Dispatch<React.SetStateAction<string | null>>,
  setCurrentInput: React.Dispatch<React.SetStateAction<string>>,
  setScore: React.Dispatch<React.SetStateAction<number>>,
  callbacks?: TypingCallbacks
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      const key = e.key.toLowerCase();
      if (key.length > 1 || !/[a-z]/.test(key)) return;

      // React StrictModeでの2重実行を防ぐためのフラグ
      let effectsTriggered = false;

      setWords((currentWords) => {
        let nextTargetId = targetWordId;
        const newInput = currentInput + key;

        if (!nextTargetId) {
          const matchingWords = currentWords.filter(w => w.text.startsWith(newInput));
          matchingWords.sort((a, b) => b.y - a.y);

          if (matchingWords.length > 0) {
            nextTargetId = matchingWords[0].id;
            const targetWord = matchingWords[0];
            
            if (!effectsTriggered) {
              effectsTriggered = true;
              setTimeout(() => {
                setTargetWordId(nextTargetId);
                setCurrentInput(newInput);
                callbacks?.onHit?.(targetWord, true);
              }, 0);
            }
          } else {
             if (!effectsTriggered) {
               effectsTriggered = true;
               setTimeout(() => callbacks?.onMiss?.(), 0);
             }
          }
        } else {
          const targetWord = currentWords.find(w => w.id === nextTargetId);
          if (targetWord && targetWord.text.startsWith(newInput)) {
            const isCompleted = targetWord.text === newInput;

            if (!effectsTriggered) {
              effectsTriggered = true;
              setTimeout(() => {
                callbacks?.onHit?.(targetWord, false);

                if (isCompleted) {
                  setScore(s => s + targetWord.text.length * 10);
                  setCurrentInput('');
                  setTargetWordId(null);
                  callbacks?.onDestroy?.(targetWord);
                } else {
                  setCurrentInput(newInput);
                }
              }, 0);
            }

            if (isCompleted) {
              return currentWords.filter(w => w.id !== nextTargetId);
            }
          } else {
             if (!effectsTriggered) {
               effectsTriggered = true;
               setTimeout(() => callbacks?.onMiss?.(), 0);
             }
          }
        }
        return currentWords;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentInput, targetWordId, setWords, setTargetWordId, setCurrentInput, setScore, callbacks]);
};