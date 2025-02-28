import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-background">
      {!isLandingPage && (
        <>
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <Sidebar />
          </div>
          
          {/* Mobile Bottom Navigation */}
          <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white">
            <BottomNav />
          </div>
        </>
      )}
      
      {/* Main Content */}
      <main className={`
        ${!isLandingPage ? 'md:ml-64' : ''} // Adjust margin when sidebar is present
        ${!isLandingPage ? 'pb-20 md:pb-0' : ''} // Add bottom padding on mobile for bottom nav
      `}>
        {children}
      </main>
    </div>
  );
};

export default Layout; 