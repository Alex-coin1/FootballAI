import React, { useState, useEffect, useRef } from 'react';
import { 
  Newspaper, 
  Search, 
  Clock, 
  Eye, 
  Sparkles, 
  Tag, 
  Plus,
  Upload,
  X,
  AlertTriangle,
  Check,
  Image as ImageIcon,
  User,
  ShieldCheck,
  Trash2,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  getAllNews, 
  publishCommunityNews, 
  deleteCommunityNews,
  containsForbiddenLinks 
} from '../services/newsApi';
import { NewsItem, NewsCategory } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { isUserAdmin } from '../services/adminService';
import { formatBnbAddress } from '../services/web3BnbService';

// Recommended high-resolution football match covers for quick selection
const PRESET_FOOTBALL_COVERS = [
  {
    id: 'cover-1',
    label: 'Stadium Night Atmosphere',
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cover-2',
    label: 'Tactical Match Action',
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cover-3',
    label: 'Pitch & Ball Close-up',
    url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cover-4',
    label: 'Team Strategy & Players',
    url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cover-5',
    label: 'European Football Derby',
    url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=800&q=80'
  }
];

export const NewsPage: React.FC = () => {
  const { user, setSelectedNews, openAuthModal, showToast, settings, t } = useApp();
  const isAr = settings.language === 'ar';
  const isAdmin = isUserAdmin(user.walletAddress);

  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Publish Modal State
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishTitle, setPublishTitle] = useState('');
  const [publishCategory, setPublishCategory] = useState<NewsCategory>('Football');
  const [publishSummary, setPublishSummary] = useState('');
  const [publishContent, setPublishContent] = useState('');
  const [publishImageUrl, setPublishImageUrl] = useState('');
  const [publishTags, setPublishTags] = useState('Football, Community');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadNews = () => {
    setLoading(true);
    getAllNews().then((data: NewsItem[]) => {
      setArticles(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadNews();
  }, []);

  // Check for forbidden links in form inputs
  const hasLinkInTitle = containsForbiddenLinks(publishTitle);
  const hasLinkInSummary = containsForbiddenLinks(publishSummary);
  const hasLinkInContent = containsForbiddenLinks(publishContent);
  const hasLinkInTags = containsForbiddenLinks(publishTags);
  const hasAnyForbiddenLink = hasLinkInTitle || hasLinkInSummary || hasLinkInContent || hasLinkInTags;

  const categories = [
    { id: 'All', label: isAr ? 'الكل' : 'All' },
    { id: 'Football', label: isAr ? 'أخبار كروية' : 'Football' },
    { id: 'Premier League', label: isAr ? 'الدوري الإنجليزي' : 'Premier League' },
    { id: 'La Liga', label: isAr ? 'الدوري الإسباني' : 'La Liga' },
    { id: 'Champions League', label: isAr ? 'دوري أبطال أوروبا' : 'Champions League' },
    { id: 'Transfers', label: isAr ? 'الانتقالات' : 'Transfers' },
    { id: 'Tactical', label: isAr ? 'تحليل تكتيكي' : 'Tactical' },
    { id: 'AI Analysis', label: isAr ? 'تحليل الذكاء الاصطناعي' : 'AI Analysis' }
  ];

  // Handle image upload from file
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast(isAr ? 'يرجى اختيار ملف صورة صالح (PNG, JPG, WEBP)' : 'Please choose a valid image file', 'warning');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast(isAr ? 'حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميغابايت' : 'Image size too large, maximum 5MB', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      setPublishImageUrl(base64Url);
    };
    reader.readAsDataURL(file);
  };

  // Open Publish Modal with authentication check
  const handleOpenPublish = () => {
    if (!user.isWeb3Connected) {
      showToast(
        isAr 
          ? 'يرجى ربط محفظة Web3 أولاً لنشر الأخبار والتفاعل مع مجتمع FootballAI!' 
          : 'Please connect your Web3 wallet first to publish news and interact with the community!',
        'warning'
      );
      openAuthModal('register');
      return;
    }
    // Set default cover if none chosen
    if (!publishImageUrl) {
      setPublishImageUrl(PRESET_FOOTBALL_COVERS[0].url);
    }
    setIsPublishModalOpen(true);
  };

  // Handle Submit New News Post
  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!publishTitle.trim()) {
      showToast(isAr ? 'يرجى إدخال عنوان المقال الكروي' : 'Please enter the article title', 'warning');
      return;
    }
    if (!publishContent.trim()) {
      showToast(isAr ? 'يرجى إدخال تفاصيل الخبر أو التحليل' : 'Please enter the article content', 'warning');
      return;
    }
    if (!publishImageUrl.trim()) {
      showToast(isAr ? 'يرجى رفع صورة للخبر أو اختيار صورة مناسبة' : 'Please upload or select an image for your article', 'warning');
      return;
    }

    // Strict Link Validation Check
    if (hasAnyForbiddenLink) {
      showToast(
        isAr 
          ? 'خطأ: يُمنع منعاً باتاً إضافة أي روابط أو عناوين مواقع (URLs) لحماية أمان المجتمع!' 
          : 'Error: Links and external URLs are strictly forbidden in community posts!',
        'warning'
      );
      return;
    }

    setIsSubmitting(true);
    const authorName = user.username || (user.walletAddress ? `Analyst_${user.walletAddress.slice(2, 6)}` : 'Football Analyst');
    const tagsArray = publishTags.split(',').map(t => t.trim()).filter(Boolean);

    const result = await publishCommunityNews({
      title: publishTitle,
      summary: publishSummary.trim() || publishContent.trim().slice(0, 140) + '...',
      content: publishContent,
      category: publishCategory,
      imageUrl: publishImageUrl,
      author: authorName,
      walletAddress: user.walletAddress,
      tags: tagsArray
    });

    setIsSubmitting(false);

    if (result.success) {
      showToast(
        isAr ? '🎉 تم نشر خبرك الرياضي بنجاح في مجتمع FootballAI!' : '🎉 Your football news has been published successfully!',
        'success'
      );
      setIsPublishModalOpen(false);
      // Reset form
      setPublishTitle('');
      setPublishSummary('');
      setPublishContent('');
      setPublishImageUrl('');
      setPublishTags('Football, Community');
      loadNews();
    } else {
      showToast(result.error || 'Failed to publish news', 'warning');
    }
  };

  // Handle Delete Post
  const handleDeleteArticle = async (e: React.MouseEvent, articleId: string) => {
    e.stopPropagation();
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذا الخبر؟' : 'Are you sure you want to delete this article?')) {
      return;
    }
    await deleteCommunityNews(articleId);
    showToast(isAr ? 'تم حذف الخبر بنجاح' : 'Article deleted successfully', 'info');
    loadNews();
  };

  const filteredArticles = articles.filter((art: NewsItem) => {
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesQuery = searchQuery === '' || 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.tags && art.tags.some((tg: string) => tg.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-200">
      {/* Header & Publish Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold font-display text-white tracking-wide flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-cyan-400" />
            <span>{isAr ? 'أخبار وتحليلات كرة القدم' : 'Football Community News'}</span>
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            {isAr 
              ? 'ساحة المجتمع الرياضي: انشر تحليلاتك وشارك أخبار أنديتك المفضلة بدون روابط خارجية' 
              : 'Community Sports Hub: Publish analysis and share updates from your favorite clubs (Zero links allowed)'}
          </p>
        </div>

        {/* Publish Action Button */}
        <button
          onClick={handleOpenPublish}
          className="shrink-0 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>{isAr ? 'انشر خبراً أو تحليلاً' : 'Publish Football News'}</span>
        </button>
      </div>

      {/* Strict Anti-Link Info Banner */}
      <div className="flex items-center gap-2.5 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 to-[#070e1c] p-3 text-[11px] text-cyan-300">
        <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
        <span>
          {isAr 
            ? 'مجتمع آمن: يتاح لجميع الأعضاء نشر الأخبار وتحميل الصور، ويُمنع منعاً باتاً إضافة أي روابط لحماية المستخدمين.' 
            : 'Safe Community: All members can publish football news and upload photos. External links are strictly prohibited.'}
        </span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rtl:right-3.5 rtl:left-auto" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isAr ? 'ابحث في أخبار المجتمع، الأندية، أو التحليلات...' : 'Search community news, clubs, or tactical reports...'}
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
        <LoadingSpinner message={isAr ? 'جاري تحميل الأخبار الحية...' : 'Loading community news...'} />
      ) : filteredArticles.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-[#070e1c] p-8 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-950/50 border border-cyan-500/30 text-cyan-400">
            <Newspaper className="h-7 w-7" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-white">
              {isAr ? 'لا توجد أخبار منشورة بعد' : 'No Community News Yet'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr 
                ? 'تم تنظيف الأخبار غير الحقيقية. كن أنت أول من ينشر خبراً أو تحليلاً كروياً مع صورة مميزة لمجتمع FootballAI!' 
                : 'All non-genuine news has been removed. Be the first to publish a football update or tactical breakdown with a photo!'}
            </p>
          </div>
          <button
            onClick={handleOpenPublish}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/25 hover:bg-cyan-400 transition"
          >
            <Plus className="h-4 w-4" />
            <span>{isAr ? 'انشر أول خبر كروي الآن' : 'Publish First Article Now'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredArticles.map((article) => {
            const isAuthor = article.author === user.username || (user.walletAddress && article.author?.includes(user.walletAddress.slice(2, 6)));
            const canDelete = isAuthor || isAdmin;

            return (
              <div
                key={article.id}
                onClick={() => setSelectedNews(article)}
                className="group cursor-pointer rounded-2xl border border-slate-800/90 bg-[#070e1c] p-3.5 transition-all hover:border-cyan-500/40 hover:bg-[#081224] flex flex-col sm:flex-row gap-3.5 relative"
              >
                {/* Thumbnail */}
                <div className="relative sm:w-44 h-36 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title} 
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105" 
                  />
                  <span className="absolute top-2 left-2 rtl:right-2 rtl:left-auto rounded bg-black/70 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-cyan-400 font-tech uppercase border border-cyan-500/30">
                    {article.category}
                  </span>
                </div>

                {/* Text Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition line-clamp-2">
                        {article.title}
                      </h3>
                      {canDelete && (
                        <button
                          onClick={(e) => handleDeleteArticle(e, article.id)}
                          className="opacity-60 hover:opacity-100 p-1 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/30 transition shrink-0"
                          title={isAr ? 'حذف المقال' : 'Delete article'}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-400 line-clamp-2 font-sans">
                      {article.summary}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-medium">
                        {article.author || 'Analyst'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.publishedAt}
                      </span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                    <span className="text-cyan-400 group-hover:translate-x-0.5 transition flex items-center text-[10px] font-bold">
                      {isAr ? 'قراءة التفاصيل' : 'Read Full Post'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =====================================================================
          PUBLISH FOOTBALL NEWS MODAL
          ===================================================================== */}
      {isPublishModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto"
          onClick={() => setIsPublishModalOpen(false)}
        >
          <div 
            className="w-full max-w-xl rounded-3xl border border-cyan-500/30 bg-[#070e1c] shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Newspaper className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">
                    {isAr ? 'نشر خبر أو تحليل كروي' : 'Publish Football News & Analysis'}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    {isAr ? 'منشور مجتمعي بدون روابط خارجية' : 'Community post • Zero links allowed'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsPublishModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handlePublishSubmit} className="p-5 space-y-4 overflow-y-auto no-scrollbar">
              {/* Anti-Link Warning Alert if link detected */}
              {hasAnyForbiddenLink && (
                <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-300 flex items-start gap-2.5 animate-pulse">
                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">
                      {isAr ? 'تم اكتشاف رابط خارجي (ممنوع)!' : 'External Link Detected (Forbidden)!'}
                    </strong>
                    <span className="text-[11px] text-rose-200 leading-relaxed">
                      {isAr 
                        ? 'يُمنع منعاً باتاً تضمين أي روابط أو مواقع إلكترونية (URLs, www, http, .com) في المقال لحماية أمان المجتمع. يرجى حذف الرابط للمتابعة.' 
                        : 'External links, websites, and URLs are strictly prohibited. Please remove any URLs to publish.'}
                    </span>
                  </div>
                </div>
              )}

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>{isAr ? 'عنوان المقال / الخبر' : 'Article Title'} *</span>
                  {hasLinkInTitle && <span className="text-[10px] text-rose-400">{isAr ? 'يحتوي على رابط!' : 'Contains link!'}</span>}
                </label>
                <input
                  type="text"
                  value={publishTitle}
                  onChange={(e) => setPublishTitle(e.target.value)}
                  placeholder={isAr ? 'مثال: ريال مدريد ينهي استعداداته التكتيكية لقمة دوري الأبطال...' : 'e.g. Manchester City tactical mastery seals decisive victory...'}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-white placeholder-slate-500 bg-[#060c18] focus:outline-none ${
                    hasLinkInTitle ? 'border-rose-500 bg-rose-950/20' : 'border-slate-800 focus:border-cyan-500'
                  }`}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  {isAr ? 'التصنيف الرياضي' : 'Category'} *
                </label>
                <select
                  value={publishCategory}
                  onChange={(e) => setPublishCategory(e.target.value as NewsCategory)}
                  className="w-full rounded-xl border border-slate-800 bg-[#060c18] px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Football">{isAr ? 'أخبار كروية عامة (Football)' : 'Football (General)'}</option>
                  <option value="Premier League">{isAr ? 'الدوري الإنجليزي (Premier League)' : 'Premier League'}</option>
                  <option value="La Liga">{isAr ? 'الدوري الإسباني (La Liga)' : 'La Liga'}</option>
                  <option value="Champions League">{isAr ? 'دوري أبطال أوروبا (Champions League)' : 'Champions League'}</option>
                  <option value="Transfers">{isAr ? 'سوق الانتقالات (Transfers)' : 'Transfers'}</option>
                  <option value="Tactical">{isAr ? 'تحليل تكتيكي (Tactical)' : 'Tactical Analysis'}</option>
                  <option value="AI Analysis">{isAr ? 'تحليل الذكاء الاصطناعي (AI Analysis)' : 'AI Analysis'}</option>
                </select>
              </div>

              {/* Summary */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>{isAr ? 'ملخص مقتضب (مقدمة سريعة)' : 'Summary / Excerpt'}</span>
                  {hasLinkInSummary && <span className="text-[10px] text-rose-400">{isAr ? 'يحتوي على رابط!' : 'Contains link!'}</span>}
                </label>
                <input
                  type="text"
                  value={publishSummary}
                  onChange={(e) => setPublishSummary(e.target.value)}
                  placeholder={isAr ? 'نبذة مختصرة تظهر في قائمة الأخبار...' : 'Short highlight displayed on the news card...'}
                  className={`w-full rounded-xl border px-3.5 py-2 text-xs text-white placeholder-slate-500 bg-[#060c18] focus:outline-none ${
                    hasLinkInSummary ? 'border-rose-500 bg-rose-950/20' : 'border-slate-800 focus:border-cyan-500'
                  }`}
                />
              </div>

              {/* Full Content */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>{isAr ? 'نص الخبر أو التحليل بالتفصيل' : 'Full Article Content'} *</span>
                  {hasLinkInContent && <span className="text-[10px] text-rose-400">{isAr ? 'يحتوي على رابط!' : 'Contains link!'}</span>}
                </label>
                <textarea
                  rows={5}
                  value={publishContent}
                  onChange={(e) => setPublishContent(e.target.value)}
                  placeholder={isAr ? 'اكتب تفاصيل الخبر، تشكيلة الفريق، الإحصائيات، أو وجهة نظرك التكتيكية بدون أي روابط...' : 'Write your detailed football analysis, team tactics, match stats, or breakdown... (Zero links allowed)'}
                  className={`w-full rounded-xl border p-3 text-xs text-white placeholder-slate-500 bg-[#060c18] focus:outline-none resize-none leading-relaxed ${
                    hasLinkInContent ? 'border-rose-500 bg-rose-950/20' : 'border-slate-800 focus:border-cyan-500'
                  }`}
                  required
                />
              </div>

              {/* Image Upload & Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>{isAr ? 'صورة الخبر (رفع من جهازك أو اختيار غلاف كروي)' : 'Article Image (Upload File or Pick Cover)'} *</span>
                </label>

                {/* Upload from file button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-950/30 py-2.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/40 transition"
                  >
                    <Upload className="h-4 w-4" />
                    <span>{isAr ? 'رفع صورة من جهازك' : 'Upload Image from Device'}</span>
                  </button>
                </div>

                {/* Preset Cover Selector */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-tech">
                    {isAr ? 'أو اختر من أغلفة الملاعب والمباريات المجهزة بدقة عالية:' : 'Or pick a high-resolution football cover:'}
                  </span>
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_FOOTBALL_COVERS.map((cover) => (
                      <div
                        key={cover.id}
                        onClick={() => setPublishImageUrl(cover.url)}
                        className={`h-14 rounded-lg overflow-hidden cursor-pointer border transition relative ${
                          publishImageUrl === cover.url
                            ? 'border-cyan-400 ring-2 ring-cyan-400/40'
                            : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={cover.url} alt={cover.label} className="h-full w-full object-cover" />
                        {publishImageUrl === cover.url && (
                          <div className="absolute inset-0 bg-cyan-500/30 flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Image Preview */}
                {publishImageUrl && (
                  <div className="relative h-32 rounded-xl overflow-hidden border border-cyan-500/30">
                    <img src={publishImageUrl} alt="Preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPublishImageUrl('')}
                      className="absolute top-2 right-2 rounded-full bg-black/70 p-1 text-white hover:bg-black transition"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-cyan-300 font-tech">
                      {isAr ? 'معاينة الغلاف' : 'Cover Preview'}
                    </span>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  {isAr ? 'الوسوم (مفصولة بفاصلة)' : 'Tags (comma separated)'}
                </label>
                <input
                  type="text"
                  value={publishTags}
                  onChange={(e) => setPublishTags(e.target.value)}
                  placeholder="Football, Tactics, Champions League"
                  className="w-full rounded-xl border border-slate-800 bg-[#060c18] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-900/60 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || hasAnyForbiddenLink || !publishImageUrl}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold shadow-lg transition ${
                    hasAnyForbiddenLink || !publishImageUrl || isSubmitting
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/25'
                  }`}
                >
                  {isSubmitting ? (
                    <span>{isAr ? 'جاري النشر...' : 'Publishing...'}</span>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>{isAr ? 'نشر المقال الكروي' : 'Publish Article'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
