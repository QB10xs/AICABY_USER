import React from 'react';
import { format } from 'date-fns';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Message: React.FC<MessageProps> = ({ role, content, timestamp }) => {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`
          max-w-[80%] rounded-lg px-4 py-2
          ${isUser 
            ? 'bg-primary text-white rounded-br-none' 
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
          }
        `}
      >
        <p className="text-sm">{content}</p>
        <p className={`text-xs mt-1 ${isUser ? 'text-primary-50' : 'text-gray-500'}`}>
          {format(timestamp, 'HH:mm')}
        </p>
      </div>
    </div>
  );
};

export default Message; 