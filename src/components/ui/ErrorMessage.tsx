import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message: string;
  className?: string;
  variant?: 'default' | 'subtle';
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className,
  variant = 'default'
}) => {
  const variants = {
    default: 'bg-error/10 border-error/20 text-error',
    subtle: 'bg-error/5 border-error/10 text-error/90'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'p-3 rounded-lg border flex items-start space-x-2',
        variants[variant],
        className
      )}
    >
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <span className="text-sm">{message}</span>
    </motion.div>
  );
};

export default ErrorMessage;
