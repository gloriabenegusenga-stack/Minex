import { useState } from 'react';
import { Leaf, Award, ShieldAlert, Heart, Calendar, Zap, Trash2, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../LanguageContext';

export default function ESGdashboard() {
  const [activeSubTab, setActiveSubTab] = useState<'carbon' | 'water' | 'community' | 'safety'>('carbon');
  const [sliderYear, setSliderYear] = useState<number>(2026);
  const { t } = useLanguage();

  // Carbon trajectory data
  const carbonData: Record<number, { emissions: number; offset: number; electricFleet: number; desc: string }> = {
    2022: { emissions: 145, offset: 12, electricFleet: 10, desc: 'Diesel heavy drills baseline established at consolidated assets.' },
    2024: { emissions: 110, offset: 25, electricFleet: 45, desc: 'Began complete underground loader conversions at Aura Deepfields.' },
    2026: { emissions: 75, offset: 48, electricFleet: 75, desc: 'Current level: Queensland rail corridor coupled to regional 200MW solar grid.' },
    2028: { emissions: 40, offset: 70, electricFleet: 90, desc: 'Target: Finalizing green-hydrogen boiler systems at copper concentrators.' },
    2030: { emissions: 0, offset: 100, electricFleet: 100, desc: 'Full Scope 1 & 2 Net Zero achieved across global operation assets.' }
  };

  const selectedYearData = carbonData[sliderYear] || carbonData[2026];

  const safetyLogs = [
    { site: 'Aura Deepfields (Canada)', hours: '1.24M Hours', state: 'Zero Recordable incidents', lti: 0.00 },
    { site: 'Copper Crest (Australia)', hours: '1.10M Hours', state: '1 minor incident (Immediate resolve)', lti: 0.18 },
    { site: 'Sol Salar DLE (Chile)', hours: '860k Hours', state: 'Zero Recordable incidents', lti: 0.00 }
  ];

  return (
    <section id="esg-safety" className="w-full bg-slate-950 py-20 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-amber-500 uppercase mb-3">
            <Leaf className="w-4 h-4 text-emerald-555" />
            <span>{t('esgSubtitle')}</span>
          </div>
          <h2 className="text-3xl font-black uppercase text-white tracking-tighter leading-none mb-3">
            {t('esgTitle')} <span className="text-slate-500 font-black">{t('esgTitlePost')}</span>
          </h2>
          <p className="text-slate-400 text-xs md:text-sm font-light mt-2 leading-relaxed">
            {t('esgDesc')}
          </p>
        </div>

        {/* Dynamic Nested ESG Nav Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 bg-slate-900/60 p-1.5 rounded-none border border-slate-800 max-w-lg mx-auto">
          {[
            { id: 'carbon', label: t('carbonScope1'), color: 'text-emerald-400' },
            { id: 'water', label: t('aquiferSafetyLabel'), color: 'text-blue-400' },
            { id: 'community', label: t('partnerPortal'), color: 'text-purple-400' },
            { id: 'safety', label: t('injuryFreeTitle'), color: 'text-amber-500' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`cursor-pointer flex-1 py-3 px-1.5 text-[11px] leading-tight font-semibold rounded-none transition-all duration-200 ${
                activeSubTab === tab.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-none'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Board views */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-none p-6 md:p-8 shadow-none text-left">
          {/* TAB 1: CARBON TIMELINE SLIDER */}
          {activeSubTab === 'carbon' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <div className="bg-slate-950 text-amber-500 inline-flex items-center gap-1.5 px-3 py-1 rounded-none border border-slate-800 text-xs font-mono font-bold">
                  <Zap className="w-3.5 h-3.5" />
                  <span>GROUP SCOPE 1 & 2 CARBON STRATEGY</span>
                </div>
                <h3 className="text-2xl font-black uppercase text-slate-100">
                  Decarbonizing Mining Infrastructure at Scale
                </h3>
                <p className="text-slate-400 text-xs md:text-sm font-light leading-relaxed">
                  We maintain a rigorous path toward absolute decarbonization by eliminating subterranean diesel usage, deploying dedicated high-capacity solar systems, and securing certified carbon offsets.
                </p>

                {/* Simulated dynamic slider parameters based on chosen year */}
                <div className="space-y-4 pt-3">
                  <div className="bg-slate-950 p-6 rounded-none border border-slate-800 space-y-3">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                      Target Metrics for Slider Year {sliderYear}
                    </span>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase">CO2 EMISSIONS index</span>
                        <p className="text-amber-500 text-xl font-black font-mono mt-1">{selectedYearData.emissions}k t CO₂e</p>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase">ELECTRIC FLEET RATIO</span>
                        <p className="text-slate-100 text-xl font-black font-mono mt-1">{selectedYearData.electricFleet}% Electric</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 italic border-l-2 border-amber-500 pl-3 mt-3 leading-relaxed font-sans">
                      "{selectedYearData.desc}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Slide Graphic */}
              <div className="lg:col-span-7 bg-slate-950 p-6 md:p-8 rounded-none border border-slate-800 space-y-8">
                <div>
                  <label className="text-slate-100 text-xs font-mono uppercase tracking-widest flex justify-between">
                    <span>Slide timeline to monitor carbon changes:</span>
                    <span className="text-amber-500 font-black">{sliderYear} Fiscal Year</span>
                  </label>
                  <input
                    type="range"
                    min="2022"
                    max="2030"
                    step="2"
                    value={sliderYear}
                    onChange={(e) => setSliderYear(Number(e.target.value))}
                    className="w-full mt-4 accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-3">
                    <span>2022 (Baseline)</span>
                    <span>2024</span>
                    <span>2026 (Live)</span>
                    <span>2028</span>
                    <span>2030 (Net Zero)</span>
                  </div>
                </div>

                {/* Animated Trend graph representing CO2 reductions using simple SVGs */}
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-3">Group Emissions Trajectory vs Target Goal</span>
                  <div className="h-32 w-full flex items-end">
                    <svg className="w-full h-full text-amber-500" viewBox="0 0 100 30" preserveAspectRatio="none">
                      {/* Gradient background */}
                      <defs>
                        <linearGradient id="emissionsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0,25 L25,18 L50,12 L75,7 L100,1 L100,30 L0,30 Z" fill="url(#emissionsGradient)" />
                      {/* Trend lines */}
                      <polyline
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="1.2"
                        points="0,25 25,18 50,12 75,7 100,1"
                      />
                      {/* Target markers */}
                      <circle cx="0" cy="25" r="1.5" fill="#f59e0b" />
                      <circle cx="25" cy="18" r="1.5" fill="#f59e0b" />
                      <circle cx="50" cy="12" r="1.5" fill="#f59e0b" />
                      <circle cx="75" cy="7" r="1.5" fill="#f59e0b" />
                      <circle cx="100" cy="1" r="1.8" fill="#f59e0b" />
                    </svg>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
                    <span>145k CO2e</span>
                    <span>110k CO2e</span>
                    <span className="text-amber-500 font-bold">75k CO2e</span>
                    <span>40k CO2e</span>
                    <span>0k CO2e</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WATER & TAILINGS */}
          {activeSubTab === 'water' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <div className="bg-slate-950 text-blue-400 inline-flex items-center gap-1.5 px-3 py-1 rounded-none border border-slate-800 text-xs font-mono font-bold">
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>PREMIUM TAILINGS & LIQUID AUDIT</span>
                </div>
                <h3 className="text-2xl font-black uppercase text-slate-100">
                  92.5% Water Reclamation Cycle Efficiency
                </h3>
                <p className="text-slate-400 text-xs md:text-sm font-light leading-relaxed">
                  Water is a valuable common resource. This is why our Direct Lithium Extraction (DLE) models in Chile avoid standard high-loss evaporation basins, reinjecting 85% of active metallurgical fluids directly to preserving subsurface water balances.
                </p>

                <div className="bg-slate-950 p-6 rounded-none border border-slate-800 space-y-4 font-sans">
                  <h4 className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase">[ ACTIVE GOVERNANCE PILLARS ]</h4>
                  <ul className="space-y-2 text-xs text-slate-400 font-light font-mono leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">•</span>
                      <span>Real-Time satellite seepage telemetry on tailings reservoirs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">•</span>
                      <span>Zero toxic cyanide solution discharges inside active mills</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">•</span>
                      <span>Double-gasket synthetic liners protecting catchment pools</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Water gauge graphics */}
              <div className="lg:col-span-7 bg-slate-950 p-8 rounded-none border border-slate-800 text-center flex flex-col justify-center items-center">
                <span className="text-xs font-mono uppercase tracking-widest text-[#909EAA] mb-6">
                  Aggregate Water Recovery Index
                </span>

                {/* SVG circular progress ring */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="88"
                      cy="88"
                      r="76"
                      stroke="#1e293b"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="88"
                      cy="88"
                      r="76"
                      stroke="#3b82f6"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray="477"
                      strokeDashoffset="35" // (1 - 0.925) * 477 = 35.8
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-3xl md:text-4xl font-black text-slate-100 font-sans leading-none">
                      92.5%
                    </p>
                    <p className="text-[10px] text-blue-400 font-mono tracking-widest uppercase mt-2">
                      RECYCLED RATE
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-6 max-w-md italic leading-tight">
                  Our group targets 95% consolidated liquid recycle efficiencies across all heavy metallurgical concentrations by Fiscal Year 2028.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: COMMUNITY SOCIAL EXPENDITURES */}
          {activeSubTab === 'community' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <div className="bg-slate-950 text-purple-400 inline-flex items-center gap-1.5 px-3 py-1 rounded-none border border-slate-800 text-xs font-mono font-bold">
                  <Users className="w-3.5 h-3.5" />
                  <span>REGIONAL DEVELOPMENT MUTUALISM</span>
                </div>
                <h3 className="text-2xl font-black uppercase text-slate-100">
                  Local Partnership Trust Commitments
                </h3>
                <p className="text-slate-400 text-xs md:text-sm font-light leading-relaxed">
                  We maintain our mandate to build long-term local wealth. MineX projects are co-operated with regional landowners and indigenous stakeholders, guaranteeing employment pools, clean educational investments, and health infrastructure funding.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-none border border-slate-800">
                    <span className="text-[9px] font-mono text-slate-500 font-bold block uppercase leading-none">LOCAL LABOR</span>
                    <span className="text-amber-500 text-lg font-black block mt-2 font-mono">82% Ratios</span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold block mt-1">• Active goal</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-none border border-slate-800">
                    <span className="text-[9px] font-mono text-slate-500 font-bold block uppercase leading-none">INVESTMENT SPEND</span>
                    <span className="text-purple-400 text-lg font-black block mt-2 font-mono">$54.2M</span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold block mt-1">• Since inception</span>
                  </div>
                </div>
              </div>

              {/* Spend distribution visualization */}
              <div className="lg:col-span-7 bg-slate-950 p-6 md:p-8 rounded-none border border-slate-800 space-y-6">
                <span className="text-xs font-mono uppercase tracking-widest text-[#909EAA] block mb-2">
                  Community Fund Allocation Breakdown (FY25)
                </span>
                
                <div className="space-y-4 font-sans">
                  {[
                    { label: 'Technical Schools & Scientific Scholarships', amount: '$18.4M', pct: 34, color: 'bg-purple-500' },
                    { label: 'Primary Healthcare Centers & Water Purification', amount: '$15.2M', pct: 28, color: 'bg-blue-500' },
                    { label: 'Regional Supply Chain Infrastructure & Access Roads', amount: '$12.0M', pct: 22, color: 'bg-amber-500' },
                    { label: 'Indigenous Heritage and Land Preservation Trusts', amount: '$8.6M', pct: 16, color: 'bg-emerald-500' }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-300 font-light">{item.label}</span>
                        <span className="text-amber-500 font-bold font-mono">{item.amount} ({item.pct}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-900 rounded-none overflow-hidden border border-slate-800/85">
                        <div 
                          className={`h-full ${item.color} rounded-none`}
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SAFETY LTI RESULTS */}
          {activeSubTab === 'safety' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <div className="bg-slate-950 text-amber-500 inline-flex items-center gap-1.5 px-3 py-1 rounded-none border border-slate-800 text-xs font-mono font-bold">
                  <Award className="w-3.5 h-3.5" />
                  <span>INDUSTRY LEADERSHIP IN HEALTH & SAFETY</span>
                </div>
                <h3 className="text-2xl font-black uppercase text-slate-100">
                  Target Zero Harm Operational Mandate
                </h3>
                <p className="text-slate-400 text-xs md:text-sm font-light leading-relaxed">
                  A safe project is a profitable project. We hold an industry-best Lost Time Injury (LTI) rate of 0.12, far outperforming the global mining industry average of 0.94.
                </p>

                {/* Left metrics comparison boxes */}
                <div className="grid grid-cols-2 gap-4 pt-2 font-mono">
                  <div className="bg-slate-950 p-4 rounded-none border border-slate-800 text-center">
                    <span className="text-[9px] text-amber-500 font-bold tracking-wider uppercase block">MINEX GROUP LTI RATE</span>
                    <span className="text-slate-100 text-3xl font-extrabold block mt-2">0.12</span>
                    <span className="text-[9px] text-emerald-400 font-bold block mt-1">Excellent Control</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-none border border-slate-800 text-center">
                    <span className="text-[9px] text-slate-500 font-bold tracking-wider uppercase block">GLOBAL INDUSTRY AVG</span>
                    <span className="text-slate-400 text-3xl font-bold block mt-2">0.94</span>
                    <span className="text-[9px] text-rose-500 font-bold block mt-1">Standard Baseline</span>
                  </div>
                </div>
              </div>

              {/* Safety Logs Table */}
              <div className="lg:col-span-7 bg-slate-955 p-6 rounded-none border border-slate-800 overflow-hidden bg-slate-950">
                <span className="text-xs font-mono uppercase tracking-widest text-[#909EAA] block mb-4">
                  Active Asset Safety Audits (FY25/26)
                </span>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-300 font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px] tracking-[0.15em] pb-3">
                        <th className="py-3 font-bold">Operating Asset</th>
                        <th className="py-3 text-center font-bold">Hours Worked</th>
                        <th className="py-3 text-center font-bold">LTI Frequency</th>
                        <th className="py-3 text-right font-bold">Compliance Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60">
                      {safetyLogs.map((log, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-4 font-bold text-white uppercase tracking-tight">{log.site}</td>
                          <td className="py-4 text-center text-slate-400">{log.hours}</td>
                          <td className="py-4 text-center text-amber-500 font-black">{log.lti.toFixed(2)}</td>
                          <td className="py-4 text-right">
                            <span className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-950/45 px-3 py-1 rounded-none border border-emerald-900/40 text-[9px] font-bold uppercase tracking-wider">
                              <span className="w-1 h-1 bg-emerald-400 rounded-full"></span>
                              <span>100% Certified</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </section>
  );
}
