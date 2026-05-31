import { useState, useEffect } from 'react';
import { Earth, Navigation, ShieldAlert, Thermometer, Wind, User, Activity, Play, Eye, RotateCw, CheckCircle2, ChevronRight, CornerDownRight } from 'lucide-react';
import { projectsData } from '../data';

interface TelemetryFeed {
  workforceCount: number;
  temperature: string;
  windSpeed: string;
  humidity: string;
  powerSource: string;
  status: 'Operational' | 'Audit Sweep' | 'Exploratory Drill';
  safetyIndex: string;
  ventilationLevel?: string;
  recycleRate?: string;
}

export default function OperationsMapAndTour() {
  const [activeTab, setActiveTab] = useState<'map' | 'tour'>('map');
  const [selectedSiteId, setSelectedSiteId] = useState<string>('aura-deepfields');
  const [tourProject, setTourProject] = useState<string>('aura-deepfields');
  const [tourStep, setTourStep] = useState<number>(0);
  const [showHotspotInfo, setShowHotspotInfo] = useState<string | null>(null);

  // Dynamic telemetry states to simulate real-time sensor updates
  const [siteTelemetry, setSiteTelemetry] = useState<Record<string, TelemetryFeed>>({
    'aura-deepfields': {
      workforceCount: 184,
      temperature: '14°C',
      windSpeed: '12 km/h NW',
      humidity: '45%',
      powerSource: 'Hydro-Power Grid Match',
      status: 'Operational',
      safetyIndex: '99.8 LTI-Free',
      ventilationLevel: '3,850 CFM (Optimal)'
    },
    'copper-crest': {
      workforceCount: 295,
      temperature: '28°C',
      windSpeed: '8 km/h ESE',
      humidity: '32%',
      powerSource: '200MW Queensland Solar Corridor',
      status: 'Operational',
      safetyIndex: '100.0 LTI-Free',
      ventilationLevel: 'Open-Pit Surface'
    },
    'sol-salar': {
      workforceCount: 76,
      temperature: '19°C',
      windSpeed: '24 km/h SW',
      humidity: '12%',
      powerSource: 'Off-Grid Modular Alkaline Pack',
      status: 'Exploratory Drill',
      safetyIndex: '98.5 LTI-Free',
      recycleRate: '96.2% Aquifer Return'
    }
  });

  // Cycle telemetry data subtly over time to feel "live"
  useEffect(() => {
    const timer = setInterval(() => {
      setSiteTelemetry(prev => {
        const copy = { ...prev };
        Object.keys(copy).forEach(site => {
          const personOffset = Math.floor(Math.random() * 5) - 2;
          const tempVal = parseInt(copy[site].temperature) + (Math.random() > 0.5 ? 1 : -1);
          copy[site] = {
            ...copy[site],
            workforceCount: Math.max(10, copy[site].workforceCount + personOffset),
            temperature: `${tempVal}°C`,
          };
        });
        return copy;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const selectedSite = projectsData.find(p => p.id === selectedSiteId) || projectsData[0];
  const telemetry = siteTelemetry[selectedSiteId];

  // Panoramic Tour Data
  const tours = {
    'aura-deepfields': [
      {
        viewName: 'Underground Autonomous Drift Portal (Level 420m)',
        description: 'The central entry point for the all-electric underground load-haul-dump (LHD) fleet.',
        telemetry: { Methane: '0.00%', Ventilation: '3,800 CFM', BatteryCharge: '98% Active' },
        hotspots: [
          { x: '25%', y: '40%', name: 'Electric Cat R2900 XE Lancer', desc: 'Zero emissions continuous loader utilizing lithium-iron phosphate propulsion.' },
          { x: '70%', y: '65%', name: 'Subsurface Seismocast Sensor', desc: 'High frequency quartz sensor relaying real-time lithology compression stats to ground controllers.' }
        ]
      },
      {
        viewName: 'Deepcore Geologic Diamond Assay Suite',
        description: 'Advanced on-site diamond core examination station where drill fragments are cataloged.',
        telemetry: { CoreScans: 'Verified', OpticalLaser: 'Active', Integrity: '100%' },
        hotspots: [
          { x: '45%', y: '50%', name: 'Refining Core Spec AD-25-084', desc: 'Subelemental core demonstrating continuous quartz veining with heavy sulfide mineralization.' },
          { x: '82%', y: '30%', name: 'Spectrometer Scanner', desc: 'Measures XRF gold indicator spectrums dynamically inside 0.5 seconds.' }
        ]
      }
    ],
    'copper-crest': [
      {
        viewName: 'Primary Gyratory Crusher Platform at Pit Edge',
        description: 'Large-scale crushing sector reducing massive run-of-mine fragments into process-ready feed.',
        telemetry: { Vibration: 'Low-Sustained', OilTemp: '62°C', ProcessingRate: '3,800 t/h' },
        hotspots: [
          { x: '35%', y: '55%', name: '60x110 Superior Crusher Mantle', desc: 'High-torque alloy lining suited for extreme hardness chalcopyrite ore feeds.' },
          { x: '80%', y: '45%', name: 'Optical Grit Analyzer', desc: 'Automated camera counting fragments to optimize crusher gap tolerances dynamically.' }
        ]
      },
      {
        viewName: 'Flotation Separation Circuits & Spec Tanks',
        description: 'Metallurgical separation cells injecting certified non-toxic frothers to separate copper sands.',
        telemetry: { FluidPH: '8.4 pH', RecycleRate: '95.4%', PurityGrade: '28.5% copper con' },
        hotspots: [
          { x: '50%', y: '40%', name: 'Bubble Froth Agitator', desc: 'Generates specialized air bubble vectors to raise sulfide particles while sinking granite sand.' },
          { x: '20%', y: '70%', name: 'Water Recycle Inflow Vent', desc: 'Brings back fully filtered metallurgical liquids directly from tailings thickener loops.' }
        ]
      }
    ],
    'sol-salar': [
      {
        viewName: 'Evaporator-Free DLE Modular Adsorption Reactor',
        description: 'State-of-the-art adsorption system separating lithium brine without open solar pools.',
        telemetry: { BrineInflow: '1,450 L/m', ResinCharge: 'Optimal', ExtractionYield: '96.8%' },
        hotspots: [
          { x: '30%', y: '45%', name: 'Adsorption Column Alpha', desc: 'Proprietary titanium-silicate media capturing lithium ions selectively while rejecting sodium salts.' },
          { x: '75%', y: '50%', name: 'Active Aquifer Reinjection Port', desc: 'Safest return layout pump system maintaining subterranean moisture balance in desert sand.' }
        ]
      }
    ]
  };

  const currentTourList = tours[tourProject as keyof typeof tours] || tours['aura-deepfields'];
  const currentTourStep = currentTourList[tourStep] || currentTourList[0];

  return (
    <section id="operations-tours" className="w-full bg-slate-950 py-20 border-b border-slate-900 text-left">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-amber-500 uppercase font-bold">
              <Earth className="w-4 h-4 text-amber-500" />
              <span>Real-Time Assets & Telemetries</span>
            </div>
            <h2 className="text-3xl font-black uppercase text-white tracking-tighter leading-none mt-2 mb-3">
              Interactive Map <span className="text-slate-500 font-black">& Mine Tours</span>
            </h2>
            <p className="text-slate-400 text-xs md:text-sm font-light max-w-xl leading-relaxed">
              Verify global activities on the ground. Drill down into our active concessions or launch virtual 360° tours of our mine drifts, assay labs, and extraction chambers.
            </p>
          </div>

          {/* Tab Selection */}
          <div className="flex border border-slate-800 bg-slate-900 p-1 rounded-none font-mono">
            <button
              onClick={() => setActiveTab('map')}
              className={`cursor-pointer px-4 py-2 text-[10px] uppercase font-black tracking-widest ${
                activeTab === 'map'
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Operations Map
            </button>
            <button
              onClick={() => setActiveTab('tour')}
              className={`cursor-pointer px-4 py-2 text-[10px] uppercase font-black tracking-widest ${
                activeTab === 'tour'
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              360° Virtual Site Tour
            </button>
          </div>
        </div>

        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-fadeIn">
            {/* Interactive World Map Grid (Custom geometric representation inside HTML/SVG) */}
            <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800 rounded-none p-6 flex flex-col justify-between relative overflow-hidden min-h-[440px]">
              
              {/* Background Map Grid Pattern */}
              <div className="absolute inset-0 opacity-10 font-mono text-[9px] select-none pointer-events-none p-4 overflow-hidden leading-tight">
                {Array.from({ length: 18 }).map((_, i) => (
                  <p key={i} className="whitespace-nowrap">
                    01010101 01010010 10101100 11001101 10100010 01101110 01101010 10100110 00110111 11000100 10101011
                  </p>
                ))}
              </div>

              <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
                <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">
                  SATELLITE POSITION COORDINATE SYSTEM
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/30 border border-emerald-900/40 px-2.5 py-0.5 rounded-none uppercase animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  Live GPS Stream Active
                </span>
              </div>

              {/* Geo Diagram Grid */}
              <div className="relative z-10 flex-grow flex items-center justify-center my-6 min-h-[220px]">
                
                {/* Visual stylised continent outline or coordinate plane representation with custom SVG */}
                <svg viewBox="0 0 800 400" className="w-full max-w-2xl h-auto text-slate-800 stroke-slate-800/40 fill-none" strokeWidth="1">
                  {/* Grid Lines */}
                  <g strokeDasharray="3 3" stroke="#334155" opacity="0.3">
                    <line x1="100" y1="0" x2="100" y2="400" />
                    <line x1="200" y1="0" x2="200" y2="400" />
                    <line x1="300" y1="0" x2="300" y2="400" />
                    <line x1="400" y1="0" x2="400" y2="400" />
                    <line x1="500" y1="0" x2="500" y2="400" />
                    <line x1="600" y1="0" x2="600" y2="400" />
                    <line x1="700" y1="0" x2="700" y2="400" />
                    <line x1="0" y1="100" x2="800" y2="100" />
                    <line x1="0" y1="200" x2="800" y2="200" />
                    <line x1="0" y1="300" x2="800" y2="300" />
                  </g>

                  {/* Abstract continent vectors */}
                  {/* North America */}
                  <path d="M 120 80 Q 150 90 200 70 Q 230 110 210 160 Q 180 180 150 200 L 120 180 Z" className="fill-slate-900/40 stroke-slate-800" />
                  {/* South America */}
                  <path d="M 230 220 Q 260 250 240 320 Q 210 350 190 300 Q 200 250 230 220" className="fill-slate-900/40 stroke-slate-800" />
                  {/* Europe / Asia */}
                  <path d="M 380 90 Q 420 70 500 80 Q 560 110 650 90 Q 700 130 680 200 L 580 190 Q 520 140 450 150 Z" className="fill-slate-900/40 stroke-slate-800" />
                  {/* Australia */}
                  <path d="M 640 250 Q 690 240 720 280 Q 680 320 630 290 Z" className="fill-slate-900/40 stroke-slate-800" />

                  {/* Operational Markers */}
                  {/* Canada Marker (Aura Deepfields) - approx 175, 110 */}
                  <g 
                    className="cursor-pointer group/node" 
                    onClick={() => setSelectedSiteId('aura-deepfields')}
                  >
                    <circle cx="175" cy="110" r="14" className="fill-amber-500/15 stroke-amber-500/40 animate-pulse stroke-2" />
                    <circle cx="175" cy="110" r="6" className={`transition-all duration-200 ${selectedSiteId === 'aura-deepfields' ? 'fill-amber-500 r-8' : 'fill-amber-500/60 group-hover/node:fill-amber-500'}`} />
                    <text x="175" y="90" textAnchor="middle" className="font-mono text-[9px] fill-slate-300 font-bold uppercase tracking-wider">Aura Gold (CA)</text>
                  </g>

                  {/* Chile Marker (Sol Salar) - approx 225, 275 */}
                  <g 
                    className="cursor-pointer group/node" 
                    onClick={() => setSelectedSiteId('sol-salar')}
                  >
                    <circle cx="225" cy="275" r="14" className="fill-amber-500/15 stroke-amber-500/40 animate-pulse stroke-2" />
                    <circle cx="225" cy="275" r="6" className={`transition-all duration-200 ${selectedSiteId === 'sol-salar' ? 'fill-amber-500 r-8' : 'fill-amber-500/60 group-hover/node:fill-amber-500'}`} />
                    <text x="225" y="255" textAnchor="middle" className="font-mono text-[9px] fill-slate-300 font-bold uppercase tracking-wider">Sol Salar (CL)</text>
                  </g>

                  {/* Australia Marker (Copper Crest) - approx 670, 280 */}
                  <g 
                    className="cursor-pointer group/node" 
                    onClick={() => setSelectedSiteId('copper-crest')}
                  >
                    <circle cx="670" cy="280" r="14" className="fill-amber-500/15 stroke-amber-500/40 animate-pulse stroke-2" />
                    <circle cx="670" cy="280" r="6" className={`transition-all duration-200 ${selectedSiteId === 'copper-crest' ? 'fill-amber-500 r-8' : 'fill-amber-500/60 group-hover/node:fill-amber-500'}`} />
                    <text x="670" y="260" textAnchor="middle" className="font-mono text-[9px] fill-slate-300 font-bold uppercase tracking-wider">Copper Crest (AU)</text>
                  </g>
                </svg>

              </div>

              {/* Selector Buttons */}
              <div className="relative z-10 grid grid-cols-3 gap-3 bg-slate-950 p-2 border border-slate-850">
                {projectsData.map((project) => {
                  const isCur = selectedSiteId === project.id;
                  return (
                    <button
                      key={project.id}
                      onClick={() => setSelectedSiteId(project.id)}
                      className={`cursor-pointer py-2 text-center text-[10px] font-mono uppercase font-black border transition-all duration-200 ${
                        isCur
                          ? 'bg-slate-900 border-amber-500 text-amber-500'
                          : 'bg-slate-950 border-transparent text-slate-400 hover:text-white hover:bg-slate-900/30'
                      }`}
                    >
                      {project.name.split(' ')[0]} Site
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Live Telemetry Panels */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              
              {/* Telemetry Block */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-none p-6 text-left space-y-5 flex-grow">
                <div className="flex items-center gap-3 border-b border-slate-850 pb-4">
                  <div className="p-2.5 bg-slate-950 text-amber-500 border border-slate-800">
                    <Navigation className="w-4 h-4 animate-spin-slow text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-black uppercase text-sm font-sans tracking-tight">
                      {selectedSite.name} CONCESSION
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{selectedSite.location} • Coordinates: {selectedSite.coordinates}</p>
                  </div>
                </div>

                {/* Status Indicator Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-slate-950/70 p-3 border border-slate-850">
                    <span className="text-slate-500 text-[9px] uppercase tracking-wider block mb-1">Telemetry Status</span>
                    <span className={`font-bold block uppercase ${
                      telemetry.status === 'Operational' ? 'text-emerald-400' : 'text-amber-500'
                    }`}>
                      ● {telemetry.status}
                    </span>
                  </div>
                  <div className="bg-slate-950/70 p-3 border border-slate-850">
                    <span className="text-slate-500 text-[9px] uppercase tracking-wider block mb-1">Safety Index</span>
                    <span className="text-emerald-400 font-bold block">{telemetry.safetyIndex}</span>
                  </div>
                </div>

                {/* Main Stats List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs border-b border-slate-850 pb-2">
                    <span className="text-slate-400 font-sans flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-500" /> Headcount Active
                    </span>
                    <span className="font-mono text-slate-100 font-bold">{telemetry.workforceCount} Personnel</span>
                  </div>

                  <div className="flex items-center justify-between text-xs border-b border-slate-850 pb-2">
                    <span className="text-slate-400 font-sans flex items-center gap-1.5">
                      <Thermometer className="w-3.5 h-3.5 text-amber-500" /> Core Environment
                    </span>
                    <span className="font-mono text-slate-100 font-bold">{telemetry.temperature} / {telemetry.humidity} Humidity</span>
                  </div>

                  <div className="flex items-center justify-between text-xs border-b border-slate-850 pb-2">
                    <span className="text-slate-400 font-sans flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5 text-amber-500" /> Surface Wind
                    </span>
                    <span className="font-mono text-slate-100 font-bold">{telemetry.windSpeed}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs border-b border-slate-850 pb-2">
                    <span className="text-slate-400 font-sans flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-amber-500" /> Power Allocation
                    </span>
                    <span className="font-mono text-slate-100 font-bold text-right text-[11px] leading-tight">{telemetry.powerSource}</span>
                  </div>

                  {telemetry.ventilationLevel && (
                    <div className="flex items-center justify-between text-xs border-b border-slate-850 pb-2">
                      <span className="text-slate-400 font-sans flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Mine Ventilation Flow
                      </span>
                      <span className="font-mono text-emerald-400 font-bold">{telemetry.ventilationLevel}</span>
                    </div>
                  )}

                  {telemetry.recycleRate && (
                    <div className="flex items-center justify-between text-xs border-b border-slate-850 pb-2">
                      <span className="text-slate-400 font-sans flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> Aquifer Fluid Recovery
                      </span>
                      <span className="font-mono text-emerald-450 font-bold text-emerald-400">{telemetry.recycleRate}</span>
                    </div>
                  )}
                </div>

                {/* Short concession explanation */}
                <p className="text-slate-400 text-[11.5px] font-light leading-relaxed font-sans pt-2">
                  {selectedSite.description}
                </p>
              </div>

              {/* Action Link Row */}
              <div className="p-4 bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono tracking-wider block">RESOURCE TYPE</span>
                  <p className="text-white text-xs font-bold uppercase font-mono tracking-widest">{selectedSite.type} Concession</p>
                </div>
                <button
                  onClick={() => setTourProject(selectedSiteId)}
                  className="cursor-pointer bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] font-mono tracking-widest px-4 py-2 uppercase flex items-center gap-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Launch Tour</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'tour' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-fadeIn">
            {/* Visual Screen Viewport simulating 360° Panorama */}
            <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-none p-4 flex flex-col relative overflow-hidden min-h-[480px]">
              
              {/* Cinematic Simulation Viewport */}
              <div className="relative flex-grow bg-slate-950/80 border border-slate-850 flex flex-col justify-between overflow-hidden p-6 rounded-none">
                
                {/* Simulated Panorama Visual Box with CSS effects representing mine chamber */}
                <div className="absolute inset-0 bg-radial-gradient z-0 opacity-40" />

                {/* Panoramic Lines / Tech Grid overlays */}
                <div className="absolute inset-0 z-10 pointer-events-none border-y border-slate-900 border-dashed m-12" />
                <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                  <div className="w-32 h-32 border border-amber-500/20 rounded-full animate-ping pointer-events-none absolute" />
                  <div className="w-56 h-56 border border-slate-800/50 rounded-full pointer-events-none absolute" />
                  
                  {/* Rotating compass grid */}
                  <RotateCw className="w-48 h-48 text-slate-800/10 animate-spin-slow pointer-events-none absolute stroke-[0.5]" />
                </div>

                {/* Viewport UI header */}
                <div className="relative z-20 flex justify-between items-start">
                  <div className="bg-slate-900/95 border border-slate-800 p-3 flex flex-col">
                    <span className="text-slate-500 text-[8px] font-mono tracking-widest uppercase font-black mb-1">ACTIVE TOUR DEPOT</span>
                    <span className="text-white font-mono text-[11px] font-black uppercase tracking-wider">{currentTourStep.viewName}</span>
                  </div>

                  <div className="bg-slate-900/95 border border-slate-800 p-2.5 font-mono text-[9px] text-slate-400 flex flex-col gap-1 text-right">
                    <span>GPS LOC: {projectsData.find(p => p.id === tourProject)?.coordinates}</span>
                    <span className="text-amber-500 font-bold uppercase">CAM RETICULATION: ACTIVE</span>
                  </div>
                </div>

                {/* Hotspot overlays */}
                <div className="absolute inset-0 z-20">
                  {currentTourStep.hotspots.map((hs, i) => (
                    <div 
                      key={i} 
                      style={{ top: hs.y, left: hs.x }}
                      className="absolute translate-x-[-50%] translate-y-[-50%]"
                    >
                      <button
                        onClick={() => setShowHotspotInfo(showHotspotInfo === hs.name ? null : hs.name)}
                        className="cursor-pointer w-7 h-7 bg-amber-500 text-slate-950 font-black rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-[0_0_15px_rgba(245,158,11,0.5)] border-2 border-slate-900 animate-pulse text-xs"
                      >
                        i
                      </button>
                      
                      {/* Active Spot info box */}
                      {showHotspotInfo === hs.name && (
                        <div className="absolute top-9 left-2 w-64 bg-slate-900 border border-amber-500 p-3.5 z-30 font-sans shadow-xl text-left animate-fadeIn">
                          <h4 className="text-amber-500 font-bold text-xs uppercase font-mono tracking-wide">{hs.name}</h4>
                          <p className="text-slate-300 text-[11.5px] mt-1.5 leading-relaxed font-light">{hs.desc}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Viewport bottom telemetry feed bar */}
                <div className="relative z-20 mt-auto pt-6 flex flex-wrap gap-4 items-center justify-between border-t border-slate-900 bg-slate-900/90 p-4 border border-slate-800">
                  <div className="flex gap-6">
                    {Object.entries(currentTourStep.telemetry).map(([key, value]) => (
                      <div key={key} className="font-mono text-left">
                        <span className="text-[8px] text-slate-500 uppercase tracking-widest block">{key}</span>
                        <span className="text-slate-100 font-bold text-[11.5px]">{value}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-400 font-light max-w-sm italic leading-snug font-sans">
                    {currentTourStep.description}
                  </p>
                </div>

              </div>

              {/* Steps control footer */}
              <div className="mt-4 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">PROJECT STATIONS: {tourStep + 1} OF {currentTourList.length}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setTourStep(prev => Math.max(0, prev - 1));
                      setShowHotspotInfo(null);
                    }}
                    disabled={tourStep === 0}
                    className="px-3 py-1.5 border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed uppercase text-[10px]"
                  >
                    PREV NODE
                  </button>
                  <button
                    onClick={() => {
                      setTourStep(prev => Math.min(currentTourList.length - 1, prev + 1));
                      setShowHotspotInfo(null);
                    }}
                    disabled={tourStep === currentTourList.length - 1}
                    className="px-3 py-1.5 border border-slate-800 hover:border-slate-705 bg-slate-900 text-slate-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed uppercase text-[10px]"
                  >
                    NEXT NODE
                  </button>
                </div>
              </div>

            </div>

            {/* Tour site selection sidebar controls */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
              
              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-none text-left flex-grow space-y-5">
                <h3 className="text-slate-500 text-[10px] font-mono tracking-widest uppercase font-bold border-b border-slate-850 pb-3">
                  SELECT CONCESSION PANORAMA
                </h3>

                <div className="space-y-2.5">
                  {[
                    { id: 'aura-deepfields', label: 'Aura Underground Gold', loc: 'Ontario, Canada' },
                    { id: 'copper-crest', label: 'Copper Crest Phase 2', loc: 'Queensland, Australia' },
                    { id: 'sol-salar', label: 'Sol Salar DLE Aqua System', loc: 'Atacama Desert, Chile' }
                  ].map((btn) => {
                    const isCur = tourProject === btn.id;
                    return (
                      <button
                        key={btn.id}
                        onClick={() => {
                          setTourProject(btn.id);
                          setTourStep(0);
                          setShowHotspotInfo(null);
                        }}
                        className={`w-full text-left p-3.5 border transition-all duration-200 cursor-pointer flex flex-col ${
                          isCur
                            ? 'bg-slate-900 border-amber-500 text-amber-500'
                            : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white hover:bg-slate-900/10'
                        }`}
                      >
                        <span className="font-mono text-xs font-bold uppercase tracking-wider">{btn.label}</span>
                        <span className="text-[9px] text-slate-500 font-mono tracking-wide mt-1 uppercase">{btn.loc}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Tour Guideline Explanation */}
                <div className="bg-slate-950 border border-slate-850 p-4 text-[11px] text-slate-500 space-y-2.5">
                  <div className="flex items-center gap-1 text-slate-400 font-mono font-bold uppercase text-[9.5px]">
                    <Eye className="w-3.5 h-3.5 text-amber-500" />
                    <span>How to Navigate Tour:</span>
                  </div>
                  <p className="leading-relaxed">
                    Use the console selection above to switch concessions. Inside the camera screen, click on pulsate gold <strong className="text-amber-500">"i"</strong> indicators to scan geologic arrays, autonomous equipment metrics, and metallurgical separation tanks.
                  </p>
                </div>
              </div>

              {/* Dispatched verification trigger */}
              <div className="bg-slate-900 border border-slate-850 p-4 flex flex-col gap-2.5 text-left text-xs">
                <p className="font-sans text-slate-400 text-[11px] leading-normal font-light">
                  Require official site inspections or live physical core auditing visits? Fill out compliance credentials in our Inquiry Terminal for verification.
                </p>
                <div className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="font-mono text-[9px] text-slate-500 uppercase font-black uppercase leading-5">Compliant with Canadian NI 43-101</span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
