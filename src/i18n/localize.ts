/**
 * Localization Helper
 * Translates dynamic football entities (teams, leagues, tasks, achievements, activities, news)
 * when the language is set to Arabic.
 */

import { Language } from '../types';

const TEAM_TRANSLATIONS_AR: Record<string, string> = {
  'Real Madrid CF': 'ريال مدريد',
  'Real Madrid': 'ريال مدريد',
  'FC Barcelona': 'برشلونة',
  'Barcelona': 'برشلونة',
  'Arsenal FC': 'آرسنال',
  'Arsenal': 'آرسنال',
  'Manchester City FC': 'مانشستر سيتي',
  'Manchester City': 'مانشستر سيتي',
  'Liverpool FC': 'ليفربول',
  'Liverpool': 'ليفربول',
  'Manchester United FC': 'مانشستر يونايتد',
  'Manchester United': 'مانشستر يونايتد',
  'Chelsea FC': 'تشيلسي',
  'Chelsea': 'تشيلسي',
  'Tottenham Hotspur FC': 'توتنهام هوتسبير',
  'Tottenham': 'توتنهام',
  'Aston Villa FC': 'أستون فيلا',
  'Aston Villa': 'أستون فيلا',
  'Newcastle United FC': 'نيوكاسل يونايتد',
  'Newcastle': 'نيوكاسل',
  'Brighton & Hove Albion FC': 'برايتون',
  'Brighton': 'برايتون',
  'West Ham United FC': 'وست هام',
  'West Ham': 'وست هام',
  'Wolverhampton Wanderers FC': 'ولفرهامبتون',
  'Wolves': 'ولفرهامبتون',
  'Everton FC': 'إيفرتون',
  'Everton': 'إيفرتون',
  'Brentford FC': 'برينتفورد',
  'Brentford': 'برينتفورد',
  'Fulham FC': 'فولهام',
  'Fulham': 'فولهام',
  'Crystal Palace FC': 'كريستال بالاس',
  'Crystal Palace': 'كريستال بالاس',
  'AFC Bournemouth': 'بورنموث',
  'Bournemouth': 'بورنموث',
  'Nottingham Forest FC': 'نوتنغهام فورست',
  'Nottingham Forest': 'نوتنغهام فورست',
  'Leicester City FC': 'ليستر سيتي',
  'Leicester': 'ليستر سيتي',
  'Southampton FC': 'ساوثهامبتون',
  'Southampton': 'ساوثهامبتون',
  'Ipswich Town FC': 'إيبسويتش تاون',
  'Ipswich Town': 'إيبسويتش تاون',

  // La Liga
  'Club Atlético de Madrid': 'أتلتيكو مدريد',
  'Atlético de Madrid': 'أتلتيكو مدريد',
  'Atletico Madrid': 'أتلتيكو مدريد',
  'Athletic Club': 'أتلتيك بيلباو',
  'Athletic Bilbao': 'أتلتيك بيلباو',
  'Real Sociedad de Fútbol': 'ريال سوسيداد',
  'Real Sociedad': 'ريال سوسيداد',
  'Real Betis Balompié': 'ريال بيتيس',
  'Real Betis': 'ريال بيتيس',
  'Villarreal CF': 'فياريال',
  'Villarreal': 'فياريال',
  'Girona FC': 'جيرونا',
  'Girona': 'جيرونا',
  'Sevilla FC': 'إشبيلية',
  'Sevilla': 'إشبيلية',
  'Valencia CF': 'فالنسيا',
  'Valencia': 'فالنسيا',
  'RC Celta de Vigo': 'سيلتا فيغو',
  'Celta Vigo': 'سيلتا فيغو',
  'RCD Mallorca': 'مايوركا',
  'Mallorca': 'مايوركا',
  'CA Osasuna': 'أوساسونا',
  'Osasuna': 'أوساسونا',
  'Getafe CF': 'خيتافي',
  'Getafe': 'خيتافي',
  'Rayo Vallecano de Madrid': 'رايو فاييكانو',
  'Rayo Vallecano': 'رايو فاييكانو',
  'Deportivo Alavés': 'ديبورتيفو ألافيس',
  'Alaves': 'ألافيس',
  'UD Las Palmas': 'لاس بالماس',
  'Las Palmas': 'لاس بالماس',
  'CD Leganés': 'ليغانيس',
  'Leganes': 'ليغانيس',
  'Real Valladolid CF': 'بلد الوليد',
  'Valladolid': 'بلد الوليد',
  'RCD Espanyol de Barcelona': 'إسبانيول',
  'Espanyol': 'إسبانيول',

  // Champions League & European Giants
  'FC Bayern München': 'بايرن ميونخ',
  'Bayern Munich': 'بايرن ميونخ',
  'Bayern': 'بايرن ميونخ',
  'Borussia Dortmund': 'بوروسيا دورتموند',
  'Dortmund': 'دورتموند',
  'Bayer 04 Leverkusen': 'باير ليفركوزن',
  'Bayer Leverkusen': 'باير ليفركوزن',
  'RB Leipzig': 'لايبزيغ',
  'VfB Stuttgart': 'شتوتغارت',
  'Paris Saint-Germain FC': 'باريس سان جيرمان',
  'Paris Saint-Germain': 'باريس سان جيرمان',
  'PSG': 'باريس سان جيرمان',
  'AS Monaco FC': 'موناكو',
  'Monaco': 'موناكو',
  'LOSC Lille': 'ليل',
  'Lille': 'ليل',
  'Stade Brestois 29': 'بريست',
  'Brest': 'بريست',
  'FC Internazionale Milano': 'إنتر ميلان',
  'Inter Milan': 'إنتر ميلان',
  'Inter': 'إنتر ميلان',
  'AC Milan': 'ميلان',
  'Juventus FC': 'يوفنتوس',
  'Juventus': 'يوفنتوس',
  'Atalanta BC': 'أتالانتا',
  'Atalanta': 'أتالانتا',
  'Bologna FC 1909': 'بولونيا',
  'Bologna': 'بولونيا',
  'Sporting Clube de Portugal': 'سبورتينغ لشبونة',
  'Sporting CP': 'سبورتينغ لشبونة',
  'SL Benfica': 'بنفيكا',
  'Benfica': 'بنفيكا',
  'FC Porto': 'بورتو',
  'Porto': 'بورتو',
  'PSV Eindhoven': 'آيندهوفن',
  'PSV': 'آيندهوفن',
  'Feyenoord Rotterdam': 'فاينورد',
  'Feyenoord': 'فاينورد',
  'Celtic FC': 'سيلتيك',
  'Celtic': 'سيلتيك',
  'Club Brugge KV': 'كلوب بروج',
  'Club Brugge': 'كلوب بروج',
  'FC Shakhtar Donetsk': 'شاختار دونيتسك',
  'Shakhtar': 'شاختار',
  'GNK Dinamo Zagreb': 'دينامو زغرب',
  'Dinamo Zagreb': 'دينامو زغرب',
  'FK Crvena Zvezda': 'ريد ستار بلغراد',
  'BSC Young Boys': 'يونغ بويز',
  'SK Sturm Graz': 'شتورم غراتس',
  'AC Sparta Praha': 'سبارتا براغ',
  'ŠK Slovan Bratislava': 'سلوفان براتيسلافا',
  'FC Red Bull Salzburg': 'سالزبورغ',
  'Salzburg': 'سالزبورغ',
  'Bodø/Glimt': 'بودو/غليمت',
  'FK Bodø/Glimt': 'بودو/غليمت'
};

