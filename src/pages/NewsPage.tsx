import React, { useState, useEffect } from 'react';
import { 
  Newspaper, 
  Search, 
  Clock, 
  Eye, 
  Sparkles, 
  Tag, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getAllNews } from '../services/newsApi';
import { NewsItem } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { localizeNewsItem } from '../i18n/localize';

export const NewsPage: React.FC = () => {
  const { setSelectedNews, settings, t } = useApp();
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    getAllNews().then((data: NewsItem[]) => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  const categories = [
    { id: 'All', label: t.newsCatAll },
    { id: 'AI Analysis', label: t.newsCatAI },
    { id: 'Tactical', label: t.newsCatTactical },
    { id: 'Transfers', label: t.newsCatTransfers },
    { id: 'Champions League', label: t.newsCatChampionsLeague }
  ];

  const filteredArticles = articles.filter((rawArt: NewsItem) => {
    const art = localizeNewsItem(rawArt, settings.language);
    const matchesCat = selectedCategory === 'All' || rawArt.category === selectedCategory;
    const matchesQuery = searchQuery === '' || 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rawArt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rawArt.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.tags && art.tags.some((tg: string) => tg.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold font-display text-white tracking-wide flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-cyan-400" />
          <span>{t.newsTitle}</span>
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed font-sans">
          {t.newsSubtitle}
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rtl:right-3.5 rtl:left-auto" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchNewsPlaceholder}
          className="w-full rounded-2xl border border-slate-800 bg-[#070e1c] pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition border ${
              selectedCategory === cat.id
                ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300'
                : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Articles Stream */}
      {loading ? (
        <LoadingSpinner message={t.fetchingNewsFeeds} />
      ) : filteredArticles.length === 0 ? (
        <EmptyState
          title={t.noArticlesFoundTitle}
          description={t.noArticlesFoundDesc}
          actionText={t.resetSearch}
          onAction={() => {
            setSelectedCategory('All');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="space-y-3">
          {filteredArticles.map((rawArticle) => {
            const article = localizeNewsItem(rawArticle, settings.language);
            return (
              <div
                key={article.id}
                onClick={() => setSelectedNews(article)}
                className="group cursor-pointer rounded-2xl border border-slate-800/90 bg-[#070e1c] p-3.5 transition-all hover:border-cyan-500/40 hover:bg-[#081224] flex flex-col sm:flex-row gap-3.5"
              >
                {/* Thumbnail */}
                <div className="relative sm:w-44 h-36 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title} 
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105" 
                  />
                  <span className="absolute top-2 left-2 rtl:right-2 rtl:left-auto rounded bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-cyan-400 font-tech uppercase border border-cyan-500/30">
                    {article.category}
                  </span>
                </div>

                {/* Text Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400 line-clamp-2 font-sans">
                      {article.summary}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.viewsCount}
                      </span>
                    </div>
                    <span className="text-cyan-400 group-hover:translate-x-0.5 transition flex items-center text-[10px] font-bold">
                      {t.readAnalysis}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
