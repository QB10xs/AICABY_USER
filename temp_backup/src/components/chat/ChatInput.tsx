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
    <div className="glass-card p-4">
      <div className="flex items-end space-x-2">
        <div className="flex-1 min-h-[44px] bg-white/5 rounded-lg border border-white/10 focus-within:border-taxi-yellow transition-colors">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="How can AI CABY help you today?"
            className="w-full bg-transparent p-3 text-white placeholder-gray-400 resize-none focus:outline-none"
            rows={1}
            style={{ minHeight: '44px' }}
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`p-3 rounded-lg transition-colors ${
              isRecording ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-400 hover:text-taxi-yellow'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>

          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className={`p-3 rounded-lg transition-colors ${
              message.trim()
                ? 'bg-taxi-yellow text-night-black hover:bg-yellow-400'
                : 'bg-white/5 text-gray-400'
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