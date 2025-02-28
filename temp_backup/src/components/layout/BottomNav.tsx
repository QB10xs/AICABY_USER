import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  EllipsisHorizontalIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  EllipsisHorizontalIcon as EllipsisHorizontalIconSolid,
  UserCircleIcon as UserCircleIconSolid,
} from '@heroicons/react/24/solid';
import { Car } from 'lucide-react';
import MoreModal from './MoreModal';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  
  const navItems = [
    { path: '/dashboard', label: 'Home', icon: HomeIcon, activeIcon: HomeIconSolid },
    { path: '/rides', label: 'Rides', icon: Car, activeIcon: Car },
    { path: '/profile', label: 'Profile', icon: UserCircleIcon, activeIcon: UserCircleIconSolid },
    { type: 'more', label: 'More', icon: EllipsisHorizontalIcon, activeIcon: EllipsisHorizontalIconSolid },
  ];

  return (
    <>
      <nav className="bg-zinc-900/95 backdrop-blur-lg text-white h-16 flex items-center justify-around shadow-lg border-t border-white/10 fixed bottom-0 left-0 right-0">
        {navItems.map((item) => {
          const isActive = item.path ? location.pathname === item.path : false;
          const Icon = isActive ? item.activeIcon : item.icon;
          
          if (item.type === 'more') {
            return (
              <button
                key="more"
                onClick={() => setIsMoreOpen(true)}
                className={`
                  flex flex-col items-center justify-center space-y-1 w-16 py-1
                  transition-all duration-200 ease-in-out
                  text-white/70 hover:text-white
                `}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium tracking-wide opacity-70">
                  {item.label}
                </span>
              </button>
            );
          }
          
          return (
            <Link
              key={item.path}
              to={item.path!}
              className={`
                flex flex-col items-center justify-center space-y-1 w-16 py-1
                transition-all duration-200 ease-in-out
                ${isActive 
                  ? 'text-yellow-500 translate-y-[-4px]' 
                  : 'text-white/70 hover:text-white'
                }
              `}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'drop-shadow-[0_0_3px_rgba(255,215,0,0.5)]' : ''}`} />
              <span className={`text-xs font-medium tracking-wide ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      
      <MoreModal isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} />
    </>
  );
};

export default BottomNav; 