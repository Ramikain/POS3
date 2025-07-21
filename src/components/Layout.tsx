import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
};