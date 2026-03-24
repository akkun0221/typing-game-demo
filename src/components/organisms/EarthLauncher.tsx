import React from 'react';
import '../../style/MissileDefense.css';

export const EarthLauncher: React.FC = () => {
  return (
    <div className="earth-container">
      <div className="earth-surface" />
      <div className="launcher">
        <div className="launcher-base" />
        <div className="launcher-barrel" />
      </div>
    </div>
  );
};
