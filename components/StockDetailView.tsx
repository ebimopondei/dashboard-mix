
import React, { useState, useMemo } from 'react';
import { StockBond, Investment, ViewType } from '../types';
import { Icon } from './Icon';
import { MOCK_PAYMENT_METHODS } from '../constants';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';

interface StockDetailViewProps {
  stock: StockBond;
  onBack: () => void;
  onAddInvestment?: (investment: Investment, pMethod: 'wallet' | 'card') => void;
  userBalance: number;
}

type Tab = 'overview' | 'orderbook' | 'financials' | 'news';
type FlowStep = 'details' | 'payment' | 'processing' | 'success';
type OrderType = 'Market' | 'Limit';

const MOCK_CHART_DATA = [
    { time: '09:30', price: 138.2, rsi: 45, ma: 139.5 },
    { time: '10:00', price: 139.5, rsi: 48, ma: 139.6 },
    { time: '10:30', price: 140.8, rsi: 55, ma: 139.8 },
    { time: '11:00', price: 139.2, rsi: 50, ma: 139.7 },
    { time: '11:30', price: 141.4, rsi: 58, ma: 140.0 },
    { time: '12:00', price: 142.1, rsi: 62, ma: 140.2 },
    { time: '12:30', price: 140.5, rsi: 52, ma: 140.3 },
    { time: '13:00', price: 143.2, rsi: 65, ma: 140.8 },
    { time: '13:30', price: 144.5, rsi: 70, ma: 141.2 },
    { time: '14:00', price: 143.8, rsi: 68, ma: 141.5 },
    { time: '14:30', price: 145.1, rsi: 72, ma: 142.0 },
    { time: '15:00', price: 142.5, rsi: 60, ma: 142.2 },
];

