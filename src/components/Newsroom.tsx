import { useState } from 'react';
import { newsData } from '../data';
import { NewsArticle } from '../types';
import { useLanguage } from '../LanguageContext';
import { Calendar, BarChart3, Clock, ChevronRight, Newspaper, ArrowLeft } from 'lucide-react';

export default function Newsroom() {
  const [newsFilter, setNewsFilter] = useState<string>('All');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const { t } = useLanguage();

  const filteredNews = newsFilter === 'All' 
    ? newsData 
    : newsData.filter((n) => n.category === newsFilter);

  const selectedArticle = newsData.find((n) => n.id === selectedArticleId);

  return (
    <section id="investor-news" className="w-full bg-slate-950 py-20 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-left">
        
        {/* If article detail is active, render detailed news page */}
        {selectedArticle ? (
          <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
            {/* Back to news button */}
            <button
              onClick={() => setSelectedArticleId(null)}
              className="cursor-pointer inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-slate-400 hover:text-amber-550 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-amber-500" />
              <span>Back to Announcements Feed</span>
            </button>

            {/* Detailed Article Contents */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <span className={`px-3 py-1 rounded-none font-bold uppercase text-[10px] tracking-wider border ${
                  selectedArticle.category === 'Exploration' ? 'bg-amber-500/10 border-amber-500/20 text-amber-550' :
                  selectedArticle.category === 'Financial' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                  selectedArticle.category === 'ESG' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                  'bg-slate-900 border-slate-800 text-slate-300'
                }`}>
                  {selectedArticle.category.toUpperCase()}
                </span>
                <span className="text-slate-750">•</span>
                <span className="text-slate-400 flex items-center gap-1.5 font-bold uppercase text-[10px]">
                  <Calendar className="w-3.5 h-3.5 text-amber-500/60" />
                  {selectedArticle.date}
                </span>
                <span className="text-slate-755">•</span>
                <span className="text-slate-400 flex items-center gap-1.5 font-bold uppercase text-[10px]">
                  <Clock className="w-3.5 h-3.5 text-amber-500/60" />
                  {selectedArticle.readTime}
                </span>
              </div>

              <h3 className="text-2xl md:text-4xl text-slate-100 font-black uppercase tracking-tighter leading-none mt-4">
                {selectedArticle.title}
              </h3>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-none p-6 md:p-8 text-slate-300 font-sans text-sm md:text-base leading-relaxed space-y-6">
              <p className="font-bold text-slate-200 border-l-4 border-amber-500 pl-4 italic">
                {selectedArticle.summary}
              </p>
              
              {/* Splitting block text by newline mock blocks to look nice */}
              <div className="space-y-4 text-xs md:text-sm font-light text-slate-400">
                {selectedArticle.content.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500">
                <span>MineX Investor Relations Liaison Officer</span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-450 font-bold bg-emerald-950/25 px-2.5 py-1 rounded-none border border-emerald-900/40">
                  RELEASE: IMMEDIATE ACCESS
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Standard List View Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-mono tracking-wider text-amber-500 uppercase">
                  <Newspaper className="w-4 h-4" />
                  <span>{t('newsroomTitle')}</span>
                </div>
                <h2 className="text-3xl font-black uppercase text-white tracking-tighter leading-none mt-2 mb-3">
                  {t('newsroomSubtitle')} <span className="text-slate-500 font-black">{t('newsroomSubtitlePost') || 'Desk'}</span>
                </h2>
                <p className="text-slate-400 text-xs md:text-sm font-light max-w-xl">
                  {t('newsroomDesc')}
                </p>
              </div>

              {/* News filters */}
              <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1.5 rounded-none border border-slate-800">
                {['All', 'Corporate', 'Exploration', 'Financial', 'ESG'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNewsFilter(cat)}
                    className={`cursor-pointer px-4 py-2 text-[9px] font-mono tracking-widest uppercase rounded-none transition-all duration-200 ${
                      newsFilter === cat
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-white hover:bg-slate-955/40'
                    }`}
                  >
                    {cat === 'All' ? t('filterAll') : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List Grid is displayed here */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNews.map((article) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticleId(article.id)}
                  className="bg-slate-900/40 border border-slate-800 hover:border-amber-500/80 rounded-none p-6 transition-all duration-300 flex flex-col justify-between cursor-pointer group text-left"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className={`px-2.5 py-1 text-[9px] rounded-none border font-bold uppercase tracking-wide ${
                        article.category === 'Exploration' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                        article.category === 'Financial' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                        article.category === 'ESG' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                        'bg-slate-955 border-slate-800 text-slate-400'
                      }`}>
                        {article.category}
                      </span>
                      <span className="text-slate-500 font-mono tracking-wide font-bold">{article.date}</span>
                    </div>

                    <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white group-hover:text-amber-500 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-450 font-light leading-relaxed line-clamp-3">
                      {article.summary}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-slate-850 mt-5 flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-amber-550/80 tracking-widest">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      {article.readTime}
                    </span>
                    <span className="text-xs font-semibold group-hover:text-white flex items-center gap-0.5 text-slate-400">
                      <span>Examine Data</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-500" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
