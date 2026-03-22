import React from 'react';
import { Icon } from './Icon';

export const BottomFab: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-0 left-0 flex justify-center w-full max-w-md mx-auto px-4 z-20 pointer-events-none">
      <button className="flex items-center justify-center gap-2 w-full max-w-xs h-14 px-6 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all pointer-events-auto">
        <Icon name="add" />
        <span>Find New Investments</span>
      </button>
    </div>
  );
};
