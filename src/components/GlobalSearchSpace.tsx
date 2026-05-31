import React, { useState, useMemo } from 'react';
import { 
  Search, Globe, FileText, Newspaper, MapPin, Database, Gem, Ship, 
  ArrowRight, Sparkles, Filter, Info, Lock, Unlock, Zap, Shield, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../LanguageContext';
import { useAuth } from '../AuthContext';
import { projectsData, technicalDocsData, newsData, stonesSoldData } from '../data';

interface SearchResultItem {
  id: string;
  category: 'concessions' | 'documents' | 'newsroom' | 'assets' | 'trade';
  categoryLabel: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string; // 'emerald', 'amber', 'cyan', 'rose', 'slate'
  description: string;
  targetTab: 'projects' | 'library' | 'news' | 'stones' | 'trade' | 'operations';
  metrics: { label: string; value: string }[];
  actionText: string;
  isGated?: boolean;
}

interface GlobalSearchSpaceProps {
  setActiveTab: (tab: string) => void;
  onUnlockDoc: (docName: string) => void;
}

export default function GlobalSearchSpace({ setActiveTab, onUnlockDoc }: GlobalSearchSpaceProps) {
  const { language, t } = useLanguage();
  const { user, openLoginModal } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [isFocused, setIsFocused] = useState(false);

  // Dynamic search recommendations for easy interaction
  const searchRecommendations = [
    { label: 'Gold Reserves', query: 'Gold' },
    { label: 'NI 43-101', query: 'NI 43-101' },
    { label: 'Atacama DLE', query: 'Atacama' },
    { label: 'Flawless Diamond', query: 'Diamond' },
    { label: 'Offtake Deal', query: 'Offtake' },
    { label: 'LTI Safety', query: 'LTI' }
  ];

  // Map existing static datasets into normalized indexable database
  const searchDatabase = useMemo<SearchResultItem[]>(() => {
    const items: SearchResultItem[] = [];

    // 1. Projects Data
    projectsData.forEach(p => {
      items.push({
        id: p.id,
        category: 'concessions',
        categoryLabel: 'Mining Concession',
        title: p.name,
        subtitle: p.location,
        badge: `${p.type} • ${p.phase}`,
        badgeColor: p.type === 'Gold' ? 'amber' : p.type === 'Copper' ? 'emerald' : 'cyan',
        description: p.description,
        targetTab: 'projects',
        metrics: [
          { label: 'Grade Profile', value: p.grade },
          { label: 'Net Reserves', value: p.tonnage },
          { label: 'Estimated NPV', value: p.npv }
        ],
        actionText: 'Inspect Geological Model'
      });
    });

    // 2. Technical Documents Data
    technicalDocsData.forEach(doc => {
      items.push({
        id: doc.id,
        category: 'documents',
        categoryLabel: 'Technical Library Document',
        title: doc.title,
        subtitle: `Published: ${doc.date} • ${doc.size}`,
        badge: doc.type,
        badgeColor: 'slate',
        description: `Official publication regarding consolidated mineral assays or operational audits under standard OECD security protocols.`,
        targetTab: 'library',
        metrics: [
          { label: 'Pub Date', value: doc.date },
          { label: 'File Capacity', value: doc.size },
          { label: 'Sovereign Clearance', value: doc.isLocked ? 'Gated Asset' : 'Public Access' }
        ],
        actionText: doc.isLocked ? 'Inquire and Unlock Gated Doc' : 'Download Assay Archive',
        isGated: doc.isLocked
      });
    });

    // 3. News Articles Data
    newsData.forEach(n => {
      items.push({
        id: n.id,
        category: 'newsroom',
        categoryLabel: 'Corporate News & Announcement',
        title: n.title,
        subtitle: `${n.date} • Authored by Executive Desk`,
        badge: n.category,
        badgeColor: n.category === 'ESG' ? 'emerald' : n.category === 'Exploration' ? 'amber' : 'cyan',
        description: n.summary + " " + n.content.slice(0, 100) + "...",
        targetTab: 'news',
        metrics: [
          { label: 'Category', value: n.category },
          { label: 'Reading Estimate', value: n.readTime },
          { label: 'Release stamp', value: n.date }
        ],
        actionText: 'Review Full Press Release'
      });
    });

    // 4. Precious Stone & Mineral Sales Assets
    stonesSoldData.forEach(s => {
      items.push({
        id: s.id,
        category: 'assets',
        categoryLabel: 'Precious Specimen Inventory',
        title: s.name,
        subtitle: `Extracted from: ${s.site}`,
        badge: `${s.grade}`,
        badgeColor: 'amber',
        description: `Authenticated high-purity gem/metal lot under sovereign escrow. Carats / size specs: ${s.size}. Shape configuration: ${s.shape}.`,
        targetTab: 'stones',
        metrics: [
          { label: 'Lot Value (USD)', value: `$${(s.totalCost / 1000).toFixed(0)}k` },
          { label: 'Consigned Qty', value: `${s.quantitySold} units` },
          { label: 'Ecosystem Phase', value: s.year }
        ],
        actionText: 'Inspect Stones ledger stream'
      });
    });

    // 5. Global Trade Desk Sourcing & Cargo Concepts
    items.push({
      id: 'trade-fob-bulk',
      category: 'trade',
      categoryLabel: 'Maritime Trade Route',
      title: 'Copper Anode Docks & Transatlantic Transport Corridor',
      subtitle: 'Queensland Site to Rotterdam metallurgical Smelter Gateways',
      badge: 'CIF Bulk Freight',
      badgeColor: 'cyan',
      description: 'Active international shipment lines carrying over 45,000 WMT of copper concentrate and lithium crystals. Real-time ETA coordinates are cross-checked via Lloyd’s marine registries.',
      targetTab: 'trade',
      metrics: [
        { label: 'Standard Code', value: 'MINEX-CIF-ROT' },
        { label: 'Current Coverage', value: '$250M Lloyd’s Underwriting' },
        { label: 'Primary Vessel', value: 'M.V. Crest Pioneer' }
      ],
      actionText: 'Manage Trade Desk Logistics'
    });

    items.push({
      id: 'trade-loader-fleet',
      category: 'trade',
      categoryLabel: 'Sourced Machinery Import',
      title: 'Solid-State Battery Loader Fleet procurement',
      subtitle: 'Sourced from Siemens Industrial AG (Germany)',
      badge: 'Bespoke Import',
      badgeColor: 'amber',
      description: 'Zero-emission electric loaders engineered for Aura Deepfields underground extraction shifts. Covered under preferential trade contracts with strategic European partners plus CBAM carbon offsets.',
      targetTab: 'trade',
      metrics: [
        { label: 'Inbound Target', value: 'Aura Deepfields Mine' },
        { label: 'Piece Value', value: '$850,000 unit base' },
        { label: 'Customs Clearance', value: 'Pre-Approved' }
      ],
      actionText: 'Audit Import Sourcing Bill'
    });

    return items;
  }, []);

  // Filter items matching query and category selector
  const filteredResults = useMemo(() => {
    let list = searchDatabase;

    // Filter by type tab
    if (activeCategoryFilter !== 'all') {
      list = list.filter(item => item.category === activeCategoryFilter);
    }

    // Filter by text search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(item => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.categoryLabel.toLowerCase().includes(q) ||
          item.metrics.some(m => m.label.toLowerCase().includes(q) || m.value.toLowerCase().includes(q))
        );
      });
    }

    return list;
  }, [searchDatabase, searchQuery, activeCategoryFilter]);

  // Handle direct navigation or gating trigger
  const handleResultAction = (item: SearchResultItem) => {
    if (item.isGated && !user) {
      onUnlockDoc(item.title);
    } else {
      setActiveTab(item.targetTab);
      // Optional: scroll target panel to view
      setTimeout(() => {
        let elementId = '';
        if (item.targetTab === 'projects') elementId = 'prospectus-section';
        else if (item.targetTab === 'library') elementId = 'technical-library';
        else if (item.targetTab === 'stones') elementId = 'stones-tracker';
        else if (item.targetTab === 'trade') elementId = 'trade-operations-grid';
        
        if (elementId) {
          const el = document.getElementById(elementId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <div className="w-full bg-slate-900/20 border-b border-slate-800/80 py-12 text-left" id="global-search-space">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">
        
        {/* Search header container */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[9px] font-mono font-black tracking-widest text-amber-500 bg-slate-900 border border-slate-800 px-2.5 py-1 uppercase rounded-none">
              <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
              <span>Sovereign Intelligence Desk</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black font-sans uppercase tracking-tight text-white">
              Resource Search & Deep Discovery Index
            </h2>
            <p className="text-xs text-slate-400 font-light max-w-xl">
              Query metallurgical core samples, OECD concession limits, custom cargo vessel routes, and regulatory NI 43-101 publications instantly.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 bg-slate-900/60 p-2 border border-slate-850 self-start md:self-auto">
            <span>INDEX RECONCILED:</span>
            <span className="text-emerald-500 font-bold">100% REALTIME ACCURATE</span>
          </div>
        </div>

        {/* Big Premium Search Entry Console */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 relative">
          <div className="relative flex items-center">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
              <Search className={`w-5 h-5 transition-colors ${isFocused ? 'text-amber-500' : 'text-slate-500'}`} />
            </div>

            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Type to search e.g. Gold Reserve, NI 43-101, Diamond, Rotterdam cargo..."
              className="w-full bg-slate-950 border border-slate-850 pl-12 pr-10 py-3.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 font-mono font-black uppercase rounded-none transition-all tracking-wider"
            />

            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-[9px] font-mono font-bold text-slate-500 hover:text-white transition-colors uppercase bg-slate-900 hover:bg-slate-850 border border-slate-800 px-2 py-1 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Recommendations Tags */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[9px] font-mono text-slate-500 leading-none">
            <span className="uppercase font-bold text-slate-600 mr-1.5 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" /> Hot Targets:
            </span>
            {searchRecommendations.map((rec) => (
              <button
                key={rec.label}
                onClick={() => setSearchQuery(rec.query)}
                className="px-2.5 py-1 bg-slate-950 border border-slate-850 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer rounded-none"
              >
                #{rec.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Filters and Statistics Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex flex-wrap items-center gap-1 text-[10px] uppercase tracking-widest font-mono font-bold">
            {[
              { id: 'all', label: 'All Fields', icon: Globe },
              { id: 'concessions', label: 'Deposit Sites', icon: MapPin },
              { id: 'documents', label: 'Technical Docs', icon: FileText },
              { id: 'newsroom', label: 'News Updates', icon: Newspaper },
              { id: 'assets', label: 'Gems & Assets', icon: Gem },
              { id: 'trade', label: 'Trade Desk', icon: Ship }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategoryFilter(tab.id)}
                  className={`px-3 py-2 border transition-all cursor-pointer flex items-center gap-1.5 rounded-none ${
                    activeCategoryFilter === tab.id
                      ? 'bg-slate-900 border-amber-500 text-amber-500 font-extrabold'
                      : 'bg-slate-950 border-slate-850/80 text-slate-400 hover:text-white hover:border-slate-750'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[10px] font-mono text-slate-400 font-semibold self-start md:self-auto bg-slate-900 px-3 py-1 border border-slate-850">
            Filtered matches: <strong className="text-white">{filteredResults.length}</strong> / {searchDatabase.length} entries
          </div>
        </div>

        {/* Real-time reactive query outputs list (using modern flex & grids) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredResults.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                key={item.id}
                className="bg-slate-950 border border-slate-850 p-4 flex flex-col justify-between hover:border-slate-700 transition-colors group text-left"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pointer-events-none">
                    <span className="text-[9px] font-mono font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
                      {item.category === 'concessions' && <MapPin className="w-3 h-3 text-cyan-500" />}
                      {item.category === 'documents' && <FileText className="w-3 h-3 text-amber-500" />}
                      {item.category === 'newsroom' && <Newspaper className="w-3 h-3 text-emerald-500" />}
                      {item.category === 'assets' && <Gem className="w-3 h-3 text-purple-400" />}
                      {item.category === 'trade' && <Ship className="w-3 h-3 text-blue-400" />}
                      <span>{item.categoryLabel}</span>
                    </span>

                    <span className={`text-[8.5px] font-mono font-extrabold uppercase px-2 py-0.5 border ${
                      item.badgeColor === 'amber' ? 'border-amber-900/60 bg-amber-950/20 text-amber-400' :
                      item.badgeColor === 'emerald' ? 'border-emerald-900/60 bg-emerald-950/20 text-emerald-400' :
                      item.badgeColor === 'cyan' ? 'border-cyan-900/60 bg-cyan-950/20 text-cyan-400' :
                      'border-slate-800 bg-slate-900 text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase tracking-tight text-white group-hover:text-amber-500 transition-colors font-sans">
                      {item.title}
                    </h3>
                    <p className="text-[9.5px] text-slate-500 font-mono italic leading-none">{item.subtitle}</p>
                  </div>

                  <p className="text-[11px] text-slate-400 font-light leading-relaxed font-sans mt-1">
                    {item.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 bg-slate-900/60 p-2.5 border border-slate-900 rounded-none font-mono text-[9px] leading-tight text-slate-400 mt-2">
                    {item.metrics.map((met, mi) => (
                      <div key={mi} className="space-y-0.5">
                        <span className="text-[8px] text-slate-600 uppercase font-black tracking-wider block font-sans">{met.label}</span>
                        <span className="text-slate-200 font-black truncate block">{met.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center text-[10px] font-mono tracking-wider">
                  <span className="text-[9px] text-slate-600 font-semibold uppercase">ID: {item.id}</span>
                  <button
                    onClick={() => handleResultAction(item)}
                    className="cursor-pointer text-amber-500 hover:text-amber-400 font-black uppercase flex items-center gap-1 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 transition-colors text-[9px]"
                  >
                    {item.isGated && !user ? (
                      <>
                        <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>Unlock Document</span>
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-3 h-3 shrink-0" />
                        <span>{item.actionText}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredResults.length === 0 && (
            <div className="md:col-span-2 bg-slate-950 border border-slate-850/60 border-dashed p-10 flex flex-col items-center justify-center text-center">
              <HelpCircle className="w-8 h-8 text-slate-700 mb-2 animate-pulse" />
              <p className="text-xs uppercase font-mono font-black text-slate-400 mb-1">Zero search results matched</p>
              <p className="text-[10px] text-slate-600 max-w-sm font-sans leading-relaxed">
                Could not find any concessions, mineral core parameters, logistics vessels, or geological reports matching "{searchQuery}". Try searching for shorter terms like "Gold", "Assay", "Lithium", or "Rotterdam".
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
