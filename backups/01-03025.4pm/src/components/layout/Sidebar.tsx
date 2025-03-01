import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  StarIcon,
  ClockIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,

} from '@heroicons/react/24/outline';
import { Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../stores/themeStore';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useLocalStorage('sidebarOpen', window.innerWidth >= 1024);
  const [isOpen, setIsOpen] = useState(sidebarOpen);
  const { isDarkMode } = useThemeStore();

  // Update localStorage when sidebar state changes
  useEffect(() => {
    setSidebarOpen(isOpen);
  }, [isOpen, setSidebarOpen]);
  
  useEffect(() => {
    // Apply dark mode class to html element
    document.documentElement.classList.toggle('dark', isDarkMode);

    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // Only auto-open if it was previously open
        if (sidebarOpen) {
          setIsOpen(true);
        }
      } else {
        setIsOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDarkMode]);
  
  interface NavItem {
    path: string;
    label: string;
    icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  }

  const navItems: NavItem[] = [
    { path: '/', label: 'Dashboard', icon: HomeIcon },
    { path: '/rides', label: 'Active Rides', icon: Car },
    { path: '/favourites', label: 'Favourites', icon: StarIcon },
    { path: '/history', label: 'Ride History', icon: ClockIcon },
    { path: '/profile', label: 'Profile', icon: UserCircleIcon },
    { path: '/support', label: 'Support', icon: ChatBubbleLeftRightIcon },
  ];

  return (
    <div className="relative">
      {/* Hamburger Button - Visible when sidebar is closed */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed top-4 left-4 z-50 p-2.5 rounded-lg bg-[#F7C948] hover:bg-[#FFE17D] 
          transition-all duration-200 shadow-[0_4px_12px_rgba(247,201,72,0.3)] ml-2
          ${isOpen ? 'hidden' : 'block'}
          transform hover:scale-105
        `}
        aria-label="Toggle Menu"
      >
        <Bars3Icon className="w-6 h-6 text-[#2A2A2A]" />
      </button>

      <AnimatePresence>
        {/* Backdrop - Only on mobile */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 ${window.innerWidth >= 1024 ? 'bg-opacity-0' : ''}`}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Fixed on desktop, animated on mobile */}
      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        className="fixed left-0 top-0 h-full w-[280px] bg-[#1C1C1C] text-white shadow-2xl z-50"
      >
        {/* Yellow Taxi Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F7C948] via-[#FFE17D] to-[#F7C948]" />

        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors z-[60]"
          aria-label="Close Menu"
        >
          <XMarkIcon className="w-6 h-6 text-white" />
        </button>

        <div className="relative h-full flex flex-col px-4 py-6">
          {/* Logo */}
          <div className="flex items-center mb-12 px-2 mt-2">
            <div className="bg-[#F7C948] p-2 rounded-xl shadow-lg">
              <Car className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <span className="ml-3 text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#F7C948] to-[#FFE17D] bg-clip-text text-transparent">
              AI CABY
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-thin scrollbar-track-[rgba(255,255,255,0.05)] scrollbar-thumb-[rgba(247,201,72,0.3)] hover:scrollbar-thumb-[rgba(247,201,72,0.5)] px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <div key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`
                      group flex items-center px-4 py-2.5 rounded-full transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-to-r from-[#F7C948] to-[#FFE17D] shadow-lg' 
                        : 'hover:bg-white/5'
                      }
                    `}
                  >
                    <div className={`
                      p-1.5 rounded-full transition-colors
                      ${isActive ? 'bg-black/20 text-white' : 'text-white group-hover:bg-black/20'}
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`
                      ml-3 font-medium tracking-wide
                      ${isActive ? 'text-[#2A2A2A]' : 'text-white/80 group-hover:text-white'}
                    `}>
                      {item.label}
                    </span>
                  </Link>
                  
                </div>
              );
            })}
          </nav>

          <div className="mt-auto mb-6" />

          {/* User Profile Section */}
          <div className="border-t border-[#F7C948]/20 pt-6 mt-6">
            <div className="flex items-center px-2">
              <div className="w-10 h-10 rounded-xl bg-[#F7C948] backdrop-blur-sm flex items-center justify-center">
                <UserCircleIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-3 flex-1">
                <div className="font-bold tracking-wide text-white">John Doe</div>
                <div className="text-sm font-medium text-[#F7C948]/80">Professional Driver</div>
              </div>
            </div>
            <Link
              to="/auth/signout"
              onClick={() => setIsOpen(false)}
              className="flex items-center mt-4 px-3 py-2 text-white/70 hover:text-white transition-colors group"
            >
              <div className="p-2 rounded-lg text-white group-hover:bg-white/5">
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </div>
              <span className="ml-3 font-bold tracking-wide">Sign Out</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
