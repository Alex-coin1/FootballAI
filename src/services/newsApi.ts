/**
 * FootballAI Community News Service
 * Real user-generated football news and tactical analysis.
 * Fake news items have been deleted.
 * External links and URLs are strictly prohibited to ensure community safety.
 */

import { NewsCategory, NewsItem } from '../types';

const STORAGE_KEY_COMMUNITY_NEWS = 'footballai_community_news';

/**
 * Strict validator to detect URLs, web domains, and links in text.
 * Links are strictly forbidden per user requirements.
 */
export function containsForbiddenLinks(text?: string): boolean {
  if (!text) return false;
  
  // 1. Explicit protocols
  const protocolPattern = /(?:https?|ftp|file|chrome|mailto):\/\/[^\s]+/i;
  if (protocolPattern.test(text)) return true;

  // 2. www. prefix
  const wwwPattern = /\bwww\.[a-z0-9-]+\.[a-z0-9.-]+/i;
  if (wwwPattern.test(text)) return true;

  // 3. Common domain TLDs and shorteners
  const domainPattern = /\b[a-z0-9.-]+\.(com|net|org|io|co|xyz|app|me|info|biz|site|online|tech|ai|dev|link|top|club|vip|live|pro|space|tv|gg|cc|tg|ly|gl|ee|is)\b(?:\/[^\s]*)?/i;
  if (domainPattern.test(text)) return true;

  // 4. Markdown links [text](url) or HTML tags <a href="...">
  const markdownPattern = /\[.*?\]\(.*?\)/i;
  const htmlLinkPattern = /<a[\s]+[^>]*?href[\s]?=[\s"\']?[^\'\"\s>]+[\'\"\s>]?/i;
  if (markdownPattern.test(text) || htmlLinkPattern.test(text)) return true;

  // 5. Telegram, WhatsApp, social short links
  const socialShorteners = /\b(t\.me|wa\.me|bit\.ly|tinyurl\.com|goo\.gl|cutt\.ly|is\.gd|v\.gd)\b/i;
  if (socialShorteners.test(text)) return true;

  return false;
}

/**
 * Empty list of default/experimental news - all fake news deleted
 */
export const EXPERIMENTAL_NEWS: NewsItem[] = [];
export const DEMO_NEWS = EXPERIMENTAL_NEWS;

/**
 * Retrieve all community news from localStorage
 */
export function getStoredCommunityNews(): NewsItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMMUNITY_NEWS);
    if (raw) {
      const parsed: NewsItem[] = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load community news', e);
  }
  return [];
}

/**
 * Save community news to localStorage
 */
export function saveStoredCommunityNews(news: NewsItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_COMMUNITY_NEWS, JSON.stringify(news));
  } catch (e) {
    console.error('Failed to save community news', e);
  }
}

/**
 * Get news items, filtered by category if specified
 */
export async function getNews(category?: NewsCategory | string): Promise<NewsItem[]> {
  await new Promise(resolve => setTimeout(resolve, 40));
  const all = getStoredCommunityNews();
  if (!category || category === 'All') {
    return all;
  }
  return all.filter(item => item.category === category);
}

/**
 * Get a specific news item by ID
 */
export async function getNewsById(id: string): Promise<NewsItem | undefined> {
  await new Promise(resolve => setTimeout(resolve, 30));
  const all = getStoredCommunityNews();
  return all.find(item => item.id === id);
}

/**
 * Publish a new football news article created by a user
 * Image must be provided (file upload or URL)
 * Links are strictly prohibited
 */
export async function publishCommunityNews(params: {
  title: string;
  summary: string;
  content: string;
  category: NewsCategory;
  imageUrl: string;
  author: string;
  walletAddress?: string;
  tags?: string[];
}): Promise<{ success: boolean; item?: NewsItem; error?: string }> {
  // Validate presence
  if (!params.title.trim()) {
    return { success: false, error: 'Title is required' };
  }
  if (!params.content.trim()) {
    return { success: false, error: 'Article content is required' };
  }
  if (!params.imageUrl.trim()) {
    return { success: false, error: 'An image is required for the news article' };
  }

  // Strict link check across all text fields
  if (
    containsForbiddenLinks(params.title) ||
    containsForbiddenLinks(params.summary) ||
    containsForbiddenLinks(params.content) ||
    (params.tags && params.tags.some(t => containsForbiddenLinks(t)))
  ) {
    return {
      success: false,
      error: 'FORBIDDEN_LINKS: Including links, URLs, or external websites is strictly prohibited in news posts.'
    };
  }

  // Calculate approximate read time
  const wordCount = (params.content + ' ' + params.summary).trim().split(/\s+/).length;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 180));
  const readTime = `${readMinutes} min read`;

  const newItem: NewsItem = {
    id: `cnews_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: params.title.trim(),
    summary: params.summary.trim() || params.content.trim().slice(0, 140) + '...',
    content: params.content.trim(),
    category: params.category || 'Football',
    source: `Community • ${params.author}`,
    publishedAt: 'Just now',
    imageUrl: params.imageUrl.trim(),
    readTime,
    tags: params.tags && params.tags.length > 0 ? params.tags : [params.category, 'Community'],
    viewsCount: '1 view',
    author: params.author
  };

  const existing = getStoredCommunityNews();
  const updated = [newItem, ...existing];
  saveStoredCommunityNews(updated);

  return { success: true, item: newItem };
}

/**
 * Delete a news article by ID
 */
export async function deleteCommunityNews(id: string): Promise<boolean> {
  const existing = getStoredCommunityNews();
  const filtered = existing.filter(n => n.id !== id);
  saveStoredCommunityNews(filtered);
  return true;
}

export const getAllNews = getNews;
