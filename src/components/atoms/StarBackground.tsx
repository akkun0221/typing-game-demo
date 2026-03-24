import React, { useMemo } from 'react';
import '../../style/StarBackground.css';

const generateStars = (count: number) => {
  // 画面外（-2000px～0px）に星を配置して下へスクロールさせる想定ですが、
  // リピートのため 0〜2000px の範囲にランダム配置し、CSSで translateY させます。
  let value = `${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF`;
  for (let i = 1; i < count; i++) {
    value += `, ${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF`;
  }
  return value;
};

export const StarBackground: React.FC = () => {
  // 3つの層（近景・中景・遠景）で星の数とサイズを変えてパララックス（視差）効果を生む
  const starsSmall = useMemo(() => generateStars(700), []);
  const starsMedium = useMemo(() => generateStars(200), []);
  const starsLarge = useMemo(() => generateStars(50), []);

  return (
    <div className="star-background">
      <div className="star-layer small" style={{ boxShadow: starsSmall }}></div>
      <div className="star-layer medium" style={{ boxShadow: starsMedium }}></div>
      <div className="star-layer large" style={{ boxShadow: starsLarge }}></div>
    </div>
  );
};
