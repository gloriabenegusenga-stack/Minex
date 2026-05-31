import { useState, useEffect } from 'react';
import { Shield, ChevronRight, TrendingUp, TrendingDown, Hammer, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { mineralPrices } from '../data';
import { useLanguage } from '../LanguageContext';
import { useAuth } from '../AuthContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRequestAssistance: () => void;
}

export default function Header({ activeTab, setActiveTab, onRequestAssistance }: HeaderProps) {
  const [prices, setPrices] = useState(mineralPrices);
  const { language, setLanguage, t } = useLanguage();
  const { user, openLoginModal, logout } = useAuth();

  // Simulate minor real-time mineral pricing fluxes to showcase analytic capability
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prevPrices) =>
        prevPrices.map((item) => {
          const percentage = (Math.random() * 0.16 - 0.08); // small offset
          const newPrice = Number((item.price * (1 + percentage / 100)).toFixed(2));
          const netChange = Number((item.change + percentage).toFixed(2));
          return {
            ...item,
            price: newPrice,
            change: netChange,
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 text-slate-100 sticky top-0 z-50">
      {/* Dynamic pricing ticker bar */}
      <div className="w-full bg-slate-900/60 text-xs py-2 px-4 overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px] uppercase tracking-wider font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>{t('liveIndex')}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            {prices.map((m) => (
              <div key={m.symbol} className="flex items-center gap-1.5 font-medium">
                <span className="text-slate-100">{m.name}</span>
                <span className="text-amber-500 font-semibold">${m.price.toLocaleString()}</span>
                <span className="text-[10px] select-none font-mono flex items-center">
                  {m.change >= 0 ? (
                    <span className="text-emerald-500 flex items-center font-bold">
                      <TrendingUp className="w-3 h-3 mr-0.5" />+{m.change}%
                    </span>
                  ) : (
                    <span className="text-rose-500 flex items-center font-semibold">
                      <TrendingDown className="w-3 h-3 mr-0.5" />{m.change}%
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-slate-500 mr-0.5">/{m.unit}</span>
              </div>
            ))}
          </div>
          <button 
            onClick={onRequestAssistance}
            className="hidden md:flex items-center gap-1 text-[10px] text-amber-500/90 hover:text-amber-400 transition-all cursor-pointer font-bold duration-200"
          >
            <span>{t('qualifyAccess')}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
        <div id="company-logo" className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setActiveTab('home')}>
          <div className="w-8 h-8 bg-amber-500 rounded-sm flex items-center justify-center font-bold text-slate-950 italic">
            V
          </div>
          <div>
            <h1 className="text-sm md:text-md font-black tracking-tighter uppercase text-slate-100 font-sans leading-none">
              {t('companyTitle')}
            </h1>
            <p className="text-[8px] text-slate-500 mt-0.5 tracking-[0.2em] font-mono leading-none uppercase">
              {t('companySubtitle')}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Link Toggles */}
        <nav className="hidden lg:flex items-center gap-1">
          {[
            { id: 'home', label: t('overview') },
            { id: 'operations', label: t('liveMap') },
            { id: 'projects', label: t('resourceProjects') },
            { id: 'stones', label: t('stonesTab') },
            { id: 'trade', label: t('tradeTab') },
            { id: 'esg', label: t('esgSafety') },
            { id: 'library', label: t('geologicalLibrary') },
            { id: 'news', label: t('investorRelations') }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-none cursor-pointer ${
                activeTab === tab.id
                  ? 'text-amber-500 border-b border-amber-500 bg-transparent'
                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-900/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Elegant 11-Language Selector Dropdown */}
          <div className="relative flex items-center font-mono border border-slate-800 bg-slate-900 px-2 py-1.5 focus-within:border-amber-500/50">
            <span className="text-[9px] text-slate-500 mr-1.5 uppercase font-black">LANG:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent text-[10px] text-slate-200 uppercase font-black tracking-wider focus:outline-none cursor-pointer border-none p-0 pr-4 appearance-none font-mono"
            >
              <option value="en" className="bg-slate-950 text-slate-200">EN</option>
              <option value="fr" className="bg-slate-950 text-slate-200">FR</option>
              <option value="rw" className="bg-slate-950 text-slate-200">RW</option>
              <option value="es" className="bg-slate-950 text-slate-200">ES</option>
              <option value="zh" className="bg-slate-950 text-slate-200">ZH</option>
              <option value="de" className="bg-slate-950 text-slate-200">DE</option>
              <option value="hi" className="bg-slate-950 text-slate-200">HI</option>
              <option value="ar" className="bg-slate-950 text-slate-200">AR</option>
              <option value="pt" className="bg-slate-950 text-slate-200">PT</option>
              <option value="ja" className="bg-slate-950 text-slate-200">JA</option>
              <option value="ru" className="bg-slate-950 text-slate-200">RU</option>
            </select>
            <div className="pointer-events-none absolute right-2 flex items-center text-amber-500 text-[8px]">
              ▼
            </div>
          </div>

          {/* Global Stakeholder Sign In Actions */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right font-mono text-[9px] leading-tight text-slate-400 border border-slate-800 p-1.5 bg-slate-900 px-2.5">
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  {user.flag} {user.email.split('@')[0]}
                </span>
                <span className="text-slate-500 mt-0.5 text-[8px]">{user.phone}</span>
                {localStorage.getItem('minex_login_paid') === 'true' && (
                  <span className="text-[7.5px] text-amber-500 font-black uppercase tracking-widest mt-1">
                    {localStorage.getItem('minex_login_paid_plan') === 'one-time' ? '✔ Escrow Verified' : '★ $200/mo Subscriber'}
                  </span>
                )}
              </div>
              <button
                onClick={logout}
                title="Sign Out Sovereign Session"
                className="cursor-pointer p-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-red-900 hover:text-red-400 transition-all text-slate-400 flex items-center justify-center rounded-none"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="cursor-pointer text-[10px] font-mono font-black uppercase tracking-wider px-3.5 py-2.5 bg-slate-900 hover:bg-slate-850 hover:text-amber-400 transition-all text-slate-300 border border-slate-800 flex items-center gap-1.5 rounded-none"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">SIGN IN</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('contact')}
            className={`cursor-pointer text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-none border transition-all duration-300 ${
              activeTab === 'contact'
                ? 'bg-amber-500 text-slate-950 border-amber-500 text-xs font-black'
                : 'border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-slate-950'
            }`}
          >
            {t('inquireTerminal')}
          </button>
        </div>
      </div>
    </header>
  );
}
