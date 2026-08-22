import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';
import Copilot from '../ui/Copilot';

const Layout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-df-bg text-df-text">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-df-lime"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-full bg-df-bg text-df-text overflow-hidden transition-colors duration-300">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block w-64 h-full border-r border-df-border bg-df-surface">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 w-full h-full overflow-hidden">
        {/* TopBar */}
        <div className="h-16 border-b border-df-border bg-df-surface/80 backdrop-blur-md sticky top-0 z-10">
          <TopBar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation - visible only on mobile */}
      <div className="md:hidden border-t border-df-border bg-df-surface fixed bottom-0 w-full z-20">
        <MobileNav />
      </div>

      <Copilot />
    </div>
  );
};

export default Layout;
