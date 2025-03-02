import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Star, RotateCcw } from 'lucide-react';

interface Activity {
  id: string;
  type: 'ride' | 'favorite' | 'location';
  title: string;
  subtitle: string;
  timestamp: Date;
}

interface RecentActivitiesProps {
  activities: Activity[];
  onRebook?: (activityId: string) => void;
}

const activityIcons = {
  ride: Clock,
  favorite: Star,
  location: MapPin
};

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities, onRebook }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-8"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activities</h3>
      
      <div className="space-y-3">
        {activities.map((activity) => {
          const Icon = activityIcons[activity.type];
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-4 bg-zinc-900/90 rounded-xl backdrop-blur-sm"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-zinc-800 rounded-lg">
                  <Icon className="w-5 h-5 text-yellow-500" />
                </div>
                
                <div>
                  <h4 className="font-medium text-white">{activity.title}</h4>
                  <p className="text-sm text-zinc-400">{activity.subtitle}</p>
                </div>
              </div>

              {activity.type === 'ride' && onRebook && (
                <button
                  onClick={() => onRebook(activity.id)}
                  className="p-2 text-zinc-400 hover:text-yellow-500 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RecentActivities;
