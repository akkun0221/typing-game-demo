const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'src');
const dirs = [
  'components/atoms',
  'components/molecules',
  'components/organisms',
  'components/pages',
  'style',
  'types',
  'hooks'
];

dirs.forEach(d => fs.mkdirSync(path.join(src, d), { recursive: true }));

const files = {
  'types/game.ts': `
export type GameState = 'START_SCREEN' | 'PLAYING' | 'GAME_OVER';

export interface FallingWordType {
  id: string;
  text: string;
  x: number;
  y: number;
  speed: number;
}
`,
  'style/Button.css': `
.primary-btn {
  background: var(--accent-primary);
  color: #0d1117;
  font-size: 1.2rem;
  font-weight: 700;
  padding: 16px 32px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 0 20px var(--accent-primary-glow);
}
.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(88, 166, 255, 0.6);
  background: #79c0ff;
}
.primary-btn:active {
  transform: translateY(1px);
}
`,
  'style/Word.css': `
.word {
  position: absolute;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-main);
  padding: 8px 16px;
  background: rgba(33, 38, 45, 0.8);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  transition: background-color 0.2s, border-color 0.2s, transform 0.1s;
  will-change: transform, top;
  display: flex;
}
.word.targeted {
  border-color: var(--accent-primary);
  background: rgba(88, 166, 255, 0.1);
  box-shadow: 0 0 15px var(--accent-primary-glow);
  transform: scale(1.05);
}
.word .typed {
  color: var(--accent-primary);
  text-shadow: 0 0 8px var(--accent-primary-glow);
}
.word .untyped {
  color: var(--text-main);
}
`,
  'style/HUD.css': `
.hud {
  position: absolute;
  top: 20px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 40px;
  z-index: 10;
  pointer-events: none;
}
.hud-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 12px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
.hud-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #8b949e;
  margin-bottom: 4px;
}
.hud-value {
  font-size: 2rem;
  font-weight: 800;
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-main);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
}
.lives-container {
  display: flex;
  gap: 8px;
}
.life-icon {
  font-size: 1.5rem;
  color: var(--accent-danger);
  filter: drop-shadow(0 0 5px rgba(248, 81, 73, 0.5));
  transition: all 0.3s ease;
}
.life-icon.lost {
  color: #30363d;
  filter: none;
  transform: scale(0.8);
}
`,
  'style/GameModal.css': `
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(13, 17, 23, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  animation: fadeIn 0.5s ease-out;
}
.modal {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  padding: 48px;
  border-radius: 24px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  min-width: 400px;
  transform: translateY(0);
  pointer-events: auto;
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #fff, #8b949e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.modal.game-over h1 {
  background: linear-gradient(135deg, var(--accent-danger), #ff8a84);
  -webkit-background-clip: text;
}
.modal p {
  font-size: 1.2rem;
  color: #8b949e;
  margin-bottom: 32px;
}
.modal .score-display {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--accent-success);
  margin-bottom: 32px;
  font-family: 'JetBrains Mono', monospace;
  text-shadow: 0 0 15px rgba(63, 185, 80, 0.4);
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
`,
  'style/GameField.css': `
.game-area {
  flex: 1;
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
`,
  'components/atoms/Button.tsx': `
import React from 'react';
import '../../style/Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button className="primary-btn" {...props}>
      {children}
    </button>
  );
};
`,
  'components/atoms/Icon.tsx': `
import React from 'react';

interface IconProps {
  symbol: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({ symbol, className = '', style }) => {
  return <span className={className} style={style}>{symbol}</span>;
}
`,
  'components/atoms/Typography.tsx': `
import React from 'react';

interface TypographyProps {
  variant: 'h1' | 'p' | 'score' | 'label';
  children: React.ReactNode;
  className?: string;
}

export const Typography: React.FC<TypographyProps> = ({ variant, children, className = '' }) => {
  switch (variant) {
    case 'h1': return <h1 className={className}>{children}</h1>;
    case 'score': return <div className={\`score-display \${className}\`}>{children}</div>;
    case 'label': return <div className={\`hud-label \${className}\`}>{children}</div>;
    case 'p':
    default: return <p className={className}>{children}</p>;
  }
};
`,
  'components/molecules/LifeContainer.tsx': `
import React from 'react';
import { Icon } from '../atoms/Icon';

interface LifeContainerProps {
  lives: number;
  maxLives: number;
}

export const LifeContainer: React.FC<LifeContainerProps> = ({ lives, maxLives }) => {
  return (
    <div className="lives-container">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon 
          key={i} 
          symbol="❤️"
          className={\`life-icon \${i >= lives ? 'lost' : ''}\`}
          style={{ display: i < maxLives ? 'inline-block' : 'none' }}
        />
      ))}
    </div>
  );
};
`,
  'components/molecules/ScoreBoard.tsx': `
import React from 'react';
import { Typography } from '../atoms/Typography';

interface ScoreBoardProps {
  score: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ score }) => {
  return (
    <div className="hud-panel">
      <Typography variant="label">SCORE</Typography>
      <div className="hud-value">{score}</div>
    </div>
  );
};
`,
  'components/molecules/FallingWord.tsx': `
import React from 'react';
import { FallingWordType } from '../../types/game';
import '../../style/Word.css';

interface FallingWordProps {
  word: FallingWordType;
  isTargeted: boolean;
  currentInput: string;
}

export const FallingWord: React.FC<FallingWordProps> = ({ word, isTargeted, currentInput }) => {
  const typedPart = isTargeted ? currentInput : '';
  const untypedPart = word.text.slice(typedPart.length);

  return (
    <div
      className={\`word \${isTargeted ? 'targeted' : ''}\`}
      style={{
        left: \`\${word.x}%\`,
        top: \`\${word.y}px\`
      }}
    >
      <span className="typed">{typedPart}</span>
      <span className="untyped">{untypedPart}</span>
    </div>
  );
};
`,
  'components/organisms/HUD.tsx': `
import React from 'react';
import { ScoreBoard } from '../molecules/ScoreBoard';
import { LifeContainer } from '../molecules/LifeContainer';
import { Typography } from '../atoms/Typography';
import '../../style/HUD.css';

interface HUDProps {
  score: number;
  lives: number;
  maxLives: number;
}

export const HUD: React.FC<HUDProps> = ({ score, lives, maxLives }) => {
  return (
    <div className="hud">
      <ScoreBoard score={score} />
      <div className="hud-panel">
        <Typography variant="label">LIVES</Typography>
        <LifeContainer lives={lives} maxLives={maxLives} />
      </div>
    </div>
  );
};
`,
  'components/organisms/GameModal.tsx': `
import React from 'react';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import '../../style/GameModal.css';

interface GameModalProps {
  title: string;
  isGameOver?: boolean;
  score?: number;
  description?: string;
  buttonText: string;
  onButtonClick: () => void;
}

export const GameModal: React.FC<GameModalProps> = ({ 
  title, isGameOver = false, score, description, buttonText, onButtonClick 
}) => {
  return (
    <div className="overlay">
      <div className={\`modal \${isGameOver ? 'game-over' : ''}\`}>
        <Typography variant="h1">{title}</Typography>
        {description && <Typography variant="p">{description}</Typography>}
        {score !== undefined && (
          <Typography variant="score">SCORE: {score}</Typography>
        )}
        <Button onClick={onButtonClick}>{buttonText}</Button>
      </div>
    </div>
  );
};
`,
  'components/organisms/GameField.tsx': `
import React from 'react';
import { FallingWordType } from '../../types/game';
import { FallingWord } from '../molecules/FallingWord';
import '../../style/GameField.css';

interface GameFieldProps {
  words: FallingWordType[];
  targetWordId: string | null;
  currentInput: string;
}

export const GameField: React.FC<GameFieldProps> = ({ words, targetWordId, currentInput }) => {
  return (
    <div className="game-area">
      {words.map((word) => (
        <FallingWord 
          key={word.id} 
          word={word} 
          isTargeted={word.id === targetWordId}
          currentInput={currentInput}
        />
      ))}
    </div>
  );
};
`,
  'components/pages/StartScreen.tsx': `
import React from 'react';
import { GameModal } from '../organisms/GameModal';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <GameModal 
      title="TYPING MASTER"
      description="画面から落ちてくる単語をタイプして消そう！"
      buttonText="GAME START"
      onButtonClick={onStart}
    />
  );
};
`,
  'components/pages/GameOverScreen.tsx': `
import React from 'react';
import { GameModal } from '../organisms/GameModal';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => {
  return (
    <GameModal 
      title="GAME OVER"
      isGameOver={true}
      score={score}
      buttonText="PLAY AGAIN"
      onButtonClick={onRestart}
    />
  );
};
`,
  'hooks/useGameLoop.ts': `
import { useEffect, useCallback, useRef } from 'react';
import { FallingWordType } from '../types/game';

const WORD_LIST = [
  'react', 'typescript', 'javascript', 'frontend', 'developer',
  'component', 'state', 'props', 'hook', 'effect',
  'interface', 'type', 'boolean', 'string', 'number',
  'function', 'variable', 'constant', 'object', 'array',
  'promise', 'async', 'await', 'browser', 'window',
  'document', 'element', 'virtual', 'dom', 'render'
];

const FALL_SPEED_BASE = 1;
const SPAWN_RATE_MS = 1500;

export const useGameLoop = (
  isPlaying: boolean,
  score: number,
  setWords: React.Dispatch<React.SetStateAction<FallingWordType[]>>,
  setLives: React.Dispatch<React.SetStateAction<number>>,
  setTargetWordId: React.Dispatch<React.SetStateAction<string | null>>,
  setCurrentInput: React.Dispatch<React.SetStateAction<string>>,
  gameOver: () => void
) => {
  const lastSpawnTime = useRef<number>(0);

  const updateGame = useCallback((time: number) => {
    if (!isPlaying) return;

    let droppedInThisFrame: string[] = [];

    setWords((prevWords) => {
      const alive: FallingWordType[] = [];
      for (const w of prevWords) {
        const nextY = w.y + w.speed;
        if (nextY > window.innerHeight) {
          if (!droppedInThisFrame.includes(w.id)) {
            droppedInThisFrame.push(w.id);
          }
        } else {
          alive.push({ ...w, y: nextY });
        }
      }
      return alive;
    });

    if (droppedInThisFrame.length > 0) {
      setTimeout(() => {
        setLives(prev => {
          const newLives = prev - droppedInThisFrame.length;
          if (newLives <= 0) gameOver();
          return newLives;
        });

        setTargetWordId(prevId => {
          if (prevId && droppedInThisFrame.includes(prevId)) {
            setCurrentInput('');
            return null;
          }
          return prevId;
        });
      }, 0);
    }

    if (time - lastSpawnTime.current > SPAWN_RATE_MS) {
      const text = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
      const x = 10 + Math.random() * 80;
      setWords((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          text,
          x,
          y: -50,
          speed: FALL_SPEED_BASE + (Math.random() * 0.5) + (score * 0.02)
        }
      ]);
      lastSpawnTime.current = time;
    }
  }, [isPlaying, score, gameOver, setWords, setLives, setTargetWordId, setCurrentInput]);

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
`,
  'hooks/useTyping.ts': `
import { useEffect } from 'react';
import { FallingWordType } from '../types/game';

export const useTyping = (
  isPlaying: boolean,
  targetWordId: string | null,
  currentInput: string,
  setWords: React.Dispatch<React.SetStateAction<FallingWordType[]>>,
  setTargetWordId: React.Dispatch<React.SetStateAction<string | null>>,
  setCurrentInput: React.Dispatch<React.SetStateAction<string>>,
  setScore: React.Dispatch<React.SetStateAction<number>>
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      const key = e.key.toLowerCase();
      if (key.length > 1 || !/[a-z]/.test(key)) return;

      setWords((currentWords) => {
        let nextTargetId = targetWordId;
        const newInput = currentInput + key;

        if (!nextTargetId) {
          const matchingWords = currentWords.filter(w => w.text.startsWith(newInput));
          matchingWords.sort((a, b) => b.y - a.y);

          if (matchingWords.length > 0) {
            nextTargetId = matchingWords[0].id;
            setTargetWordId(nextTargetId);
            setCurrentInput(newInput);
          }
        } else {
          const targetWord = currentWords.find(w => w.id === nextTargetId);
          if (targetWord && targetWord.text.startsWith(newInput)) {
            setCurrentInput(newInput);

            if (targetWord.text === newInput) {
              setScore(s => s + targetWord.text.length * 10);
              setCurrentInput('');
              setTargetWordId(null);
              return currentWords.filter(w => w.id !== nextTargetId);
            }
          }
        }
        return currentWords;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentInput, targetWordId, setWords, setTargetWordId, setCurrentInput, setScore]);
};
`,
  'components/pages/PlayingScreen.tsx': `
import React from 'react';
import { FallingWordType } from '../../types/game';
import { HUD } from '../organisms/HUD';
import { GameField } from '../organisms/GameField';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useTyping } from '../../hooks/useTyping';

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
}

export const PlayingScreen: React.FC<PlayingScreenProps> = ({
  score, lives, words, currentInput, targetWordId, maxLives,
  setScore, setLives, setWords, setCurrentInput, setTargetWordId, gameOver
}) => {

  useGameLoop(true, score, setWords, setLives, setTargetWordId, setCurrentInput, gameOver);
  useTyping(true, targetWordId, currentInput, setWords, setTargetWordId, setCurrentInput, setScore);

  return (
    <>
      <HUD score={score} lives={lives} maxLives={maxLives} />
      <GameField words={words} targetWordId={targetWordId} currentInput={currentInput} />
    </>
  );
};
`
};

Object.entries(files).forEach(([file, content]) => {
  fs.writeFileSync(path.join(src, file), content.trim() + '\\n');
});

console.log('Successfully created all atomic components and styles!');
