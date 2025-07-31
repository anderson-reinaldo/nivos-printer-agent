import React from 'react';
import { WindowControls } from './WindowControls';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 flex transition-colors duration-300">
    <div className="w-full bg-white dark:bg-zinc-800 shadow-lg border border-gray-200 dark:border-zinc-700">
      <WindowControls />
      {children}
    </div>
  </div>
);

export default AppLayout;
