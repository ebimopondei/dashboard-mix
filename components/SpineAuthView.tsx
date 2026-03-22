
import React, { useState } from 'react';
import { Icon } from './Icon';
import { SpineUser } from '../types';

interface SpineAuthViewProps {
  users: SpineUser[];
  onAuthSuccess: (user: SpineUser) => void;
  onBack: () => void;
}

export const SpineAuthView: React.FC<SpineAuthViewProps> = ({ users, onAuthSuccess, onBack }) => {
  const [selectedUser, setSelectedUser] = useState<SpineUser | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        if (nextPin === '1234') {
          onAuthSuccess(selectedUser!);
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 600);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col animate-in fade-in duration-500 max-w-sm mx-auto w-full pt-10">
        <div className="text-center mb-10">
          <button 
            onClick={onBack}
            className="mb-8 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Icon name="arrow_back" />
          </button>
          <div className="size-16 rounded-3xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <Icon name="storefront" className="text-3xl" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Switch to Spine</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Select your profile to continue</p>
        </div>

        <div className="space-y-3">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500 transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold text-lg">
                  {user.name[0]}
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800 dark:text-white">{user.name}</p>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                    user.role === 'Owner' ? 'bg-amber-100 text-amber-600' :
                    user.role === 'Manager' ? 'bg-blue-100 text-blue-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
              <Icon name="lock" className="text-slate-300" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col animate-in slide-in-from-bottom duration-500 max-w-sm mx-auto w-full pt-10">
      <div className="text-center mb-10">
        <button 
          onClick={() => { setSelectedUser(null); setPin(''); }}
          className="mb-8 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <Icon name="arrow_back" />
        </button>
        <div className="size-20 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4 text-2xl font-black text-slate-800 dark:text-white border-4 border-emerald-500">
          {selectedUser.name[0]}
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Welcome, {selectedUser.name.split(' ')[0]}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Enter your 4-digit security PIN</p>
      </div>

      <div className="flex justify-center gap-4 mb-10">
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`size-4 rounded-full border-2 transition-all duration-200 ${
              error ? 'bg-rose-500 border-rose-500 scale-125' :
              pin.length > i ? 'bg-emerald-500 border-emerald-500 scale-110' : 'border-slate-300 dark:border-slate-700'
            }`} 
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 px-4">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
          <button 
            key={n} 
            onClick={() => handleDigit(n)}
            className="size-16 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-800 dark:text-white active:bg-emerald-500 active:text-white shadow-sm transition-colors"
          >
            {n}
          </button>
        ))}
        <div />
        <button 
          onClick={() => handleDigit('0')}
          className="size-16 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-800 dark:text-white active:bg-emerald-500 active:text-white shadow-sm transition-colors"
        >
          0
        </button>
        <button 
          onClick={handleBackspace}
          className="size-16 rounded-full flex items-center justify-center text-slate-400 active:text-rose-500 transition-colors"
        >
          <Icon name="backspace" />
        </button>
      </div>

      {error && (
        <p className="text-center text-rose-500 font-bold mt-8 animate-bounce">Incorrect PIN. Try again.</p>
      )}

      <p className="text-center text-[10px] text-slate-400 mt-auto pb-10 uppercase tracking-widest font-black">Secured by Mix Spine</p>
    </div>
  );
};
