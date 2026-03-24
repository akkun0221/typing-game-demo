import React from "react";
import { GameModal } from "../organisms/GameModal";

interface StartScreenProps {
  onStart: () => void;
  isMuted?: boolean;
  toggleMute?: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, isMuted, toggleMute }) => {
  return (
    <>
      <GameModal
        buttonText="GAME START"
        onButtonClick={onStart}
        bgImage="/image/title.png"
      />
      {toggleMute && (
        <button 
          onClick={toggleMute}
          style={{
            position: 'absolute',
            bottom: '30px',
            right: '30px',
            padding: '12px 24px',
            background: 'rgba(22, 27, 34, 0.8)',
            border: '1px solid rgba(48, 54, 61, 0.8)',
            color: '#c9d1d9',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontWeight: 'bold',
            zIndex: 100,
            backdropFilter: 'blur(4px)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(48, 54, 61, 0.9)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(22, 27, 34, 0.8)'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {isMuted ? "🔇 SOUND OFF (Space)" : "🔊 SOUND ON (Space)"}
        </button>
      )}
    </>
  );
};
