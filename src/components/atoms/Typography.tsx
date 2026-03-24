import React from "react";

interface TypographyProps {
  variant: "h1" | "p" | "score" | "label";
  children: React.ReactNode;
  className?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  variant,
  children,
  className = "",
}) => {
  switch (variant) {
    case "h1":
      return <h1 className={className}>{children}</h1>;
    case "score":
      return <div className={`score-display ${className}`}>{children}</div>;
    case "label":
      return <div className={`hud-label ${className}`}>{children}</div>;
    case "p":
    default:
      return <p className={className}>{children}</p>;
  }
};