const LEAGUE_TRANSLATIONS_AR: Record<string, string> = {
  'Premier League': 'الدوري الإنجليزي الممتاز',
  'English Premier League': 'الدوري الإنجليزي الممتاز',
  'La Liga': 'الدوري الإسباني (لا ليغا)',
  'Primera Division': 'الدوري الإسباني (لا ليغا)',
  'Spanish League': 'الدوري الإسباني',
  'UEFA Champions League': 'دوري أبطال أوروبا',
  'Champions League': 'دوري أبطال أوروبا',
};

export function localizeTeamName(name: string, lang: Language): string {
  if (lang !== 'ar') return name;
  return TEAM_TRANSLATIONS_AR[name] || TEAM_TRANSLATIONS_AR[name.trim()] || name;
}

export function localizeLeagueName(name: string, lang: Language): string {
  if (lang !== 'ar') return name;
  return LEAGUE_TRANSLATIONS_AR[name] || LEAGUE_TRANSLATIONS_AR[name.trim()] || name;
}

export function localizeWeekLabel(weekLabel: string | undefined, lang: Language): string {
  if (!weekLabel) return '';
  if (lang !== 'ar') return weekLabel;
  // e.g. "Matchday 28 • Season 2026" or "Round 5 • 2026"
  return weekLabel
    .replace(/Matchday/gi, 'الجولة')
    .replace(/Round/gi, 'الدور')
    .replace(/Season/gi, 'موسم')
    .replace(/Quarter-finals/gi, 'ربع النهائي')
    .replace(/Semi-finals/gi, 'نصف النهائي')
    .replace(/Final/gi, 'النهائي');
}

