import React from "react";
import { Bot } from "lucide-react";
import { Link } from "react-router-dom";

interface FloatingActionButtonProps {
  to?: string;
  label: string;
  onClick?: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  to,
  label,
  onClick,
}) => {
  // Common button style
  const buttonStyle =
    "flex items-center gap-2 bg-dhl-red hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-all group-hover:gap-3";

  // Common content
  const buttonContent = (
    <>
      <Bot className="h-6 w-6" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out">
        {label}
      </span>
    </>
  );

  return (
    <div className="fixed bottom-6 right-6 group z-50">
      {onClick ? (
        // Button with onClick handler
        <button onClick={onClick} className={buttonStyle}>
          {buttonContent}
        </button>
      ) : (
        // Link to a route
        <Link to={to || "/"} className={buttonStyle}>
          {buttonContent}
        </Link>
      )}
    </div>
  );
};

export default FloatingActionButton;
