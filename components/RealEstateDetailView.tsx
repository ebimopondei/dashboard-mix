
import React, { useState } from 'react';
import { RealEstateProperty, ViewType, RealEstateManagementType, RealEstateUnit, Investment, RealEstatePurchaseType } from '../types';
import { Icon } from './Icon';
import { MOCK_PAYMENT_METHODS } from '../constants';

interface RealEstateDetailViewProps {
  property: RealEstateProperty;
  onBack: () => void;
  onAddInvestment?: (investment: Investment, pMethod: 'wallet' | 'card') => void;
  userBalance: number;
}

type Tab = 'overview' | 'units' | 'management' | 'blockchain';
type FlowStep = 'view' | 'payment' | 'processing' | 'success';

export const RealEstateDetailView: React.FC<RealEstateDetailViewProps> = ({ property, onBack, onAddInvestment, userBalance }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [flowStep, setFlowStep] = useState<FlowStep>('view');
  const [unitQuantity, setUnitQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet');
  const [error, setError] = useState<string | null>(null);

  const isWhole = property.purchaseType === 'Whole';
  const totalCost = isWhole ? property.totalValue : (unitQuantity * property.minInvestment);

  // Management State: Fixed to 'Mix Afrika' for Fractional, Toggleable for Whole
  const [selectedManagement, setSelectedManagement] = useState<RealEstateManagementType>(
    isWhole ? 'Self' : 'Mix Afrika'
  );

  const tabs: {id: Tab, label: string, icon: string}[] = [
      { id: 'overview', label: 'Overview', icon: 'info' },
      { id: 'units', label: isWhole ? 'Deed Status' : 'Units List', icon: 'view_module' },
      { id: 'management', label: 'Management', icon: 'manage_accounts' },
      { id: 'blockchain', label: 'Ownership', icon: 'account_balance' },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleStartPurchase = () => {
      setFlowStep('payment');
  };

  const handleConfirmPurchase = () => {
    if (paymentMethod === 'wallet' && totalCost > userBalance) {
        setError("Insufficient wallet balance.");
        return;
    }
    
    setError(null);
    setFlowStep('processing');
    
    // Simulate smart contract minting
    setTimeout(() => {
        if (onAddInvestment) {
            const newInvestment: Investment = {
                id: `INV-RE-${Date.now()}`,
                name: property.name,
                category: 'Real Estate',
                status: 'Active',
                investedAmount: totalCost,
                currentReturn: 0,
                progress: 100, 
                iconName: 'apartment',
                cycleDuration: 'Perpetual',
                startDate: 'Today',
                maturityDate: 'Open Market',
                payoutDate: 'Quarterly Yields',
                propertyId: property.id,
                managementType: selectedManagement,
                purchaseType: property.purchaseType
            };
            onAddInvestment(newInvestment, paymentMethod);
        }
        setFlowStep('success');
    }, 2500);
  };

  if (flowStep === 'success') {
    return (
        <div className="fixed inset-0 z-[120] bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
            <div className="size-24 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 shadow-2xl">
                <Icon name="check_circle" className="text-5xl" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Ownership Secured!</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-8">
                Your tokenized deed for <span className="text-slate-900 dark:text-white font-bold">{property.name}</span> has been successfully registered on the Mix Chain.
            </p>
            
            <div className="w-full max-w-sm bg-slate-900 rounded-3xl p-6 text-white text-left mb-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Icon name="token" className="text-7xl" /></div>
                <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-4">On-Chain Asset Certificate</p>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Token ID</span>
                        <span className="text-xs font-mono">#{property.id.toUpperCase()}-MIX</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Management</span>
                        <span className="text-xs font-bold">{selectedManagement}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Liquidity</span>
                        <span className="text-xs font-bold text-emerald-400">T+0 Marketable</span>
                    </div>
                </div>
            </div>

            <button 
                onClick={onBack}
                className="w-full max-w-xs py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest rounded-2xl shadow-lg"
            >
                Portfolio
            </button>
        </div>
    );
  }

  if (flowStep === 'payment') {
      const cards = MOCK_PAYMENT_METHODS.filter(pm => pm.type === 'card');
      return (
          <div className="fixed inset-0 z-[110] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-bottom duration-500">
              <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light dark:bg-background-dark z-10 border-b border-slate-200 dark:border-slate-800">
                <button onClick={() => setFlowStep('view')} className="p-2 -ml-2 rounded-full text-slate-600 dark:text-slate-300">
                  <Icon name="arrow_back" className="text-2xl" />
                </button>
                <h1 className="text-lg font-bold flex-1 text-slate-800 dark:text-white">Review Purchase</h1>
              </header>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  <div className="text-center">
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Asset Value</p>
                      <h2 className="text-4xl font-black text-slate-900 dark:text-white">₦{totalCost.toLocaleString()}</h2>
                  </div>

                  <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Method</p>
                      <div 
                        onClick={() => setPaymentMethod('wallet')}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'wallet' ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800'}`}
                        >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <Icon name="account_balance_wallet" />
                            </div>
                            <span className="font-bold text-slate-800 dark:text-white">Wallet Balance</span>
                            </div>
                            {paymentMethod === 'wallet' && <Icon name="check_circle" className="text-primary" />}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 ml-13">Available: <span className="font-bold text-slate-700 dark:text-slate-200">₦{userBalance.toLocaleString()}</span></p>
                        {paymentMethod === 'wallet' && userBalance < totalCost && (
                            <p className="text-rose-500 text-[10px] font-bold mt-2 ml-13 flex items-center gap-1"><Icon name="error" className="text-xs" /> Insufficient funds</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        {cards.map(card => (
                            <div 
                                key={card.id}
                                onClick={() => { setPaymentMethod('card'); }}
                                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === 'card' ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                                            <Icon name="credit_card" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-800 dark:text-white">{card.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{card.mask}</p>
                                        </div>
                                    </div>
                                    {paymentMethod === 'card' && <Icon name="check_circle" className="text-primary" />}
                                </div>
                            </div>
                        ))}
                      </div>
                  </div>

                  <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4 shadow-xl border border-white/5">
                      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-primary">
                          <span>Management Selection</span>
                          <span>{selectedManagement}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed italic">
                        By confirming, you authorize the minting of a tokenized ownership certificate linked to your identity.
                      </p>
                  </div>
              </div>

              <div className="p-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
                {error && <p className="text-rose-500 text-xs font-bold mb-4 text-center">{error}</p>}
                <button 
                  onClick={handleConfirmPurchase}
                  disabled={paymentMethod === 'wallet' && userBalance < totalCost}
                  className="w-full py-5 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-[2rem] shadow-xl disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
                >
                  Confirm & Purchase Asset
                </button>
              </div>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
      {/* Processing Overlay */}
      {flowStep === 'processing' && (
          <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
              <div className="size-20 border-4 border-white/10 border-t-emerald-500 rounded-full animate-spin mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">Minting Smart Contract</h3>
              <p className="text-slate-400 text-sm">Registering tokenized deed on Mix Chain...</p>
          </div>
      )}

      {/* Header */}
      <header className="flex items-center gap-4 p-4 shrink-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-20 border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1">
          Property Detail
        </h1>
        <button className="p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
          <Icon name="share" />
        </button>
      </header>

      {/* Hero Image */}
      <div className="h-64 shrink-0 relative overflow-hidden">
          <img src={property.imageUrl} alt={property.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
              <div className="flex gap-2 mb-2">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md border border-white/20 ${isWhole ? 'bg-indigo-600/40' : 'bg-primary/40'}`}>
                        {property.purchaseType} Purchase
                   </span>
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md border border-white/20 bg-amber-600/40`}>
                        {selectedManagement} Managed
                   </span>
              </div>
              <h2 className="text-3xl font-black text-white leading-tight">{property.name}</h2>
              <p className="text-slate-300 text-sm font-bold flex items-center gap-1">
                  <Icon name="location_on" className="text-xs" />
                  {property.location}, {property.country}
              </p>
          </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 py-2 gap-2 bg-background-light dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 shrink-0 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' : 'text-slate-500 dark:text-slate-400'}`}
              >
                  <Icon name={tab.icon} className="text-sm" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
              </button>
          ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">
          
          {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm text-center">
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Target Yield</p>
                           <p className="text-2xl font-black text-emerald-500">{property.expectedYield}%</p>
                           <p className="text-[10px] text-slate-400 mt-1 font-bold">Annual ROI</p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm text-center">
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{isWhole ? 'Total Valuation' : 'Price per Unit'}</p>
                           <p className="text-xl font-black text-slate-800 dark:text-white">₦{property.minInvestment.toLocaleString()}</p>
                           <p className="text-[10px] text-slate-400 mt-1 font-bold">Entry Point</p>
                      </div>
                  </div>

                  <div className="space-y-3">
                      <h3 className="font-black text-lg text-slate-800 dark:text-white">Property Narrative</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {property.description}
                      </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-500/10 p-5 rounded-3xl border border-blue-100 dark:border-blue-500/20 flex gap-4">
                      <div className="size-12 rounded-2xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                          <Icon name="token" className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                          <h4 className="font-black text-sm uppercase tracking-widest mb-1 text-slate-800 dark:text-white">Liquid Tokenized Deed</h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                              Whether you own the whole property or a fraction, your interest is represented by a digital certificate. This smart contract can be traded or liquidated on the Mix secondary market at any time.
                          </p>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'units' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between px-1">
                      <h3 className="font-black text-lg text-slate-800 dark:text-white">Inventory Status</h3>
                      <p className="text-xs text-slate-500 font-bold">
                          {isWhole ? 'Single Asset Block' : `${property.availableUnits} / ${property.totalUnits} Units Remaining`}
                      </p>
                  </div>
                  
                  {isWhole ? (
                      <div className="p-6 bg-indigo-50 dark:bg-indigo-500/10 rounded-[2rem] border border-indigo-100 dark:border-indigo-500/20 text-center space-y-4">
                          <Icon name="home_work" className="text-5xl text-indigo-500" />
                          <h4 className="font-black text-lg text-slate-800 dark:text-white">Whole Property Acquisition</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300 px-4">
                              Acquire the entire asset block. Once purchased, you become the 100% owner of the physical deed and its digital twin.
                          </p>
                          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl inline-block shadow-sm">
                              <p className="text-[10px] font-black text-slate-400 uppercase">Valuation</p>
                              <p className="text-xl font-black text-slate-800 dark:text-white">₦{property.totalValue.toLocaleString()}</p>
                          </div>
                      </div>
                  ) : (
                    <div className="grid gap-3">
                        {property.units.map(unit => (
                            <div key={unit.id} className={`p-5 rounded-3xl border flex items-center justify-between transition-all ${unit.isAvailable ? 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700' : 'bg-slate-50 dark:bg-slate-900 border-transparent opacity-50'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`size-10 rounded-2xl flex items-center justify-center ${unit.isAvailable ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-400'}`}>
                                        <Icon name="apartment" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-white">{unit.name}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{unit.sizeSqft} Sq Ft Share</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-lg text-slate-800 dark:text-white">₦{unit.price.toLocaleString()}</p>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${unit.isAvailable ? 'text-primary' : 'text-slate-400'}`}>{unit.isAvailable ? 'Pool Active' : 'Sold'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                  )}
              </div>
          )}

          {activeTab === 'management' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-2">
                      <h3 className="font-black text-lg px-1 text-slate-800 dark:text-white">Asset Management</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 px-1">
                          {isWhole 
                            ? 'As a whole asset owner, you decide how to manage your physical property.' 
                            : 'Fractional assets are professionally managed by Mix Afrika for shared stakeholder stability.'}
                      </p>
                  </div>

                  <div className="space-y-4">
                      {isWhole ? (
                          <>
                            <div 
                                onClick={() => setSelectedManagement('Self')}
                                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer ${selectedManagement === 'Self' ? 'border-primary bg-primary/5 shadow-md scale-[1.02]' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800'}`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-4">
                                        <div className={`size-10 rounded-2xl flex items-center justify-center ${selectedManagement === 'Self' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                                            <Icon name="person" />
                                        </div>
                                        <span className="font-black uppercase tracking-widest text-slate-800 dark:text-white">Self Managed</span>
                                    </div>
                                    {selectedManagement === 'Self' && <Icon name="check_circle" className="text-primary" />}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Maintain full physical control. We provide the tokenized digital twin, but you handle occupancy, maintenance, and rent directly.
                                </p>
                            </div>
                            <div 
                                onClick={() => setSelectedManagement('Mix Afrika')}
                                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer ${selectedManagement === 'Mix Afrika' ? 'border-primary bg-primary/5 shadow-md scale-[1.02]' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800'}`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-4">
                                        <div className={`size-10 rounded-2xl flex items-center justify-center ${selectedManagement === 'Mix Afrika' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                                            <Icon name="corporate_fare" />
                                        </div>
                                        <span className="font-black uppercase tracking-widest text-slate-800 dark:text-white">Mix Afrika Managed</span>
                                    </div>
                                    {selectedManagement === 'Mix Afrika' && <Icon name="check_circle" className="text-primary" />}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Hands-free ownership. We handle repairs, tenant search, and utilities. Yield is distributed automatically to your wallet minus a 10% fee.
                                </p>
                            </div>
                          </>
                      ) : (
                          <div className="p-6 bg-primary/5 dark:bg-primary/10 rounded-[2rem] border border-primary/20 space-y-4">
                              <div className="flex items-center gap-4">
                                  <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center">
                                      <Icon name="verified_user" />
                                  </div>
                                  <div>
                                      <h4 className="font-black uppercase tracking-widest text-sm text-slate-800 dark:text-white">Mandatory Mix Management</h4>
                                      <p className="text-[10px] font-bold text-primary/80">Automated Yield Assurance</p>
                                  </div>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                  To protect the interests of all stakeholders, this fractional property is managed by Mix Afrika. This ensures consistent maintenance standards and high-occupancy rent harvesting.
                              </p>
                          </div>
                      )}
                  </div>
              </div>
          )}

          {activeTab === 'blockchain' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="p-6 bg-slate-950 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                      <Icon name="smart_toy" className="absolute -right-4 -bottom-4 text-[10rem] opacity-10" />
                      <div className="relative z-10">
                          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-4">Smart Contract Identity</p>
                          <div 
                            onClick={() => handleCopy(property.smartContractId)}
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between group active:scale-[0.98] transition-transform cursor-pointer"
                          >
                              <div className="flex items-center gap-3">
                                  <Icon name="link" className="text-slate-500" />
                                  <p className="font-mono text-sm text-slate-300 truncate max-w-[200px]">{property.smartContractId}</p>
                              </div>
                              <Icon name="content_copy" className="text-emerald-500 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                      </div>
                  </div>

                  <div className="space-y-4">
                      <h3 className="font-black text-lg text-slate-800 dark:text-white">Blockchain Benefits</h3>
                      <div className="space-y-3">
                           {[
                               { label: 'Instant Resale', value: 'Liquid Market Certificate', icon: 'currency_exchange' },
                               { label: 'Custody', value: 'Tokenized Property Deed', icon: 'shield' },
                               { label: 'Verification', value: 'Public Immutable Ledger', icon: 'visibility' }
                           ].map((item, i) => (
                               <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                   <div className="flex items-center gap-3">
                                       <Icon name={item.icon} className="text-slate-400 text-sm" />
                                       <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">{item.label}</span>
                                   </div>
                                   <span className="text-sm font-black text-slate-800 dark:text-white">{item.value}</span>
                               </div>
                           ))}
                      </div>
                  </div>
              </div>
          )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 max-w-md mx-auto z-50">
          <div className="flex items-center gap-4">
               {isWhole ? (
                   <div className="flex flex-col">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Full Acquisition</p>
                       <p className="text-xl font-black text-slate-900 dark:text-white">₦{property.totalValue.toLocaleString()}</p>
                   </div>
               ) : (
                   <div className="flex flex-col">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Pool Commitment</p>
                       <p className="text-xl font-black text-slate-900 dark:text-white">₦{totalCost.toLocaleString()}</p>
                   </div>
               )}
               
               {!isWhole && (
                   <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                       <button onClick={() => setUnitQuantity(Math.max(1, unitQuantity-1))} className="text-slate-500"><Icon name="remove" className="text-sm" /></button>
                       <span className="text-sm font-black w-4 text-center text-slate-800 dark:text-white">{unitQuantity}</span>
                       <button onClick={() => setUnitQuantity(unitQuantity+1)} className="text-primary"><Icon name="add" className="text-sm" /></button>
                   </div>
               )}

               <button 
                onClick={handleStartPurchase}
                className="flex-1 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-[0.3em] rounded-[2rem] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
               >
                   <Icon name="payments" />
                   {isWhole ? 'Purchase Whole' : 'Commit Units'}
               </button>
          </div>
      </div>
    </div>
  );
};
