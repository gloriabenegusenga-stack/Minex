import { useState, useEffect, FormEvent } from 'react';
import { Inquiry } from '../types';
import { useLanguage } from '../LanguageContext';
import { useAuth } from '../AuthContext';
import { Shield, Sparkles, Building2, Earth, Users2, HelpCircle, CheckCircle2, ListFilter, Trash2 } from 'lucide-react';

interface InquiryTerminalProps {
  initialAudience: 'Investor' | 'Partner' | 'Government' | 'General';
  gatedDocName: string | null;
  onSuccessClearDocGate: () => void;
}

export default function InquiryTerminal({ 
  initialAudience, 
  gatedDocName,
  onSuccessClearDocGate 
}: InquiryTerminalProps) {
  const [audienceType, setAudienceType] = useState<'Investor' | 'Partner' | 'Government' | 'General'>(initialAudience);
  const { t } = useLanguage();
  const { user } = useAuth();
  
  // Set form inputs
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');

  // Prefill email if authenticated
  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);
  
  // Dynamic fields
  const [aumRange, setAUMRange] = useState('$5M - $50M');
  const [projectOfInterest, setProjectOfInterest] = useState('Aura Deepfields Gold');
  const [metalType, setMetalType] = useState('Copper Concentrates');
  const [metalVolume, setMetalVolume] = useState('25,000 Metric Tonnes');
  const [regulatoryTopic, setRegulatoryTopic] = useState('Environmental Hydrology Approvals');
  
  // History of inquiries stored in state (backed up by LocalStorage)
  const [submissions, setSubmissions] = useState<Inquiry[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sovereign Meeting Scheduler states
  const [selectedCoordinator, setSelectedCoordinator] = useState<'Dr. Alistair Sterling' | 'Elaine Westlake'>('Elaine Westlake');
  const [selectedDay, setSelectedDay] = useState<number>(4); // Default to June 4th
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:15 UTC');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const handleBookMeeting = () => {
    // Check if the user filled their email or full name in the form above to personalize the booking experience!
    const targetEmail = email || 'your work email';
    setBookingSuccess(`SUCCESS: Encrypted briefing coordinate secured on June ${selectedDay}, 2026 at ${selectedTimeSlot} with ${selectedCoordinator}. A secure calendar stream invite and virtual meeting coordinates have been dispatched to ${targetEmail}. Ready for compliance verification.`);
  };

  // Sync component states on initial selection change from parent metrics clicks
  useEffect(() => {
    setAudienceType(initialAudience);
  }, [initialAudience]);

  // Load submissions from localstorage
  useEffect(() => {
    const cached = localStorage.getItem('minex_inquiries');
    if (cached) {
      try {
        setSubmissions(JSON.parse(cached));
      } catch (err) {
        console.error('Error reloading caches', err);
      }
    }
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem('minex_inquiries');
    setSubmissions([]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!fullName || !organization || !email || !details) {
      alert('Please fill out all required parameters inside the registry.');
      return;
    }

    // Capture dynamic structured info
    const extraFields: Record<string, string> = {};
    if (audienceType === 'Investor') {
      extraFields['AUM Portfolio Range'] = aumRange;
      extraFields['Asset Focus'] = projectOfInterest;
    } else if (audienceType === 'Partner') {
      extraFields['Required Mineral Specification'] = metalType;
      extraFields['Target Annual Volume'] = metalVolume;
    } else if (audienceType === 'Government') {
      extraFields['Regulatory Category'] = regulatoryTopic;
    }

    const newInquiry: Inquiry = {
      id: 'MINEX-' + Math.floor(Math.random() * 90000 + 10000),
      name: fullName,
      organization,
      audienceType,
      email,
      details,
      submittedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
      status: 'Received',
      additionalData: extraFields
    };

    const updated = [newInquiry, ...submissions];
    setSubmissions(updated);
    localStorage.setItem('minex_inquiries', JSON.stringify(updated));

    // Clear main inputs
    setFullName('');
    setOrganization('');
    setEmail('');
    setDetails('');

    // Successful Trigger State
    if (gatedDocName) {
      setSuccessMsg(`VERIFIED: Security credentials approved for download stream. Restricted File matching "${gatedDocName}" is now fully decrypted and has been dispatched to ${email}. You have also unlocked the entire Technical Library index!`);
      onSuccessClearDocGate();
    } else {
      setSuccessMsg(`REGISTRATION SUCCESSFUL: Your credentials have been authorized. High-level investor relation updates will be processed to ${email} instantly. Reference Code: ${newInquiry.id}`);
    }

    // Scroll slightly to success alert banner
    const el = document.getElementById('success-banner-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="access-portal" className="w-full bg-slate-950 py-20 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Anchor point */}
        <div id="success-banner-anchor"></div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-amber-500 uppercase font-bold">
              <Shield className="w-4 h-4 text-amber-500" />
              <span>{t('gatewayInvestor') || 'Sovereign & Investor Access Desk'}</span>
            </div>
            <h2 className="text-3xl font-black uppercase text-white tracking-tighter leading-none mt-2 mb-3">
              {t('inquiryTitle')} <span className="text-slate-500 font-black">{t('inquiryTitlePost')}</span>
            </h2>
            <p className="text-slate-400 text-xs md:text-sm font-light max-w-xl leading-relaxed">
              {t('inquiryDesc')}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-none px-4 py-1.5 inline-flex items-center gap-1.5 text-xs font-mono text-slate-450 font-bold uppercase">
            <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>SECURE AES-256 REGISTRATION</span>
          </div>
        </div>

        {/* Dynamic PDF Unlock Toast */}
        {gatedDocName && !successMsg && (
          <div className="mb-8 p-5 bg-slate-900 rounded-none border border-amber-500/40 text-left flex gap-4 items-center animate-pulse">
            <span className="text-sm font-bold text-amber-500 font-mono flex-shrink-0">🔒 HIGH-SECURITY GATE ACTIVE:</span>
            <span className="text-xs text-slate-400">
              You selected the locked document <strong>"{gatedDocName}"</strong>. Complete the credentials verification process below to instantly dispatch PDF download rights.
            </span>
          </div>
        )}

        {/* Submission success popup */}
        {successMsg && (
          <div className="mb-8 p-6 bg-slate-900 rounded-none border border-emerald-500 text-left flex flex-col md:flex-row md:items-center gap-4 animate-fadeIn justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-450 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-emerald-450 font-black font-mono text-xs uppercase tracking-wider">SECURITY VALIDATED SUCCESSFULLY</h4>
                <p className="text-slate-300 text-xs mt-1.5 font-sans leading-relaxed">{successMsg}</p>
              </div>
            </div>
            <button
              onClick={() => setSuccessMsg(null)}
              className="cursor-pointer bg-emerald-950/40 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 px-4 py-2.5 rounded-none text-xs font-mono uppercase font-black tracking-widest whitespace-nowrap"
            >
              Dismiss Notice
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive adaptive form inputs */}
          <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800 rounded-none p-6 md:p-8 shadow-none text-left space-y-6">
            <h3 className="text-slate-500 text-[10px] font-mono tracking-widest uppercase font-bold">
              Step 1: Validate Your Stakeholder Persona
            </h3>

            {/* Persona Grid Selector */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950 p-2 rounded-none border border-slate-850 text-center">
              {[
                { id: 'Investor' as const, label: 'Investor', icon: Building2 },
                { id: 'Partner' as const, label: 'Offtake Client', icon: Earth },
                { id: 'Government' as const, label: 'Regulatory', icon: Users2 },
                { id: 'General' as const, label: 'General Info', icon: HelpCircle }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = audienceType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setAudienceType(item.id);
                      setSuccessMsg(null); // Clear success msg
                    }}
                    className={`cursor-pointer flex flex-col items-center justify-center p-3.5 rounded-none transition-all duration-200 ${
                      isSelected
                        ? 'bg-slate-900 text-amber-500 border border-amber-500 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-2 stroke-[1.8]" />
                    <span className="text-[10px] uppercase tracking-wide font-mono font-bold leading-none">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 pt-3 font-sans">
              <h3 className="text-slate-500 text-[10px] font-mono tracking-widest uppercase font-bold">
                Step 2: Enter Compliance Verification Info
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-xs font-medium block mb-2 font-mono uppercase tracking-wider text-[10px]">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Alistair Sterling"
                    className="w-full bg-slate-950 text-xs text-white rounded-none px-4 py-3.5 border border-slate-800 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs font-medium block mb-2 font-mono uppercase tracking-wider text-[10px]">Company / Sovereign Agency</label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Apex sovereign Wealth / LME Minerals"
                    className="w-full bg-slate-950 text-xs text-white rounded-none px-4 py-3.5 border border-slate-800 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-xs font-medium block mb-2 font-mono uppercase tracking-wider text-[10px]">Corporate/Work Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alistair.sterling@organization.com"
                  className="w-full bg-slate-950 text-xs text-white rounded-none px-4 py-3.5 border border-slate-800 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* Dynamic Adaptable Inputs Area based on active stakeholder */}
              {audienceType === 'Investor' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-950 rounded-none border border-slate-850 animate-fadeIn">
                  <div>
                    <label className="text-amber-500 text-xs font-mono block mb-2 font-bold uppercase tracking-wider text-[9px]">Institutional AUM Capacity</label>
                    <select
                      value={aumRange}
                      onChange={(e) => setAUMRange(e.target.value)}
                      className="w-full bg-slate-900 text-xs text-white rounded-none p-3 outline-none border border-slate-800 font-mono cursor-pointer"
                    >
                      <option value="Sub $5M">Sub $5,000,000 USD</option>
                      <option value="$5M - $50M">$5,000,000 - $50,000,000 USD</option>
                      <option value="$50M - $250M">$50,000,000 - $250,000,000 USD</option>
                      <option value="$250M+">$250,000,000+ USD (Tier-One IR Direct)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-amber-500 text-xs font-mono block mb-2 font-bold uppercase tracking-wider text-[9px]">Resource Asset Focus</label>
                    <select
                      value={projectOfInterest}
                      onChange={(e) => setProjectOfInterest(e.target.value)}
                      className="w-full bg-slate-900 text-xs text-white rounded-none p-3 outline-none border border-slate-800 font-mono cursor-pointer"
                    >
                      <option value="Aura Deepfields Gold">Aura Deepfields Undergound Gold</option>
                      <option value="Copper Crest Development">Copper Crest Open-Pit Copper</option>
                      <option value="Sol Salar DLE">Sol Salar DLE Lithium Hydroxides</option>
                      <option value="Consolidated Portfolio">All Consolidated MineX Reserves</option>
                    </select>
                  </div>
                </div>
              )}

              {audienceType === 'Partner' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-950 rounded-none border border-slate-850 animate-fadeIn">
                  <div>
                    <label className="text-amber-500 text-xs font-mono block mb-2 font-bold uppercase tracking-wider text-[9px]">Lithology Metallurgy Specification</label>
                    <select
                      value={metalType}
                      onChange={(e) => setMetalType(e.target.value)}
                      className="w-full bg-slate-900 text-xs text-white rounded-none p-3 outline-none border border-slate-800 font-mono cursor-pointer"
                    >
                      <option value="Copper Concentrates">Copper Concentrates (30% pure Cu equivalent)</option>
                      <option value="Lithium Hydroxide">Battery-Grade Lithium Hydroxide (DLE Trace)</option>
                      <option value="Gold Bullion">Fine Gold Bullion bars (XAU 99.99%)</option>
                      <option value="Co-product Zinc">Zinc Concentrate (Secondary refining)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-amber-500 text-xs font-mono block mb-2 font-bold uppercase tracking-wider text-[9px]">Annual Volume Requirement</label>
                    <select
                      value={metalVolume}
                      onChange={(e) => setMetalVolume(e.target.value)}
                      className="w-full bg-slate-900 text-xs text-white rounded-none p-3 outline-none border border-slate-800 font-mono cursor-pointer"
                    >
                      <option value="Sub 10,000 Metric Tonnes">Sub 10,000 Metric Tonnes</option>
                      <option value="10k - 50k Metric Tonnes">10,000 - 50,000 Metric Tonnes</option>
                      <option value="50,000+ Metric Tonnes">50,000+ Metric Tonnes (Contract allocation)</option>
                      <option value="Gold Spot delivery">Gold Spot bullion delivery (oz)</option>
                    </select>
                  </div>
                </div>
              )}

              {audienceType === 'Government' && (
                <div className="p-4 bg-slate-950 rounded-none border border-slate-850 animate-fadeIn">
                  <label className="text-amber-500 text-xs font-mono block mb-2 font-bold uppercase tracking-wider text-[9px]">Primary Department Regulatory Focus</label>
                  <select
                    value={regulatoryTopic}
                    onChange={(e) => setRegulatoryTopic(e.target.value)}
                    className="w-full bg-slate-905 text-xs text-white rounded-none p-3 outline-none border border-slate-800 font-mono cursor-pointer w-full bg-slate-900"
                  >
                    <option value="Environmental Hydrology Approvals">Environmental Hydrology & Mine Water Reclamation</option>
                    <option value="Local Employment & Trust Audits">Local First Nations & Regional Landowner Trust Audits</option>
                    <option value="Mine Tailings Telemetry & Safety Checks">Mine Tailings Telemetry & Seismology Inspections</option>
                    <option value="Royalties / Treasury Contribution">Group Royalties & Sovereign Corporate Taxation accounts</option>
                  </select>
                </div>
              )}

              {/* Message Context Details */}
              <div>
                <label className="text-slate-450 text-xs font-medium block mb-2 font-mono uppercase tracking-wider text-[10px]">
                  {audienceType === 'Investor' ? 'Confirm Investment Mandate & Scope' :
                   audienceType === 'Partner' ? 'Outline Offtake Delivery Criteria' :
                   audienceType === 'Government' ? 'Verify Regulation Codes / Inquest Context' :
                   'Message / General Request Details'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Please state details regarding background, specific project parameters required, or regulatory authority credentials..."
                  className="w-full bg-slate-950 text-xs text-white rounded-none px-4 py-3.5 border border-slate-800 focus:outline-none focus:border-amber-500 transition-all font-sans leading-relaxed"
                />
              </div>

              {/* Submit credentials terminal button */}
              <button
                type="submit"
                className="cursor-pointer w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-3.5 rounded-none font-black uppercase text-xs tracking-wider transition-all shadow-none flex items-center justify-center gap-2 h-12"
              >
                <span>Authorize & Unlock Compliance Data</span>
              </button>
            </form>
          </div>

          {/* Right Column: Simulated Live Submission Verification Monitor Logs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/40 border border-slate-800 rounded-none p-6 shadow-none text-left">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div>
                  <h4 className="text-slate-200 font-black font-mono text-xs uppercase tracking-wider">Registry Submission Monitor</h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase tracking-wide">Persistent Verification Archive</p>
                </div>
                {submissions.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="cursor-pointer text-[10px] font-mono uppercase bg-rose-950/20 text-rose-450 hover:bg-rose-950/40 hover:text-white px-2.5 py-1 rounded-none transition-colors flex items-center gap-1.5 border border-rose-900"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Purge logs</span>
                  </button>
                )}
              </div>

              {submissions.length === 0 ? (
                <div className="py-12 px-4 text-center border border-dashed border-slate-800 rounded-none text-slate-500 font-mono text-[11px] space-y-3">
                  <p>● NO SUBMISSIONS PENDING</p>
                  <p className="text-slate-600 max-w-xs mx-auto leading-normal">
                    Submit verified credentials in the terminal form to register a secure dispatch entry.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                  {submissions.map((sub) => (
                    <div 
                      key={sub.id} 
                      className="bg-slate-950 p-4 rounded-none border border-slate-850 space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-mono font-bold text-[10px] bg-slate-900 px-2.5 py-0.5 rounded-none border border-slate-850">
                          {sub.id}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-none bg-emerald-950/25 text-emerald-450 font-bold font-mono text-[9px] uppercase border border-emerald-900/40">
                          <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping" />
                          {sub.status}
                        </span>
                      </div>

                      <div className="space-y-1 font-sans">
                        <p className="text-white font-semibold">{sub.name} • <span className="text-slate-400 text-[11px]">{sub.organization}</span></p>
                        <p className="text-slate-500 text-[11px]">{sub.email}</p>
                      </div>

                      {/* Display customized extra attributes */}
                      {Object.entries(sub.additionalData).length > 0 && (
                        <div className="border-t border-slate-900/80 pt-2.5 mt-2.5 space-y-1 font-mono text-[10px]">
                          {Object.entries(sub.additionalData).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-slate-500">{key}:</span>
                              <span className="text-amber-500 font-semibold">{value}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="border-t border-slate-900/80 pt-2.5 mt-2.5">
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Credentials Narrative Summary</span>
                        <p className="text-slate-400 mt-1 leading-relaxed text-xs break-words">{sub.details}</p>
                      </div>

                      <p className="text-[9px] text-slate-500 font-mono text-right">{sub.submittedAt}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sovereign Meeting Booking Calendar */}
            <div className="bg-slate-900 border border-slate-800 rounded-none p-6 shadow-none text-left space-y-5">
              <div>
                <h4 className="text-slate-200 font-black font-mono text-xs uppercase tracking-wider">Sovereign Briefing Calendar</h4>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase tracking-wide">Coordinate 1-on-1 Regulatory or Capital Calls</p>
              </div>

              {/* Coordinator selection */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {[
                  { name: 'Dr. Sterling', role: 'VP Operations', desc: 'Sovereign / Metals spec' },
                  { name: 'Elaine Westlake', role: 'Head of IR', desc: 'AUM / CapEx profile' }
                ].map((c) => {
                  const isCur = (c.name === 'Dr. Sterling' && selectedCoordinator === 'Dr. Alistair Sterling') ||
                                (c.name === 'Elaine Westlake' && selectedCoordinator === 'Elaine Westlake');
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        setSelectedCoordinator(c.name === 'Dr. Sterling' ? 'Dr. Alistair Sterling' : 'Elaine Westlake');
                        setBookingSuccess(null);
                      }}
                      className={`cursor-pointer p-2.5 border text-left transition-colors ${
                        isCur
                          ? 'bg-slate-950 border-amber-500 text-amber-500'
                          : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:text-white'
                      }`}
                    >
                      <p className="font-bold text-[10.5px] uppercase">{c.name}</p>
                      <p className="text-[9px] text-slate-450 mt-0.5 leading-none font-sans font-semibold">{c.role}</p>
                      <p className="text-[8px] text-slate-500 mt-1 uppercase font-mono tracking-wider leading-none">{c.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Day Selector (June 2026 calendar matrix) */}
              <div className="bg-slate-950 p-4 border border-slate-850">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase mb-3 border-b border-slate-900 pb-2">
                  <span className="text-slate-400">June 2026</span>
                  <span className="text-amber-500 font-black">Mon - Fri Slots Open</span>
                </div>

                <div className="grid grid-cols-7 gap-1 text-[10px] font-mono text-center mb-1">
                  {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                    <span key={day} className="text-slate-600 font-bold uppercase">{day}</span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 text-[10px] font-mono">
                  {/* Padding offsets for June 2026 (Starts on a Monday) */}
                  {Array.from({ length: 30 }).map((_, idx) => {
                    const dayNum = idx + 1;
                    // Determine weekday (1 is Monday, 5 is Friday)
                    const dayOfWeek = (idx % 7) + 1;
                    const isWeekend = dayOfWeek > 5;
                    const isSelected = selectedDay === dayNum;

                    return (
                      <button
                        key={dayNum}
                        type="button"
                        disabled={isWeekend}
                        onClick={() => {
                          setSelectedDay(dayNum);
                          setBookingSuccess(null);
                        }}
                        className={`py-1.5 font-bold transition-all ${
                          isWeekend 
                            ? 'text-slate-800 cursor-not-allowed select-none' 
                            : isSelected
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'text-slate-350 hover:bg-slate-900 hover:text-white cursor-pointer'
                        }`}
                      >
                        {dayNum}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots selector */}
              <div className="space-y-2">
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider font-bold block mb-1">Select focus slot</span>
                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                  {[
                    { val: '09:30 UTC', label: 'Metallurgy & Permitting' },
                    { val: '11:15 UTC', label: 'Drill Hole Assays Core Review' },
                    { val: '14:00 UTC', label: 'Consolidated ESG water audit' },
                    { val: '16:00 UTC', label: 'Institutional AUM Placing details' }
                  ].map((s) => (
                    <button
                      key={s.val}
                      type="button"
                      onClick={() => {
                        setSelectedTimeSlot(s.val);
                        setBookingSuccess(null);
                      }}
                      className={`cursor-pointer p-2 border transition-colors text-left ${
                        selectedTimeSlot === s.val
                          ? 'bg-slate-950 border-amber-500 text-amber-500 font-bold'
                          : 'bg-slate-950/20 border-slate-850 text-slate-400 hover:text-white'
                      }`}
                    >
                      <p className="font-semibold text-white">{s.val}</p>
                      <p className="text-[8px] text-slate-500 uppercase mt-0.5 font-sans leading-relaxed">{s.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Booking Trigger Button */}
              <button
                type="button"
                onClick={handleBookMeeting}
                className="cursor-pointer w-full bg-slate-950 hover:bg-slate-900 text-white font-bold py-2.5 rounded-none text-xs font-mono uppercase border border-slate-800 hover:border-amber-500 transition-colors tracking-widest text-center"
              >
                Schedule Briefing Slot
              </button>

              {/* Booking success notification inside cards */}
              {bookingSuccess && (
                <div className="bg-slate-950 border border-emerald-500 p-4 animate-fadeIn space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-450 mt-0.5 flex-shrink-0" />
                    <div className="text-xs">
                      <p className="text-emerald-450 font-mono font-bold uppercase text-[10px] tracking-wider">Briefing Slot Held</p>
                      <p className="text-slate-300 font-sans leading-relaxed text-[11px] mt-1">
                        {bookingSuccess}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Regulatory & Security Guidelines Note */}
            <div className="bg-slate-900 border border-slate-850 rounded-none p-5 text-left space-y-2">
              <h5 className="text-white font-mono text-xs uppercase tracking-wider font-bold">Traceability Statement</h5>
              <p className="text-slate-400 text-[11px] font-light leading-relaxed">
                MineX Gold, Silver & Bronze Group maintains fully validated legal trace indexes from mine source directly to physical delivery. All metallurgical concentrates, core grades, and environmental balances comply with the international mineral standards and localized environmental protection decrees.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
