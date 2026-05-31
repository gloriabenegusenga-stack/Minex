import { useState } from 'react';
import { technicalDocsData } from '../data';
import { TechnicalDoc } from '../types';
import { useLanguage } from '../LanguageContext';
import { useAuth } from '../AuthContext';
import { Database, Download, Lock, Unlock, Search, Filter, HelpCircle, FileCheck } from 'lucide-react';

interface GeologyLibraryProps {
  onUnlockDoc: (docName: string) => void;
}

export default function GeologyLibrary({ onUnlockDoc }: GeologyLibraryProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [docTypeFilter, setDocTypeFilter] = useState<string>('All');
  const { t } = useLanguage();
  const { user, openLoginModal } = useAuth();

  // Simple quick downloader for unlocked docs
  const handleDownload = (doc: TechnicalDoc) => {
    const isLockedForUser = doc.isLocked && !user;
    if (isLockedForUser) {
      // Prompt user to sign in using their global phone setup coordinates
      openLoginModal();
    } else {
      // Simulate file download
      alert(`[Download Successful] Downloading consolidated material: "${doc.title}" (${doc.size}). Status: SECURE STREAM AUTHORIZED.`);
    }
  };

  const filteredDocs = technicalDocsData.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = docTypeFilter === 'All' ? true : doc.type === docTypeFilter;
    return matchesSearch && matchesType;
  });

  const docTypes = ['All', 'Mineral Resource Report', 'Engineering Specification', 'Environmental Assessment', 'Financial Statement', 'Safety Guidelines'];

  return (
    <section id="technical-library" className="w-full bg-slate-950/80 py-20 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono tracking-wider text-amber-500 uppercase">
              <Database className="w-4 h-4" />
              <span>{t('geoLibraryTitle')}</span>
            </div>
            <h2 className="text-3xl font-black uppercase text-white tracking-tighter leading-none mt-2 mb-3">
              {t('geoLibrarySubtitle')} <span className="text-slate-500 font-black">{t('geoLibrarySubtitlePost') || 'Desk'}</span>
            </h2>
            <p className="text-slate-400 text-xs md:text-sm font-light max-w-xl">
              {t('geoLibraryDesc')}
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-none px-4 py-1.5 inline-flex items-center gap-2 text-[10px] font-mono font-bold tracking-wider text-amber-500 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>DATA ROOM SECURED</span>
          </div>
        </div>

        {/* Searching Filtering Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-4" />
            <input
              type="text"
              placeholder={t('searchLibrary')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 text-xs text-white rounded-none pl-11 pr-4 py-3.5 border border-slate-800 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="md:col-span-4">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-3 rounded-none text-xs w-full">
              <Filter className="w-4 h-4 text-amber-500" />
              <select
                value={docTypeFilter}
                onChange={(e) => setDocTypeFilter(e.target.value)}
                className="bg-transparent border-0 text-white focus:ring-0 outline-none w-full text-xs cursor-pointer font-mono uppercase font-bold text-slate-300"
              >
                {docTypes.map((tOp) => (
                  <option key={tOp} value={tOp} className="bg-slate-900 text-white py-1">
                    {tOp === 'All' ? 'ALL ARCHIVES' : tOp.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Technical Directory Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-none overflow-hidden shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm font-sans">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-500 font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-4 px-6 font-bold">{t('allDocuments')}</th>
                  <th className="py-4 px-4 font-bold md:table-cell hidden">{t('docType')}</th>
                  <th className="py-4 px-4 font-bold">{t('docDate')}</th>
                  <th className="py-4 px-4 font-bold">{t('docSize')}</th>
                  <th className="py-4 px-6 text-right font-bold">Action Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 text-xs md:text-sm">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-950/45 transition-colors text-xs">
                    <td className="py-4 px-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-none mt-0.5 flex-shrink-0 bg-slate-955 border ${
                          doc.isLocked ? 'bg-amber-550/10 border-amber-500/20 text-amber-500' : 'bg-slate-950 border-slate-800 text-emerald-400'
                        }`}>
                          <FileCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white leading-snug">{doc.title}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-wider">{doc.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-400 uppercase tracking-widest text-[9px] font-bold md:table-cell hidden">
                      {doc.isLocked && !user ? (
                        <span className="text-amber-500/80">{t('statusLocked')}</span>
                      ) : (
                        <span className="text-emerald-400/80">{t('statusUnlocked')}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-400">{doc.date}</td>
                    <td className="py-4 px-4 font-mono text-slate-400">{doc.size}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDownload(doc)}
                        className={`cursor-pointer inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-none text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 ${
                          doc.isLocked && !user
                            ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 font-black'
                            : 'bg-slate-950 text-emerald-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {doc.isLocked && !user ? (
                          <>
                            <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>{t('lockedAction')}</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                            <span>{t('unlockedAction')}</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredDocs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 font-mono text-xs">
                      No publications matched your search criteria elements.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Capture Gated Notice Banner */}
        <div className="bg-slate-900 p-6 rounded-none border border-slate-800 mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center rounded-none flex-shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs font-mono font-black uppercase tracking-wider">
                Why are selected documents gated?
              </h4>
              <p className="text-slate-450 text-xs font-light mt-1.5 leading-relaxed">
                Sensitive geological core assessments represent strategic corporate equity. They are reserved exclusively for validated Investors, Communities, and qualified Offtake Partners after basic registration verification is submitted.
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => onUnlockDoc('MineX Gold, Silver & Bronze Mineral Prospectus Portfolio')}
            className="cursor-pointer bg-amber-500 text-slate-950 hover:bg-amber-400 border-0 transition-colors py-2.5 px-5 text-xs font-mono font-black uppercase tracking-widest whitespace-nowrap self-start md:self-auto rounded-none"
          >
            Access Terminal Registration
          </button>
        </div>

      </div>
    </section>
  );
}
