import { useState } from 'react';
import Header from './components/Header';
import MetricHero from './components/MetricHero';
import ProjectProspectus from './components/ProjectProspectus';
import ESGdashboard from './components/ESGdashboard';
import GeologyLibrary from './components/GeologyLibrary';
import Newsroom from './components/Newsroom';
import InquiryTerminal from './components/InquiryTerminal';
import OperationsMapAndTour from './components/OperationsMapAndTour';
import AIAssistant from './components/AIAssistant';
import StonesTracker from './components/StonesTracker';
import TradeDesk from './components/TradeDesk';
import GlobalSearchSpace from './components/GlobalSearchSpace';
import LoginModal from './components/LoginModal';
import { Shield, Sparkles, AlertTriangle, Scale, Mail, Phone, MapPin } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [terminalAudience, setTerminalAudience] = useState<'Investor' | 'Partner' | 'Government' | 'General'>('General');
  const [activeGateDoc, setActiveGateDoc] = useState<string | null>(null);

  // Quick audience routing from Hero panels
  const handleQuickRoute = (audienceType: 'Investor' | 'Partner' | 'Government') => {
    setTerminalAudience(audienceType);
    setActiveTab('contact');
    
    // Quick auto scroll to form block
    setTimeout(() => {
      const formEl = document.getElementById('access-portal');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 120);
  };

  // When a user tries to unlock a locked technical report
  const handleUnlockDoc = (docName: string) => {
    setActiveGateDoc(docName);
    
    // Match audience dynamically based on document names
    if (docName.toLowerCase().includes('gold') || docName.toLowerCase().includes('resource')) {
      setTerminalAudience('Investor');
    } else if (docName.toLowerCase().includes('copper') || docName.toLowerCase().includes('fluid') || docName.toLowerCase().includes('metallurgical')) {
      setTerminalAudience('Partner');
    } else if (docName.toLowerCase().includes('lithium') || docName.toLowerCase().includes('hydrology') || docName.toLowerCase().includes('environmental')) {
      setTerminalAudience('Government');
    } else {
      setTerminalAudience('General');
    }
    
    setActiveTab('contact');

    // Auto scroll
    setTimeout(() => {
      const formEl = document.getElementById('access-portal');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 120);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Dynamic Global Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onRequestAssistance={() => handleQuickRoute('Investor')}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <div className="animate-fadeIn">
            {/* Value Stat Hero */}
            <MetricHero 
              onQuickRoute={handleQuickRoute} 
              onExploreProjects={() => setActiveTab('projects')}
            />

            {/* Global Sovereign Search & Intelligence Desk */}
            <GlobalSearchSpace 
              setActiveTab={setActiveTab}
              onUnlockDoc={handleUnlockDoc}
            />

            {/* Combined Mini-Dashboards for high-converting landing structure */}
            <div className="bg-slate-900/10 py-16 border-b border-slate-800">
              <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                {[
                  {
                    title: 'Tier-One Capital Focus',
                    desc: 'We operate exclusively in stable, democratic OECD-compliant mining jurisdictions, guaranteeing raw metal supply chains against regional political conflicts.',
                    icon: Shield,
                    action: 'Verify Jurisdictions',
                    tab: 'projects'
                  },
                  {
                    title: 'Traceable Low Carbon Path',
                    desc: 'From solar grid matching to fully electrified underground loader operations, we supply premium grade concentrates backed by traceable carbon audits.',
                    icon: Sparkles,
                    action: 'Inspect ESG Targets',
                    tab: 'esg'
                  },
                  {
                    title: 'Qualified Institutional Scale',
                    desc: 'Our deposit sites represent over 22.4M oz gold equivalent in combined reserves, proven by core drilling assay tables open to validated research teams.',
                    icon: Scale,
                    action: 'Search Geologic Desk',
                    tab: 'library'
                  }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="bg-slate-900/40 p-8 rounded-none border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
                      <div>
                        <div className="p-3 bg-slate-850 inline-flex rounded-none text-amber-500 mb-6 border border-slate-800">
                          <Icon className="w-5 h-5 stroke-[1.8]" />
                        </div>
                        <h4 className="text-slate-100 font-bold uppercase tracking-wider text-sm font-mono mb-3">{item.title}</h4>
                        <p className="text-slate-400 text-xs font-light leading-relaxed mb-6">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setActiveTab(item.tab)}
                        className="cursor-pointer text-left text-xs font-mono font-bold uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>{item.action}</span>
                        <span>&rarr;</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Teaser panels for fast navigation */}
            <OperationsMapAndTour />
            <ProjectProspectus onUnlockDoc={handleUnlockDoc} />
            <ESGdashboard />
            <StonesTracker />
          </div>
        )}

        {activeTab === 'operations' && (
          <div className="animate-fadeIn">
            <OperationsMapAndTour />
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="animate-fadeIn">
            <ProjectProspectus onUnlockDoc={handleUnlockDoc} />
          </div>
        )}

        {activeTab === 'esg' && (
          <div className="animate-fadeIn">
            <ESGdashboard />
          </div>
        )}

        {activeTab === 'library' && (
          <div className="animate-fadeIn">
            <GeologyLibrary onUnlockDoc={handleUnlockDoc} />
          </div>
        )}

        {activeTab === 'news' && (
          <div className="animate-fadeIn">
            <Newsroom />
          </div>
        )}

        {activeTab === 'stones' && (
          <div className="animate-fadeIn">
            <StonesTracker />
          </div>
        )}

        {activeTab === 'trade' && (
          <div className="animate-fadeIn">
            <TradeDesk />
          </div>
        )}

        {/* Dynamic Qualified Terminal captures */}
        <div className={`${activeTab === 'contact' ? 'block animate-fadeIn' : 'hidden'}`}>
          <InquiryTerminal 
            initialAudience={terminalAudience} 
            gatedDocName={activeGateDoc}
            onSuccessClearDocGate={() => setActiveGateDoc(null)}
          />
        </div>
      </main>

      {/* Corporate Technical Footer & Public Disclosures */}
      <footer className="bg-slate-900 border-t border-slate-800 py-16 text-slate-400 text-xs font-sans text-left">
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-10">
          
          {/* Main Footer Block Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h4 className="text-white font-bold font-sans tracking-[0.16em] uppercase">MineX Gold, Silver & Bronze</h4>
              <p className="text-slate-400 font-light leading-relaxed text-[11px]">
                Providing institutional gold, silver, and bronze critical reserves and premium mineral assets. Headquartered in Vancouver, Canada with active operations in premium stable jurisdictions.
              </p>
              <div className="flex gap-4 font-mono text-[9px] text-slate-500">
                <span>TSX-V: MINX</span>
                <span>•</span>
                <span>ASX: MINX</span>
                <span>•</span>
                <span>OTC: MINXF</span>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="text-white font-mono text-[11px] font-bold tracking-widest uppercase">REGIONAL OFFICES</h5>
              <div className="space-y-2 text-[11px] font-light text-slate-400">
                <p className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Suite 1250, Georgia Corporate Tower, Vancouver, BC, Canada</span>
                </p>
                <p className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>34 Queen St Arcade, Brisbane, QLD 4000, Australia</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="text-white font-mono text-[11px] font-bold tracking-widest uppercase">INVESTOR SERVICES</h5>
              <div className="space-y-2 text-[11px] font-light text-slate-400">
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-500" />
                  <span>ir@minexmininggroup.com</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  <span>+1 (604) 555-0142</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="text-white font-mono text-[11px] font-bold tracking-widest uppercase">QUICK ACCESS VAULTS</h5>
              <div className="flex flex-col gap-2 font-mono text-[10px] text-slate-400">
                <button onClick={() => setActiveTab('projects')} className="hover:text-white transition-colors cursor-pointer text-left uppercase">Asset Grid</button>
                <button onClick={() => setActiveTab('esg')} className="hover:text-white transition-colors cursor-pointer text-left uppercase">ESG compliance data</button>
                <button onClick={() => setActiveTab('library')} className="hover:text-white transition-colors cursor-pointer text-left uppercase">NI 43-101 Statements</button>
                <button onClick={() => setActiveTab('news')} className="hover:text-white transition-colors cursor-pointer text-left uppercase">Quarterly Audits</button>
              </div>
            </div>
          </div>

          {/* Warning NI-43101 Disclaimer (Adds intense financial credibility) */}
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-none space-y-2 text-[11px] text-slate-500 leading-relaxed font-sans border-l-4 border-amber-500">
            <div className="flex items-center gap-1.5 text-amber-500 font-mono font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>National Instrument 43-101 Advisory & Disclaimer</span>
            </div>
            <p>
              All technical, geological, and mineral resource estimates featured on this website have been compiled and verified in accordance with standard National Instrument 43-101 (Standards of Disclosure for Mineral Projects) requirements. Dr. Jeremy Lockhart, P.Geo, is the "Qualified Person" under NI 43-101 guidelines responsible for reviewing and authorizing these structural geological models and assay logs.
            </p>
            <p>
              <strong>Forward-Looking Statements:</strong> This portal contains forward-looking information regarding projected metallurgical recovery schedules, capital requirements, mine lives, Net Present Values (NPV), and Internal Rates of Return (IRR). Such statements reflect management's current expectations, are speculative in nature, and carry substantial exploratory risks regarding metal spot fluctuations and environmental regulatory licensing.
            </p>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-[10px] text-slate-600 font-mono">
            <p>© 2026 MineX Gold, Silver & Bronze Ltd. All regulatory sovereign rights reserved.</p>
            <div className="flex gap-4">
              <span className="hover:text-white cursor-pointer select-none">Privacy Charter</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer select-none">Terms of Registry Disclosure</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer select-none">Traceability Protocols</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Public Interactive A.I. Support Console */}
      <AIAssistant />
      
      {/* Global Stakeholder Sign-In Overlay */}
      <LoginModal />
    </div>
  );
}
