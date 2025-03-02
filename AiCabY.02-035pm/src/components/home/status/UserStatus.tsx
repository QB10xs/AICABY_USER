import React from 'react';
import { motion } from 'framer-motion';

interface UserStatusProps {
  name: string;
  status: 'gold' | 'silver' | 'bronze' | 'new';
  rideCount: number;
  joinDate: string;
  totalDistance: number;
}

const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)}km`;
  }
  return `${meters}m`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

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

const UserStatus: React.FC<UserStatusProps> = ({ name, status, rideCount, joinDate, totalDistance }) => {
  const config = statusConfig[status];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-6 bg-zinc-900/90 rounded-xl backdrop-blur-sm border border-[#F7C948]/10"
    >
      <div className="flex items-center space-x-6">
        <div className={`w-12 h-12 rounded-full ${config.color} bg-opacity-20 flex items-center justify-center`}>
          <span className="text-2xl">{status === 'gold' ? '🏆' : status === 'silver' ? '🥈' : status === 'bronze' ? '🥉' : '🌟'}</span>
        </div>
        <div className="flex flex-col space-y-1">
          <h2 className="text-xl font-semibold text-white">
            Welcome back, {name}!
          </h2>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-zinc-400">
              <span className="font-medium text-[#F7C948]">{rideCount}</span> rides completed
            </p>
            <span className="text-zinc-600">•</span>
            <p className="text-sm text-zinc-400">
              <span className="font-medium text-[#F7C948]">{formatDistance(totalDistance)}</span> traveled
            </p>
          </div>
          <p className="text-xs text-zinc-500">
            Member since {formatDate(joinDate)}
          </p>
        </div>
      </div>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-end"
      >
        <span className={`text-sm font-medium ${config.color} text-opacity-90`}>
          {config.text}
        </span>
        <div className="mt-2 flex items-center space-x-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className={`w-2 h-2 rounded-full ${i < Math.ceil((rideCount / 500) * 3) ? config.color : 'bg-zinc-800'}`}
            />
          ))}
        </div>
      </motion.div>
      
      <div className={`px-3 py-1 ${config.color} rounded-full`}>
        <span className="text-sm font-medium text-white">
          {config.text}
        </span>
      </div>
    </motion.div>
  );
};

export default UserStatus;
