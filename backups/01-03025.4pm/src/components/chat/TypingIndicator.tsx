import React from 'react';

interface TypingIndicatorProps {
  className?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ className }) => {
  return (
    <div className={`flex items-center space-x-2 ${className || ''}`}>
      <div className="w-2 h-2 bg-[#F7C948] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-[#F7C948] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-[#F7C948] rounded-full animate-bounce"></div>
    </div>
  );
};

export default TypingIndicator; 