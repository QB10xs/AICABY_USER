// Brand Colors
export const brandColors = {
  taxiYellow: '#F7C948',
  nightBlack: '#2A2A2A',
  successGreen: '#27AE60',
  errorRed: '#EB5757'
};

// Glassmorphism Effects
export const glassEffects = {
  light: {
    background: 'bg-white/70 backdrop-blur-md',
    border: 'border border-white/20',
    shadow: 'shadow-lg shadow-yellow-500/10',
    hover: 'hover:bg-white/80 hover:shadow-yellow-500/20',
    gradient: 'bg-gradient-to-br from-yellow-400 to-yellow-200'
  },
  dark: {
    background: 'bg-zinc-900/70 backdrop-blur-md',
    border: 'border border-yellow-500/20',
    shadow: 'shadow-lg shadow-yellow-500/5',
    hover: 'hover:bg-zinc-800/80 hover:shadow-yellow-500/10',
    gradient: 'bg-gradient-to-br from-zinc-800 to-zinc-900'
  }
};

// Semantic Colors
export const semanticColors = {
  light: {
    background: 'bg-zinc-50',
    surface: 'bg-white/70 backdrop-blur-md',
    surfaceHover: 'hover:bg-white/80',
    text: {
      primary: 'text-zinc-900',
      secondary: 'text-zinc-600',
      accent: 'text-yellow-500'
    },
    border: 'border-white/20',
    input: {
      background: 'bg-white/70 backdrop-blur-sm',
      border: 'border-white/20',
      focus: 'focus:ring-yellow-500/30 focus:border-yellow-500/50'
    }
  },
  dark: {
    background: 'bg-zinc-900',
    surface: 'bg-zinc-800/70 backdrop-blur-md',
    surfaceHover: 'hover:bg-zinc-700/80',
    text: {
      primary: 'text-white',
      secondary: 'text-zinc-400',
      accent: 'text-yellow-400'
    },
    border: 'border-yellow-500/20',
    input: {
      background: 'bg-zinc-800/70 backdrop-blur-sm',
      border: 'border-yellow-500/20',
      focus: 'focus:ring-yellow-400/30 focus:border-yellow-400/50'
    }
  }
};
