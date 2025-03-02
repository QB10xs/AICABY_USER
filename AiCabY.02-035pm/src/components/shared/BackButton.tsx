import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  to?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ to, className = '' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); // Go back one step in history
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors ${className}`}
    >
      <ArrowLeft className="w-5 h-5 mr-1" />
      <span>Back</span>
    </button>
  );
};

export default BackButton;
