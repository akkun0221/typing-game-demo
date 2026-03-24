import React from "react";

interface IconProps {
  symbol: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({
  symbol,
  className = "",
  style,
}) => {
  return (
    <span className={className} style={style}>
      {symbol}
    </span>
  );
};
