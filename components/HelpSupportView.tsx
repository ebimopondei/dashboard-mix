
import React, { useState } from 'react';
import { Icon } from './Icon';

interface HelpSupportViewProps {
  onBack: () => void;
}

const FAQS = [
    {
        question: "How are returns calculated?",
        answer: "Returns are calculated based on a fixed percentage return for the specific cluster you invested in. For example, if a 30-day cluster offers a 10% return, you will receive 10% of your invested amount upon maturity."
    },
    {
        question: "When do I get my principal back?",
        answer: "Your principal amount plus the accrued interest is returned to your wallet on the Payout Date, which is usually 1-3 days after the cluster maturity date."
    },
    {
        question: "Is my investment insured?",
        answer: "Investments are secured by underlying assets (inventory, trade credit, etc.). While we employ strict risk management, all investments carry some level of risk. Check the 'Security Type' on each collection for details."
    },
    {
        question: "Can I withdraw before maturity?",
        answer: "Liquidity cycles are fixed terms. Early withdrawal is generally not permitted to ensure the stability of the underlying business operations."
    }
];

export const HelpSupportView: React.FC<HelpSupportViewProps> = ({ onBack }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1">
          Help & Support
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Search */}
        <div className="relative">
            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
                type="text" 
                placeholder="How can we help?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-primary text-slate-800 dark:text-white placeholder-slate-400 shadow-sm"
            />
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center text-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Icon name="chat" />
                </div>
                <p className="font-bold text-slate-800 dark:text-white text-sm">Live Chat</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Avg. wait: 2 mins</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center text-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                <div className="size-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Icon name="mail" />
                </div>
                <p className="font-bold text-slate-800 dark:text-white text-sm">Email Us</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Response in 24h</p>
            </div>
        </div>

        {/* FAQ Section */}
        <div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Frequently Asked Questions</h3>
            <div className="space-y-3">
                {FAQS.filter(f => f.question.toLowerCase().includes(searchQuery.toLowerCase())).map((faq, index) => (
                    <div 
                        key={index}
                        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden"
                    >
                        <button 
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full flex items-center justify-between p-4 text-left"
                        >
                            <span className="font-bold text-sm text-slate-800 dark:text-white">{faq.question}</span>
                            <Icon 
                                name="expand_more" 
                                className={`text-slate-400 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`} 
                            />
                        </button>
                        {openIndex === index && (
                            <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed animate-in slide-in-from-top-2 duration-200">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
