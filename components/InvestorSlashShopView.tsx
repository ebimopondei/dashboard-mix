import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { SpineProduct, UserProfile, SpineReview } from '../types';
import { MOCK_PAYMENT_METHODS } from '../constants';

interface InvestorSlashShopViewProps {
  products: SpineProduct[];
  userProfile: UserProfile;
  onBack: () => void;
  onPurchase: (total: number, itemsCount: number, pMethod: 'wallet' | 'card') => void;
}

type SlashSubView = 'HOME' | 'SLASH' | 'WISHLIST' | 'CART' | 'DETAIL' | 'CHECKOUT' | 'SUCCESS' | 'HISTORY';
type FilterMode = 'Shop' | 'Product' | 'Map';
type ProductDetailMode = 'DEFAULT' | 'SLASH_DEAL';

interface CartItem {
  product: SpineProduct;
  quantity: number;
  unitType: 'piece' | 'bulk';
  slashedPrice?: number;
  expiresAt?: number;
  isDeal: boolean;
}

interface WishlistItem {
  product: SpineProduct;
  isDeal: boolean;
  slashedPrice?: number;
  expiresAt?: number;
}

// Individual Countdown Component to prevent whole list re-renders
const DealCountdown: React.FC<{ endTime: number, isDarkMode: boolean, large?: boolean, tiny?: boolean }> = ({ endTime, isDarkMode, large = false, tiny = false }) => {
  const [timeLeft, setTimeLeft] = useState(endTime - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  if (timeLeft <= 0) return <span className="text-rose-500 text-[10px] font-black uppercase tracking-tighter">Deal Expired</span>;

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <div className={`flex items-center gap-1 font-mono font-black tracking-tighter ${large ? 'text-sm' : tiny ? 'text-[9px]' : 'text-[10px]'} ${isDarkMode ? 'text-rose-400' : 'text-rose-600'}`}>
      <Icon name="timer" className={large ? 'text-lg' : tiny ? 'text-[10px]' : 'text-[12px]'} />
      <span>{hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>
    </div>
  );
};

export const InvestorSlashShopView: React.FC<InvestorSlashShopViewProps> = ({ products, userProfile, onBack, onPurchase }) => {
  const [activeSubView, setActiveSubView] = useState<SlashSubView>('HOME');
  const [selectedProduct, setSelectedProduct] = useState<SpineProduct | null>(null);
  const [productDetailMode, setProductDetailMode] = useState<ProductDetailMode>('DEFAULT');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true); 
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [adIndex, setAdIndex] = useState(0);
  
  // Detail View State
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [detailUnitType, setDetailUnitType] = useState<'piece' | 'bulk'>('piece');

  // Searching logic for Home
  const [search, setSearch] = useState('');
  
  // Browsing/Filter State
  const [activeCategory, setActiveCategory] = useState('All');
  const [slashActiveCategory, setSlashActiveCategory] = useState('All');
  const [isModeModalOpen, setIsModeModalOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<FilterMode>('Product');

  // Ad Slider Logic
  const ads = [
    { title: "Free Delivery", sub: "On orders above ₦10,000 this weekend", icon: "local_shipping", color: "bg-indigo-600" },
    { title: "Market Day Special", sub: "Get extra 5% off items with the 'Market' tag", icon: "festival", color: "bg-emerald-600" },
    { title: "Mix Wallet Bonus", sub: "Earn 2% cashback when you pay with wallet", icon: "account_balance_wallet", color: "bg-amber-600" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setAdIndex((prev) => (prev + 1) % ads.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [ads.length]);

  // Derive deals for the Slash section
  const rawSlashedDeals = useMemo(() => {
      const now = Date.now();
      return products.slice(0, 15).map((p, i) => {
          const discountPercent = 15 + (i * 2); 
          const discountAmount = Math.floor(p.sellingPricePerPiece * (discountPercent / 100));
          const expiryMinutes = (i + 1) * 30; 
          const totalStockLimit = 50 + (i * 10);
          const currentStock = Math.floor(totalStockLimit * (0.1 + (Math.random() * 0.4)));

          return {
              ...p,
              slashedPrice: p.sellingPricePerPiece - discountAmount,
              discountPercent,
              expiresAt: now + (expiryMinutes * 60 * 1000),
              currentStock,
              totalStockLimit
          };
      });
  }, [products]);

  const slashedDeals = useMemo(() => {
    if (slashActiveCategory === 'All') return rawSlashedDeals;
    return rawSlashedDeals.filter(d => d.category === slashActiveCategory);
  }, [rawSlashedDeals, slashActiveCategory]);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const addToCart = (product: SpineProduct, qty: number = 1, unit: 'piece' | 'bulk' = 'piece', isDeal: boolean = false, slashedPrice?: number, expiresAt?: number) => {
    setCart(prev => {
        const existing = prev.find(i => i.product.id === product.id && i.unitType === unit && i.isDeal === isDeal);
        if (existing) {
            return prev.map(i => (i.product.id === product.id && i.unitType === unit && i.isDeal === isDeal) ? { ...i, quantity: i.quantity + qty } : i);
        }
        return [...prev, { product, quantity: qty, unitType: unit, slashedPrice, expiresAt, isDeal }];
    });
  };

  const toggleWishlist = (product: SpineProduct, isDeal: boolean = false, slashedPrice?: number, expiresAt?: number) => {
    setWishlist(prev => {
        const exists = prev.find(p => p.product.id === product.id && p.isDeal === isDeal);
        if (exists) return prev.filter(p => !(p.product.id === product.id && p.isDeal === isDeal));
        return [...prev, { product, isDeal, slashedPrice, expiresAt }];
    });
  };

  const updateCartQty = (id: string, delta: number, unit: 'piece' | 'bulk', isDeal: boolean) => {
      setCart(prev => prev.map(i => (i.product.id === id && i.unitType === unit && i.isDeal === isDeal) ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0));
  };

  const handleSwitchMode = (mode: FilterMode) => {
    setActiveMode(mode);
    setIsModeModalOpen(false);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const cartTotal = cart.reduce((sum, item) => {
      const basePrice = item.slashedPrice || (item.unitType === 'bulk' 
        ? (item.product.sellingPricePerBulk || item.product.sellingPricePerPiece * item.product.unitsPerBulk)
        : item.product.sellingPricePerPiece);
      return sum + (basePrice * item.quantity);
  }, 0);

  const handleFinalCheckout = () => {
    if (paymentMethod === 'wallet' && cartTotal > userProfile.walletBalance) {
        return;
    }
    
    setIsProcessing(true);
    setTimeout(() => {
        onPurchase(cartTotal, cart.length, paymentMethod);
        setIsProcessing(false);
        setActiveSubView('SUCCESS');
        setCart([]);
    }, 2000);
  };

  const themeClass = isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-white text-slate-950';

  const ProductIconPlaceholder = ({ product, small = false }: { product: SpineProduct, small?: boolean }) => {
    const categoryIcons: {[key: string]: string} = {
        'Produce': 'eco',
        'Fabrics': 'apparel',
        'Groceries': 'local_mall',
        'Bakery': 'bakery_dining',
        'Electronics': 'devices'
    };
    const icon = categoryIcons[product.category || ''] || 'shopping_bag';
    
    return (
        <div className={`size-full flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <Icon name={icon} className={`${small ? 'text-3xl' : 'text-4xl'} ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
        </div>
    );
  };

  const renderHome = () => (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10 pt-2">
        <div className="flex items-center justify-between px-1">
            <div className="space-y-0.5">
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Welcome back,</p>
                <h2 className="text-2xl font-black">{userProfile.name.split(' ')[0]}</h2>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={toggleTheme}
                    className={`size-11 rounded-2xl flex items-center justify-center shadow-sm border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-yellow-400' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                >
                    <Icon name={isDarkMode ? "light_mode" : "dark_mode"} className="text-xl" />
                </button>
                <div className={`size-11 rounded-2xl flex flex-col items-center justify-center shadow-sm border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-emerald-400' : 'bg-white border-slate-100 text-emerald-600'}`}>
                    <p className="text-[7px] font-black uppercase tracking-tighter">Balance</p>
                    <p className="text-[10px] font-black leading-none">₦{Math.floor(userProfile.walletBalance/1000)}k</p>
                </div>
            </div>
        </div>

        <div className="relative">
            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
                type="text" 
                placeholder="Search market..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'}`}
            />
        </div>

        <div className="relative rounded-[2.5rem] bg-emerald-600 p-8 text-white overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4">
                 <Icon name="bolt" className="text-[140px]" />
             </div>
             <div className="relative z-10 max-w-[60%]">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-emerald-100">Market Pick</p>
                 <h3 className="text-2xl font-black leading-tight mb-4 tracking-tighter">Verified Local Quality</h3>
                 <button onClick={() => setActiveSubView('SLASH')} className="px-5 py-2 bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Browse Deals</button>
             </div>
        </div>

        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setIsModeModalOpen(true)}
                    className={`size-11 shrink-0 rounded-2xl flex items-center justify-center transition-all border ${isDarkMode ? 'bg-slate-900 text-slate-400 border-slate-800' : 'bg-white text-slate-400 border-slate-100 shadow-sm'}`}
                >
                    <Icon name="tune" />
                </button>
                <div 
                  className="flex gap-2 overflow-x-auto no-scrollbar flex-1 items-center py-1"
                >
                    {categories.map(cat => (
                        <button 
                            key={cat} 
                            onClick={() => setActiveCategory(cat as string)} 
                            className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-2 ${
                                activeCategory === cat 
                                    ? (isDarkMode ? 'bg-white text-black border-white shadow-lg shadow-white/5' : 'bg-slate-950 text-white border-slate-950 shadow-md')
                                    : (isDarkMode ? 'bg-slate-900 text-slate-500 border-slate-800' : 'bg-white text-slate-400 border-slate-50')
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map(p => {
                const isInWishlist = wishlist.some(w => w.product.id === p.id && !w.isDeal);
                return (
                    <div 
                        key={p.id} 
                        onClick={() => { 
                            setSelectedProduct(p); 
                            setProductDetailMode('DEFAULT');
                            setActiveSubView('DETAIL'); 
                            setDetailQuantity(1);
                        }} 
                        className={`rounded-[2rem] border overflow-hidden active:scale-95 transition-transform group ${isDarkMode ? 'bg-slate-900 border-slate-800 shadow-xl' : 'bg-white border-slate-50 shadow-sm'}`}
                    >
                        <div className={`aspect-[4/5] relative flex items-center justify-center overflow-hidden ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                            <ProductIconPlaceholder product={p} />
                            <button 
                                onClick={(e) => { e.stopPropagation(); toggleWishlist(p, false); }}
                                className={`absolute top-4 right-4 size-8 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-colors ${isInWishlist ? 'bg-rose-500 text-white' : 'bg-black/10 text-white hover:text-rose-400'}`}
                            >
                                <Icon name={isInWishlist ? "favorite" : "favorite_border"} className="text-lg" />
                            </button>
                        </div>
                        <div className="p-4 space-y-1">
                            <p className={`text-[10px] font-black uppercase tracking-tighter ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{p.category}</p>
                            <h4 className="font-bold truncate text-sm">{p.name}</h4>
                            <div className="flex items-center justify-between pt-2">
                                <p className="font-black">₦{p.sellingPricePerPiece.toLocaleString()}</p>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); addToCart(p, 1, 'piece', false); }} 
                                    className={`size-8 rounded-full flex items-center justify-center shadow-lg active:bg-emerald-500 transition-colors ${isDarkMode ? 'bg-white text-black' : 'bg-slate-950 text-white'}`}
                                >
                                    <Icon name="add" className="text-lg" />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );

  const renderSlashDeals = () => (
    <div className="flex flex-col h-full animate-in slide-in-from-bottom duration-500 pt-2 overflow-hidden">
        <header className="flex flex-col gap-3 p-6 pb-4 shrink-0">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-xl">
                        <Icon name="local_fire_department" className="text-2xl" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight leading-none">Slash Deals</h2>
                        <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Hyper-Urgent Stocks</p>
                    </div>
                </div>
                <div className="size-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-rose-500 shadow-inner">
                    <Icon name="bolt" className="animate-pulse" />
                </div>
            </div>

            {/* Advert Slider */}
            <div className="relative h-20 w-full overflow-hidden rounded-2xl shadow-lg mt-1">
                {ads.map((ad, i) => (
                    <div 
                        key={i}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out flex items-center p-4 gap-4 ${ad.color} ${i === adIndex ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
                    >
                        <div className="size-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                            <Icon name={ad.icon} className="text-2xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-black text-white text-sm leading-none mb-1 uppercase tracking-tighter">{ad.title}</h4>
                            <p className="text-[10px] text-white/80 font-bold leading-tight">{ad.sub}</p>
                        </div>
                    </div>
                ))}
                <div className="absolute bottom-2 right-4 flex gap-1">
                    {ads.map((_, i) => (
                        <div key={i} className={`size-1.5 rounded-full transition-all ${i === adIndex ? 'bg-white w-3' : 'bg-white/30'}`} />
                    ))}
                </div>
            </div>

            {/* Slash Category Filter */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 mt-1">
                {categories.map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setSlashActiveCategory(cat as string)} 
                        className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-2 ${
                            slashActiveCategory === cat 
                                ? (isDarkMode ? 'bg-rose-500 text-white border-rose-500 shadow-xl shadow-rose-500/20 scale-105' : 'bg-slate-950 text-white border-slate-950 shadow-md')
                                : (isDarkMode ? 'bg-slate-900 text-slate-500 border-slate-800' : 'bg-white text-slate-400 border-slate-50')
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 space-y-5 pb-12 mt-2">
            {slashedDeals.map(p => {
                const isInWishlist = wishlist.some(w => w.product.id === p.id && w.isDeal);
                const stockPercent = (p.currentStock / p.totalStockLimit) * 100;
                
                return (
                    <div 
                        key={p.id}
                        onClick={() => { 
                            setSelectedProduct(p); 
                            setProductDetailMode('SLASH_DEAL');
                            setActiveSubView('DETAIL'); 
                            setDetailUnitType('piece');
                        }}
                        className={`flex flex-col p-5 rounded-[2.5rem] border shadow-2xl relative overflow-hidden group transition-all active:scale-[0.98] ${isDarkMode ? 'bg-slate-900 border-slate-800/50' : 'bg-white border-slate-100'}`}
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 blur-[80px] pointer-events-none" />
                        
                        <div className="flex gap-5 mb-5 relative z-10">
                            {/* Larger Thumbnail */}
                            <div className={`size-28 rounded-[2rem] flex items-center justify-center shrink-0 overflow-hidden relative shadow-2xl ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                                <ProductIconPlaceholder product={p} />
                                <div className="absolute top-2 left-2 bg-rose-600 text-white text-[9px] font-black px-2 py-1 rounded-full shadow-lg border border-white/20 scale-110">
                                    -{p.discountPercent}%
                                </div>
                            </div>
                            
                            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                                <div className="flex justify-between items-start">
                                    <div className="min-w-0 pr-2">
                                        <h4 className="font-black text-xl leading-tight truncate text-slate-800 dark:text-white tracking-tighter">{p.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <DealCountdown endTime={p.expiresAt} isDarkMode={isDarkMode} />
                                        </div>
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); toggleWishlist(p, true, p.slashedPrice, p.expiresAt); }}
                                        className={`size-8 rounded-xl flex items-center justify-center transition-all shadow-sm border ${isInWishlist ? 'bg-rose-500 text-white border-rose-500' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700'}`}
                                    >
                                        <Icon name={isInWishlist ? "favorite" : "favorite_border"} className="text-lg" />
                                    </button>
                                </div>
                                
                                <div className="mt-2">
                                    <p className="text-[10px] text-slate-400 line-through font-bold">₦{p.sellingPricePerPiece.toLocaleString()}</p>
                                    <div className="flex items-baseline gap-1">
                                        <p className="text-3xl font-black text-rose-500 leading-none tracking-tighter">₦{p.slashedPrice.toLocaleString()}</p>
                                        <span className="text-[10px] font-black text-slate-500 uppercase">/{p.pieceUnitName}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Stock Progress */}
                        <div className="space-y-2 mb-6 relative z-10 px-1">
                            <div className="flex justify-between items-end">
                                <div className="flex items-center gap-1.5">
                                    <div className="size-2 rounded-full bg-rose-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{p.currentStock} {p.pieceUnitName}s Available</span>
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase">{Math.round(stockPercent)}%</span>
                            </div>
                            <div className={`h-2.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-950 shadow-inner' : 'bg-slate-100'}`}>
                                <div 
                                    className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(244,63,94,0.5)]" 
                                    style={{ width: `${stockPercent}%` }} 
                                />
                            </div>
                        </div>

                        {/* Primary Prominent Button */}
                        <button 
                            onClick={(e) => { e.stopPropagation(); addToCart(p, 1, 'piece', true, p.slashedPrice, p.expiresAt); }}
                            className="w-full py-5 bg-primary text-white font-black uppercase text-xs tracking-[0.4em] rounded-[2rem] shadow-[0_10px_30px_rgba(16,185,129,0.2)] active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                            <Icon name="add_shopping_cart" className="text-xl relative z-10" />
                            <span className="relative z-10">Add to Shopping Bag</span>
                        </button>
                    </div>
                );
            })}

            {slashedDeals.length === 0 && (
                <div className="py-20 text-center opacity-30 flex flex-col items-center animate-in fade-in zoom-in-95">
                    <div className="size-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                        <Icon name="local_mall" className="text-6xl text-slate-400" />
                    </div>
                    <p className="font-black text-lg uppercase tracking-widest">No deals in {slashActiveCategory}</p>
                    <button onClick={() => setSlashActiveCategory('All')} className="mt-4 text-primary font-black uppercase text-xs underline underline-offset-4">Reset Filter</button>
                </div>
            )}
        </div>
    </div>
  );

  const renderWishlist = () => (
    <div className="flex flex-col h-full animate-in slide-in-from-bottom duration-400 pt-2">
        <header className="flex items-center gap-4 p-6 shrink-0">
            <button onClick={() => setActiveSubView('HOME')} className={`size-10 rounded-full flex items-center justify-center active:scale-90 transition-transform ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}><Icon name="arrow_back" /></button>
            <h2 className="text-xl font-black flex-1 text-center">My Wishlist</h2>
            <div className="size-10" />
        </header>

        <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-10">
            {wishlist.length > 0 ? (
                wishlist.map(item => {
                    const p = item.product;
                    return (
                        <div 
                            key={`${p.id}-${item.isDeal}`}
                            onClick={() => { 
                                setSelectedProduct(p); 
                                setProductDetailMode(item.isDeal ? 'SLASH_DEAL' : 'DEFAULT');
                                setActiveSubView('DETAIL'); 
                            }}
                            className={`flex gap-4 p-2 rounded-3xl border shadow-sm cursor-pointer group active:scale-[0.98] transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50'}`}
                        >
                            <div className={`size-24 rounded-[2rem] flex items-center justify-center shrink-0 overflow-hidden relative ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                                <ProductIconPlaceholder product={p} />
                                {item.isDeal && (
                                    <div className="absolute top-1 left-1 bg-rose-500 text-white text-[7px] font-black px-1 py-0.5 rounded shadow">SLASH</div>
                                )}
                            </div>
                            <div className="flex-1 flex flex-col justify-center py-1 min-w-0">
                                <h4 className="font-bold truncate">{p.name}</h4>
                                <div className="flex items-baseline gap-2">
                                    <p className={`font-black ${item.isDeal ? 'text-rose-500' : 'text-primary'}`}>₦{(item.slashedPrice || p.sellingPricePerPiece).toLocaleString()}</p>
                                    {item.isDeal && <p className="text-[10px] text-slate-400 line-through">₦{p.sellingPricePerPiece.toLocaleString()}</p>}
                                </div>
                                {item.isDeal && item.expiresAt && (
                                    <div className="mt-1">
                                        <DealCountdown endTime={item.expiresAt} isDarkMode={isDarkMode} tiny />
                                    </div>
                                )}
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); toggleWishlist(p, item.isDeal); }}
                                className="p-4 text-rose-500 active:scale-90"
                            >
                                <Icon name="delete" />
                            </button>
                        </div>
                    );
                })
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 p-10 mt-10">
                    <Icon name="favorite" className="text-7xl mb-4" />
                    <p className="font-black uppercase tracking-widest">Nothing saved yet</p>
                </div>
            )}
        </div>
    </div>
  );

  const renderCart = () => (
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-400 pt-2">
        <header className="flex items-center gap-4 p-6 shrink-0">
            <button onClick={() => setActiveSubView('HOME')} className={`size-10 rounded-full flex items-center justify-center active:scale-90 transition-transform ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}><Icon name="arrow_back" /></button>
            <h2 className="text-xl font-black flex-1 text-center">My Shopping Bag</h2>
            <button 
                onClick={() => setActiveSubView('HISTORY')}
                className={`size-10 rounded-full flex items-center justify-center active:scale-90 transition-transform ${isDarkMode ? 'bg-slate-900 text-primary' : 'bg-slate-50 text-primary'}`}
                title="Purchase History"
            >
                <Icon name="history" />
            </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 space-y-6">
            {cart.length > 0 ? (
                cart.map((item, idx) => {
                    const price = item.slashedPrice || (item.unitType === 'bulk' 
                        ? (item.product.sellingPricePerBulk || item.product.sellingPricePerPiece * item.product.unitsPerBulk)
                        : item.product.sellingPricePerPiece);
                    
                    return (
                        <div 
                            key={`${item.product.id}-${item.unitType}-${item.isDeal}-${idx}`} 
                            className={`flex gap-4 p-2 rounded-3xl border shadow-sm animate-in fade-in duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50'}`}
                        >
                            <div className={`size-24 rounded-[2rem] flex items-center justify-center shrink-0 overflow-hidden relative ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                                <ProductIconPlaceholder product={item.product} />
                                {item.isDeal && (
                                    <div className="absolute top-1 left-1 bg-rose-500 text-white text-[7px] font-black px-1 py-0.5 rounded shadow">SLASH</div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                <div className="flex justify-between items-start">
                                    <div className="min-w-0">
                                        <h4 className="font-bold truncate text-sm">{item.product.name}</h4>
                                        <div className="flex items-center gap-2">
                                            <p className={`text-[9px] font-black uppercase tracking-tighter ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                {item.unitType === 'bulk' ? item.product.bulkUnitName : item.product.pieceUnitName}
                                            </p>
                                            {item.isDeal && item.expiresAt && (
                                                <DealCountdown endTime={item.expiresAt} isDarkMode={isDarkMode} tiny />
                                            )}
                                        </div>
                                    </div>
                                    <button onClick={() => updateCartQty(item.product.id, -item.quantity, item.unitType, item.isDeal)} className="text-slate-500 hover:text-rose-500 p-1"><Icon name="close" className="text-sm" /></button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="font-black text-sm">
                                        ₦{(price * item.quantity).toLocaleString()}
                                    </p>
                                    <div className={`flex items-center gap-3 rounded-xl p-1 px-2 border shadow-inner ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                                        <button onClick={() => updateCartQty(item.product.id, -1, item.unitType, item.isDeal)} className="text-slate-500 active:text-white px-1"><Icon name="remove" className="text-sm" /></button>
                                        <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                                        <button onClick={() => updateCartQty(item.product.id, 1, item.unitType, item.isDeal)} className="px-1 active:scale-110 transition-transform"><Icon name="add" className="text-sm" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 p-10 mt-10">
                    <Icon name="shopping_cart" className="text-7xl mb-4" />
                    <p className="font-black uppercase tracking-widest">Bag is Empty</p>
                </div>
            )}
            <div className="h-10" />
        </div>

        {cart.length > 0 && (
            <div className={`p-6 border-t space-y-4 mx-2 rounded-t-[2.5rem] shadow-2xl relative z-10 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center justify-between">
                    <p className={`text-sm font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Subtotal</p>
                    <p className="text-2xl font-black">₦{cartTotal.toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => setActiveSubView('CHECKOUT')}
                  className={`w-full py-5 font-black text-xs uppercase tracking-[0.4em] rounded-[2rem] shadow-2xl active:scale-[0.98] transition-transform ${isDarkMode ? 'bg-white text-black' : 'bg-slate-950 text-white'}`}
                >
                    Checkout
                </button>
            </div>
        )}
    </div>
  );

  const renderDetail = () => {
    if (!selectedProduct) return null;
    const p = selectedProduct;
    const dealData = rawSlashedDeals.find(d => d.id === p.id);
    const isSlashMode = productDetailMode === 'SLASH_DEAL' && !!dealData;
    
    const currentPrice = isSlashMode && detailUnitType === 'piece' 
        ? dealData!.slashedPrice 
        : (detailUnitType === 'bulk' 
            ? (p.sellingPricePerBulk || p.sellingPricePerPiece * p.unitsPerBulk)
            : p.sellingPricePerPiece);

    const stockPercent = isSlashMode ? (dealData!.currentStock / dealData!.totalStockLimit) * 100 : 0;

    return (
        <div className="flex flex-col h-full animate-in slide-in-from-right duration-400 pt-2">
            <header className="flex items-center justify-between p-6 shrink-0 absolute top-0 left-0 right-0 z-[60]">
                <button onClick={() => setActiveSubView(isSlashMode ? 'SLASH' : 'HOME')} className="size-10 rounded-full flex items-center justify-center bg-black/20 backdrop-blur-md text-white border border-white/20 active:scale-90 transition-transform">
                    <Icon name="arrow_back" />
                </button>
                <div className="flex gap-2">
                    <button 
                        onClick={() => toggleWishlist(p, isSlashMode, isSlashMode ? dealData?.slashedPrice : undefined, isSlashMode ? dealData?.expiresAt : undefined)}
                        className={`size-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all ${wishlist.some(w => w.product.id === p.id && w.isDeal === isSlashMode) ? 'bg-rose-500 text-white' : 'bg-black/20 text-white'}`}
                    >
                        <Icon name={wishlist.some(w => w.product.id === p.id && w.isDeal === isSlashMode) ? "favorite" : "favorite_border"} />
                    </button>
                    <button 
                        onClick={() => setActiveSubView('CART')}
                        className="size-10 rounded-full flex items-center justify-center bg-black/20 backdrop-blur-md text-white border border-white/20 relative"
                    >
                        <Icon name="shopping_basket" />
                        {cart.length > 0 && <span className="absolute -top-1 -right-1 size-4 bg-primary text-white text-[8px] font-black rounded-full flex items-center justify-center">{cart.length}</span>}
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className={`aspect-[4/5] relative flex items-center justify-center overflow-hidden ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                    <ProductIconPlaceholder product={p} />
                    {isSlashMode && (
                        <div className="absolute bottom-16 left-6 right-6 z-20 animate-in slide-in-from-bottom-4 duration-700">
                             <div className="bg-rose-600/90 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl flex items-center justify-between">
                                 <div className="space-y-0.5">
                                    <p className="text-[8px] font-black text-rose-100 uppercase tracking-widest">Special Offer Ends In</p>
                                    <DealCountdown endTime={dealData!.expiresAt} isDarkMode={isDarkMode} large />
                                 </div>
                                 <div className="text-right">
                                    <p className="text-[18px] font-black text-white">-{dealData!.discountPercent}%</p>
                                    <p className="text-[8px] font-black text-rose-100 uppercase tracking-widest">Slashed</p>
                                 </div>
                             </div>
                        </div>
                    )}
                </div>

                <div className={`px-6 py-10 rounded-t-[4rem] -mt-12 relative z-50 shadow-[0_-20px_40px_rgba(0,0,0,0.2)] ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                    <div className="flex justify-between items-start mb-2">
                        <div className="space-y-1 min-w-0 flex-1 pr-4">
                            <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isSlashMode ? 'text-rose-500' : 'text-primary'}`}>{p.category}</p>
                            <h2 className="text-3xl font-black tracking-tighter truncate">{p.name}</h2>
                        </div>
                        <div className="text-right shrink-0">
                             {isSlashMode && detailUnitType === 'piece' && (
                                <p className="text-xs text-slate-500 line-through font-bold">₦{p.sellingPricePerPiece.toLocaleString()}</p>
                             )}
                             <p className={`text-3xl font-black tracking-tighter ${isSlashMode && detailUnitType === 'piece' ? 'text-rose-500' : 'text-primary'}`}>₦{currentPrice.toLocaleString()}</p>
                             <p className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>per {detailUnitType === 'bulk' ? p.bulkUnitName : p.pieceUnitName}</p>
                        </div>
                    </div>

                    {isSlashMode && detailUnitType === 'piece' && (
                        <div className="mt-4 mb-8 space-y-2">
                            <div className="flex justify-between items-end">
                                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1">
                                    <Icon name="bolt" className="text-sm" />
                                    Only {dealData!.currentStock} {p.pieceUnitName}s Left
                                </p>
                                <span className="text-[10px] font-black text-slate-500 uppercase">{Math.round(stockPercent)}%</span>
                            </div>
                            <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
                                <div 
                                    className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(244,63,94,0.3)]" 
                                    style={{ width: `${stockPercent}%` }} 
                                />
                            </div>
                        </div>
                    )}

                    {!isSlashMode && (
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex text-yellow-400">
                                <Icon name="star" className="text-xs" />
                                <Icon name="star" className="text-xs" />
                                <Icon name="star" className="text-xs" />
                                <Icon name="star" className="text-xs" />
                                <Icon name="star_half" className="text-xs" />
                            </div>
                            <span className="text-xs font-bold opacity-60">4.8 (24 Reviews)</span>
                        </div>
                    )}

                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div className={`flex p-1.5 rounded-[1.5rem] border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                                <button 
                                    onClick={() => setDetailUnitType('piece')}
                                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${detailUnitType === 'piece' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-lg scale-105' : 'text-slate-500'}`}
                                >
                                    {p.pieceUnitName}
                                </button>
                                <button 
                                    onClick={() => setDetailUnitType('bulk')}
                                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${detailUnitType === 'bulk' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-lg scale-105' : 'text-slate-500'}`}
                                >
                                    {p.bulkUnitName}
                                </button>
                            </div>

                            <div className={`flex items-center gap-5 p-1.5 px-5 rounded-[1.5rem] border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                                <button onClick={() => setDetailQuantity(Math.max(1, detailQuantity - 1))} className="text-slate-500 active:scale-75 transition-transform"><Icon name="remove" /></button>
                                <span className="font-black text-lg w-4 text-center">{detailQuantity}</span>
                                <button onClick={() => setDetailQuantity(detailQuantity + 1)} className="text-primary active:scale-75 transition-transform"><Icon name="add" /></button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className={`font-black text-[10px] uppercase tracking-[0.25em] ${isSlashMode ? 'text-rose-500' : 'text-slate-500'}`}>Product Credentials</h4>
                            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                This {p.name} is verified for quality and origin. Sourced from local markets with Spine-audited supply chains. {isSlashMode ? 'Available for a limited time at this hyper-competitive price.' : 'A stable pick for consistent daily trade requirements.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`p-6 border-t flex gap-4 shrink-0 z-50 shadow-2xl ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50'}`}>
                <button 
                  onClick={() => { addToCart(p, detailQuantity, detailUnitType, isSlashMode, isSlashMode ? dealData!.slashedPrice : undefined, isSlashMode ? dealData!.expiresAt : undefined); setActiveSubView('CART'); }}
                  className={`flex-[2] py-5 font-black text-xs uppercase tracking-[0.3em] rounded-[2rem] shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${isSlashMode && detailUnitType === 'piece' ? 'bg-primary text-white' : (isDarkMode ? 'bg-white text-black' : 'bg-slate-950 text-white')}`}
                >
                    <Icon name="shopping_basket" className="text-lg" />
                    <span>Add (₦{(currentPrice * detailQuantity).toLocaleString()})</span>
                </button>
            </div>
        </div>
    );
  };

  const renderCheckout = () => {
    const cards = MOCK_PAYMENT_METHODS.filter(pm => pm.type === 'card');
    const isWalletInsufficient = paymentMethod === 'wallet' && cartTotal > userProfile.walletBalance;

    return (
        <div className="flex flex-col h-full animate-in slide-in-from-bottom duration-400 pt-2">
            <header className="flex items-center gap-4 p-6 shrink-0">
                <button onClick={() => setActiveSubView('CART')} className={`size-10 rounded-full flex items-center justify-center active:scale-90 transition-transform ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}><Icon name="arrow_back" /></button>
                <h2 className="text-xl font-black flex-1 text-center">Secure Checkout</h2>
                <div className="size-10" />
            </header>

            <div className="flex-1 overflow-y-auto px-6 space-y-8 pb-10">
                <div className="text-center">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Payable</p>
                    <h2 className="text-4xl font-black">₦{cartTotal.toLocaleString()}</h2>
                </div>

                <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Payment Method</p>
                    
                    <div 
                        onClick={() => setPaymentMethod('wallet')}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'wallet' ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                    <Icon name="account_balance_wallet" />
                                </div>
                                <span className="font-bold">Mix Wallet</span>
                            </div>
                            {paymentMethod === 'wallet' && <Icon name="check_circle" className="text-primary" />}
                        </div>
                        <div className="flex justify-between items-center ml-13">
                            <p className="text-xs text-slate-500">Balance: ₦{userProfile.walletBalance.toLocaleString()}</p>
                            {isWalletInsufficient && <span className="text-[10px] font-black text-rose-500 uppercase">Insufficient</span>}
                        </div>
                    </div>

                    {cards.map(card => (
                        <div 
                            key={card.id}
                            onClick={() => setPaymentMethod('card')}
                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === 'card' ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                                        <Icon name="credit_card" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{card.name}</p>
                                        <p className="text-xs text-slate-500">{card.mask}</p>
                                    </div>
                                </div>
                                {paymentMethod === 'card' && <Icon name="check_circle" className="text-primary" />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-6">
                <button 
                    onClick={handleFinalCheckout}
                    disabled={isWalletInsufficient || isProcessing}
                    className={`w-full py-5 font-black text-xs uppercase tracking-[0.4em] rounded-[2rem] shadow-xl transition-all flex items-center justify-center gap-3 ${isDarkMode ? 'bg-white text-black' : 'bg-slate-950 text-white'} disabled:opacity-50 disabled:grayscale`}
                >
                    {isProcessing ? (
                        <span className="size-5 border-2 border-slate-400 border-t-slate-100 rounded-full animate-spin" />
                    ) : (
                        <>
                            <Icon name="verified_user" />
                            Pay Now
                        </>
                    )}
                </button>
            </div>
        </div>
    );
  };

  const renderSuccessFlow = () => (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
          <div className="size-24 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/30">
              <Icon name="shopping_bag" className="text-5xl" />
          </div>
          <h2 className="text-3xl font-black mb-2">Order Confirmed!</h2>
          <p className={`text-sm mb-10 max-w-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Your order has been sent to the trader for fulfillment. You'll get a notification when it's out for delivery.
          </p>
          <button 
              onClick={() => setActiveSubView('HOME')}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest ${isDarkMode ? 'bg-white text-black' : 'bg-slate-900 text-white'}`}
          >
              Return to Market
          </button>
      </div>
  );

  const renderHistory = () => {
    const history = userProfile.activities.filter(a => a.type === 'purchase');
    return (
        <div className="flex flex-col h-full animate-in slide-in-from-bottom duration-400 pt-2">
            <header className="flex items-center gap-4 p-6 shrink-0">
                <button onClick={() => setActiveSubView('CART')} className={`size-10 rounded-full flex items-center justify-center active:scale-90 transition-transform ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}><Icon name="arrow_back" /></button>
                <h2 className="text-xl font-black flex-1 text-center">Shopping History</h2>
                <div className="size-10" />
            </header>

            <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-10">
                {history.length > 0 ? (
                    history.map(activity => (
                        <div 
                            key={activity.id}
                            className={`p-5 rounded-3xl border shadow-sm animate-in fade-in duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                        <Icon name="receipt_long" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-white">{activity.title}</p>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black">{activity.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-900 dark:text-white">₦{Math.abs(activity.amount).toLocaleString()}</p>
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${activity.status === 'completed' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10' : 'bg-amber-100 text-amber-600'}`}>{activity.status}</span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-2 border-t border-slate-100 dark:border-slate-800 pt-2">{activity.description}</p>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30 p-10 mt-10">
                        <Icon name="history" className="text-7xl mb-4" />
                        <p className="font-black uppercase tracking-widest">No previous purchases</p>
                    </div>
                )}
            </div>
        </div>
    );
  };

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col animate-in fade-in duration-300 ${themeClass}`}>
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeSubView === 'HOME' && <div className="flex-1 overflow-y-auto px-4 no-scrollbar">{renderHome()}</div>}
        {activeSubView === 'SLASH' && <div className="flex-1 overflow-hidden">{renderSlashDeals()}</div>}
        {activeSubView === 'WISHLIST' && <div className="flex-1 overflow-hidden">{renderWishlist()}</div>}
        {activeSubView === 'CART' && <div className="flex-1 overflow-hidden">{renderCart()}</div>}
        {activeSubView === 'DETAIL' && <div className="flex-1 overflow-hidden">{renderDetail()}</div>}
        {activeSubView === 'CHECKOUT' && <div className="flex-1 overflow-hidden">{renderCheckout()}</div>}
        {activeSubView === 'SUCCESS' && <div className="flex-1 overflow-hidden">{renderSuccessFlow()}</div>}
        {activeSubView === 'HISTORY' && <div className="flex-1 overflow-hidden">{renderHistory()}</div>}
      </div>

      {!['DETAIL', 'CHECKOUT', 'SUCCESS', 'HISTORY'].includes(activeSubView) && (
        <div className={`shrink-0 border-t px-6 py-4 pb-8 flex justify-between items-center shadow-[0_-10px_50px_rgba(0,0,0,0.04)] z-50 ${isDarkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-50'}`}>
            <button onClick={() => setActiveSubView('HOME')} className={`flex flex-col items-center gap-1 transition-all ${activeSubView === 'HOME' ? (isDarkMode ? 'text-white scale-105' : 'text-slate-950 scale-105') : 'text-slate-500'}`}>
                <Icon name="grid_view" className="text-2xl" />
                <span className="text-[8px] font-black uppercase tracking-tighter">Browse</span>
                {activeSubView === 'HOME' && <div className="size-1 rounded-full bg-primary mt-0.5" />}
            </button>

            <button onClick={() => setActiveSubView('SLASH')} className={`flex flex-col items-center gap-1 transition-all ${activeSubView === 'SLASH' ? (isDarkMode ? 'text-white scale-105' : 'text-slate-950 scale-105') : 'text-slate-500'}`}>
                <Icon name="local_fire_department" className={`text-2xl ${activeSubView === 'SLASH' ? 'text-rose-500' : ''}`} />
                <span className="text-[8px] font-black uppercase tracking-tighter">Slash</span>
                {activeSubView === 'SLASH' && <div className="size-1 rounded-full bg-rose-500 mt-0.5" />}
            </button>

            <button onClick={() => setActiveSubView('WISHLIST')} className={`relative flex flex-col items-center gap-1 transition-all ${activeSubView === 'WISHLIST' ? (isDarkMode ? 'text-white scale-105' : 'text-slate-950 scale-105') : 'text-slate-500'}`}>
                <Icon name="favorite" className="text-2xl" />
                <span className="text-[8px] font-black uppercase tracking-tighter">Wishlist</span>
                {wishlist.length > 0 && <span className="absolute top-0 -right-1 size-3 bg-rose-500 text-[6px] font-black text-white rounded-full flex items-center justify-center">{wishlist.length}</span>}
                {activeSubView === 'WISHLIST' && <div className="size-1 rounded-full bg-primary mt-0.5" />}
            </button>

            <button onClick={() => setActiveSubView('CART')} className={`relative flex flex-col items-center gap-1 transition-all ${activeSubView === 'CART' ? (isDarkMode ? 'text-white scale-105' : 'text-slate-950 scale-105') : 'text-slate-500'}`}>
                <Icon name="shopping_basket" className="text-2xl" />
                <span className="text-[8px] font-black uppercase tracking-tighter">Cart</span>
                {cart.length > 0 && (
                    <span className="absolute top-0 -right-1 size-3 bg-primary text-[6px] font-black text-white rounded-full flex items-center justify-center">
                        {cart.length}
                    </span>
                )}
                {activeSubView === 'CART' && <div className="size-1 rounded-full bg-primary mt-0.5" />}
            </button>

            <div className={`w-px h-8 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`} />

            <button 
                onClick={onBack}
                className="flex flex-col items-center gap-1 transition-all text-rose-500 active:scale-90"
            >
                <Icon name="exit_to_app" className="text-2xl" />
                <span className="text-[8px] font-black uppercase tracking-tighter">Exit</span>
            </button>
        </div>
      )}

      {isModeModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-end justify-center">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModeModalOpen(false)} />
              <div className={`relative w-full max-w-md rounded-t-[3rem] p-10 shadow-2xl animate-in slide-in-from-bottom duration-500 flex flex-col ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-950'}`}>
                  <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-xl bg-yellow-400 flex items-center justify-center text-black shadow-lg shadow-yellow-400/20"><Icon name="bolt" className="font-black" /></div>
                        <h2 className="text-xl font-black uppercase tracking-widest leading-none pt-1">Discovery</h2>
                      </div>
                      <button onClick={() => setIsModeModalOpen(false)} className="p-2 -mr-2 text-slate-500 hover:text-slate-400 transition-colors"><Icon name="close" /></button>
                  </div>
                  <div className="grid gap-3">
                      {(['Product', 'Shop', 'Map'] as FilterMode[]).map(mode => (
                          <button 
                            key={mode} 
                            onClick={() => handleSwitchMode(mode)} 
                            className={`w-full py-5 rounded-3xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-between px-8 border ${
                                activeMode === mode 
                                    ? (isDarkMode ? 'bg-white text-black border-white translate-x-2' : 'bg-slate-950 text-white border-slate-950 translate-x-2 shadow-xl')
                                    : (isDarkMode ? 'bg-slate-950 text-slate-500 border-slate-800' : 'bg-slate-50 text-slate-400 border-slate-100')
                            }`}
                          >
                              <div className="flex items-center gap-4">
                                <Icon name={mode === 'Shop' ? 'storefront' : mode === 'Product' ? 'inventory_2' : 'map'} className="text-xl" />
                                <span>{mode === 'Product' ? 'By Category' : mode === 'Shop' ? 'By Distance' : 'Explore Map'}</span>
                              </div>
                              {activeMode === mode && <Icon name="check_circle" className={isDarkMode ? "text-slate-950 text-lg" : "text-yellow-400 text-lg"} />}
                          </button>
                      ))}
                  </div>
                  <div className="h-10" />
              </div>
          </div>
      )}
    </div>
  );
};