export function localizeChoice(choice: string, lang: Language): string {
  if (lang !== 'ar') {
    if (choice === 'HOME_WIN') return 'Home Win';
    if (choice === 'DRAW') return 'Draw';
    if (choice === 'AWAY_WIN') return 'Away Win';
    return choice;
  }
  if (choice === 'HOME_WIN') return 'فوز المضيف';
  if (choice === 'DRAW') return 'تعادل';
  if (choice === 'AWAY_WIN') return 'فوز الضيف';
  return choice;
}

export function localizeRarity(rarity: string, lang: Language): string {
  if (lang !== 'ar') return rarity;
  switch (rarity) {
    case 'Common': return 'شائع';
    case 'Rare': return 'نادر';
    case 'Epic': return 'ملحمي';
    case 'Legendary': return 'أسطوري';
    default: return rarity;
  }
}

export function localizePosition(position: string, lang: Language): string {
  if (lang !== 'ar') return position;
  switch (position) {
    case 'ATT': return 'هجوم';
    case 'MID': return 'وسط';
    case 'DEF': return 'دفاع';
    case 'GK': return 'حارس';
    default: return position;
  }
}

export function localizeTask<T extends { id: string; title: string; description: string; actionText?: string }>(task: T, lang: Language): T {
  if (lang !== 'ar') return task;
  const AR_TASKS: Record<string, { title: string; description: string; actionText?: string }> = {
    'task-1': {
      title: 'تسجيل الدخول اليومي',
      description: 'طالب بنقاط FAI اليومية وحافظ على استمرار سلسلة حضورك النشطة.',
      actionText: 'تسجيل الحضور'
    },
    'task-2': {
      title: 'متابعة FootballAI على منصة X',
      description: 'انضم لمجتمعنا على X (تويتر) للاطلاع على تحليلات المباريات والتحديثات.',
      actionText: 'متابعة على X'
    },
    'task-3': {
      title: 'مشاركة تطبيق FootballAI',
      description: 'شارك التطبيق مع أصدقائك ومحبي كرة القدم على منصات التواصل.',
      actionText: 'مشاركة التطبيق'
    },
    'task-4': {
      title: 'دعوة صديق جديد',
      description: 'شارك رمز الإحالة الخاص بك FAI2026 مع عشاق كرة القدم.',
      actionText: 'دعوة الأصدقاء'
    },
    'task-5': {
      title: 'إكمال 3 توقعات كروية',
      description: 'قدم توقعاتك لـ 3 مباريات قادمة عبر نموذج الذكاء الاصطناعي.',
      actionText: 'توقع الآن'
    },
    'task-6': {
      title: 'قراءة الأخبار الكروية',
      description: 'اطلع على أحدث تقارير الذكاء الاصطناعي والتحليلات التكتيكية العالمية.',
      actionText: 'تصفح الأخبار'
    },
    'task-7': {
      title: 'سلسلة 7 أيام متتالية',
      description: 'سجل الحضور لسبعة أيام متتالية لفتح مضاعف المكافآت المميز.',
      actionText: 'متابعة السلسلة'
    }
  };

  const localized = AR_TASKS[task.id];
  if (!localized) return task;
  return {
    ...task,
    title: localized.title,
    description: localized.description,
    actionText: localized.actionText || task.actionText
  };
}

