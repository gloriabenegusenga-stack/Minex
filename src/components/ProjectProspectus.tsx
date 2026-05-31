import { useState } from 'react';
import { Project, DrillHole } from '../types';
import { projectsData } from '../data';
import { useLanguage } from '../LanguageContext';
import { 
  Compass, MapPin, Gauge, ShieldAlert, FileText, Lock, 
  Layers, Database, Calendar, TrendingUp, Info 
} from 'lucide-react';

interface ProjectProspectusProps {
  onUnlockDoc: (docName: string) => void;
}

export default function ProjectProspectus({ onUnlockDoc }: ProjectProspectusProps) {
  const [filterType, setFilterType] = useState<string>('All');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('aura-deepfields');
  const [selectedDrillHoleId, setSelectedDrillHoleId] = useState<string>('AD-25-081');
  const { t } = useLanguage();

  const filteredProjects = projectsData.filter((p) => {
    if (filterType === 'All') return true;
    return p.type === filterType;
  });

  const selectedProject = projectsData.find((p) => p.id === selectedProjectId) || projectsData[0];
  
  // Drill hole data
  const selectedDrillHole = 
    selectedProject.drillHoles.find((dh) => dh.holeId === selectedDrillHoleId) || 
    selectedProject.drillHoles[0];

  return (
    <section id="resource-projects" className="w-full bg-slate-950 py-20 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-amber-500 uppercase mb-2">
              <Compass className="w-4 h-4" />
              <span>{t('prospectusTitle')}</span>
            </div>
            <h2 className="text-3xl font-black uppercase text-white tracking-tighter">
              {t('provenProjects')} <span className="text-slate-500">{t('prospectusHeaderPost') || 'Assays'}</span>
            </h2>
            <p className="text-slate-400 text-xs md:text-sm font-light max-w-xl mt-1.5 leading-relaxed">
              {t('prospectusDesc')}
            </p>
          </div>

          {/* Project Filters */}
          <div className="flex flex-wrap gap-2">
            {['All', 'Gold', 'Copper', 'Lithium'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`cursor-pointer px-5 py-2.5 text-xs font-mono tracking-widest uppercase transition-all duration-200 rounded-none ${
                  filterType === type
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                {type === 'All' ? t('filterAll') : type === 'Gold' ? t('filterGold') : type === 'Copper' ? t('filterCopper') : t('filterLithium')}
              </button>
            ))}
          </div>
        </div>

        {/* Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Project Grid */}
          <div className="lg:col-span-4 space-y-4">
            {filteredProjects.map((project) => {
              const isSelected = project.id === selectedProjectId;
              return (
                <div
                  key={project.id}
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    // Select first drill hole automatically of the new project
                    setSelectedDrillHoleId(project.drillHoles[0]?.holeId || '');
                  }}
                  className={`p-6 rounded-none cursor-pointer transition-all duration-300 border text-left ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500 shadow-none'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono tracking-widest px-2.5 py-0.5 bg-slate-800 rounded-none text-slate-100 font-bold uppercase">
                      {project.type}
                    </span>
                    <span className={`text-[9px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-none ${
                      project.phase === 'Production' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' :
                      project.phase === 'Development' ? 'bg-amber-950/80 text-amber-400 border border-amber-805' :
                      'bg-blue-950/80 text-blue-400 border border-blue-800'
                    }`}>
                      {project.phase.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-slate-100 font-bold text-lg mt-3 uppercase tracking-tight">
                    {project.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    {project.location}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800/80 text-xs">
                    <div>
                      <p className="text-slate-500 font-mono text-[9px] uppercase tracking-wider">NPV Val</p>
                      <p className="text-amber-500 font-black font-sans text-sm mt-1">{project.npv.split(' ')[0]}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-mono text-[9px] uppercase tracking-wider">{t('lifeLabel')}</p>
                      <p className="text-slate-100 font-black font-sans text-sm mt-1">{project.mineLife} {t('lifeYears')}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredProjects.length === 0 && (
              <div className="p-8 text-center bg-slate-900/30 border border-dashed border-slate-800 rounded-none text-slate-400 text-sm font-mono">
                No core reserves found for the current selection filter.
              </div>
            )}
          </div>

          {/* Right Column: Mini Prospectus & Technical Inspection Hub */}
          <div className="lg:col-span-8 bg-slate-900/40 border border-slate-800 rounded-none p-6 md:p-8 space-y-8 shadow-none">
            {/* Asset Metadata Header */}
            <div className="border-b border-slate-850 pb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <span className="text-xs text-amber-500 font-mono tracking-widest uppercase font-bold">
                  DEPOSIT SPECIFICATIONS • {selectedProject.coordinates}
                </span>
                <h3 className="text-2xl md:text-3xl font-black uppercase text-slate-100 mt-2">
                  {selectedProject.name} Prospectus
                </h3>
                <p className="text-xs text-slate-400 mt-1 uppercase font-mono">
                  {t('phaseLabel')}: <span className="text-amber-500 font-bold">{selectedProject.phase}</span>
                </p>
              </div>

              {/* Technical Ni-43-101 Gated Button */}
              <button
                onClick={() => onUnlockDoc(`NI 43-101 FSR - ${selectedProject.name}`)}
                className="cursor-pointer inline-flex items-center gap-2 border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-slate-950 px-6 py-2.5 rounded-none transition-all text-xs font-bold tracking-widest uppercase bg-transparent"
              >
                <Lock className="w-3.5 h-3.5 text-amber-500/90" />
                <span>{t('requestPreFeas')}</span>
              </button>
            </div>

            {/* Core Statistics Card Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950 p-5 rounded-none border border-slate-800 shadow-none">
              {[
                { label: t('gradeLabel'), val: selectedProject.grade },
                { label: t('capexLabel'), val: selectedProject.capex.split(' ')[0] },
                { label: t('tonnageLabel'), val: selectedProject.tonnage.split(' ')[0] },
                { label: t('irrLabel'), val: selectedProject.irr.split(' ')[0] }
              ].map((m, i) => (
                <div key={i} className="text-left font-sans">
                  <span className="text-[9px] font-mono tracking-widest text-[#909EAA] block mb-1">
                    {m.label}
                  </span>
                  <span className="text-slate-100 font-black text-xs md:text-[13px] tracking-tight uppercase">
                    {m.val}
                  </span>
                </div>
              ))}
            </div>

            {/* Narrative Description & Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="space-y-3">
                <h4 className="text-xs font-mono tracking-widest text-slate-500 uppercase font-bold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-500" />
                  {t('highlightsTitle')}
                </h4>
                <p className="text-slate-400 text-xs md:text-sm font-light leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-mono tracking-widest text-slate-500 uppercase font-bold flex items-center gap-1.5">
                  <CheckedBadge className="w-3.5 h-3.5 text-emerald-500" />
                  {t('highlightsTitle')}
                </h4>
                <ul className="space-y-2 text-xs text-slate-400 font-light font-sans">
                  {selectedProject.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold font-mono mt-0.5">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Interactive Drill Hole Assay Log */}
            <div className="border-t border-slate-850 pt-6 text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                <div>
                  <h4 className="text-xs font-mono tracking-widest text-slate-400 uppercase font-bold flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-500" />
                    {t('viewDrillAssays')}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                    Select a core sample hole ID to inspect active mineral thickness and lithology records.
                  </p>
                </div>

                {/* Drill selectors list */}
                <div className="flex flex-wrap gap-1 bg-slate-950 p-1.5 rounded-none border border-slate-850">
                  {selectedProject.drillHoles.map((dh) => (
                    <button
                      key={dh.holeId}
                      onClick={() => setSelectedDrillHoleId(dh.holeId)}
                      className={`cursor-pointer px-3 py-1 text-[10px] font-mono tracking-wider rounded-none transition-colors ${
                        selectedDrillHoleId === dh.holeId
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {dh.holeId}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated Core Sample Graphic */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950 p-6 rounded-none border border-slate-800 items-stretch">
                <div className="md:col-span-5 space-y-4">
                  <div className="space-y-1 bg-slate-900 p-4 rounded-none border border-slate-800">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">{t('drillHoleID')}</span>
                    <p className="text-slate-100 font-bold font-mono text-lg">{selectedDrillHole.holeId}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900 p-4 rounded-none border border-slate-800">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">{t('interceptDepth')}</span>
                      <p className="text-amber-500 font-black text-sm tracking-tight">{selectedDrillHole.depth} Mtrs</p>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-none border border-slate-800">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">{t('interceptGrade')}</span>
                      <p className="text-slate-150 font-black text-sm tracking-tight uppercase">
                        {selectedDrillHole.grade} {selectedProject.type === 'Gold' ? 'g/t' : selectedProject.type === 'Copper' ? '%' : 'mg/L'}
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-none border border-slate-800">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">{t('lithologyType')}</span>
                    <p className="text-emerald-400 font-bold text-xs mt-1 uppercase tracking-wider font-mono">{selectedDrillHole.lithology}</p>
                  </div>
                </div>

                {/* Vertical Core Sample Drill Graphic Column */}
                <div className="md:col-span-7 border-l-0 md:border-l border-dashed border-slate-800 md:pl-6 flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mb-2">
                    Visual Core Lithology Column (Stratigraphy View)
                  </span>
                  
                  <div className="flex flex-col h-32 md:h-full min-h-[140px] border border-slate-800 rounded-none overflow-hidden text-[10px] font-mono shadow-none">
                    <div className="bg-amber-950/40 text-amber-200 p-3 border-b border-slate-800 flex-1 flex items-center justify-between">
                      <span>0m - 120m : Soil Overburden Layer</span>
                      <span className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">Clay/Silt Mix</span>
                    </div>
                    <div className="bg-emerald-950/20 text-emerald-300 p-3 border-b border-slate-800 flex-2 flex items-center justify-between">
                      <span>120m - {Math.floor(selectedDrillHole.depth * 0.7)}m : Host Formative Bedrock</span>
                      <span className="text-slate-500 uppercase tracking-wider text-[9px] font-bold font-mono">Basalt/Gneiss</span>
                    </div>
                    <div className="bg-amber-500/10 text-amber-400 p-3 flex-3 flex items-center justify-between animate-pulse border-l-2 border-amber-500 bg-gradient-to-r from-amber-500/5 to-transparent">
                      <span className="font-bold">TARGET MINERALIZED BODY</span>
                      <span className="text-amber-500 font-black">{selectedDrillHole.grade} Units</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 italic leading-tight">
                    *Assay results verified in accordance with national mineral inspection standards.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive SVG Group Annual Production Chart */}
            <div className="border-t border-slate-850 pt-6 text-left">
              <h4 className="text-xs font-mono tracking-widest text-slate-400 uppercase font-bold flex items-center gap-1.5 mb-3">
                <Database className="w-4 h-4 text-amber-500" />
                ANNUAL REVENUE & PRODUCTION RUN-RATE
              </h4>
              <p className="text-[11px] text-slate-500 mb-5 leading-normal font-mono">
                Actual record volumes extracted vs forward planning metrics for {selectedProject.name}.
              </p>

              {/* Simple Custom SVG Bar Chart */}
              <div className="bg-slate-950 p-6 rounded-none border border-slate-850">
                <div className="flex items-end justify-between h-40 gap-3 px-2">
                  {selectedProject.annualProduction.map((p, idx) => {
                    const maxVal = Math.max(...selectedProject.annualProduction.map(x => x.volume));
                    const heightPercent = maxVal ? (p.volume / maxVal) * 85 : 0;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 bg-slate-900 text-slate-100 text-[10px] font-mono py-1.5 px-3 rounded-none border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                          {p.volume} {p.unit}
                        </div>
                        {/* Static Column Bar */}
                        <div 
                          className="w-full bg-slate-900 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500 rounded-none transition-all flex flex-col justify-end overflow-hidden"
                          style={{ height: `${heightPercent}%` }}
                        >
                          <div className="w-full bg-gradient-to-t from-amber-600 to-amber-500 h-full rounded-none" />
                        </div>
                        {/* Column labels */}
                        <span className="text-[10px] font-mono text-slate-500 mt-3">{p.year}</span>
                        <span className="text-[9px] font-mono text-amber-500 font-bold">{p.volume}{p.unit}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

// Inline custom mini badge components
function CheckedBadge({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
