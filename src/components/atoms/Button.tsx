import React from "react";
import "../../style/Button.css";

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