export function localizeAchievement<T extends { id: string; title: string; description: string }>(ach: T, lang: Language): T {
  if (lang !== 'ar') return ach;
  const AR_ACHIEVEMENTS: Record<string, { title: string; description: string }> = {
    'ach-1': {
      title: 'تسجيل الحضور الأول',
      description: 'أكملت أول عملية تسجيل دخول والمطالبة بنقاط FAI التجريبية.'
    },
    'ach-2': {
      title: 'التوقع الأول',
      description: 'قدمت أول توقع لنتيجة مباراة بالذكاء الاصطناعي بنجاح.'
    },
    'ach-3': {
      title: 'سلسلة 7 أيام متتالية',
      description: 'حافظت على سلسلة حضور متواصلة دون انقطاع لمدة 7 أيام.'
    },
    'ach-4': {
      title: '10 توقعات مكتملة',
      description: 'قدمت 10 توقعات لنتائج المباريات بالاعتماد على تحليلات المنصة.'
    },
    'ach-5': {
      title: 'أول إحالة ناجحة',
      description: 'دعوت صديقاً مؤهلاً بنجاح للانضمام لمنظومة FootballAI.'
    },
    'ach-6': {
      title: 'مستكشف بطاقات NFT',
      description: 'عاينت واستكشفت بطاقات اللاعبين الرقمية في سوق المنصة.'
    }
  };

  const localized = AR_ACHIEVEMENTS[ach.id];
  if (!localized) return ach;
  return {
    ...ach,
    title: localized.title,
    description: localized.description
  };
}

export function localizeActivity<T extends { id: string; title: string; timestamp: string }>(act: T, lang: Language): T {
  if (lang !== 'ar') return act;
  let title = act.title;
  let timestamp = act.timestamp;

  if (title.includes('Daily FAI Check-in') || title.includes('Daily Check-in Bonus')) {
    title = 'مكافأة تسجيل الدخول اليومي';
  } else if (title.includes('Day 7 Mega Claim')) {
    title = 'مكافأة اليوم السابع الكبرى';
  } else if (title.includes('Prediction Win')) {
    title = title.replace('Prediction Win:', 'فوز في توقع:');
  } else if (title.includes('Mission:')) {
    title = title.replace('Mission:', 'مهمة:');
  } else if (title.includes('Welcome Community Pilot Grant')) {
    title = 'منحة الترحيب التجريبية للمجتمع';
  }

  if (timestamp === 'Just now') timestamp = 'الآن';
  else if (timestamp === 'Today') timestamp = 'اليوم';
  else if (timestamp === 'Yesterday') timestamp = 'أمس';
  else if (timestamp === '2 days ago') timestamp = 'منذ يومين';
  else if (timestamp.includes('hours ago')) timestamp = timestamp.replace('hours ago', 'ساعات مضت');

  return {
    ...act,
    title,
    timestamp
  };
}

