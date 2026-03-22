import React, { useState } from 'react';
import { Icon } from './Icon';
// Updated to use SpineProduct as KokoroProduct alias
import { SpineProduct as KokoroProduct, ViewType } from '../types';

interface KokoroInventoryViewProps {
  products: KokoroProduct[];
  onNavigate: (view: ViewType, id?: string) => void;
  onBack: () => void;
}

export const KokoroInventoryView: React.FC<KokoroInventoryViewProps> = ({ products, onNavigate, onBack }) => {
  const [search, setSearch] = useState('');
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1">My Stock</h1>
        {/* Updated KOKORO_ADD_PRODUCT to SPINE_ADD_PRODUCT */}
        <button onClick={() => onNavigate(ViewType.SPINE_ADD_PRODUCT)} className="size-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
          <Icon name="add" />
        </button>
      </header>

      <div className="p-4">
        <div className="relative">
          <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Find an item..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-10">
        {filteredProducts.map(product => {
          const isLow = product.pieceQuantity < 10 && product.bulkQuantity === 0;
          return (
            <div 
              key={product.id}
              // Updated KOKORO_PRODUCT_DETAIL to SPINE_PRODUCT_DETAIL
              onClick={() => onNavigate(ViewType.SPINE_PRODUCT_DETAIL, product.id)}
              className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4 active:bg-slate-50 transition-colors"
            >
              <div className={`size-14 rounded-2xl flex items-center justify-center shadow-inner ${isLow ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                <Icon name="inventory" className="text-2xl" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-800 dark:text-white">{product.name}</h3>
                  <span className="font-bold text-primary">₦{product.sellingPricePerPiece}</span>
                </div>
                
                <div className="flex gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Bulk:</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-white">{product.bulkQuantity}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Pieces:</span>
                    <span className={`text-sm font-bold ${isLow ? 'text-amber-600' : 'text-slate-800 dark:text-white'}`}>{product.pieceQuantity}</span>
                  </div>
                </div>
              </div>
              
              <Icon name="chevron_right" className="text-slate-300" />
            </div>
          );
        })}
        
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Icon name="inventory_2" className="text-4xl" />
            </div>
            <p className="text-slate-500 font-bold">No items matching "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
};