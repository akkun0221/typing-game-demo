import React, { useEffect } from 'react';
import '../../style/Introduction.css';
import { StarBackground } from '../atoms/StarBackground';

interface IntroductionProps {
  onComplete: () => void;
  onInterrupt: () => void;
}

export const Introduction: React.FC<IntroductionProps> = ({ onComplete, onInterrupt }) => {
  useEffect(() => {
    const handleKeyDown = () => onInterrupt();
    const handleClick = () => onInterrupt();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);

    const timer = setTimeout(() => {
      onComplete();
    }, 15000); // 15秒でアニメーション終了し遷移

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
      clearTimeout(timer);
    };
  }, [onComplete, onInterrupt]);

  return (
    <>
      <StarBackground />
      <div className="intro-container">
        <div className="intro-fade" />
        <div className="intro-crawl">
          <p>
            人類が宇宙への進出を果たし、かつてない繁栄と平和を謳歌していた時代。その平穏は、突如として破られた。太陽系の彼方より、観測史上未曾有の巨大隕石群が、地球へ向かって急接近を開始したのだ。
          </p>
          <p>
            隕石群の軌道は地球を直撃しており、衝突すれば文明は滅亡する。在来の防衛システムは無力化され、絶望に沈む世界。人類は最後の希望を、極秘裏に開発されていた超高性能AIサイボーグ「T-EDF オペレーター」に託した。彼の体内には、紅蓮の回路が脈動し、超人的な情報解析演算能力を秘めている。
          </p>
          <p>
            EDFの迎撃システムが起動した。しかし、隕石の数は無数。彼の超人的な「高速タイピング能力」だけが、この隕石群を正確に捉え、ミサイルを撃ち込める唯一の手段である。人類の存亡は、今、彼の、そしてあなたの指先に委ねられた……。
          </p>
        </div>
      </div>
    </>
  );
};
