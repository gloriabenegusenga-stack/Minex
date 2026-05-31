import React, { useState, useEffect } from 'react';
import { useAuth, countriesData } from '../AuthContext';
import { useLanguage } from '../LanguageContext';
import { 
  X, Mail, Phone, ShieldCheck, Sparkles, MessageSquareCode, Search, 
  ChevronDown, Check, Fingerprint, Wallet, CreditCard, Loader2, Cpu, KeyRound,
  DollarSign, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type LoginTab = 'mfa' | 'web3' | 'passkey' | 'rfid';

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<LoginTab>('mfa');

  // MFA state
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countriesData[0]); // Default to US
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [authStep, setAuthStep] = useState<'details' | 'verify'>('details');
  const [verifyCode, setVerifyCode] = useState('');
  const [simulatedCode, setSimulatedCode] = useState('');

  // Web3 state
  const [selectedWallet, setSelectedWallet] = useState<'metamask' | 'coinbase' | 'phantom' | 'ledger'>('metamask');
  const [web3Status, setWeb3Status] = useState<'disconnected' | 'connecting' | 'connected' | 'signing' | 'signed'>('disconnected');
  const [web3Logs, setWeb3Logs] = useState<string[]>([]);
  const [web3Addr, setWeb3Addr] = useState('');

  // Passkey state
  const [passkeyStep, setPasskeyStep] = useState<'idle' | 'initiating' | 'scanning' | 'complete'>('idle');
  const [scanProgress, setScanProgress] = useState(0);

  // RFID state
  const [fobId, setFobId] = useState('');
  const [fobDepartment, setFobDepartment] = useState('Deep Drift Exploration');
  const [fobAlert, setFobAlert] = useState<string | null>(null);

  // Common errors
  const [errorText, setErrorText] = useState<string | null>(null);

  // Payment Gated States
  const [isPaid, setIsPaid] = useState<boolean>(() => {
    return localStorage.getItem('minex_login_paid') === 'true';
  });
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'one-time'>(() => {
    return (localStorage.getItem('minex_login_paid_plan') as 'monthly' | 'one-time') || 'monthly';
  });
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentStep, setPaymentStep] = useState<number>(0);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setCardExpiry(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3);
    setCardCvv(value);
  };

  const triggerQuickPaymentAutofill = () => {
    setCardName('STAKEHOLDER EXPLORER');
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/28');
    setCardCvv('992');
    setPaymentPhone('+1 (555) 019-2834');
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || cardNumber.replace(/\s/g, '').length < 16 || cardExpiry.length < 5 || cardCvv.length < 3 || !paymentPhone.trim()) {
      setErrorText('Please fill out all the payment details correctly, including telephone number and credit card.');
      return;
    }
    
    setErrorText(null);
    setPaymentStatus('processing');
    setPaymentStep(1);

    // Dynamic processing steps through timer intervals
    setTimeout(() => {
      setPaymentStep(2);
      setTimeout(() => {
        setPaymentStep(3);
        setTimeout(() => {
          setPaymentStatus('success');
          localStorage.setItem('minex_login_paid', 'true');
          localStorage.setItem('minex_login_paid_plan', selectedPlan);
          setTimeout(() => {
            setIsPaid(true);
          }, 1200);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  function resetState() {
    // MFA keys
    setEmail('');
    setPhoneNumber('');
    setVerifyCode('');
    setSimulatedCode('');
    setAuthStep('details');
    // Web3 keys
    setWeb3Status('disconnected');
    setWeb3Logs([]);
    setWeb3Addr('');
    // Passkey keys
    setPasskeyStep('idle');
    setScanProgress(0);
    // RFID keys
    setFobId('');
    setFobAlert(null);
    setErrorText(null);
  }

  useEffect(() => {
    if (!isLoginModalOpen) {
      resetState();
    }
  }, [isLoginModalOpen]);

  if (!isLoginModalOpen) return null;

  const filteredCountries = countriesData.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.includes(searchQuery)
  );

  // ----------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------

  // 1. MFA Sign In Code dispatch
  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phoneNumber) {
      setErrorText('Please enter your stakeholder email and phone number.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorText('Please provide a valid corporate email address.');
      return;
    }

    if (phoneNumber.length < 5) {
      setErrorText('Please enter a valid phone number corresponding to your selected country.');
      return;
    }

    setErrorText(null);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedCode(code);
    setAuthStep('verify');
    
    console.log(`[MINEX SECURE PORTAL] Verification Code sent for security compliance dispatch: ${code}`);
  };

  // 1b. MFA code matches
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyCode === simulatedCode || verifyCode === '123456') {
      setErrorText(null);
      const sanitizedPhone = `${selectedCountry.code} ${phoneNumber}`;
      login(email, sanitizedPhone, selectedCountry.code, selectedCountry.name, selectedCountry.flag);
      resetState();
    } else {
      setErrorText('Verification token mismatch or expired. Please look at your telemetry alerts or enter the simulation override [123456].');
    }
  };

  // 2. Web3 Simulation Action
  const handleWeb3Connect = () => {
    setWeb3Status('connecting');
    setWeb3Logs(['[system] Initializing blockchain connection protocol...', '[system] querying injected provider...']);

    setTimeout(() => {
      let adr = '';
      if (selectedWallet === 'metamask') {
        adr = '0x3F91a' + Math.floor(1000 + Math.random() * 9000) + '...C729';
      } else if (selectedWallet === 'coinbase') {
        adr = '0x992B1' + Math.floor(1000 + Math.random() * 9000) + '...004E';
      } else if (selectedWallet === 'phantom') {
        adr = 'SolXGa' + Math.floor(100 + Math.random() * 900) + 'r7' + '...m19X';
      } else {
        adr = 'LdgA99' + Math.floor(1000 + Math.random() * 9000) + '...F81D';
      }

      setWeb3Addr(adr);
      setWeb3Status('connected');
      setWeb3Logs(prev => [
        ...prev,
        `[rpc] Verified account balance on ChainID: 1 (Mainnet)`,
        `[provider] Account loaded: ${adr}`,
        `[system] Ready for secure cryptographic challenge sign`
      ]);
    }, 1200);
  };

  const handleWeb3SignAndLogin = () => {
    setWeb3Status('signing');
    setWeb3Logs(prev => [...prev, `[sig] Prompting cryptographic challenge signature payload...`]);

    setTimeout(() => {
      setWeb3Status('signed');
      setWeb3Logs(prev => [...prev, `[sig] ECDSA SHA-256 signature generated successfully!`, `[auth] Security proof verified.`]);

      setTimeout(() => {
        const walletName = selectedWallet === 'metamask' ? 'MetaMask' 
                         : selectedWallet === 'coinbase' ? 'Coinbase' 
                         : selectedWallet === 'phantom' ? 'Phantom' : 'Ledger';
        login(web3Addr, 'ECDSA Signature Token Passed', 'Web3', walletName, '🌐');
        resetState();
      }, 800);
    }, 1200);
  };

  // 3. Passkey Simulated Verification
  const handlePasskeyStart = () => {
    setPasskeyStep('initiating');
    setTimeout(() => {
      setPasskeyStep('scanning');
      setScanProgress(0);
    }, 800);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (passkeyStep === 'scanning') {
      interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setPasskeyStep('complete');
              setTimeout(() => {
                login('hardware.passkey@minex.com', 'FIDO2 Biometric Auth Token', 'FIDO2', 'Sovereign Passkey Keyring', '🔑');
                resetState();
              }, 800);
            }, 600);
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [passkeyStep]);

  // 4. RFID card reader simulation
  const handleRfidScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fobId) {
      setFobAlert('Please enter your 10-digit Mine Fob RFID ID code.');
      return;
    }

    const reg = /^[A-Za-z0-9-]+$/;
    if (!reg.test(fobId)) {
      setFobAlert('Invalid alphanumeric syntax. Use digits or standard dashes.');
      return;
    }

    setFobAlert(null);
    login(`fob.operator-${fobId}@minex.com`, `Station: ${fobDepartment}`, 'RFID', 'Physical Security FOB', '🎴');
    resetState();
  };

  const handleApplyQuickFob = (code: string) => {
    setFobId(code);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      {/* Container Card */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 text-left rounded-none shadow-2xl p-5 md:p-7 space-y-5 my-6">
        
        {/* Close button */}
        <button 
          onClick={() => {
            closeLoginModal();
            resetState();
          }}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand identity */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-amber-500 uppercase font-black">
            <ShieldCheck className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>STAKEHOLDER GATEWAY SECURITY DECK</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase text-white tracking-tighter leading-none mt-1">
            Sovereign <span className="text-amber-500">Authentication</span> Suite
          </h2>
          <p className="text-slate-400 text-[10px] font-mono leading-relaxed uppercase tracking-wider">
            Enterprise Verification Portal • SECURE CHANNEL GATED: 256-BIT
          </p>
        </div>

        {!isPaid ? (
          <div className="space-y-4">
            {/* Custom Payment Plan Choice Selection Container */}
            <div className="space-y-1.5 font-mono text-xs">
              <span className="block text-[8px] text-slate-500 uppercase font-bold tracking-widest">SELECT SECURE CLEARANCE LICENSE</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPlan('monthly')}
                  className={`p-3 border text-left flex flex-col justify-between transition-all cursor-pointer rounded-none relative overflow-hidden ${
                    selectedPlan === 'monthly'
                      ? 'border-amber-500 bg-slate-950 text-white'
                      : 'border-slate-800 bg-slate-950/20 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[9px] font-black uppercase tracking-wider">Monthly license</span>
                    <span className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${
                      selectedPlan === 'monthly' ? 'border-amber-500 bg-amber-500 text-slate-950' : 'border-slate-700'
                    }`}>
                      {selectedPlan === 'monthly' && <Check className="w-2.5 h-2.5" />}
                    </span>
                  </div>
                  <div className="mt-2 text-left">
                    <p className="text-sm font-black text-white leading-none">$200.00<span className="text-[9px] text-slate-500 font-normal">/mo</span></p>
                    <p className="text-[8px] text-slate-500 uppercase mt-1 leading-none">Billed every month</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPlan('one-time')}
                  className={`p-3 border text-left flex flex-col justify-between transition-all cursor-pointer rounded-none relative overflow-hidden ${
                    selectedPlan === 'one-time'
                      ? 'border-amber-500 bg-slate-950 text-white'
                      : 'border-slate-800 bg-slate-950/20 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[9px] font-black uppercase tracking-wider">Verify Escrow</span>
                    <span className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${
                      selectedPlan === 'one-time' ? 'border-amber-500 bg-amber-500 text-slate-950' : 'border-slate-700'
                    }`}>
                      {selectedPlan === 'one-time' && <Check className="w-2.5 h-2.5" />}
                    </span>
                  </div>
                  <div className="mt-2 text-left">
                    <p className="text-sm font-black text-white leading-none">$5.00 <span className="text-[9px] text-slate-500 font-normal">USD</span></p>
                    <p className="text-[8px] text-slate-500 uppercase mt-1 leading-none">One-time token fee</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-slate-950 border border-amber-500/10 p-3.5 rounded-none space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-amber-500 uppercase font-black tracking-wider">
                <Lock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>{selectedPlan === 'monthly' ? 'ACTIVE $200.00 RECURRING SUSPENSION DECK' : 'ESCROW GATEWAY DEPOSIT REQUIRED'}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400 font-sans">
                {selectedPlan === 'monthly' ? (
                  <>
                    A recurring monthly subscription of <strong className="text-white font-mono">$200.00 USD / month</strong> is required to unlock full access. This supports complete sovereign trading coordinates, private reserve models, and direct assays.
                  </>
                ) : (
                  <>
                    In compliance with Guest Access rules, an identity verification escrow token fee of <strong className="text-white font-mono">$5.00 USD</strong> is required to decrypt enterprise authentication credentials.
                  </>
                )}
              </p>
            </div>

            {/* Visual Credit Card */}
            <div className="relative w-full aspect-[1.586/1] bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 border border-slate-800 p-5 flex flex-col justify-between font-mono shadow-xl overflow-hidden rounded-none select-none">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[9px] text-amber-500 uppercase font-black tracking-widest block">MINEX CARD</span>
                  <div className="w-8 h-6 bg-gradient-to-tr from-amber-500/20 to-amber-400/45 rounded border border-amber-500/50 flex flex-col justify-around p-1">
                    <div className="h-0.5 w-full bg-amber-500/35"></div>
                    <div className="h-0.5 w-full bg-amber-500/35"></div>
                  </div>
                </div>
                <div className="text-right text-[8.5px] text-slate-500 font-black">
                  <p className="font-sans font-black tracking-tight text-white uppercase text-[9px]">MINEX PAY</p>
                  <p className="uppercase mt-0.5 tracking-wider">SECURE ESCROW</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-lg md:text-xl font-bold tracking-[0.14em] text-white">
                  {cardNumber || '•••• •••• •••• ••••'}
                </p>
              </div>

              <div className="flex justify-between items-end text-[9px]">
                <div className="space-y-0.5 max-w-[65%]">
                  <span className="text-[7.5px] text-slate-600 block uppercase font-bold">STAKEHOLDER CARDHOLDER</span>
                  <p className="text-slate-300 uppercase truncate tracking-wide font-black">{cardName || 'STAKEHOLDER EXPLORER'}</p>
                  {paymentPhone && (
                    <p className="text-amber-500/80 text-[7px] truncate font-mono tracking-widest mt-0.5">TEL: {paymentPhone}</p>
                  )}
                </div>
                <div className="flex gap-4">
                  <div className="text-center">
                    <span className="text-[7.5px] text-slate-600 block uppercase font-bold">EXP</span>
                    <p className="text-slate-300 font-black">{cardExpiry || 'MM/YY'}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-[7.5px] text-slate-600 block uppercase font-bold">CVV</span>
                    <p className="text-slate-300 font-black">{cardCvv ? '•••' : '***'}</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
            </div>

            {/* Error Prompt */}
            {errorText && (
              <div className="p-2.5 bg-red-950/40 border border-red-800 text-red-400 text-xs font-mono uppercase tracking-wide leading-tight">
                ⚠ {errorText}
              </div>
            )}

            {paymentStatus === 'idle' ? (
              <form onSubmit={handleProcessPayment} className="space-y-3 font-mono">
                <div className="space-y-1">
                  <label className="block text-[8px] text-slate-400 uppercase tracking-widest font-black">Associated Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2 w-4 h-4 text-slate-600" />
                    <input 
                      type="tel"
                      required
                      placeholder="e.g. +1 (555) 019-2834"
                      value={paymentPhone}
                      onChange={(e) => setPaymentPhone(e.target.value)}
                      className="w-full bg-slate-950 text-xs text-white pl-10 pr-3 py-2 border border-slate-850 rounded-none focus:outline-none focus:border-amber-500 placeholder:text-slate-800 font-black"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[8px] text-slate-400 uppercase tracking-widest font-black">Cardholder Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. GLORIA BENEGUSENGA"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 text-xs text-white px-3 py-2 border border-slate-850 rounded-none focus:outline-none focus:border-amber-500 placeholder:text-slate-800 font-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[8px] text-slate-400 uppercase tracking-widest font-black">Card Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-2 w-4 h-4 text-slate-600" />
                    <input 
                      type="text"
                      required
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full bg-slate-950 text-xs text-white pl-10 pr-3 py-2 border border-slate-850 rounded-none focus:outline-none focus:border-amber-500 placeholder:text-slate-800 font-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[8px] text-slate-400 uppercase tracking-widest font-black">Expiry Date (MM/YY)</label>
                    <input 
                      type="text"
                      required
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      className="w-full bg-slate-950 text-xs text-white px-3 py-2 border border-slate-850 rounded-none focus:outline-none focus:border-amber-500 placeholder:text-slate-800 text-center font-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[8px] text-slate-400 uppercase tracking-widest font-black">CVV / CVN</label>
                    <input 
                      type="password"
                      required
                      placeholder="992"
                      maxLength={3}
                      value={cardCvv}
                      onChange={handleCvvChange}
                      className="w-full bg-slate-950 text-xs text-white px-3 py-2 border border-slate-850 rounded-none focus:outline-none focus:border-amber-500 placeholder:text-slate-800 text-center tracking-widest font-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={triggerQuickPaymentAutofill}
                    className="py-2.5 border border-slate-800 hover:bg-slate-950 text-slate-400 hover:text-white transition-colors uppercase text-[9px] font-black tracking-widest rounded-none cursor-pointer"
                  >
                    🚀 Autofill Demo
                  </button>
                  
                  <button
                    type="submit"
                    className="py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all text-slate-950 uppercase text-[9px] font-black tracking-widest rounded-none flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                  >
                    <DollarSign className="w-3.5 h-3.5 text-slate-950" />
                    {selectedPlan === 'monthly' ? 'Subscribe $200.00 / mo' : 'Pay $5.00 Escrow'}
                  </button>
                </div>
              </form>
            ) : paymentStatus === 'processing' ? (
              <div className="bg-slate-950 border border-slate-850 p-6 flex flex-col justify-center items-center space-y-4 rounded-none min-h-[220px]">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                
                <div className="space-y-1.5 text-center w-full max-w-xs">
                  <p className="text-xs font-mono uppercase text-amber-500 font-bold tracking-wider">
                    Securing Transmission Node...
                  </p>
                  
                  <div className="space-y-1 font-mono text-[9px] text-slate-500 text-left bg-slate-900 border border-slate-850 p-3 leading-loose">
                    <p className="flex items-center justify-between">
                      <span>1. Routing bank clearing...</span>
                      {paymentStep >= 1 ? (
                        <span className="text-emerald-500 font-bold">✔ OK</span>
                      ) : (
                        <span className="animate-pulse text-amber-500">PENDING</span>
                      )}
                    </p>
                    <p className="flex items-center justify-between">
                      <span>2. Handshaking escrow ledger...</span>
                      {paymentStep >= 2 ? (
                        <span className="text-emerald-500 font-bold">✔ OK</span>
                      ) : (
                        <span className={`text-slate-600 ${paymentStep === 1 ? 'animate-pulse text-amber-500' : ''}`}>WAIT</span>
                      )}
                    </p>
                    <p className="flex items-center justify-between">
                      <span>3. Tokenizing {selectedPlan === 'monthly' ? '$200.00/mo sub' : '$5.00 identity'}...</span>
                      {paymentStep >= 3 ? (
                        <span className="text-emerald-500 font-bold">✔ OK</span>
                      ) : (
                        <span className={`text-slate-600 ${paymentStep === 2 ? 'animate-pulse text-amber-500' : ''}`}>WAIT</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-950/20 border border-emerald-800 p-8 flex flex-col items-center justify-center space-y-3 rounded-none py-10 text-center">
                <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500 rounded-full flex items-center justify-center text-emerald-400">
                  <Check className="w-6 h-6 animate-bounce" />
                </div>
                <div className="font-mono">
                  <p className="text-sm font-bold uppercase text-emerald-400 tracking-wider">Payment Confirmed</p>
                  <p className="text-[9px] uppercase text-slate-500 mt-1">Transaction MTN escrow complete.</p>
                  <p className="text-[10px] text-slate-300 mt-2">Unlocking authentication interfaces...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Authentication Mode Tabs */}
            <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 border border-slate-850 font-mono text-[9px] uppercase tracking-wider">
          <button
            onClick={() => { setActiveTab('mfa'); setErrorText(null); }}
            className={`flex flex-col md:flex-row items-center justify-center gap-1.5 py-2 px-1 transition-all text-center rounded-none cursor-pointer ${
              activeTab === 'mfa' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SMS & Email</span>
          </button>
          
          <button
            onClick={() => { setActiveTab('web3'); setErrorText(null); }}
            className={`flex flex-col md:flex-row items-center justify-center gap-1.5 py-2 px-1 transition-all text-center rounded-none cursor-pointer ${
              activeTab === 'web3' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Web3 Crypto</span>
          </button>

          <button
            onClick={() => { setActiveTab('passkey'); setErrorText(null); }}
            className={`flex flex-col md:flex-row items-center justify-center gap-1.5 py-2 px-1 transition-all text-center rounded-none cursor-pointer ${
              activeTab === 'passkey' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Finger Passkey</span>
          </button>

          <button
            onClick={() => { setActiveTab('rfid'); setErrorText(null); }}
            className={`flex flex-col md:flex-row items-center justify-center gap-1.5 py-2 px-1 transition-all text-center rounded-none cursor-pointer ${
              activeTab === 'rfid' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mine Fob</span>
          </button>
        </div>

        {/* Global Error Prompt */}
        {errorText && (
          <div className="p-3 bg-red-950/40 border border-red-800 text-red-400 text-xs font-mono uppercase tracking-wide leading-tight">
            ⚠ {errorText}
          </div>
        )}

        <div className="border-t border-slate-850 pt-4">
          <AnimatePresence mode="wait">
            
            {/* 1. MFA SMS & EMAIL LOGIN FORM */}
            {activeTab === 'mfa' && (
              <motion.div
                key="mfa"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {authStep === 'details' ? (
                  <form onSubmit={handleSendCode} className="space-y-4">
                    <p className="text-slate-400 text-xs font-sans">
                      Verify institutional account coordinates. A secure single-use passcode token is generated and logged instantly.
                    </p>
                    
                    {/* Email Field */}
                    <div className="space-y-1">
                      <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                        Stakeholder Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                        <input 
                          type="email"
                          required
                          placeholder="name@mininggroup.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-slate-950 text-xs text-white pl-10 pr-4 py-2.5 border border-slate-850 rounded-none focus:outline-none focus:border-amber-500 placeholder:text-slate-800 font-mono"
                        />
                      </div>
                    </div>

                    {/* Country Selector Dropdown & Phone Field */}
                    <div className="space-y-1">
                      <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                        Global Phone Number
                      </label>
                      
                      <div className="relative flex items-stretch">
                        <button
                          type="button"
                          onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                          className="flex items-center gap-1.5 px-3 bg-slate-950 border border-r-0 border-slate-850 hover:bg-slate-900 transition-colors cursor-pointer text-xs font-mono text-white select-none"
                        >
                          <span className="text-sm">{selectedCountry.flag}</span>
                          <span className="text-[10px] font-bold text-amber-500">{selectedCountry.code}</span>
                          <ChevronDown className="w-3 h-3 text-slate-500" />
                        </button>

                        {/* Country List flyout */}
                        <AnimatePresence>
                          {isCountryDropdownOpen && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute left-0 bottom-full mb-1 z-[115] w-72 max-h-52 overflow-y-auto bg-slate-950 border border-slate-800 shadow-2xl p-2 divide-y divide-slate-900"
                            >
                              <div className="sticky top-0 bg-slate-950 pb-1.5 mb-1.5 border-b border-slate-900 flex items-center gap-1.5">
                                <Search className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                                <input 
                                  type="text"
                                  placeholder="Search countries..."
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  className="w-full bg-slate-900 text-[10px] text-white p-1 focus:outline-none"
                                />
                              </div>
                              
                              <div className="space-y-0.5">
                                {filteredCountries.map((c) => (
                                  <button
                                    key={`${c.id}-${c.code}`}
                                    type="button"
                                    onClick={() => {
                                      setSelectedCountry(c);
                                      setIsCountryDropdownOpen(false);
                                      setSearchQuery('');
                                    }}
                                    className="w-full flex items-center justify-between text-left px-2 py-1.5 hover:bg-slate-900 text-[10px] font-mono transition-colors rounded-none"
                                  >
                                    <span className="flex items-center gap-2 text-slate-300">
                                      <span>{c.flag}</span>
                                      <span className="truncate max-w-[130px]">{c.name}</span>
                                    </span>
                                    <span className="text-amber-500 font-bold">{c.code}</span>
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <input 
                          type="tel"
                          required
                          placeholder="0788 123 456"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="flex-grow bg-slate-950 text-xs text-white px-4 py-2.5 border border-slate-850 rounded-none focus:outline-none focus:border-amber-500 placeholder:text-slate-800 font-mono"
                        />
                      </div>
                      <p className="text-[9px] text-slate-500 font-mono uppercase tracking-tight">
                        Supports all networks in {countriesData.length - 1}+ sovereign territories.
                      </p>
                    </div>

                    <div className="bg-slate-950 p-2.5 border border-slate-850 flex items-start gap-2">
                      <input type="checkbox" required className="mt-0.5 accent-amber-500 cursor-pointer" />
                      <p className="text-[10px] text-slate-400 leading-normal font-sans">
                        I hereby attest that these contact coordinates are linked with a registered industrial, mining, or institutional entity.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full cursor-pointer py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all text-slate-950 font-black text-xs uppercase tracking-widest text-center rounded-none"
                    >
                      Authenticate and Send OTP Token
                    </button>
                  </form>
                ) : (
                  /* Verify phase of MFA */
                  <form onSubmit={handleVerify} className="space-y-4">
                    <div className="bg-slate-950 p-4 border border-amber-500/15 text-[11px] font-mono space-y-2">
                      <div className="flex items-center justify-between text-amber-500 font-bold uppercase tracking-wider text-[10px]">
                        <span>SIMULATED CELLULAR ROUTER TRANSMITTING</span>
                        <span className="animate-pulse flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> LIVE
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        A security compliance OTP code has been dispatched:
                      </p>
                      <p className="text-amber-500 font-bold block bg-slate-950 p-2 border border-slate-850 truncate text-xs">
                        {selectedCountry.flag} {selectedCountry.code} {phoneNumber} 
                        <span className="text-slate-600 font-normal"> // </span>
                        {email}
                      </p>
                      
                      <div className="mt-3 pt-2.5 border-t border-slate-850 bg-amber-500/5 p-2 text-center text-amber-500">
                        <span className="font-sans block text-[9px] uppercase text-slate-500 mb-1">Passkey Emulated Dispatch:</span>
                        <span className="text-xl font-black tracking-[0.25em] text-white select-all">{simulatedCode}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                        Enter 6-Digit Secure Verification Code
                      </label>
                      <div className="relative">
                        <MessageSquareCode className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                        <input 
                          type="text"
                          required
                          maxLength={6}
                          placeholder={`Enter code or use the simulated OTP`}
                          value={verifyCode}
                          onChange={(e) => setVerifyCode(e.target.value)}
                          className="w-full bg-slate-950 text-xs text-white pl-10 pr-4 py-2.5 border border-slate-850 rounded-none focus:outline-none focus:border-amber-500 placeholder:text-slate-700 font-mono tracking-[0.2em] text-center font-bold"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setAuthStep('details')}
                        className="w-1/3 py-2.5 border border-slate-800 hover:bg-slate-900 transition-colors text-slate-300 font-bold text-xs uppercase tracking-widest text-center rounded-none"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="w-2/3 cursor-pointer py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all text-slate-950 font-black text-xs uppercase tracking-widest text-center rounded-none"
                      >
                        Decrypt & Open System Desk
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}

            {/* 2. WEB3 DIGITAL WALLET SIGN-IN */}
            {activeTab === 'web3' && (
              <motion.div
                key="web3"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <p className="text-slate-400 text-xs font-sans">
                  Connect a cold signature wallet. Verify corporate gold holding credits on the sovereign blockchain node registry.
                </p>

                {web3Status === 'disconnected' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'metamask', name: 'MetaMask', desc: 'Injected MetaMask App', label: '🦊' },
                        { id: 'coinbase', name: 'Coinbase Wallet', desc: 'Secure Ledger Link', label: '🛡' },
                        { id: 'phantom', name: 'Phantom', desc: 'Solana Web3 Node', label: '👻' },
                        { id: 'ledger', name: 'Ledger HW Suite', desc: 'Sovereign Keyring', label: '📟' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedWallet(item.id as any)}
                          className={`p-3 text-left border flex items-center gap-3 transition-all rounded-none cursor-pointer ${
                            selectedWallet === item.id 
                              ? 'bg-amber-500/15 border-amber-500 text-white' 
                              : 'bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-900 hover:text-white'
                          }`}
                        >
                          <span className="text-2xl">{item.label}</span>
                          <div className="font-mono">
                            <p className="text-xs font-bold leading-tight uppercase">{item.name}</p>
                            <p className="text-[9px] text-slate-500 tracking-tight leading-none mt-0.5">{item.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleWeb3Connect}
                      className="w-full py-2.5 cursor-pointer bg-slate-950 hover:bg-slate-900 border border-slate-800 text-white font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 "
                    >
                      <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                      Connect Blockchain Wallet
                    </button>
                  </div>
                )}

                {(web3Status === 'connecting' || web3Status === 'connected' || web3Status === 'signing' || web3Status === 'signed') && (
                  <div className="space-y-4">
                    {/* Simulated terminal logs */}
                    <div className="bg-slate-950 border border-slate-850 p-4 font-mono text-[10px] text-emerald-400 leading-normal space-y-1 rounded-none min-h-[120px]">
                      <div className="flex justify-between text-[8px] text-slate-500 uppercase tracking-widest pb-1 border-b border-slate-900 mb-1.5 font-bold">
                        <span>Web3 Provider Terminal Console</span>
                        <span className="text-emerald-500 animate-pulse">Connected</span>
                      </div>
                      {web3Logs.map((log, lIdx) => (
                        <p key={lIdx} className="break-all">{log}</p>
                      ))}
                      {web3Status === 'connecting' && (
                        <p className="animate-pulse text-amber-500">[wait] query pending...</p>
                      )}
                      {web3Status === 'signing' && (
                        <p className="animate-pulse text-amber-500">[wait] waiting for wallet signature check...</p>
                      )}
                    </div>

                    {web3Status === 'connected' && (
                      <div className="space-y-2">
                        <div className="bg-slate-950 border border-slate-850 p-2.5 text-center">
                          <p className="text-[9px] font-mono text-slate-500 uppercase">Sovereign Wallet Verified Account:</p>
                          <p className="text-xs font-mono font-black text-amber-500 uppercase mt-0.5 select-all leading-tight">{web3Addr}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setWeb3Status('disconnected')}
                            className="w-1/3 py-2 border border-slate-800 text-xs text-slate-400 uppercase tracking-wider text-center"
                          >
                            Disconnect
                          </button>
                          <button
                            type="button"
                            onClick={handleWeb3SignAndLogin}
                            className="w-2/3 py-2 bg-amber-500 hover:bg-amber-400 text-xs text-slate-950 font-black uppercase tracking-wider text-center "
                          >
                            Sign Challenge & Check Assets
                          </button>
                        </div>
                      </div>
                    )}

                    {web3Status === 'signed' && (
                      <div className="bg-emerald-950/20 border border-emerald-800 p-3 text-center text-emerald-400 font-mono text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 animate-bounce" />
                        Challenge Signed. Decrypting...
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* 3. BIOMETRIC PASSKEY AUTH */}
            {activeTab === 'passkey' && (
              <motion.div
                key="passkey"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 text-center"
              >
                <p className="text-slate-400 text-xs font-sans text-left">
                  Instant FIDO2 Device Authentication. Use local face biometric or fingerprint keys to bypass OTP loops.
                </p>

                {passkeyStep === 'idle' && (
                  <div className="bg-slate-950 border border-slate-850 p-6 flex flex-col items-center justify-center space-y-4 rounded-none py-10">
                    <div className="w-16 h-16 bg-slate-900 border border-slate-800 flex items-center justify-center rounded-full text-slate-500 hover:text-amber-500 hover:border-amber-500/50 transition-all cursor-pointer group" onClick={handlePasskeyStart}>
                      <Fingerprint className="w-8 h-8 text-slate-600 group-hover:text-amber-500 transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-mono uppercase text-slate-200 font-bold tracking-wider">Ready to Scan Device</p>
                      <p className="text-[9px] font-mono uppercase text-slate-500 mt-1">Accept biometric prompt on browser module</p>
                    </div>
                    <button
                      type="button"
                      onClick={handlePasskeyStart}
                      className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 uppercase font-mono text-xs font-black tracking-widest"
                    >
                      Scan Passkey Fingerprint
                    </button>
                  </div>
                )}

                {(passkeyStep === 'initiating' || passkeyStep === 'scanning') && (
                  <div className="bg-slate-950 border border-slate-850 p-6 flex flex-col items-center justify-center space-y-4 rounded-none py-8 relative overflow-hidden">
                    
                    {/* Laser Scanner animation effect */}
                    {passkeyStep === 'scanning' && (
                      <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-pulse shadow-[0_0_10px_#f59e0b]" style={{ top: `${scanProgress}%`, transition: 'top 0.15s linear' }}></div>
                    )}
                    
                    <div className="relative">
                      <Fingerprint className="w-14 h-14 text-amber-500/25 animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-amber-500 animate-spin opacity-80" />
                      </div>
                    </div>

                    <div className="space-y-1.5 w-full max-w-xs">
                      <p className="text-xs font-mono uppercase text-amber-500 font-bold tracking-wider">
                        {passkeyStep === 'initiating' ? 'INITIALIZING CHIP MODULE...' : `SCANNING: ${scanProgress}%`}
                      </p>
                      <div className="w-full h-1 bg-slate-900 border border-slate-800 rounded-none overflow-hidden">
                        <div className="bg-amber-500 h-full transition-all duration-150" style={{ width: `${scanProgress}%` }}></div>
                      </div>
                      <p className="text-[8px] font-mono uppercase text-slate-500 leading-none">
                        FIDO2 Cryptographic Handshake via Local Certificate Manager
                      </p>
                    </div>
                  </div>
                )}

                {passkeyStep === 'complete' && (
                  <div className="bg-emerald-950/20 border border-emerald-800 p-8 flex flex-col items-center justify-center space-y-3 rounded-none py-10">
                    <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500 rounded-full flex items-center justify-center text-emerald-400">
                      <Check className="w-6 h-6" />
                    </div>
                    <div className="text-center font-mono">
                      <p className="text-xs font-bold uppercase text-emerald-400 tracking-wider">Passkey ID Accepted</p>
                      <p className="text-[9px] uppercase text-slate-500 mt-1">Welcome back. Authenticating security session...</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* 4. RFID PHYSICAL FOB MINE KEY */}
            {activeTab === 'rfid' && (
              <motion.div
                key="rfid"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <p className="text-slate-400 text-xs font-sans">
                  Enter alphanumeric physical Mine Fob RFID identifier. Simulates contactless scanner terminal connection.
                </p>

                {fobAlert && (
                  <div className="p-2 bg-amber-950/40 border border-amber-800 text-amber-400 text-[10px] font-mono uppercase tracking-wide">
                    ⚠ {fobAlert}
                  </div>
                )}

                <form onSubmit={handleRfidScan} className="space-y-4">
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* Fob ID Field */}
                    <div className="space-y-1">
                      <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                        Alpha-Numeric RFID Stamp
                      </label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                        <input 
                          type="text"
                          required
                          placeholder="e.g. FOB-4819-MTX"
                          value={fobId}
                          onChange={(e) => setFobId(e.target.value.toUpperCase())}
                          className="w-full bg-slate-950 text-xs text-white pl-10 pr-4 py-2 border border-slate-850 rounded-none focus:outline-none focus:border-amber-500 placeholder:text-slate-800 font-mono tracking-widest"
                        />
                      </div>
                    </div>

                    {/* Department Level focus */}
                    <div className="space-y-1">
                      <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                        Station Authority Level
                      </label>
                      <select
                        value={fobDepartment}
                        onChange={(e) => setFobDepartment(e.target.value)}
                        className="w-full bg-slate-950 text-xs text-white px-3 py-2.5 border border-slate-850 rounded-none focus:outline-none focus:border-amber-500 font-mono"
                      >
                        <option value="Explorations Core Lab">Explorations Core Lab</option>
                        <option value="Underground Extraction Drift">Underground Extraction Drift</option>
                        <option value="Refining Metallurgical Room">Refining Metallurgical Room</option>
                        <option value="Headquarters Board Desk">Headquarters Board Desk</option>
                      </select>
                    </div>
                  </div>

                  {/* Gamified numpad preset shortcuts */}
                  <div className="bg-slate-950 p-3 border border-slate-850 font-mono">
                    <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold mb-2">Simulate Physical Fob Keypad Tags:</p>
                    <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                      {[
                        { code: 'FOB-9041-AURA', label: 'Aura Deep Gold' },
                        { code: 'FOB-2891-COPPER', label: 'Copper Crest' },
                        { code: 'FOB-5182-SALAR', label: 'Sol Salar DLE' }
                      ].map((preset) => (
                        <button
                          key={preset.code}
                          type="button"
                          onClick={() => handleApplyQuickFob(preset.code)}
                          className="py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-amber-500 border border-slate-850 text-[9px] font-mono transition-colors rounded-none text-left px-2"
                        >
                          <span className="block font-bold text-amber-500">{preset.code}</span>
                          <span className="text-[7px] text-slate-500 font-normal block leading-tight truncate">{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scan Dispatch Submit */}
                  <button
                    type="submit"
                    className="w-full py-2.5 cursor-pointer bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all text-slate-950 font-black text-xs uppercase tracking-widest text-center rounded-none flex items-center justify-center gap-2"
                  >
                    <Cpu className="w-4 h-4 text-slate-950" />
                    RFID Laser Read & Authorize Level
                  </button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Reset Payment footer button for playability */}
        <div className="pt-2 text-center border-t border-slate-950">
          <button 
            type="button"
            onClick={() => {
              localStorage.removeItem('minex_login_paid');
              setIsPaid(false);
              setPaymentStatus('idle');
              setCardName('');
              setCardNumber('');
              setCardExpiry('');
              setCardCvv('');
            }}
            className="text-[8px] font-mono uppercase text-slate-500 hover:text-amber-500 transition-colors cursor-pointer select-none font-bold tracking-widest"
          >
            🔒 PAID SESSION ACTIVE • CLICK TO RESET TRANSACTION GATE
          </button>
        </div>
        </>
        )}

      </div>
    </div>
  );
}
