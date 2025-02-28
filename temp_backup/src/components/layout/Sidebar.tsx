import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import {
  HomeIcon,
  StarIcon,
  ClockIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuthStore();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { path: '/rides', label: 'Active Rides', icon: Car },
    { path: '/favourites', label: 'Favourites', icon: StarIcon },
    { path: '/history', label: 'Ride History', icon: ClockIcon },
    { path: '/profile', label: 'Profile', icon: UserCircleIcon },
    { path: '/support', label: 'Support', icon: ChatBubbleLeftRightIcon },
  ];

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '280px' }}
      className="fixed left-0 top-0 h-full bg-zinc-900/95 backdrop-blur-xl border-r border-yellow-400/20 text-white shadow-2xl z-50"
    >
      {/* Yellow Taxi Stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400" />
      
      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-8 bg-yellow-400 rounded-full p-1.5 shadow-lg hover:bg-yellow-500 transition-colors z-50"
      >
        {isCollapsed ? (
          <ChevronRightIcon className="w-4 h-4 text-black" />
        ) : (
          <ChevronLeftIcon className="w-4 h-4 text-black" />
        )}
      </button>

      <div className="relative h-full flex flex-col px-4 py-6">
        {/* Logo */}
        <Link to="/" className="flex items-center mb-12 px-2">
          <div className="bg-yellow-500 p-2 rounded-xl shadow-lg">
            <Car className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-3"
              >
                <span className="text-2xl font-extrabold tracking-tight text-white">
                  AI CABY
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group flex items-center px-3 py-3 rounded-xl transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg' 
                    : 'hover:bg-zinc-800'
                  }
                `}
              >
                <div className={`
                  p-2 rounded-lg transition-colors
                  ${isActive ? 'bg-black/20 text-white' : 'text-white group-hover:bg-black/20'}
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={`
                        ml-3 font-bold tracking-wide whitespace-nowrap
                        ${isActive ? 'text-white' : 'text-white/80 group-hover:text-white'}
                      `}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-white/10 pt-6 mt-6">
          <div className="flex items-center px-2">
            <div className="w-10 h-10 rounded-xl bg-yellow-500 backdrop-blur-sm flex items-center justify-center">
              <UserCircleIcon className="w-6 h-6 text-white" />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="ml-3 flex-1"
                >
                  <div className="font-bold tracking-wide text-white">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest'}
                  </div>
                  <div className="text-sm font-medium text-yellow-400/80">
                    {user?.user_metadata?.role || 'Passenger'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link
            to="/auth/signout"
            className="flex items-center mt-4 px-3 py-2 text-white/70 hover:text-white transition-colors group"
          >
            <div className="p-2 rounded-lg text-white group-hover:bg-zinc-800">
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="ml-3 font-bold tracking-wide"
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
