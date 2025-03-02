import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

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
          {/* Sidebar - Fixed on desktop, toggleable on mobile */}
          <div className="fixed inset-y-0 left-0 z-40">
            <Sidebar />
          </div>
        </>
      )}
      
      {/* Main Content */}
      <main className={`
        ${!isLandingPage ? 'pl-4 pt-20 md:pt-6 transition-all duration-300' : ''}
        ${!isLandingPage ? 'md:pl-[280px]' : ''}
        px-4 sm:px-6 lg:px-8
      `}>
        {children}
      </main>
    </div>
  );
};

export default Layout; 