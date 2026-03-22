
import React, { useState } from 'react';
import { Icon } from './Icon';
import { TAX_FILINGS_MOCK } from '../constants';

interface TaxAdminViewProps {
  onBack: () => void;
}

export const TaxAdminView: React.FC<TaxAdminViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'filings' | 'rules'>('filings');

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Icon name="close" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1">
          Tax Admin Console
        </h1>
      </header>

      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark">
         <button 
            onClick={() => setActiveTab('filings')}
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'filings' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-slate-400'}`}
         >
            Filings Monitor
         </button>
         <button 
            onClick={() => setActiveTab('rules')}
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'rules' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-slate-400'}`}
         >
            Rules Engine
         </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'filings' ? (
              <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 mb-2">
                      <div className="bg-emerald-100 dark:bg-emerald-500/20 p-3 rounded-xl text-center">
                          <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">124</p>
                          <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-300">Filed</p>
                      </div>
                      <div className="bg-amber-100 dark:bg-amber-500/20 p-3 rounded-xl text-center">
                          <p className="text-lg font-bold text-amber-700 dark:text-amber-400">45</p>
                          <p className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-300">Draft</p>
                      </div>
                      <div className="bg-rose-100 dark:bg-rose-500/20 p-3 rounded-xl text-center">
                          <p className="text-lg font-bold text-rose-700 dark:text-rose-400">2</p>
                          <p className="text--[10px] uppercase font-bold text-rose-600 dark:text-rose-300">Failed</p>
                      </div>
                  </div>

                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                              <th className="pb-2 font-bold uppercase">Period</th>
                              <th className="pb-2 font-bold uppercase">Type</th>
                              <th className="pb-2 font-bold uppercase text-right">Status</th>
                          </tr>
                      </thead>
                      <tbody>
                          {[...TAX_FILINGS_MOCK, { id: 'f4', period: 'Oct 2023', taxType: 'VAT', amountDue: 21000, status: 'Failed' }].map((filing, idx) => (
                              <tr key={idx} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                                  <td className="py-3 text-sm font-medium text-slate-800 dark:text-white">{filing.period}</td>
                                  <td className="py-3 text-xs text-slate-500 dark:text-slate-400">{filing.taxType}</td>
                                  <td className="py-3 text-right">
                                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                                          filing.status === 'Filed' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                          filing.status === 'Failed' ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400' :
                                          'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                                      }`}>
                                          {filing.status}
                                      </span>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          ) : (
              <div className="space-y-6">
                  <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-700 shadow-inner">
                      <pre>{`{
  "country_code": "NG",
  "effective_from": "2026-01-01",
  "taxes": [
    {
      "id": "VAT",
      "type": "vat",
      "rate": 0.075,
      "registration_threshold_ngn": 25000000,
      "taxable_base": "gross_sales_excl_vat",
      "input_vat_claim": { "requires_invoice": true }
    }
  ]
}`}</pre>
                  </div>
                  
                  <div className="space-y-4">
                      <h3 className="font-bold text-slate-800 dark:text-white">Update Rules</h3>
                      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                         <Icon name="upload_file" className="text-3xl text-slate-400" />
                         <div>
                             <p className="font-bold text-slate-800 dark:text-white">Upload Rule Pack (JSON)</p>
                             <p className="text-xs text-slate-500 dark:text-slate-400">Drag & drop or click to browse</p>
                         </div>
                      </div>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};
