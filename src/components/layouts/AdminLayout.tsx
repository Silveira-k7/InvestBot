import React from 'react';
import { AdminHeader } from '../admin/AdminHeader';
import { AdminSidebar } from '../admin/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 lg:ml-64 pt-16">
          {children}
        </main>
      </div>
    </div>
  );
};