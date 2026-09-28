/**
 * Football News Service
 * Powered by high-fidelity experimental football intelligence data.
 * Zero external NEWS_API_KEY required — functions seamlessly out-of-the-box.
 */

import { NewsCategory, NewsItem } from '../types';

export const EXPERIMENTAL_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Next-Gen Neural Tracking: How Machine Learning is Redefining Tactical Football',
    summary: 'European clubs are integrating spatial tracking algorithms to simulate opponent pressing angles in real time during training sessions.',
    content: `Modern football analytics has transitioned far beyond simple possession percentages and shot counts. With high-framerate optical tracking and deep neural networks, coaching staffs now model off-the-ball runs and defensive cover shadows dynamically.

FootballAI's predictive engines utilize similar mathematical models, aggregating player positioning data, acceleration bursts, and transition frequency to generate probabilistic outcome forecasts. In upcoming updates, supporters will be able to visualize predictive heatmaps directly in the match hub.

Experimental Notice: This article is produced by FootballAI's experimental data synthesizer. Zero external news keys are required.`,
    category: 'AI Analysis',
    tags: ['AI Analysis', 'Tactical', 'Computer Vision', 'xG'],
    source: 'FAI Analytics Desk',
    publishedAt: '2 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    readTime: '3 min read'
  },
  {
    id: 'news-2',
    title: 'Champions League Quarter-Finals Draw: Heavyweights Collide in Madrid & Manchester',
    summary: 'The stage is set for a blockbuster clash as the defending champions face off against historic rivals in an electrifying two-leg tie.',
    content: `The European football landscape reaches fever pitch as UEFA conducted the draw for the Champions League knockout rounds. Football enthusiasts and analysts are preparing for tactical masterclasses between positional-play juggernauts and high-velocity counter-attacking sides.

Statistical models indicate an exceptionally narrow margin of victory across both legs, with set-piece efficiency projected to be the single highest differentiator.`,
    category: 'Champions League',
    tags: ['Champions League', 'Tactical', 'European Cup'],
    source: 'European Football Report',
    publishedAt: '4 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read'
  },
  {
    id: 'news-3',
    title: 'Summer Transfer Blueprint: High-Tech Scouting Algorithms Driving 100M+ Signings',
    summary: 'Top sporting directors are utilizing predictive injury and longevity AI metrics prior to sanctioning marquee European transfers.',
    content: `The transfer market has embraced algorithmic diligence. Clubs are no longer relying solely on scouts in the stands; instead, physiological strain indices and pressing resistance under cognitive fatigue are evaluated via machine learning before contracts are drafted.`,
    category: 'Transfers',
    tags: ['Transfers', 'Scouting', 'AI Analysis'],
    source: 'Global Transfer Central',
    publishedAt: '6 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read'
  },
  {
    id: 'news-4',
    title: 'Premier League Inverted Block Tactics: Countering Rapid Transition Overloads',
    summary: 'How top flight managers are reorganizing their mid-block structures to negate transition overloads.',
    content: `England's top tier continues to deliver unprecedented tactical evolution. With defensive records holding firm and attacking lines operating at peak velocity, every single fixture carries massive implications for the title race and European qualification.`,
    category: 'Tactical',
    tags: ['Tactical', 'Premier League', 'Transition Analysis'],
    source: 'EPL Insight',
    publishedAt: '8 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80',
    readTime: '3 min read'
  },
  {
    id: 'news-5',
    title: 'La Liga Clásico Tactical Breakdown: Midfield Supremacy Dictating Spanish Crown',
    summary: 'Deep-dive analysis into the spatial structures and inverted fullback rotations defining the Spanish championship race.',
    content: `A surgical look into how modern tactical fluidity has evolved in Spanish football. The role of box-to-box midfielders and progressive passing distance continues to surpass raw possession metrics in determining match winners.`,
    category: 'Tactical',
    tags: ['Tactical', 'La Liga', 'Clasico'],
    source: 'Iberian Football Daily',
    publishedAt: '12 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read'
  },
  {
    id: 'news-6',
    title: 'Autonomous Offside & Optical Tracking: The Next Era of AI In Match Operations',
    summary: 'Continental federations pilot ultra-low-latency computer vision tracking to deliver instant precision telemetry.',
    content: `Computer vision technology continues its rapid advancement on the pitch. Sub-millimeter skeletal mesh tracking allows automated systems to render 3D avatars of attackers and defenders, minimizing match disruption while maintaining absolute measurement fidelity.`,
    category: 'AI Analysis',
    tags: ['AI Analysis', 'Computer Vision', 'VAR'],
    source: 'SportsTech Review',
    publishedAt: '1 day ago',
    imageUrl: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read'
  }
];

export const DEMO_NEWS = EXPERIMENTAL_NEWS;

export async function getNews(category?: NewsCategory | string): Promise<NewsItem[]> {
  // Simulating async network delay
  await new Promise(resolve => setTimeout(resolve, 80));
  if (!category || category === 'All') {
    return EXPERIMENTAL_NEWS;
  }
  return EXPERIMENTAL_NEWS.filter(item => item.category === category);
}

export async function getNewsById(id: string): Promise<NewsItem | undefined> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return EXPERIMENTAL_NEWS.find(item => item.id === id);
}

export const getAllNews = getNews;

