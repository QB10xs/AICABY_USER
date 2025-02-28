import React from 'react';
import { glassEffects } from '@/theme/colors';
import { useDarkMode } from '@/hooks/useDarkMode';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  gradient?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  interactive = false,
  gradient = false,
  onClick,
  style,
  ...props
}) => {
  const { isDarkMode } = useDarkMode();
  const mode = isDarkMode ? 'dark' : 'light';
  const effects = glassEffects[mode];

  const baseClasses = [
    effects.background,
    effects.border,
    effects.shadow,
    'rounded-xl',
    'transition-all',
    'duration-300',
    'ease-in-out'
  ];

  if (interactive) {
    baseClasses.push(effects.hover, 'cursor-pointer', 'transform', 'hover:-translate-y-1');
  }

  if (gradient) {
    baseClasses.push(effects.gradient);
  }

  return (
    <div
      className={`${baseClasses.join(' ')} ${className}`}
      onClick={interactive ? onClick : undefined}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};
