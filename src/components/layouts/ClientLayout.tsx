import React from 'react';
import { Header } from '../layout/Header';
import { Sidebar } from '../layout/Sidebar';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 pt-16">
          {children}
        </main>
      </div>
    </div>
  );
};