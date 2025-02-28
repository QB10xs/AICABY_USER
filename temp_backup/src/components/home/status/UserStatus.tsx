import React from 'react';
import { motion } from 'framer-motion';

interface UserStatusProps {
  name: string;
  status: 'gold' | 'silver' | 'bronze' | 'new';
  rideCount: number;
}

const statusConfig = {
  gold: {
    color: 'bg-yellow-500',
    text: 'Gold Member',
    minRides: 500
  },
  silver: {
    color: 'bg-zinc-400',
    text: 'Silver Member',
    minRides: 200
  },
  bronze: {
    color: 'bg-amber-700',
    text: 'Bronze Member',
    minRides: 50
  },
  new: {
    color: 'bg-zinc-600',
    text: 'New Member',
    minRides: 0
  }
};

const UserStatus: React.FC<UserStatusProps> = ({ name, status, rideCount }) => {
  const config = statusConfig[status];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 bg-zinc-900/90 rounded-xl backdrop-blur-sm"
    >
      <div className="flex items-center space-x-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold text-white">
            Welcome back, {name}!
          </h2>
          <p className="text-sm text-zinc-400">
            {rideCount} rides completed
          </p>
        </div>
      </div>
      
      <div className={`px-3 py-1 ${config.color} rounded-full`}>
        <span className="text-sm font-medium text-white">
          {config.text}
        </span>
      </div>
    </motion.div>
  );
};

export default UserStatus;
