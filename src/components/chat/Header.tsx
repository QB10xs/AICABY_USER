import React from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { Menu } from 'lucide-react';

const Header: React.FC = () => {
  const session = useSession();
  const membershipStatus = session?.user?.user_metadata?.membership_status || 'standard';

  return (
    <header className="glass-card p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <Menu className="w-6 h-6 text-taxi-yellow" />
        </button>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-taxi-yellow to-yellow-300">
          AI CABY
        </h1>
      </div>

      <div className="flex items-center space-x-2">
        {membershipStatus === 'gold' && (
          <span className="flex items-center space-x-1">
            <span className="text-taxi-yellow">⭐</span>
            <span className="text-sm font-medium text-taxi-yellow">Gold Member</span>
          </span>
        )}
      </div>
    </header>
  );
};

export default Header; 