
import React, { useState, useMemo } from 'react';
import { Collection, Cluster, Investment } from '../types';
import { Icon } from './Icon';
import { CLUSTERS, COLLECTION_UPDATES } from '../constants';
import { ClusterCycleView } from './ClusterCycleView';

interface ClusterDetailsViewProps {
  collection: Collection;
  onBack: () => void;
  onAddInvestment?: (investment: Investment, pMethod: 'wallet' | 'card') => void;
  userBalance: number;
}

export const ClusterDetailsView: React.FC<ClusterDetailsViewProps> = ({ collection, onBack, onAddInvestment, userBalance }) => {
  const collectionClusters = useMemo(() => 
    CLUSTERS.filter(c => c.collectionId === collection.id)
    .sort((a, b) => a.durationDays - b.durationDays),
    [collection.id]
  );
  
  const collectionUpdates = COLLECTION_UPDATES.filter(u => u.collectionId === collection.id);
  
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'updates'>('overview');

  if (selectedCluster) {
    return (
      <ClusterCycleView 
        cluster={selectedCluster} 
        collection={collection} 
        onBack={() => setSelectedCluster(null)} 
        onAddInvestment={onAddInvestment}
        userBalance={userBalance}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right-10 duration-300">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1">
          {collection.name}
        </h1>
        <button className="p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
          <Icon name="bookmark_border" />
        </button>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark">
         <button 
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-slate-400'}`}
         >
            Overview
         </button>
         <button 
            onClick={() => setActiveTab('updates')}
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'updates' ? 'border-primary text-primary' : 'border-transparent text-slate-500 dark:text-slate-400'}`}
         >
            Market Updates
            {collectionUpdates.length > 0 && <span className="ml-2 text-[10px] bg-primary text-white px-1.5 py-0.5 rounded-full">{collectionUpdates.length}</span>}
         </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 bg-slate-50 dark:bg-background-dark">
        
        {activeTab === 'overview' ? (
            <div className="py-6 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-start justify-between">
                    <div className="size-16 rounded-2xl bg-blue-50 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Icon name={collection.iconName} className="text-4xl" />
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{collection.name}</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                        <Icon name="location_on" className="text-lg" />
                        <span>{collection.location}, {collection.country}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Icon name="category" className="text-lg" />
                        <span>{collection.category}</span>
                    </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 shadow-sm">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Up to Return</p>
                    <p className="text-2xl font-bold text-primary">{collection.maxReturn}%</p>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 shadow-sm">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Investors</p>
                    <p className="text-xl font-bold text-slate-800 dark:text-white">{collection.totalInvestors}</p>
                </div>
                </div>

                {/* About Section */}
                <div className="space-y-4 mb-4 bg-white dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700/30">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">About this Collection</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                    {collection.description}
                </p>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <Icon name="verified_user" className="text-emerald-500" />
                    <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Security Type</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{collection.securityType}</p>
                    </div>
                </div>
                </div>

                {/* Standardized Cycles Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Standard Clusters</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 -mt-3 mb-2">Choose your preferred duration to lock in fixed returns.</p>
                    
                    <div className="flex flex-col gap-4">
                        {collectionClusters.map((cluster) => (
                        <div 
                            key={cluster.id}
                            className="rounded-xl p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                        >
                            <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <div className="bg-primary/10 text-primary p-2 rounded-lg group-hover:scale-110 transition-transform">
                                    <Icon name="schedule" />
                                </div>
                                {cluster.status === 'Sold Out' ? (
                                    <div className="px-2 py-1 bg-rose-500/10 text-rose-500 rounded text-[10px] font-black uppercase tracking-widest">Waitlist Open</div>
                                ) : (
                                    <div>
                                        <h4 className="text-base font-bold text-slate-800 dark:text-white">{cluster.durationDays} Days Cycle</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Min. ₦{cluster.minInvestment.toLocaleString()}</p>
                                    </div>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-primary">{cluster.fixedReturn}% Return</p>
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${cluster.status === 'Open' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : cluster.status === 'Sold Out' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'}`}>
                                {cluster.status}
                                </span>
                            </div>
                            </div>

                            <div className="space-y-1.5 mb-4 px-1">
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="text-slate-500 dark:text-slate-400">Pool Progress</span>
                                    <span className="text-slate-800 dark:text-white font-bold">{cluster.fundingProgress}%</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                                    <div 
                                    className="bg-primary h-1.5 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
                                    style={{ width: `${cluster.fundingProgress}%` }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <button 
                                    onClick={() => setSelectedCluster(cluster)}
                                    className="py-2.5 px-4 rounded-lg font-bold text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                >
                                    Details
                                </button>
                                <button 
                                    onClick={() => cluster.status !== 'Sold Out' && setSelectedCluster(cluster)}
                                    disabled={cluster.status === 'Sold Out'}
                                    className="py-2.5 px-4 rounded-lg font-bold text-sm bg-primary text-white shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                                >
                                    {cluster.status === 'Sold Out' ? 'Full' : 'Invest Now'}
                                </button>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        ) : (
            <div className="py-6 flex flex-col gap-6 animate-in fade-in slide-in-from-right-2 duration-300">
                {collectionUpdates.length > 0 ? (
                    collectionUpdates.map((update) => (
                        <div key={update.id} className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700 ml-2">
                             <div className="absolute -left-[9px] top-0 size-4 bg-background-light dark:bg-background-dark border-2 border-primary rounded-full"></div>
                             
                             <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full 
                                        ${update.type === 'news' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' : 
                                          update.type === 'impact' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                          'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400'
                                        }`}
                                    >
                                        {update.type}
                                    </span>
                                    <span className="text-xs text-slate-400">{update.date}</span>
                                </div>
                                
                                <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2">{update.title}</h3>
                                
                                {update.imageUrl && (
                                    <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                                        <img src={update.imageUrl} alt={update.title} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {update.content}
                                </p>
                             </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                            <Icon name="feed" className="text-2xl text-slate-400" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">No updates available yet.</p>
                        <p className="text-xs text-slate-400 max-w-[200px]">We will post news and impact reports here as they happen.</p>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};
