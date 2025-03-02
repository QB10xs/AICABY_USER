import React, { useState } from 'react';
import { Send, Mic } from 'lucide-react';

interface ChatInputProps {
  onSend?: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      onSend?.(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-zinc-800 shadow-lg dark:shadow-zinc-900/50 rounded-xl">
      <div className="flex items-end space-x-2">
        <div className="flex-1 min-h-[44px] bg-zinc-50 dark:bg-zinc-700/50 rounded-lg border border-zinc-200 dark:border-zinc-600 focus-within:border-primary transition-colors">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="How can AI CABY help you today?"
            className="w-full bg-transparent p-3 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 resize-none focus:outline-none"
            rows={1}
            style={{ minHeight: '44px' }}
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`p-3 rounded-lg transition-colors ${
              isRecording 
                ? 'bg-red-500 text-white dark:bg-red-600' 
                : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-primary dark:hover:text-primary'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>

          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className={`p-3 rounded-lg transition-colors ${
              message.trim()
                ? 'bg-primary text-black hover:bg-primary/90 dark:hover:bg-primary/80'
                : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput; 