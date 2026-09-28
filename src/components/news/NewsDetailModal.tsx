import React from 'react';
import { X, Clock, Eye, Share2, Tag, Cpu, Bookmark } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { localizeNewsArticle } from '../../i18n/localize';

export const NewsDetailModal: React.FC = () => {
  const { selectedNews, setSelectedNews, showToast, t, settings } = useApp();
  const isAr = settings.language === 'ar';

  if (!selectedNews) return null;

  const article = localizeNewsArticle(selectedNews, settings.language);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast(t.linkCopied, 'info');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto"
      onClick={() => setSelectedNews(null)}
    >
      <div 
        className="w-full max-w-xl rounded-3xl border border-cyan-500/30 bg-[#070e1c] shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover Image Header */}
        <div className="relative h-56 w-full bg-slate-900">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070e1c] via-transparent to-black/60" />
          
          <button
            onClick={() => setSelectedNews(null)}
            className="absolute top-4 right-4 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 backdrop-blur-md transition"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="rounded-full bg-cyan-500 px-3 py-1 text-xs font-bold text-slate-950 uppercase font-tech">
              {article.category}
            </span>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {article.publishedAt}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {article.viewsCount}
              </span>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="p-6 overflow-y-auto space-y-4 no-scrollbar">
          <h2 className="text-xl font-bold font-display text-white leading-snug">
            {article.title}
          </h2>

          <div className="flex items-center justify-between border-y border-slate-800 py-3 text-xs text-slate-400">
            <span>{isAr ? 'الكاتب:' : 'Author:'} <strong className="text-cyan-400">{article.author}</strong></span>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleShare}
                className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-slate-300 hover:text-white"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>{t.share}</span>
              </button>
            </div>
          </div>

          <p className="text-sm font-semibold text-cyan-200/90 leading-relaxed italic border-l-2 border-cyan-400 pl-3 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-3">
            "{article.summary}"
          </p>

          <div className="text-sm text-slate-300 leading-relaxed font-sans space-y-3 whitespace-pre-line">
            <p>{article.content}</p>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-1.5">
              {article.tags.map((tag: string, idx: number) => (
                <span 
                  key={idx} 
                  className="rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-[11px] text-slate-400 flex items-center gap-1"
                >
                  <Tag className="h-3 w-3 text-cyan-500" />
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
