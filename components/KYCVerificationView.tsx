
import React, { useState, useRef } from 'react';
import { Icon } from './Icon';

interface KYCVerificationViewProps {
  onBack: () => void;
}

type VerificationStep = 'intro' | 'select_type' | 'upload_front' | 'upload_back' | 'processing' | 'success';

export const KYCVerificationView: React.FC<KYCVerificationViewProps> = ({ onBack }) => {
  const [step, setStep] = useState<VerificationStep>('intro');
  const [docType, setDocType] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Simulate upload progress
      setUploadProgress(10);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                if (step === 'upload_front') setStep('upload_back');
                else if (step === 'upload_back') {
                    setStep('processing');
                    // Simulate backend analysis
                    setTimeout(() => setStep('success'), 3000);
                }
                setUploadProgress(0);
            }, 500);
            return 100;
          }
          return prev + 20;
        });
      }, 300);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const renderIntro = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <Icon name="verified_user" className="text-9xl" />
        </div>
        <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Upgrade your Account</h2>
            <p className="text-slate-300 mb-6">Verify your identity to unlock higher limits and enable withdrawals.</p>
            
            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                    <span className="text-sm font-medium text-slate-300">Daily Withdrawal</span>
                    <div className="flex items-center gap-3">
                        <span className="text-sm line-through opacity-50">₦2,000</span>
                        <Icon name="arrow_forward" className="text-xs" />
                        <span className="text-emerald-400 font-bold">₦50,000</span>
                    </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                    <span className="text-sm font-medium text-slate-300">Investment Limit</span>
                    <div className="flex items-center gap-3">
                        <span className="text-sm line-through opacity-50">₦5k/mo</span>
                        <Icon name="arrow_forward" className="text-xs" />
                        <span className="text-emerald-400 font-bold">Unlimited</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 dark:text-white">Requirements</h3>
        <div className="flex gap-4 items-start">
            <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                <Icon name="badge" />
            </div>
            <div>
                <p className="font-bold text-slate-800 dark:text-white text-sm">Government Issued ID</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Passport, Driver's License, or National ID</p>
            </div>
        </div>
        <div className="flex gap-4 items-start">
            <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                <Icon name="face" />
            </div>
            <div>
                <p className="font-bold text-slate-800 dark:text-white text-sm">Selfie Photo</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">To confirm the ID belongs to you</p>
            </div>
        </div>
      </div>

      <button 
        onClick={() => setStep('select_type')}
        className="w-full py-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-[0.98]"
      >
        Start Verification
      </button>
    </div>
  );

  const renderSelectType = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Select Document Type</h2>
        <div className="space-y-3">
            {[
                { id: 'passport', label: 'International Passport', icon: 'book' },
                { id: 'license', label: 'Driver\'s License', icon: 'directions_car' },
                { id: 'nid', label: 'National ID Card', icon: 'badge' },
                { id: 'cac', label: 'Business Registration (CAC)', icon: 'business_center' },
            ].map((doc) => (
                <button
                    key={doc.id}
                    onClick={() => {
                        setDocType(doc.label);
                        setStep('upload_front');
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
                >
                    <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Icon name={doc.icon} />
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{doc.label}</span>
                    <div className="flex-1" />
                    <Icon name="chevron_right" className="text-slate-400" />
                </button>
            ))}
        </div>
    </div>
  );

  const renderUpload = (side: 'Front' | 'Back') => (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 h-full flex flex-col">
       <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase text-primary tracking-wider">Step {side === 'Front' ? '1' : '2'} of 2</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Upload {side} of ID</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
                Please ensure the image is clear and all details are readable.
            </p>
       </div>

       <div className="flex-1 flex flex-col justify-center">
          <div 
             onClick={triggerFileSelect}
             className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer min-h-[250px]"
          >
             <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
             
             {uploadProgress > 0 ? (
                 <div className="w-full max-w-[200px] text-center">
                    <div className="size-16 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-primary animate-spin mx-auto mb-4" />
                    <p className="font-bold text-slate-800 dark:text-white">Uploading...</p>
                    <p className="text-xs text-slate-500">{uploadProgress}%</p>
                 </div>
             ) : (
                 <>
                    <div className="size-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
                        <Icon name="add_a_photo" className="text-3xl" />
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-slate-800 dark:text-white">Tap to upload</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">JPG, PNG or PDF</p>
                    </div>
                 </>
             )}
          </div>
       </div>

       <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex gap-3 items-start">
          <Icon name="info" className="text-blue-500 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
             Your data is encrypted and stored securely. We only use this information for identity verification purposes required by law.
          </p>
       </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in duration-500 space-y-6">
        <div className="relative">
            <div className="size-24 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
                <Icon name="shield" className="text-3xl text-primary" />
            </div>
        </div>
        <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Verifying Identity</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                This usually takes a few seconds. Please do not close this screen.
            </p>
        </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500 space-y-6">
        <div className="size-24 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Icon name="check_circle" className="text-5xl" />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Documents Submitted</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-6">
                Your documents have been received and are under review. We will notify you once your status is updated.
            </p>
        </div>
        <button 
            onClick={onBack}
            className="w-full max-w-xs py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-lg hover:opacity-90 transition-opacity"
        >
            Back to Profile
        </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Icon name="close" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1">
          Identity Verification
        </h1>
        <div className="w-8" />
      </header>

      {/* Progress Bar (Only for steps after intro) */}
      {step !== 'intro' && step !== 'success' && step !== 'processing' && (
         <div className="h-1 bg-slate-200 dark:bg-slate-800 w-full">
            <div 
               className="h-full bg-primary transition-all duration-300" 
               style={{ width: step === 'select_type' ? '33%' : step === 'upload_front' ? '66%' : '90%' }} 
            />
         </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 flex flex-col">
        {step === 'intro' && renderIntro()}
        {step === 'select_type' && renderSelectType()}
        {step === 'upload_front' && renderUpload('Front')}
        {step === 'upload_back' && renderUpload('Back')}
        {step === 'processing' && renderProcessing()}
        {step === 'success' && renderSuccess()}
      </div>
    </div>
  );
};