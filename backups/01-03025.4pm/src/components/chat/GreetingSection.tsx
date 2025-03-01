import React from 'react';

interface GreetingSectionProps {
  userName: string;
}

const GreetingSection: React.FC<GreetingSectionProps> = ({ userName }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="text-center space-y-2 py-4">
      <div className="flex items-center justify-center space-x-2">
        <span className="text-3xl">🚕</span>
        <h2 className="text-2xl font-semibold text-white">
          {getGreeting()}, {userName}
        </h2>
      </div>
      <p className="text-gray-400">How can I assist you with your journey today?</p>
    </div>
  );
};

export default GreetingSection; 