import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StarIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface MoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const secondaryNavItems = [
  { path: '/favourites', label: 'Saved', icon: StarIcon },
  { path: '/history', label: 'History', icon: ClockIcon },
  { path: '/support', label: 'Support', icon: ChatBubbleLeftRightIcon },
];

const MoreModal: React.FC<MoreModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-zinc-900 rounded-t-3xl z-50 pb-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">More Options</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Grid of Options */}
            <div className="grid grid-cols-3 gap-4 p-6">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Icon className="w-8 h-8 text-yellow-500 mb-2" />
                    <span className="text-sm font-medium text-white text-center">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Handle for mobile */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-12 h-1 rounded-full bg-white/20" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MoreModal;
