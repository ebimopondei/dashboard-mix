

import React, { useState, useRef } from 'react';
import { Icon } from './Icon';
import { UserRole } from '../types';

interface SignupViewProps {
  onSignup: () => void;
  onNavigateToLogin: () => void;
  role?: UserRole;
}

export const SignupView: React.FC<SignupViewProps> = ({ onSignup, onNavigateToLogin, role = 'investor' }) => {
  const [step, setStep] = useState<'details' | 'verify'>('details');
  
  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState(''); // Trader specific

  // OTP State
  const [otp, setOtp] = useState(['', '', '', '']);
  const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const isTrader = role === 'trader';
  const isAgent = role === 'agent';
  const roleLabel = isAgent ? 'Agent' : isTrader ? 'Trader' : 'Investor';
  const buttonColorClass = isAgent ? 'bg-purple-600 shadow-purple-500/30 hover:bg-purple-700' : isTrader ? 'bg-emerald-600 shadow-emerald-500/30 hover:bg-emerald-700' : 'bg-primary shadow-primary/30 hover:bg-primary/90';

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock API call to send OTP
    setTimeout(() => {
      setIsLoading(false);
      setStep('verify');
    }, 1000);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock API call to verify OTP and create account
    setTimeout(() => {
      setIsLoading(false);
      onSignup();
    }, 1500);
  };

  const handleGoogleSignup = () => {
    setIsGoogleLoading(true);
    // Mock Google Auth delay - usually skips phone verify or handles it separately
    setTimeout(() => {
        setIsGoogleLoading(false);
        onSignup();
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    if (value.length > 1) {
        // Handle paste or multi-char input if needed, taking last char for now
        value = value.slice(-1);
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next input
    if (value && index < 3) {
        otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
          otpRefs[index - 1].current?.focus();
      }
  };

  // --- VERIFICATION SCREEN ---
  if (step === 'verify') {
    return (
      <div className="flex flex-col min-h-screen px-6 py-10 bg-background-light dark:bg-background-dark animate-in fade-in slide-in-from-right duration-500">
          <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
              <button 
                  onClick={() => setStep('details')}
                  className="inline-flex items-center justify-center size-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mb-8 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                  <Icon name="arrow_back" />
              </button>

              <div className="text-center mb-8">
                  <div className="size-16 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="sms" className="text-3xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Verify Phone Number</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                      We sent a 4-digit code to <span className="font-bold text-slate-800 dark:text-white">{phone}</span>
                  </p>
              </div>

              <form onSubmit={handleVerifySubmit} className="space-y-8">
                  <div className="flex justify-center gap-4">
                      {otp.map((digit, idx) => (
                          <input
                              key={idx}
                              ref={otpRefs[idx]}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(idx, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                              className="size-14 text-center text-2xl font-bold rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder-slate-300"
                              placeholder="•"
                          />
                      ))}
                  </div>

                  <button
                      type="submit"
                      disabled={isLoading || otp.some(d => !d)}
                      className={`w-full py-4 rounded-xl font-bold text-white shadow-lg active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${buttonColorClass}`}
                  >
                      {isLoading ? (
                      <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                      <span>Verify & Create Account</span>
                      )}
                  </button>
              </form>

              <div className="mt-8 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                      Didn't receive code? <button className="font-bold text-primary hover:underline">Resend</button>
                  </p>
              </div>
          </div>
      </div>
    );
  }

  // --- DETAILS FORM SCREEN ---
  return (
    <div className="flex flex-col min-h-screen px-6 py-10 bg-background-light dark:bg-background-dark animate-in fade-in duration-500">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="mb-8">
          <button 
            onClick={onNavigateToLogin}
            className="inline-flex items-center justify-center size-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mb-6 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Icon name="arrow_back" />
          </button>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Create {roleLabel} Account</h1>
          <p className="text-slate-500 dark:text-slate-400">
            {isAgent ? 'Start managing traders and field operations' : isTrader ? 'Grow your business with fair loans' : 'Start building your wealth today'}
          </p>
        </div>

        <form onSubmit={handleDetailsSubmit} className="space-y-5">
          
          {/* Split Name */}
          <div className="flex gap-4">
              <div className="space-y-1.5 flex-1">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="person" className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-9 pr-3 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="John"
                  />
                </div>
              </div>
              <div className="space-y-1.5 flex-1">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Last Name</label>
                <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="Doe"
                />
              </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon name="phone" className="text-slate-400" />
              </div>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="+234 800 000 0000"
              />
            </div>
          </div>

          {isTrader && (
             <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Business Name</label>
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon name="store" className="text-slate-400" />
                </div>
                <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="John's Electronics"
                />
                </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon name="mail" className="text-slate-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon name="lock" className="text-slate-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <Icon name={showPassword ? "visibility_off" : "visibility"} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${buttonColorClass}`}
          >
            {isLoading ? (
              <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Continue</span>
            )}
          </button>
        </form>

        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-background-light dark:bg-background-dark text-slate-500 font-bold">Or sign up with</span>
            </div>
        </div>

        <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isGoogleLoading || isLoading}
            className="w-full py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-white font-bold flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {isGoogleLoading ? (
                <span className="size-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            ) : (
                <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span>Google</span>
                </>
            )}
        </button>
      </div>
    </div>
  );
};
