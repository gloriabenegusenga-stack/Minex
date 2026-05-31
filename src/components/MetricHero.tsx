import { Shield, Sparkles, Building2, Earth, Users2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../LanguageContext';

// Using the generated image path from system
const HERO_IMAGE_URL = '/src/assets/images/mining_hero_aerial_1780245368534.png';

interface MetricHeroProps {
  onQuickRoute: (audienceType: 'Investor' | 'Partner' | 'Government') => void;
  onExploreProjects: () => void;
}

export default function MetricHero({ onQuickRoute, onExploreProjects }: MetricHeroProps) {
  const { t } = useLanguage();

  return (
    <section className="relative w-full bg-slate-950 pt-16 pb-20 border-b border-slate-800 overflow-hidden">
      {/* Absolute Cinematic Photo Backdrop */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        <img
          src={HERO_IMAGE_URL}
          alt="MineX Gold, Silver & Bronze Operations Dusk Landscape"
          className="w-full h-full object-cover object-left md:object-right filter opacity-45 select-none"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-0 border border-slate-800 bg-slate-900/20">
        {/* Value Proposition Statement */}
        <div className="lg:col-span-7 p-8 md:p-16 flex flex-col justify-center border-r border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 space-y-6">
          <div className="self-start inline-flex items-center gap-2 px-3 py-1 bg-slate-900/90 border border-slate-850 rounded-none">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span className="text-[10px] md:text-xs font-mono font-bold tracking-widest text-amber-500 uppercase">
              TIER-ONE JURISDICTIONS • SECURE OFFTAKE
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black uppercase leading-[0.9] tracking-tighter text-slate-100">
            {t('heroTitlePre')}<br />
            <span className="text-slate-500">{t('heroTitlePost')}</span>
          </h2>

          <p className="text-slate-400 text-sm md:text-base max-w-xl font-light leading-relaxed">
            {t('heroSubtitle')}
          </p>

          <div className="flex flex-wrap gap-4 pt-3">
            <button
              onClick={onExploreProjects}
              className="cursor-pointer bg-amber-500 hover:bg-amber-400 text-slate-900 px-10 py-4 font-black uppercase text-xs tracking-widest rounded-none transition-all duration-300"
            >
              {t('exploreProjectsButton')}
            </button>
            <button
              onClick={() => onQuickRoute('Partner')}
              className="cursor-pointer border border-slate-700 hover:border-slate-500 px-10 py-4 font-black uppercase text-xs tracking-widest rounded-none transition-all duration-300 bg-slate-900/30 text-white"
            >
              {t('submitSpecSheets')}
            </button>
          </div>
        </div>

        {/* Persona Curated Target Grid */}
        <div className="lg:col-span-5 bg-slate-900/50 p-8 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-slate-500 text-[10px] font-mono tracking-[0.2em] uppercase font-bold mb-4">
              [ SELECT YOUR GATEWAY TO QUALIFY ]
            </h3>
            <p className="text-slate-400 text-xs font-light leading-relaxed">
              Skip traditional research loops. Select your exact stakeholder persona below to access custom metrics, download gates, or submit compliance credentials.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                type: 'Investor' as const,
                title: t('investorPortal'),
                desc: t('verifyRegistry'),
                icon: Building2,
              },
              {
                type: 'Partner' as const,
                title: t('partnerPortal'),
                desc: t('submitSpecSheets'),
                icon: Earth,
              },
              {
                type: 'Government' as const,
                title: t('governmentPortal'),
                desc: t('inspectEsgPiles'),
                icon: Users2,
              },
            ].map((persona) => {
              const IconComp = persona.icon;
              return (
                <button
                  key={persona.type}
                  onClick={() => onQuickRoute(persona.type)}
                  className="w-full text-left p-3.5 bg-slate-950/65 hover:bg-slate-900/80 border border-slate-800 hover:border-amber-500 rounded-none transition-all duration-200 cursor-pointer group flex gap-3.5 items-start"
                >
                  <div className="p-2.5 bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-amber-500 rounded-none transition-colors flex items-center justify-center self-center">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-slate-150 font-bold text-xs group-hover:text-amber-500 transition-colors uppercase tracking-wider font-mono">
                      {persona.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-light mt-0.5 leading-snug">
                      {persona.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Critical Mining Analytical Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-16">
        <div className="border-t border-slate-800 pt-8">
          <h3 className="text-slate-500 text-[10px] font-mono tracking-[0.2em] uppercase font-bold mb-6">
            {t('esgIndicatorsTitle')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 bg-slate-900/30 border border-slate-800 relative shadow-none">
            {[
              { label: 'PROV. RES.', value: '22.4M oz', desc: 'Au Eq. Consolidated' },
              { label: 'AVG MINE LIFE', value: '22.5 Yrs', desc: 'Across All Assets' },
              { label: 'JURISDICTIONS', value: 'Canada/Aus', desc: '100% Democratic Stable' },
              { label: 'LTI ACCIDENT RATE', value: '0.12', desc: '88% Below Industry Avg' },
              { label: 'TOTAL CAPEX NPV', value: '$5.19B', desc: 'Net Asset Value Proved' },
            ].map((st, i) => (
              <div 
                key={i} 
                className={`p-6 text-center md:text-left ${
                  i < 4 ? 'border-r border-slate-800' : ''
                }`}
              >
                <span className="text-[10px] font-mono tracking-[0.2em] text-slate-500 font-bold uppercase block mb-1">
                  {st.label}
                </span>
                <p className={`text-2xl md:text-4xl font-black font-sans leading-none mt-2 ${i % 2 === 0 ? 'text-amber-500' : 'text-slate-100'}`}>
                  {st.value}
                </p>
                <p className="text-[10px] text-slate-400 font-semibold uppercase mt-2.5 tracking-wider leading-tight">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