export const StockDetailView: React.FC<StockDetailViewProps> = ({ stock, onBack, onAddInvestment, userBalance }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [step, setStep] = useState<FlowStep>('details');
  const [units, setUnits] = useState(1);
  const [orderType, setOrderType] = useState<OrderType>('Market');
  const [limitPrice, setLimitPrice] = useState(stock.price.toString());
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTechnical, setShowTechnical] = useState<'none' | 'rsi' | 'ma'>('none');

  const priceToUse = orderType === 'Market' ? stock.price : parseFloat(limitPrice) || stock.price;
  const totalCost = priceToUse * units;
  const transactionFee = totalCost * 0.005; // 0.5% fee

  const handleConfirmPurchase = () => {
    const finalAmount = totalCost + transactionFee;
    if (paymentMethod === 'wallet' && finalAmount > userBalance) {
        setError("Insufficient wallet balance.");
        return;
    }
    
    setError(null);
    setIsProcessing(true);
    setStep('processing');
    
    setTimeout(() => {
        if (onAddInvestment) {
            const newInvestment: Investment = {
                id: `INV-ST-${Date.now()}`,
                name: stock.name,
                category: stock.type === 'Stock' ? 'Stocks' : 'Bonds',
                status: 'Active',
                investedAmount: totalCost,
                currentReturn: 0,
                progress: 100, 
                iconName: 'show_chart',
                cycleDuration: 'Liquid Asset',
                startDate: 'Today',
                maturityDate: 'Open Market',
                payoutDate: 'Dividends/Resale',
                ticker: stock.ticker,
                units: units,
                history: [{
                    date: 'Just now',
                    amount: totalCost,
                    units: units,
                    method: paymentMethod
                }]
            };
            onAddInvestment(newInvestment, paymentMethod);
        }
        setIsProcessing(false);
        setStep('success');
    }, 2500);
  };

  const renderDetails = () => (
      <div className="flex-1 flex flex-col animate-in fade-in duration-500 pb-32">
          {/* Header Info */}
          <div className="bg-slate-900 px-6 py-8 text-white relative overflow-hidden shrink-0">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                   <h2 className="text-[12rem] font-black leading-none">{stock.ticker}</h2>
               </div>
               <div className="relative z-10">
                   <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-primary/20 text-primary text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-primary/20">LIVE</span>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{stock.type} • {stock.country}</p>
                            </div>
                            <h2 className="text-3xl font-black tracking-tighter">{stock.name}</h2>
                        </div>
                        <div className="size-14 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center font-black text-xl text-white shadow-inner">
                            {stock.ticker}
                        </div>
                   </div>

                   <div className="flex items-baseline gap-4">
                       <h3 className="text-5xl font-black tracking-tighter text-white">₦{stock.price.toLocaleString()}</h3>
                       <div className={`flex items-center gap-1 font-black px-2 py-1 rounded-lg ${stock.change >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                           <Icon name={stock.change >= 0 ? 'trending_up' : 'trending_down'} className="text-sm" />
                           <span className="text-sm">{stock.change >= 0 ? '+' : ''}{stock.changePercent}%</span>
                       </div>
                   </div>
               </div>
          </div>

          {/* Navigation Tabs */}
          <div className="sticky top-0 z-30 bg-background-light dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 flex overflow-x-auto no-scrollbar px-4">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'orderbook', label: 'Order Book' },
                { id: 'financials', label: 'Financials' },
                { id: 'news', label: 'Market News' }
              ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={`px-5 py-4 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}
                  >
                    {tab.label}
                  </button>
              ))}
          </div>

          <div className="px-4 py-6 space-y-6">
               {activeTab === 'overview' && (
                   <div className="space-y-6 animate-in fade-in duration-400">
                        {/* Period Chart */}
                        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                             <div className="flex justify-between items-center mb-4">
                                <div className="flex gap-2">
                                    <button onClick={() => setShowTechnical(showTechnical === 'ma' ? 'none' : 'ma')} className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter transition-all ${showTechnical === 'ma' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-500'}`}>EMA 20</button>
                                    <button onClick={() => setShowTechnical(showTechnical === 'rsi' ? 'none' : 'rsi')} className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter transition-all ${showTechnical === 'rsi' ? 'bg-purple-500 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-500'}`}>RSI</button>
                                </div>
                                <div className="flex gap-1">
                                    {['1D', '1W', '1M', '1Y'].map(t => <span key={t} className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${t === '1D' ? 'bg-primary/10 text-primary' : 'text-slate-400'}`}>{t}</span>)}
                                </div>
                             </div>

                             <div className="h-56 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    {showTechnical === 'rsi' ? (
                                        <LineChart data={MOCK_CHART_DATA}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                            <XAxis dataKey="time" hide />
                                            <YAxis domain={[0, 100]} hide />
                                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px', color: '#fff' }} />
                                            <Line type="monotone" dataKey="rsi" stroke="#A855F7" strokeWidth={2} dot={false} />
                                        </LineChart>
                                    ) : (
                                        <AreaChart data={MOCK_CHART_DATA}>
                                            <defs>
                                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                            <XAxis dataKey="time" hide />
                                            <YAxis domain={['auto', 'auto']} hide />
                                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px', color: '#fff' }} />
                                            <Area type="monotone" dataKey="price" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" animationDuration={1000} />
                                            {showTechnical === 'ma' && <Line type="monotone" dataKey="ma" stroke="#3B82F6" strokeWidth={2} dot={false} strokeDasharray="5 5" />}
                                        </AreaChart>
                                    )}
                                </ResponsiveContainer>
                             </div>
                        </div>

                        {/* Market Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                             {[
                                { label: 'Prev Close', val: `₦${stock.prevClose.toLocaleString()}` },
                                { label: 'Open', val: `₦${stock.open.toLocaleString()}` },
                                { label: 'Volume', val: stock.volume.toLocaleString() },
                                { label: 'Market Cap', val: `₦${(stock.marketCap / 1e9).toFixed(1)}B` },
                                { label: '52W High', val: `₦${stock.high52w.toLocaleString()}` },
                                { label: '52W Low', val: `₦${stock.low52w.toLocaleString()}` },
                                { label: 'Div Yield', val: stock.dividendYield ? `${stock.dividendYield}%` : 'N/A' },
                                { label: 'P/E Ratio', val: stock.peRatio ? `${stock.peRatio}x` : 'N/A' },
                             ].map((stat, i) => (
                                <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm transition-transform active:scale-95">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className="text-sm font-black text-slate-800 dark:text-white">{stat.val}</p>
                                </div>
                             ))}
                        </div>

                        {/* Issuer Profile */}
                        <div className="space-y-3">
                            <h3 className="font-black text-lg text-slate-800 dark:text-white flex items-center gap-2">
                                <Icon name="business_center" className="text-primary" />
                                Asset Profile
                            </h3>
                            <div className="bg-white dark:bg-slate-800/30 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-4">
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
                                    "{stock.description}"
                                </p>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase">Sector</p>
                                        <p className="text-xs font-bold text-slate-800 dark:text-white">{stock.sector}</p>
                                    </div>
                                    <div className="flex-1 text-right">
                                        <p className="text-[9px] font-black text-slate-400 uppercase">Exchange</p>
                                        <p className="text-xs font-bold text-primary">{stock.exchange}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                   </div>
               )}

               {activeTab === 'orderbook' && (
                   <div className="space-y-6 animate-in slide-in-from-right-4 duration-400">
                        <div className="bg-slate-900 rounded-[2rem] p-6 text-white overflow-hidden relative border border-white/5 shadow-xl">
                            <h3 className="text-sm font-black uppercase tracking-[0.25em] text-slate-400 mb-6 flex items-center gap-2">
                                <div className="size-2 rounded-full bg-primary animate-pulse" />
                                Market Depth
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tighter pb-1 border-b border-white/5">
                                        <span>Bid</span>
                                        <span>Size</span>
                                    </div>
                                    {[
                                        { p: stock.price - 0.05, s: 4200 },
                                        { p: stock.price - 0.10, s: 12500 },
                                        { p: stock.price - 0.15, s: 8400 },
                                        { p: stock.price - 0.20, s: 21000 }
                                    ].map((bid, i) => (
                                        <div key={i} className="flex justify-between text-xs items-center group">
                                            <span className="text-emerald-400 font-mono font-bold">{bid.p.toFixed(2)}</span>
                                            <span className="text-slate-400 font-mono text-[10px]">{bid.s}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tighter pb-1 border-b border-white/5">
                                        <span>Size</span>
                                        <span>Ask</span>
                                    </div>
                                    {[
                                        { p: stock.price + 0.05, s: 1500 },
                                        { p: stock.price + 0.10, s: 9200 },
                                        { p: stock.price + 0.15, s: 14000 },
                                        { p: stock.price + 0.20, s: 3100 }
                                    ].map((ask, i) => (
                                        <div key={i} className="flex justify-between text-xs items-center">
                                            <span className="text-slate-400 font-mono text-[10px]">{ask.s}</span>
                                            <span className="text-rose-400 font-mono font-bold">{ask.p.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                   </div>
               )}

               {activeTab === 'financials' && (
                   <div className="space-y-6 animate-in slide-in-from-right-4 duration-400">
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-50 dark:border-slate-700">
                                <h3 className="font-black text-lg text-slate-800 dark:text-white">Annual Audited Results</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter mt-1">FY 2023 Disclosure</p>
                            </div>
                            
                            <div className="divide-y divide-slate-50 dark:divide-slate-700">
                                {[
                                    { label: 'Total Revenue', val: `₦${(stock.marketCap * 0.15 / 1e9).toFixed(2)}B`, positive: true },
                                    { label: 'Net Income', val: `₦${(stock.marketCap * 0.04 / 1e9).toFixed(2)}B`, positive: true },
                                    { label: 'Earnings Per Share', val: `₦${(stock.price * 0.08).toFixed(2)}`, positive: true },
                                    { label: 'Current Ratio', val: '2.4', positive: true },
                                    { label: 'ROE', val: '22.1%', positive: true },
                                    { label: 'D/E Ratio', val: '0.42', positive: true }
                                ].map((row, i) => (
                                    <div key={i} className="flex justify-between items-center p-5 group hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                        <span className="text-sm font-medium text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-200">{row.label}</span>
                                        <span className={`font-black text-sm text-slate-800 dark:text-white`}>{row.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                   </div>
               )}

               {activeTab === 'news' && (
                   <div className="space-y-4 animate-in slide-in-from-right-4 duration-400">
                       {[
                           { date: '2h ago', title: `${stock.name} Announces Dividend Distribution`, src: 'Reuters' },
                           { date: '1d ago', title: `Expansion Plans in West Africa Approved by Board`, src: 'Bloomberg' },
                           { date: '3d ago', title: `Market Sentiment Shift: Analysts Maintain Buy Rating on ${stock.ticker}`, src: 'FinPost' }
                       ].map((n, i) => (
                           <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 shadow-sm active:scale-95 transition-all">
                               <div className="flex justify-between items-start mb-2">
                                   <span className="text-[10px] font-black text-primary uppercase">{n.src}</span>
                                   <span className="text-[9px] font-bold text-slate-400">{n.date}</span>
                               </div>
                               <h4 className="font-bold text-slate-800 dark:text-white leading-snug">{n.title}</h4>
                           </div>
                       ))}
                   </div>
               )}
          </div>

          {/* Trade Execution Panel */}
          <div className="px-4 space-y-4">
              <h3 className="font-black text-[10px] uppercase tracking-[0.25em] text-slate-400 px-2">Order Execution</h3>
              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 shadow-xl border border-slate-100 dark:border-slate-700 space-y-6">
                   <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl">
                       {(['Market', 'Limit'] as OrderType[]).map(type => (
                           <button 
                             key={type}
                             onClick={() => setOrderType(type)}
                             className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${orderType === type ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400'}`}
                           >
                               {type} Order
                           </button>
                       ))}
                   </div>

                   <div className="grid grid-cols-1 gap-4">
                        {orderType === 'Limit' && (
                            <div className="space-y-1.5 animate-in slide-in-from-top-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Limit Price</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">₦</span>
                                    <input 
                                        type="number"
                                        value={limitPrice}
                                        onChange={(e) => setLimitPrice(e.target.value)}
                                        className="w-full pl-8 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xl font-black text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantity (Units)</label>
                            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <button onClick={() => setUnits(Math.max(1, units - 1))} className="size-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 shadow-sm border border-slate-100 dark:border-slate-700 active:scale-90 transition-transform"><Icon name="remove" /></button>
                                <span className="flex-1 text-center text-2xl font-black text-slate-800 dark:text-white">{units}</span>
                                <button onClick={() => setUnits(units + 1)} className="size-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm border border-slate-100 dark:border-slate-700 active:scale-90 transition-transform"><Icon name="add" /></button>
                            </div>
                        </div>
                   </div>

                   <div className="space-y-3 pt-2">
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-400 uppercase tracking-tighter">Est. Principal</span>
                            <span className="font-black text-slate-800 dark:text-white">₦{totalCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-400 uppercase tracking-tighter">SEC Fee (0.5%)</span>
                            <span className="font-black text-slate-800 dark:text-white">₦{transactionFee.toLocaleString()}</span>
                        </div>
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-widest">Total Cost</span>
                            <span className="text-xl font-black text-primary tracking-tighter">₦{(totalCost + transactionFee).toLocaleString()}</span>
                        </div>
                   </div>
              </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 max-w-md mx-auto z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                <button 
                  onClick={() => setStep('payment')}
                  className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase text-xs tracking-[0.4em] rounded-[2rem] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/5"
                >
                    <Icon name="rocket_launch" />
                    Review Buy Order
                </button>
          </div>
      </div>
  );

  const renderPayment = () => {
    const cards = MOCK_PAYMENT_METHODS.filter(pm => pm.type === 'card');
    const finalAmount = totalCost + transactionFee;

    return (
        <div className="flex-1 flex flex-col animate-in slide-in-from-bottom duration-500 p-6 space-y-8 pb-32">
            <div className="text-center">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Confirming Order</p>
                <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">₦{finalAmount.toLocaleString()}</h2>
                <div className="flex items-center justify-center gap-2 mt-4">
                    <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500 px-3 py-1 rounded-full uppercase tracking-widest">{units} {stock.ticker} Units</span>
                    <span className="text-[10px] font-black bg-blue-100 dark:bg-blue-500/10 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest">{orderType}</span>
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Funding Source</label>
                <div 
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer ${paymentMethod === 'wallet' ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                          <div className={`size-12 rounded-2xl flex items-center justify-center ${paymentMethod === 'wallet' ? 'bg-primary text-white shadow-lg' : 'bg-primary/10 text-primary'}`}>
                              <Icon name="account_balance_wallet" className="text-2xl" />
                          </div>
                          <div>
                            <span className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-sm">Mix Wallet</span>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Settlement Account</p>
                          </div>
                      </div>
                      {paymentMethod === 'wallet' && <Icon name="check_circle" className="text-primary" />}
                  </div>
                  <div className="flex justify-between items-center ml-16 mt-2">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Available: <span className="font-black text-slate-900 dark:text-white">₦{userBalance.toLocaleString()}</span></p>
                    {userBalance < finalAmount && (
                      <p className="text-rose-500 text-[10px] font-black uppercase flex items-center gap-1"><Icon name="error" className="text-xs" /> Insufficient</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Linked Cards</p>
                  {cards.map(card => (
                      <div 
                          key={card.id}
                          onClick={() => { setPaymentMethod('card'); }}
                          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'card' ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800'}`}
                      >
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                  <div className="size-11 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shadow-inner">
                                      <Icon name="credit_card" />
                                  </div>
                                  <div>
                                      <p className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-widest">{card.name}</p>
                                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">{card.mask}</p>
                                  </div>
                              </div>
                              {paymentMethod === 'card' && <Icon name="check_circle" className="text-primary" />}
                          </div>
                      </div>
                  ))}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 max-w-md mx-auto z-40 shadow-2xl">
                {error && <p className="text-rose-500 text-xs font-bold mb-4 text-center animate-in shake">{error}</p>}
                <button 
                  onClick={handleConfirmPurchase}
                  disabled={(paymentMethod === 'wallet' && userBalance < finalAmount) || isProcessing}
                  className="w-full py-5 bg-primary text-white font-black uppercase text-xs tracking-[0.4em] rounded-[2rem] shadow-xl disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
                >
                  Authorize Trade
                </button>
            </div>
        </div>
    );
  };

  const renderProcessing = () => (
      <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
          <div className="relative mb-8">
              <div className="size-32 border-4 border-white/5 border-t-emerald-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                  <Icon name="show_chart" className="text-5xl text-emerald-500 animate-pulse" />
              </div>
          </div>
          <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">Routing Order</h2>
          <p className="text-slate-400 text-sm max-w-xs leading-relaxed">Executing through Mix Brokerage and {stock.exchange} Gateway...</p>
          <div className="mt-12 w-full max-w-xs space-y-2">
                {[
                    'Locating liquidity pools...',
                    'Validating account permissions...',
                    'Exchanging keys with market maker...',
                    'Finalizing settlement...'
                ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3 animate-in slide-in-from-bottom duration-500" style={{ animationDelay: `${i * 800}ms` }}>
                         <div className="size-1 rounded-full bg-emerald-500" />
                         <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{step}</span>
                    </div>
                ))}
          </div>
      </div>
  );

  const renderSuccess = () => (
      <div className="fixed inset-0 z-[120] bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
          <div className="size-24 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 shadow-2xl animate-in bounce duration-1000">
              <Icon name="verified" className="text-6xl" />
          </div>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-2 tracking-tighter">Trade Executed!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-xs text-center font-medium leading-relaxed">
              Successfully bought <span className="font-black text-slate-900 dark:text-white">{units} units of {stock.ticker}</span>. The assets are now held in your custodial wallet.
          </p>
          
          <div className="w-full max-w-sm bg-slate-900 rounded-[2.5rem] p-8 text-white text-left mb-8 shadow-2xl relative overflow-hidden border border-white/5">
              <Icon name="token" className="absolute -right-4 -bottom-4 text-9xl opacity-10" />
              <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em] mb-8 flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-primary" />
                Electronic Trade Confirmation
              </p>
              <div className="space-y-6">
                  <div className="flex justify-between border-b border-white/5 pb-4">
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Instrument</span>
                      <span className="text-sm font-black tracking-tight">{stock.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-4">
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Quantity</span>
                      <span className="text-sm font-black tracking-tight">{units} Units</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-4">
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Price Paid</span>
                      <span className="text-sm font-black tracking-tight">₦{stock.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Contract REF</span>
                      <span className="text-[10px] font-mono text-primary truncate max-w-[120px]">TC-{Math.random().toString(36).substring(7).toUpperCase()}</span>
                  </div>
              </div>
          </div>

          <button 
              onClick={onBack}
              className="w-full max-w-xs py-5 bg-primary text-white font-black uppercase tracking-[0.3em] text-xs rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95"
          >
              Done
          </button>
      </div>
  );

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-[45] border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-slate-800 dark:text-white truncate">Security Detail</h1>
        <div className="flex items-center gap-2">
            <button className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Icon name="star_outline" />
            </button>
            <button className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Icon name="share" />
            </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
          {step === 'details' && renderDetails()}
          {step === 'payment' && renderPayment()}
          {step === 'processing' && renderProcessing()}
          {step === 'success' && renderSuccess()}
      </div>
    </div>
  );
};
