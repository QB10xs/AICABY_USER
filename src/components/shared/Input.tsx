import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-300">
          {label}
        </label>
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-200
            bg-zinc-800/50
            border border-[#F7C948]/20
            text-white
            placeholder-zinc-500
            ${error 
              ? 'border-red-500 focus:ring-1 focus:ring-red-500/30' 
              : 'focus:ring-1 focus:ring-[#F7C948]/30 focus:border-[#F7C948]/30 hover:border-[#F7C948]/30'
            }
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 