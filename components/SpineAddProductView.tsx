
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { SpineProduct, SpineBatch } from '../types';

interface SpineAddProductViewProps {
  onBack: () => void;
  existingProduct?: SpineProduct | null;
  onSave: (product: SpineProduct) => void;
  products: SpineProduct[];
}

const BULK_UNITS = ["Bunch", "Crate", "Bag", "Carton", "Bundle", "Sack", "Pack", "Pair", "Dozen", "Tray", "Set"];
const RETAIL_UNITS = ["Finger", "Egg", "Mudu", "Piece", "Yard", "Bottle", "Sachet", "Tablet", "Kg", "Gram", "Litre", "Cup", "Stick"];

interface StylishDropdownProps {
    label: string;
    options: string[];
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
}

const StylishDropdown: React.FC<StylishDropdownProps> = ({ label, options, value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOther, setIsOther] = useState(!options.includes(value) && value !== '');
    const [customValue, setCustomValue] = useState(isOther ? value : '');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: string) => {
        if (option === 'Other...') {
            setIsOther(true);
            onChange('');
        } else {
            setIsOther(false);
            onChange(option);
        }
        setIsOpen(false);
    };

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCustomValue(val);
        onChange(val);
    };

    return (
        <div className="space-y-2 relative" ref={dropdownRef}>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
            
            {!isOther ? (
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex items-center justify-between p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-800 dark:text-white shadow-sm transition-all focus:ring-2 focus:ring-primary outline-none"
                    >
                        <span className={value ? '' : 'text-slate-400'}>{value || placeholder}</span>
                        <Icon name={isOpen ? "expand_less" : "expand_more"} className="text-slate-400" />
                    </button>

                    {isOpen && (
                        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="max-h-60 overflow-y-auto no-scrollbar">
                                {options.map((opt) => (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => handleSelect(opt)}
                                        className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-700 last:border-0"
                                    >
                                        {opt}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => handleSelect('Other...')}
                                    className="w-full px-4 py-3 text-left text-sm font-black text-primary hover:bg-primary/5 transition-colors"
                                >
                                    Other...
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="relative animate-in zoom-in-95 duration-200">
                    <input
                        type="text"
                        value={customValue}
                        onChange={handleCustomChange}
                        placeholder="Type custom unit..."
                        autoFocus
                        className="w-full p-3.5 pr-12 bg-white dark:bg-slate-800 border border-primary/50 dark:border-primary/30 rounded-2xl text-sm font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    />
                    <button 
                        type="button"
                        onClick={() => { setIsOther(false); onChange(''); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 size-8 flex items-center justify-center text-slate-400 hover:text-rose-500"
                    >
                        <Icon name="close" className="text-lg" />
                    </button>
                </div>
            )}
        </div>
    );
};

export const SpineAddProductView: React.FC<SpineAddProductViewProps> = ({ onBack, existingProduct, onSave, products }) => {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [name, setName] = useState(existingProduct?.name || '');
  
  // Unit Names
  const [bulkUnitName, setBulkUnitName] = useState(existingProduct?.bulkUnitName || 'Bunch');
  const [pieceUnitName, setPieceUnitName] = useState(existingProduct?.pieceUnitName || 'Finger');

  const [unitsPerBulk, setUnitsPerBulk] = useState(existingProduct?.unitsPerBulk.toString() || '12');
  
  const [sellingPricePerPiece, setSellingPricePerPiece] = useState(existingProduct?.sellingPricePerPiece.toString() || '');
  const [sellingPricePerBulk, setSellingPricePerBulk] = useState(existingProduct?.sellingPricePerBulk?.toString() || '');
  
  const [serialNumber, setSerialNumber] = useState(existingProduct?.serialNumber || '');
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const populateFromProduct = (p: SpineProduct) => {
      // Get base name without existing brackets if any
      const baseName = p.name.split(' [')[0];
      setName(`${baseName} [${p.serialNumber}]`);
      setBulkUnitName(p.bulkUnitName);
      setPieceUnitName(p.pieceUnitName);
      setUnitsPerBulk(p.unitsPerBulk.toString());
      setSellingPricePerPiece(p.sellingPricePerPiece.toString());
      setSellingPricePerBulk(p.sellingPricePerBulk?.toString() || '');
      setSerialNumber(p.serialNumber || '');
  };

  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      setTimeout(() => {
        if (!name) setName('Bananas (Sweet)');
        setIsVoiceActive(false);
      }, 2000);
    }
  };

  const handleScan = () => {
    setIsScanning(true);
    setScanMessage(null);
    
    // Simulate real scan
    setTimeout(() => {
        // Pick either an existing code or a new one for simulation
        const codes = products.map(p => p.serialNumber).filter(Boolean);
        const shouldFindExisting = Math.random() > 0.4;
        const mockCode = shouldFindExisting && codes.length > 0 
            ? codes[Math.floor(Math.random() * codes.length)] 
            : 'BAR-' + Math.floor(1000 + Math.random() * 9000);
            
        const found = products.find(p => p.serialNumber === mockCode);
        
        if (found) {
            populateFromProduct(found);
            setScanMessage(`Found: ${found.name}`);
        } else {
            setSerialNumber(mockCode as string);
            // Append code after name
            const currentBaseName = name.split(' [')[0];
            setName(`${currentBaseName || 'New Product'} [${mockCode}]`);
            setScanMessage(`New code detected: ${mockCode}`);
        }
        
        setIsScanning(false);
        setTimeout(() => setScanMessage(null), 3000);
    }, 1800);
  };

  const handleFinish = () => {
    const units = Number(unitsPerBulk) || 1;
    
    const product: SpineProduct = {
        id: existingProduct?.id || `p-${Date.now()}`,
        name,
        bulkUnitName: bulkUnitName || 'Bulk',
        pieceUnitName: pieceUnitName || 'Piece',
        bulkQuantity: existingProduct?.bulkQuantity || 0,
        unitsPerBulk: units,
        pieceQuantity: existingProduct?.pieceQuantity || 0,
        costPricePerPiece: existingProduct?.costPricePerPiece || 0,
        sellingPricePerPiece: Number(sellingPricePerPiece) || 0,
        sellingPricePerBulk: sellingPricePerBulk ? Number(sellingPricePerBulk) : undefined,
        serialNumber,
        category: existingProduct?.category || 'General',
        stockBalances: existingProduct?.stockBalances || [],
        batches: existingProduct?.batches || []
    };
    onSave(product);
  };

  return (
    <div className="fixed inset-0 z-[70] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* Scanning Overlay */}
      {isScanning && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
            <div className="w-64 h-64 border-2 border-white/20 rounded-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-primary shadow-[0_0_15px_#10B981] animate-scan-line" />
                {/* Corner markers */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />
            </div>
            <p className="mt-8 text-white font-black text-xs uppercase tracking-[0.3em] animate-pulse">Scanning Barcode...</p>
            <button onClick={() => setIsScanning(false)} className="mt-12 text-slate-500 font-bold uppercase text-[10px]">Cancel</button>
        </div>
      )}

      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full text-slate-600 dark:text-slate-300">
          <Icon name="close" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-slate-800 dark:text-white">{existingProduct ? 'Edit Product' : 'New Product'}</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-28">
        <div className="flex justify-center gap-6 mb-4">
           <button 
             onClick={handleVoiceToggle}
             className={`size-24 rounded-full flex flex-col items-center justify-center gap-1 transition-all ${
               isVoiceActive ? 'bg-rose-500 scale-110 shadow-lg shadow-rose-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
             }`}
           >
              <Icon name={isVoiceActive ? "graphic_eq" : "mic"} className={isVoiceActive ? "text-white" : "text-3xl"} />
              <span className={`text-[10px] font-bold uppercase ${isVoiceActive ? 'text-white' : ''}`}>{isVoiceActive ? 'Listening...' : 'Voice Entry'}</span>
           </button>

           <button 
             onClick={handleScan}
             disabled={isScanning}
             className={`size-24 rounded-full flex flex-col items-center justify-center gap-1 transition-all ${
               isScanning ? 'bg-primary scale-110 shadow-lg shadow-primary/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
             }`}
           >
              <Icon name={isScanning ? "sync" : "qr_code_scanner"} className={isScanning ? "text-white animate-pulse" : "text-3xl"} />
              <span className={`text-[10px] font-bold uppercase ${isScanning ? 'text-white' : ''}`}>{isScanning ? 'Scanning...' : 'Scan Item'}</span>
           </button>
        </div>

        {scanMessage && (
            <div className="bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold animate-in zoom-in-95 duration-200">
                <Icon name="check_circle" className="text-sm" />
                {scanMessage}
            </div>
        )}

        <section className="space-y-6">
           <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Item Name</label>
             <input 
               type="text" 
               value={name}
               onChange={(e) => setName(e.target.value)}
               placeholder="e.g. Bananas" 
               className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary shadow-sm"
             />
           </div>

           <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Barcode / Serial Number</label>
             <div className="relative">
                <Icon name="qr_code" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="Optional Barcode" 
                  className="w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary shadow-sm"
                />
             </div>
           </div>

           {/* Unit Definition Section */}
           <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 shadow-inner">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-2 rounded-full bg-primary" />
                <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Unit Conversion Setup</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  <StylishDropdown 
                    label="Bulk Unit" 
                    options={BULK_UNITS} 
                    value={bulkUnitName} 
                    onChange={setBulkUnitName} 
                    placeholder="e.g. Bunch" 
                  />
                  <StylishDropdown 
                    label="Retail Unit" 
                    options={RETAIL_UNITS} 
                    value={pieceUnitName} 
                    onChange={setPieceUnitName} 
                    placeholder="e.g. Finger" 
                  />
              </div>

              <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                 <div className="flex-1 text-center">
                    <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase">1 {bulkUnitName || 'Bulk'}</p>
                 </div>
                 <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black">
                    =
                 </div>
                 <div className="flex-1 flex flex-col gap-1 items-center">
                    <div className="relative w-20">
                        <input 
                            type="number" 
                            value={unitsPerBulk}
                            onChange={(e) => setUnitsPerBulk(e.target.value)}
                            className="w-full text-center p-2.5 bg-slate-50 dark:bg-slate-900 border border-primary/20 rounded-xl text-base font-black text-primary outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{pieceUnitName || 'Pieces'}</p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Sell Price / {pieceUnitName}</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₦</span>
                    <input 
                      type="number" 
                      value={sellingPricePerPiece}
                      onChange={(e) => setSellingPricePerPiece(e.target.value)}
                      className="w-full pl-10 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-primary outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Sell Price / {bulkUnitName}</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₦</span>
                    <input 
                      type="number" 
                      value={sellingPricePerBulk}
                      onChange={(e) => setSellingPricePerBulk(e.target.value)}
                      placeholder="Optional"
                      className="w-full pl-10 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-primary outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    />
                </div>
              </div>
           </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 z-50">
        <button 
          onClick={handleFinish}
          className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all"
        >
          {existingProduct ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
      
      <style>{`
        @keyframes scan-line {
            0% { top: 0%; }
            50% { top: 100%; }
            100% { top: 0%; }
        }
        .animate-scan-line {
            animation: scan-line 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