export function localizeNewsItem<T extends { id: string; title: string; summary: string; content: string; category: string; readTime?: string; publishedAt: string }>(item: T, lang: Language): T {
  if (lang !== 'ar') return item;
  const AR_NEWS: Record<string, { title: string; summary: string; content: string; category: string; readTime?: string; publishedAt: string }> = {
    'news-1': {
      title: 'التتبع العصبي من الجيل القادم: كيف يعيد التعلم الآلي رسم تكتيكات كرة القدم الحديثة',
      summary: 'أندية النخبة الأوروبية تدمج خوارزميات التتبع المكاني اللحظي لمحاكاة زوايا الضغط العكسي أثناء الحصص التدريبية.',
      content: 'تجاوزت التحليلات الكروية الحديثة مجرد حساب نسب الاستحواذ وعدد التسديدات التقليدية. باستخدام التتبع البصري فائق الدقة والشبكات العصبية العميقة، أصبحت الأجهزة الفنية قادرة على نمذجة تحركات اللاعبين بدون كرة، وظلال التغطية الدفاعية بشكل تفاعلي ومباشر. تستخدم النماذج التنبؤية لـ FootballAI أطراً رياضية متطورة لتحديد احتمالات نتائج المباريات بدقة عالية.',
      category: 'تحليل الذكاء الاصطناعي',
      readTime: 'قراءة 3 دقائق',
      publishedAt: 'منذ ساعتين'
    },
    'news-2': {
      title: 'قرعة ربع نهائي دوري أبطال أوروبا: صدام العمالقة التاريخي في مدريد ومانشستر',
      summary: 'الساحة الأوروبية تشتعل بمواجهات نارية تجمع أبطال القارة في صراع تكتيكي حاسم ذهاباً وإياباً.',
      content: 'وصلت حمى كرة القدم الأوروبية إلى ذروتها عقب قرعة الأدوار الإقصائية لدوري الأبطال. يستعد عشاق الساحرة المستديرة لدروس تكتيكية كبرى بين منظومات الاستحواذ التمركزي وفرق التحولات السريعة فائقة الخطورة. تؤكد النماذج الإحصائية أن الفارق في التأهل سيكون ضئيلاً للغاية، وستكون الكرات الثابتة العامل الحاسم الأول.',
      category: 'دوري الأبطال',
      readTime: 'قراءة 4 دقائق',
      publishedAt: 'منذ 4 ساعات'
    },
    'news-3': {
      title: 'مخطط سوق الانتقالات الصيفي: خوارزميات الاستكشاف الرقمي تقود صفقات الـ 100 مليون يورو',
      summary: 'كبار المديرين الرياضيين يعتمدون على مقاييس الذكاء الاصطناعي للتنبؤ بمعدلات الإصابات والجاهزية البدنية قبل توقيع العقود.',
      content: 'تبنى سوق الانتقالات نهج التدقيق الخوارزمي الصارم. لم تعد الأندية تكتفي بالتقارير التقليدية للمستكشفين في المدرجات؛ بل باتت تحلل مؤشرات الإجهاد الفسيولوجي ومقاومة الضغط الذهني عبر التعلم الآلي قبل إبرام الصفقات القياسية.',
      category: 'الانتقالات',
      readTime: 'قراءة 5 دقائق',
      publishedAt: 'منذ 6 ساعات'
    },
    'news-4': {
      title: 'تكتيكات الكتلة المقلوبة في الدوري الإنجليزي: تحييد خطورة التحولات الهجومية الخاطفة',
      summary: 'كيف يعيد مدربو البريميرليغ تنظيم هياكل الدفاع المتوسط لإحباط الزيادات العددية في الهجمات المرتدة.',
      content: 'يواصل الدوري الإنجليزي الممتاز تقديم تطور تكتيكي غير مسبوق في كرة القدم العالمية. ومع ثبات الخطوط الدفاعية والسرعة الفائقة لخطوط الهجوم، تحمل كل مواجهة وزناً هائلاً في حسم سباق اللقب والمقاعد الأوروبية.',
      category: 'تكتيكات',
      readTime: 'قراءة 3 دقائق',
      publishedAt: 'منذ 8 ساعات'
    }
  };

  const localized = AR_NEWS[item.id];
  if (!localized) return item;
  return {
    ...item,
    title: localized.title,
    summary: localized.summary,
    content: localized.content,
    category: localized.category,
    readTime: localized.readTime || item.readTime,
    publishedAt: localized.publishedAt
  };
}

// Convenient Aliases
export const localizeRecommendedChoice = localizeChoice;
export const localizeRarityTier = localizeRarity;
export const localizeNewsArticle = localizeNewsItem;
