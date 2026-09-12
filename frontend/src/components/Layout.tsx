import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
      <Navbar />
      <main className="flex-1 pb-12">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200/80 bg-white py-4 text-center text-xs text-slate-400">
        Clinical Trial Data Platform • Confidential Trial Operations
      </footer>
    </div>
  );
};
