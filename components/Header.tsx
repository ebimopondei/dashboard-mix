
import React, { useState } from 'react';
import { Icon } from './Icon';
import { PROFILE_IMAGE_URL } from '../constants';
import { NotificationsPanel } from './NotificationsPanel';

interface HeaderProps {
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleTheme, isDarkMode }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md transition-colors duration-300">
      <div className="flex items-center justify-between h-12">
        <div className="flex items-center gap-3">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-white/10"
            style={{ backgroundImage: `url("${PROFILE_IMAGE_URL}")` }}
            role="img"
            aria-label="User profile picture"
          />
          <h1 className="text-slate-800 dark:text-white text-xl font-bold leading-tight">
            Dashboard
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex items-center justify-center rounded-full size-10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              title="Notifications"
            >
              <Icon name="notifications" className="text-2xl" />
              <span className="absolute top-2 right-2 size-2.5 bg-rose-500 border-2 border-background-light dark:border-background-dark rounded-full"></span>
            </button>
            
            <NotificationsPanel 
              isOpen={showNotifications} 
              onClose={() => setShowNotifications(false)} 
            />
          </div>

          <button 
            onClick={onToggleTheme}
            className="flex items-center justify-center rounded-full size-10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            title="Toggle Theme"
          >
            <Icon 
              name={isDarkMode ? "light_mode" : "dark_mode"} 
              className="text-2xl" 
            />
          </button>
        </div>
      </div>
    </header>
  );
};
