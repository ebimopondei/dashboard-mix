
import React, { useState } from 'react';
import { Icon } from './Icon';

interface LearnViewProps {
  onBack: () => void;
}

const CATEGORIES = ["All", "Basics", "Strategies", "Risk", "Platform"];

const ARTICLES = [
    {
        id: 1,
        title: "Understanding Inventory Backed Securities",
        category: "Strategies",
        duration: "5 min read",
        type: "article",
        image: "https://picsum.photos/seed/inventory/400/200",
        description: "Learn how tangible assets secure your investments and mitigate risk in emerging markets."
    },
    {
        id: 2,
        title: "How are Returns Calculated?",
        category: "Basics",
        duration: "3 min read",
        type: "article",
        image: "https://picsum.photos/seed/apy/400/200",
        description: "A deep dive into fixed percentage returns and how they apply to each investment cycle."
    },
    {
        id: 3,
        title: "Diversifying Across Africa",
        category: "Strategies",
        duration: "8 min video",
        type: "video",
        image: "https://picsum.photos/seed/africa/400/200",
        description: "Why spreading capital across different regions like Kenya and Nigeria boosts stability."
    },
    {
        id: 4,
        title: "Risk Management 101",
        category: "Risk",
        duration: "12 min video",
        type: "video",
        image: "https://picsum.photos/seed/risk/400/200",
        description: "Essential tips for new investors to protect their capital while maximizing returns."
    },
    {
        id: 5,
        title: "Platform Walkthrough",
        category: "Platform",
        duration: "4 min read",
        type: "article",
        image: "https://picsum.photos/seed/platform/400/200",
        description: "A step-by-step guide to making your first deposit and investment."
    }
];

export const LearnView: React.FC<LearnViewProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredArticles = activeCategory === "All" 
    ? ARTICLES 
    : ARTICLES.filter(a => a.category === activeCategory);

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
          Learning Hub
        </h1>
        <button className="p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
          <Icon name="bookmark_border" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pb-20">
        {/* Hero Section */}
        <div className="p-4">
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 shadow-lg group cursor-pointer">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-60 transition-opacity group-hover:opacity-40"
                    style={{ backgroundImage: `url("https://picsum.photos/seed/hero/800/450")` }}
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <span className="inline-block px-2 py-1 rounded bg-primary text-white text-[10px] font-bold uppercase tracking-wider w-fit mb-2">Featured Course</span>
                    <h2 className="text-2xl font-bold text-white mb-1">Mastering Market Cycles</h2>
                    <div className="flex items-center gap-2 text-slate-300 text-xs">
                        <Icon name="play_circle" className="text-lg" />
                        <span>15 min video • Beginner</span>
                    </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 duration-300">
                    <Icon name="play_arrow" className="text-3xl" />
                </div>
            </div>
        </div>

        {/* Categories */}
        <div className="px-4 pb-2 overflow-x-auto no-scrollbar">
            <div className="flex gap-2">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors border ${
                            activeCategory === cat
                                ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 border-slate-800 dark:border-white'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        {/* Content List */}
        <div className="p-4 space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white px-1">Latest Updates</h3>
            
            {filteredArticles.map((article) => (
                <div 
                    key={article.id}
                    className="flex gap-4 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group"
                >
                    <div className="relative size-24 rounded-lg overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-700">
                         <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                         {article.type === 'video' && (
                             <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                 <Icon name="play_circle" className="text-white text-2xl" />
                             </div>
                         )}
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold text-primary uppercase">{article.category}</span>
                                <span className="text-[10px] text-slate-400">• {article.duration}</span>
                            </div>
                            <h4 className="font-bold text-slate-800 dark:text-white text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                {article.title}
                            </h4>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                            {article.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>

        {/* Daily Tip */}
        <div className="mx-4 mt-2 p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white shadow-lg relative overflow-hidden">
             <div className="absolute -right-4 -top-4 size-24 bg-white/10 rounded-full blur-2xl"></div>
             <div className="relative z-10 flex gap-4">
                 <div className="size-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shrink-0">
                     <Icon name="lightbulb" className="text-yellow-300" />
                 </div>
                 <div>
                     <h4 className="font-bold text-sm mb-1">Did you know?</h4>
                     <p className="text-xs text-blue-100 leading-relaxed">
                         Reinvesting your earnings (compound interest) can increase your total returns by up to 20% over a 2-year period compared to withdrawing profits.
                     </p>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
};
