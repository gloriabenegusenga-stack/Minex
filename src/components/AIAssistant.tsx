import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Terminal, ChevronRight, HelpCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: "ACCESS PROTOCOL INITIATED. I am the MineX Exploration and Investor Relations Support A.I. Ask me regarding our NI 43-101 mineral reserves, local ESG aquifer safety profiles, metallurgical volumes, or corporate scheduling parameters.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat list
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleQuery = (queryText: string) => {
    if (!queryText.trim() || isTyping) return;

    // Add User message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Dynamic expert responses with precise data
    setTimeout(() => {
      let reply = '';
      const prompt = queryText.toLowerCase();

      if (prompt.includes('gold') || prompt.includes('reserve') || prompt.includes('oz') || prompt.includes('aura')) {
        reply = "MineX owns 22.4 Million oz gold equivalent in combined reserves. Our primary asset, Aura Deepfields in Ontario, contains 12.8M oz proven & probable at 4.85 g/t Au. It is designed to be fully electric and automated, with an All-In Sustaining Cost (AISC) of only $845/oz (industry average is ~$1,250/oz). NPV is $1.24B post-tax.";
      } else if (prompt.includes('lithium') || prompt.includes('salar') || prompt.includes('dle') || prompt.includes('water') || prompt.includes('aquifer')) {
        reply = "The Sol Salar DLE Asset in Chile holds a 15.2M Tons LCE resource at 840 mg/L lithium concentration. Its Direct Lithium Extraction (DLE) model completely bypasses evaporation ponds, reinjecting 85% of spent brine back to subsurface aquifers. This results in direct surface ecological conservation and keeps local hydration curves secure.";
      } else if (prompt.includes('copper') || prompt.includes('concentrate') || prompt.includes('crest') || prompt.includes('volume')) {
        reply = "Copper Crest Phase 2 in Queensland holds a 245M Tons resource at 1.15% Cu equivalent. It has an estimated mine life of 28 years and an NPV of $2.10B. Under our latest binding offtake commits with European EV consortia, we will supply 30,000 tonnes of high-grade copper concentrate annually starting in FY28.";
      } else if (prompt.includes('ni 43-151') || prompt.includes('ni 43-101') || prompt.includes('compliant') || prompt.includes('qualified') || prompt.includes('report') || prompt.includes('lockhart')) {
        reply = "Absolutely. All mineral reserves and metallurgy tables on this system conform strictly to National Instrument 43-101 (NI 43-101) standards of disclosure. Dr. Jeremy Lockhart, P.Geo, acts as our resident independent Qualified Person. Full audit sheets can be logged and unlocked in the Geological Library tab.";
      } else if (prompt.includes('booking') || prompt.includes('meet') || prompt.includes('call') || prompt.includes('calendar') || prompt.includes('sterling')) {
        reply = "You can schedule secure 1-on-1 briefings directly from the Inquiry Terminal tab. Step 3 inside the terminal lets you select individual heads of department (such as Dr. Alistair Sterling for Sovereign Operations or Elaine Westlake for IR) and book real-time coordinate slots.";
      } else {
        reply = "MineX maintains active development campaigns in premium, stable democracies (Canada, Australia, Chile), specializing in gold, silver, and bronze processing. If you have specialized inquiries about our metallurgy assays, offtaking criteria, or CapEx timelines, please submit your stakeholder credentials inside our Access Terminal so our IR Desk can dispatch detailed PDFs.";
      }

      // Simulate typewriter transition
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  const quickPrompts = [
    { label: "Reserve Gold Figures", q: "What are your total resource gold metrics?" },
    { label: "DLE Lithium Eco-Audit", q: "How does the direct lithium extraction (DLE) preserve Atacama basin water?" },
    { label: "Copper Offtake Volumes", q: "What are your copper concentrate volume commitments?" },
    { label: "Qualified Person (NI 43-101)", q: "Is your mineral project compliant with NI 43-101 regulations?" }
  ];

  return (
    <>
      {/* Floating Circular Toggle Button */}
      <button
        id="ai-assistant-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 cursor-pointer w-14 h-14 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-sm flex items-center justify-center shadow-[0_4px_24px_rgba(245,158,11,0.3)] transition-transform hover:scale-105"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 animate-pulse" />}
      </button>

      {/* Floating Console Window */}
      {isOpen && (
        <div id="ai-assistant-console" className="fixed bottom-24 right-6 z-50 w-full max-w-[420px] h-[520px] bg-slate-950 border border-slate-800 rounded-none shadow-2xl flex flex-col overflow-hidden animate-fadeIn font-sans">
          
          {/* Console Header */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-amber-500 rounded-sm text-slate-950">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-black uppercase text-white font-mono tracking-wider">MINEX GEOLOGICAL SUPPORT</h4>
                <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">System Core Version 1.84</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Loop Area */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-950 text-left text-xs" ref={scrollRef}>
            {messages.map((m) => {
              const isAI = m.sender === 'assistant';
              return (
                <div key={m.id} className={`flex gap-2.5 items-start ${isAI ? '' : 'flex-row-reverse'}`}>
                  {/* Icon */}
                  <div className={`p-1.5 rounded-none flex-shrink-0 border ${
                    isAI ? 'bg-slate-900 border-slate-800 text-amber-500' : 'bg-amber-500 border-amber-500 text-slate-950'
                  }`}>
                    {isAI ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>

                  {/* Bubble Container */}
                  <div className="max-w-[78%] flex flex-col self-start">
                    <div className={`p-3 rounded-none text-xs leading-relaxed font-sans ${
                      isAI 
                        ? 'bg-slate-900/60 border border-slate-850 text-slate-300' 
                        : 'bg-slate-900 border border-slate-800 text-amber-500 font-medium'
                    }`}>
                      {m.text}
                    </div>
                    <span className="text-[8px] text-slate-600 font-mono mt-1 uppercase tracking-wider self-end select-none">
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Simulated Typist loader */}
            {isTyping && (
              <div className="flex gap-2.5 items-start">
                <div className="p-1.5 bg-slate-900 border border-slate-800 text-amber-500 rounded-none flex-shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-slate-900/40 border border-slate-850 p-3 text-slate-500 font-mono text-[10px] uppercase tracking-widest animate-pulse">
                  Querying reservoir metrics database...
                </div>
              </div>
            )}
          </div>

          {/* Quick-Prompt Recommendation Panel */}
          <div className="px-4 py-2 border-t border-slate-900/80 bg-slate-950/90 text-left">
            <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase font-bold flex items-center gap-1 mb-2">
              <HelpCircle className="w-3 h-3 text-amber-500" /> RECOMMENDED ANALYTIC LOOPS
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuery(p.q)}
                  className="cursor-pointer text-left text-[9.5px] font-mono uppercase bg-slate-905 border border-slate-850 hover:border-amber-500/60 text-slate-400 hover:text-white px-2 py-1 rounded-none transition-all duration-200"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chat Field */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleQuery(inputVal);
            }} 
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask core assay records or offtake parameters..."
              className="flex-grow bg-slate-950 text-xs text-slate-200 border border-slate-850 focus:border-amber-500 focus:outline-none p-2.5 rounded-none font-sans"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className="cursor-pointer bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 p-2.5 rounded-none font-black flex items-center justify-center transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
