// Megamind i18n — English + Sinhala dictionaries
// Add new keys here; use useT() in any Client Component to consume them.

export type Lang = 'en' | 'si';

export interface T {
  lang: Lang;
  nav: {
    howItWorks: string; subjects: string; tryAQuiz: string;
    pricing: string; flashcards: string; login: string;
    startFree: string; myProfile: string;
  };
  how: {
    eyebrow: string; heading: string; body: string;
    steps: { title: string; body: string }[];
  };
  pricing: {
    eyebrow: string; heading: string; body: string;
    plans: { name: string; unit: string; desc: string; features: string[]; cta: string; badge?: string }[];
  };
  faq: {
    eyebrow: string; heading: string; body: string; supportCta: string;
    items: { q: string; a: string }[];
  };
  subjects: { eyebrow: string; heading: string };
  flashcards: {
    eyebrow: string; heading: string; body: string;
    browseCta: string; createCta: string;
    stats: { val: string; lbl: string }[];
    swipeReview: string; swipeKnew: string;
  };
  tests: {
    eyebrow: string; heading: string; body: string; viewAllCta: string;
    noTests: string; adaptive: string; fixedPaper: string;
    adaptiveBadge: string; fixedBadge: string; questions: string; min: string;
    oneTime: string; buyNow: string; ctaTitle: string; ctaBody: string;
    seePlans: string; startFree: string;
  };
  quiz: {
    eyebrow: string; heading: string; body: string;
    features: { h: string; b: string }[];
    showTheory: string; submitAnswer: string; tryAgain: string; nextQuestion: string;
  };
  footer: { tagline: string; copyright: string };
}

const en: T = {
  lang: 'en',
  nav: {
    howItWorks: 'How it works', subjects: 'Subjects', tryAQuiz: 'Try a quiz',
    pricing: 'Pricing', flashcards: '🃏 Flashcards', login: 'Log in',
    startFree: 'Start free →', myProfile: '👤 My profile',
  },
  how: {
    eyebrow: 'How it works',
    heading: 'A tutor that rebuilds itself every time you answer.',
    body: 'Megamind watches how you answer — speed, confidence, mistakes — and quietly rewrites tomorrow\'s quiz to close the gaps.',
    steps: [
      { title: 'Pick a subject',      body: 'Choose from ICT, Physics, Chemistry, Maths or English. Tell us your grade and your target.' },
      { title: 'AI builds your quiz', body: 'Our AI picks questions based on what you know, where you slipped, and what\'s next on your syllabus.' },
      { title: 'Learn as you answer', body: 'Every question has a short theory snippet. Stuck? Tap it. Learn the concept in 30 seconds, then answer.' },
      { title: 'Skill graph updates', body: 'Your weak spots get revisited. Your strengths graduate to harder questions. It adapts every day.' },
    ],
  },
  pricing: {
    eyebrow: 'Pricing',
    heading: 'Pay monthly. Cancel anytime. Or buy a single test.',
    body: 'Full access to all 5 subjects from Rs. 1,490/month. Or grab individual tests from Rs. 1,000.',
    plans: [
      { name: 'Free',    unit: 'forever',      cta: 'Start free →',   desc: 'Taste the product. No credit card.',          features: ['2 subjects', '5 quizzes / week', 'Basic theory snippets', 'Community support'] },
      { name: 'Scholar', unit: 'per month',    cta: 'Go Scholar →',   desc: 'For the student going all-in on their exam.', features: ['All 5 subjects', 'Unlimited AI quizzes', 'Full theory library', 'Weak-spot analytics', 'Priority support'], badge: 'most popular' },
      { name: 'Family',  unit: 'per month',    cta: 'Pick Family →',  desc: 'Two siblings, two syllabi, one bill.',         features: ['Everything in Scholar', '2 student accounts', 'Parent dashboard', 'Progress reports', 'Shared test library'] },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    heading: 'Common\nquestions.',
    body: "Can't find what you're looking for? Message our team — we reply within an hour on weekdays.",
    supportCta: 'Email support →',
    items: [
      { q: 'Does Megamind follow the Sri Lankan syllabus?',           a: 'Yes. Every module is mapped to the national O/L and A/L syllabus, including Combined Maths, Pure Physics, ICT and the standard English stream.' },
      { q: 'How does the AI actually work?',                           a: "Every answer you give updates your skill graph. The AI uses that to pick the next question — harder if you're on a roll, or a fresh angle on the same concept if you're stuck." },
      { q: 'Can I buy just one test instead of subscribing?',          a: 'Yes — individual tests are Rs. 1,000 to Rs. 2,000 one-time. You keep the test, your answers and the AI feedback forever.' },
      { q: 'What grades are supported?',                               a: "O/L (Grade 6–11), A/L (Grade 12–13), and university entrance prep. We're adding primary-grade content in 2026." },
      { q: 'Can I cancel anytime?',                                    a: 'Yes. Cancel from your dashboard, no phone calls, no awkwardness. Your single-test purchases stay yours forever even after you cancel.' },
    ],
  },
  subjects: { eyebrow: 'Subjects', heading: 'Every subject. Every level.' },
  flashcards: {
    eyebrow: 'New · Flashcards', heading: 'Swipe, flip, remember.',
    body: "Curated decks from top Sri Lankan tutors. Plain text, images, even short videos — swipe left to review, right when you've nailed it.",
    browseCta: 'Browse decks →', createCta: 'Create a deck',
    stats: [{ val: '18+', lbl: 'Curated decks' }, { val: 'Rs. 500+', lbl: 'From, one-time' }, { val: '3', lbl: 'Card types' }],
    swipeReview: '← REVIEW', swipeKnew: 'I KNEW IT →',
  },
  tests: {
    eyebrow: 'Test marketplace',
    heading: 'No subscription? Buy a single test and keep it forever.',
    body: 'Past papers, model tests and subject packs — from Rs. 1,000. Yours permanently, AI feedback included.',
    viewAllCta: 'View all tests →', noTests: 'No tests available yet. Check back soon.',
    adaptive: 'AI adaptive', fixedPaper: 'Fixed paper', adaptiveBadge: 'Adaptive', fixedBadge: 'Fixed',
    questions: 'questions', min: 'min', oneTime: 'one-time · keep forever', buyNow: 'Buy now →',
    ctaTitle: 'Need the full library?',
    ctaBody: 'Scholar plan gives you unlimited access for Rs. 1,490/month',
    seePlans: 'See plans', startFree: 'Start free →',
  },
  quiz: {
    eyebrow: 'Try it live',
    heading: 'Stuck? Tap "show theory" — we\'ll teach you in 30 seconds.',
    body: 'This is the actual Megamind question format. Answer first, or peek the theory and learn the concept before you commit.',
    features: [
      { h: 'Bite-sized theory',       b: 'Each concept in 30–60 seconds, not a 20-page PDF.' },
      { h: 'AI hints on demand',      b: "Stuck after 15 seconds? The AI nudges, doesn't spoil." },
      { h: 'No penalty for peeking',  b: 'Learning is the point — score is secondary.' },
    ],
    showTheory: '📖 Show theory · no penalty', submitAnswer: 'Submit answer →',
    tryAgain: 'Try again', nextQuestion: 'Next question →',
  },
  footer: { tagline: 'AI-powered learning for Sri Lankan students.', copyright: '© 2026 Megamind. All rights reserved.' },
};

const si: T = {
  lang: 'si',
  nav: {
    howItWorks: 'ක්‍රියාවලිය', subjects: 'විෂයයන්', tryAQuiz: 'ප්‍රශ්නාවලිය',
    pricing: 'මිල ගණන්', flashcards: '🃏 ෆ්ලෑෂ් කාඩ්', login: 'පිවිසෙන්න',
    startFree: 'නොමිලේ ආරම්භ →', myProfile: '👤 මගේ පැතිකඩ',
  },
  how: {
    eyebrow: 'ක්‍රියාවලිය',
    heading: 'ඔබේ පිළිතුරු සමඟ ස්වයංක්‍රීයව ප්‍රශ්නාවලිය ගොඩනඟන උපකාරකයෙකු.',
    body: 'Megamind ඔබ පිළිතුරු දෙන ආකාරය නිරීක්ෂණය කරයි — වේගය, විශ්වාසය, වැරදි — ඉන් හෙට ප්‍රශ්නාවලිය ශ්‍රේෂ්ඨ ලෙස සකස් කරයි.',
    steps: [
      { title: 'විෂයයක් තෝරන්න',         body: 'ICT, භෞතික විද්‍යාව, රසායන විද්‍යාව, ගණිතය හෝ ඉංග්‍රීසි. ශ්‍රේණිය සහ ඔබේ ඉලක්කය සඳහන් කරන්න.' },
      { title: 'AI ප්‍රශ්නාවලිය සකසයි',   body: 'AI ඔබ දන්නා දේ, ඔබ අසාර්ථකව ජය ගත් ස්ථාන සහ ඔබේ විෂය නිර්දේශයේ ඊළඟ දෙය මත ප්‍රශ්න තෝරාගනී.' },
      { title: 'පිළිතුරු දෙමින් ඉගෙනෙන්', body: 'සෑම ප්‍රශ්නයකම කෙටි න්‍යාය දිනාමිය ඇත. හිරවී ද? ස්පර්ශ කරන්න. තත්පර 30 ක් ඇතුළත සංකල්පය ඉගෙනෙන්න.' },
      { title: 'කුසලතා ප්‍රස්තාරය යාවත්කාලීනය', body: 'ඔබේ දුර්වල ස්ථාන නැවත සමාලෝචනය කෙරේ. ශක්‍ය ස්ථාන දීර්ඝ ප්‍රශ්නවලට ශ්‍රේණිගත වේ. සෑම දිනකම රිද්මය ගැලපේ.' },
    ],
  },
  pricing: {
    eyebrow: 'මිල ගණන්',
    heading: 'මාසිකව ගෙවන්න. ඕනෑ වේලාවක අවලංගු කරන්න. හෝ තනි ප්‍රශ්නාවලිය ගන්න.',
    body: 'Rs. 1,490/මාසයෙන් විෂය 5 ම ලබාගන්න. හෝ Rs. 1,000 සිට තනි ප්‍රශ්නාවලිය ලබාගන්න.',
    plans: [
      { name: 'නොමිලේ',    unit: 'සදාකාලිකව',  cta: 'නොමිලේ ආරම්භ →',      desc: 'නිෂ්පාදිතය රස ඉගෙනෙන්න. ක්‍රෙඩිට් කාඩ් නැත.',       features: ['විෂය 2ක්', 'සතියකට ප්‍රශ්නාවලිය 5ක්', 'මූලික න්‍යාය දිනාමිය', 'ප්‍රජා සහය'] },
      { name: 'ශිෂ්‍යත්ව', unit: 'මාසිකව',      cta: 'ශිෂ්‍යත්ව ලබාගන්න →', desc: 'විභාගය ජය ගැනීමට නිවෙදිත ශිෂ්‍යයා සඳහා.',           features: ['විෂය 5 ම', 'AI ප්‍රශ්නාවලිය නොසීමිත', 'සම්පූර්ණ න්‍යාය පුස්තකාලය', 'දුර්වල ස්ථාන විශ්ලේෂණය', 'ප්‍රමුඛ සහය'], badge: 'වඩාත් ජනප්‍රිය' },
      { name: 'පවුල',       unit: 'මාසිකව',      cta: 'පවුල තෝරන්න →',      desc: 'සොහොයුරියෝ දෙදෙනා, විෂය දෙකක්, එක් බිල් එකක්.',     features: ['ශිෂ්‍යත්ව සෑම දෙයක්ම', 'ශිෂ්‍ය ගිණුම් 2ක්', 'දෙමව්පිය කළමනාකරු', 'ප්‍රගති වාර්තා', 'හෙළිදරව් ප්‍රශ්නාවලිය'] },
    ],
  },
  faq: {
    eyebrow: 'නිතර අසන ප්‍රශ්න',
    heading: 'සාමාන්‍ය\nප්‍රශ්න.',
    body: 'ඔබේ ප්‍රශ්නය නොපෙනෙනවාද? අප කණ්ඩායමට ලිඛිත කරන්න — සතියේ දිනවල පැයක් ඇතුළත අපි පිළිතුරු දෙමු.',
    supportCta: 'සහය ඊමේල් →',
    items: [
      { q: 'Megamind ශ්‍රී ලංකා විෂය නිර්දේශය අනුගමනය කරනවාද?', a: 'ඔව්. සෑම ඒකකයක්ම ජාතික O/L සහ A/L විෂය නිර්දේශයට, ඒකාබද්ධ ගණිතය, Pure Physics, ICT සහ සම්මත ඉංග්‍රීසි ධාරාව ඇතුළත් කරමින් සිතියම්ගත කර ඇත.' },
      { q: 'AI ඇත්තටමා ක්‍රියා කරන්නේ කෙලෙසද?',                    a: 'ඔබ ලබා දෙන සෑම පිළිතුරක්ම ඔබේ කුසලතා ප්‍රස්තාරය යාවත්කාලීන කරයි. AI ඒ භාවිතා කර ඊළඟ ප්‍රශ්නය තෝරා ගනී — ඔබ හොඳින් ගොස් නම් දීර්ඝ, හිරවී නම් නව කෝණයකින්.' },
      { q: 'දායකත්වය නොගෙන තනි ප්‍රශ්නාවලිය මිලදී ගත හැකිද?',    a: 'ඔව් — Rs. 1,000 සිට Rs. 2,000 ක් ඒකාරාශිය. ඔබ ප්‍රශ්නාවලිය, ඔබේ පිළිතුරු සහ AI ප්‍රතිපෝෂණය සදාකාලිකව ලබා ගනී.' },
      { q: 'කුමන ශ්‍රේණිවලට සහය දැක්වෙනවාද?',                       a: 'O/L (ශ්‍රේණිය 6–11), A/L (ශ්‍රේණිය 12–13), සහ විශ්ව විද්‍යාල ප්‍රවේශ සූදානම. 2026 දී ප්‍රාථමික ශ්‍රේණි අන්තර්ගතය එකතු කෙරේ.' },
      { q: 'ඕනෑ වේලාවක අවලංගු කළ හැකිද?',                           a: 'ඔව්. ඔබේ කළමනාකරු දළු මතින් අවලංගු කරන්න — දුරකථන ඇමතුම් නොමැත. ඒකාරාශිය ප්‍රශ්නාවලිය ලබීම දිගටම ලැබේ.' },
    ],
  },
  subjects: { eyebrow: 'විෂයයන්', heading: 'සෑම විෂයයක්. සෑම මට්ටමක්.' },
  flashcards: {
    eyebrow: 'නව · ෆ්ලෑෂ් කාඩ්', heading: 'ස්වයිප්, පෙරළ, මතක තබාගන්.',
    body: 'ශ්‍රී ලාංකික ශ්‍රේෂ්ඨ ගුරුවරුන්ගෙන් සකසූ ඩෙක්. සරල පෙළ, රූප, කෙටි වීඩියෝ — හදාරන්නට වමට, ජය ගත්තා නම් දකුණට ස්වයිප් කරන්න.',
    browseCta: 'ඩෙක් බලන්න →', createCta: 'ඩෙකක් සාදන්න',
    stats: [{ val: '18+', lbl: 'සකසූ ඩෙක්' }, { val: 'Rs. 500+', lbl: 'සිට, ඒකාරාශිය' }, { val: '3', lbl: 'කාඩ් වර්ග' }],
    swipeReview: '← හදාරන්න', swipeKnew: 'දැනෙනවා →',
  },
  tests: {
    eyebrow: 'ප්‍රශ්නාවලිය වෙළඳපළ',
    heading: 'දායකත්වයක් නැතිව? තනි ප්‍රශ්නාවලිය ගෙන සදාකාලිකව තබාගන්.',
    body: 'පසු ප්‍රශ්නාවලි, ආකෘති ප්‍රශ්නාවලි සහ විෂය පැකේජ — Rs. 1,000 සිට. ඔබේ, ස්ථිරව, AI ප්‍රතිපෝෂණ සහිතව.',
    viewAllCta: 'සියලු ප්‍රශ්නාවලි →', noTests: 'තවම ප්‍රශ්නාවලි නොමැත. ඉදිරියේදී නැවත බලන්න.',
    adaptive: 'AI අනුවර්තිත', fixedPaper: 'ස්ථාවර ප්‍රශ්නාවලිය', adaptiveBadge: 'අනුවර්තිත', fixedBadge: 'ස්ථාවර',
    questions: 'ප්‍රශ්න', min: 'මිනිත්තු', oneTime: 'ඒකාරාශිය · සදාකාලිකව', buyNow: 'දැන් ගන්න →',
    ctaTitle: 'සම්පූර්ණ පුස්තකාලය අවශ්‍යද?',
    ctaBody: 'Scholar සැලැස්ම Rs. 1,490/මාසයෙන් අසීමිත ප්‍රවේශය ලබා දෙයි',
    seePlans: 'සැලැස්ම බලන්න', startFree: 'නොමිලේ ආරම්භ →',
  },
  quiz: {
    eyebrow: 'සජීවී අත්හදා බලන්න',
    heading: 'හිරවී ද? "න්‍යාය පෙන්වන්න" ස්පර්ශ කරන්න — තත්පර 30 ක් ඇතුළත ඉගෙන දෙමු.',
    body: 'මෙය ඇත්ත Megamind ප්‍රශ්න ආකෘතිය. මුලින් පිළිතුරු දෙන්න, හෝ න්‍යාය බලා සංකල්පය ඉගෙනගෙන ඉදිරියට යන්න.',
    features: [
      { h: 'කෙටි න්‍යාය',            b: 'සෑම සංකල්පයක් තත්පර 30–60 ක් ඇතුළත, 20-පිටු PDF නොවේ.' },
      { h: 'AI ඉඟි ඉල්ලීම පරිදි',   b: 'තත්පර 15 කින් හිරවී ද? AI ඉඟිය දෙයි, පිළිතුර නොකියයි.' },
      { h: 'බලන්නට දඩයක් නැත',      b: 'ඉගෙනීම ඉලක්කය — ලකුණු ද්විතියික.' },
    ],
    showTheory: '📖 න්‍යාය පෙන්වන්න · දඩයක් නැත', submitAnswer: 'පිළිතුර ඉදිරිපත් කරන්න →',
    tryAgain: 'නැවත උත්සාහ කරන්න', nextQuestion: 'ඊළඟ ප්‍රශ්නය →',
  },
  footer: { tagline: 'ශ්‍රී ලාංකික සිසුන් සඳහා AI-ශක්‍ය ඉගෙනීම.', copyright: '© 2026 Megamind. සියලු හිමිකම් ඇවිරිණි.' },
};

export const TRANSLATIONS: Record<Lang, T> = { en, si };

/** Rebuild the full T object from flat DB rows. Falls back to hardcoded for missing keys. */
export function buildTFromRows(rows: { key: string; en: string; si: string }[], lang: Lang): T {
  const fallback = TRANSLATIONS[lang];
  const m = new Map(rows.map(r => [r.key, r[lang]]));
  const g = (key: string, fb: string) => m.get(key) ?? fb;
  const steps = (i: number) => ({
    title: g(`how.step_${i}_title`, fallback.how.steps[i]?.title ?? ''),
    body:  g(`how.step_${i}_body`,  fallback.how.steps[i]?.body  ?? ''),
  });
  const planFeat = (i: number) =>
    (m.get(`pricing.plan_${i}_features`) ?? fallback.pricing.plans[i]?.features.join('\n') ?? '').split('\n').filter(Boolean);

  return {
    lang,
    nav: {
      howItWorks: g('nav.howItWorks', fallback.nav.howItWorks),
      subjects:   g('nav.subjects',   fallback.nav.subjects),
      tryAQuiz:   g('nav.tryAQuiz',   fallback.nav.tryAQuiz),
      pricing:    g('nav.pricing',    fallback.nav.pricing),
      flashcards: g('nav.flashcards', fallback.nav.flashcards),
      login:      g('nav.login',      fallback.nav.login),
      startFree:  g('nav.startFree',  fallback.nav.startFree),
      myProfile:  g('nav.myProfile',  fallback.nav.myProfile),
    },
    how: {
      eyebrow: g('how.eyebrow', fallback.how.eyebrow),
      heading: g('how.heading', fallback.how.heading),
      body:    g('how.body',    fallback.how.body),
      steps:   [0, 1, 2, 3].map(steps),
    },
    pricing: {
      eyebrow: g('pricing.eyebrow', fallback.pricing.eyebrow),
      heading: g('pricing.heading', fallback.pricing.heading),
      body:    g('pricing.body',    fallback.pricing.body),
      plans: [0, 1, 2].map(i => ({
        name:     g(`pricing.plan_${i}_name`,  fallback.pricing.plans[i]?.name  ?? ''),
        unit:     g(`pricing.plan_${i}_unit`,  fallback.pricing.plans[i]?.unit  ?? ''),
        desc:     g(`pricing.plan_${i}_desc`,  fallback.pricing.plans[i]?.desc  ?? ''),
        cta:      g(`pricing.plan_${i}_cta`,   fallback.pricing.plans[i]?.cta   ?? ''),
        badge:    m.get(`pricing.plan_${i}_badge`) || fallback.pricing.plans[i]?.badge || undefined,
        features: planFeat(i),
      })),
    },
    faq: {
      eyebrow:    g('faq.eyebrow',    fallback.faq.eyebrow),
      heading:    g('faq.heading',    fallback.faq.heading),
      body:       g('faq.body',       fallback.faq.body),
      supportCta: g('faq.supportCta', fallback.faq.supportCta),
      items: [0, 1, 2, 3, 4].map(i => ({
        q: g(`faq.item_${i}_q`, fallback.faq.items[i]?.q ?? ''),
        a: g(`faq.item_${i}_a`, fallback.faq.items[i]?.a ?? ''),
      })),
    },
    subjects: {
      eyebrow: g('subjects.eyebrow', fallback.subjects.eyebrow),
      heading: g('subjects.heading', fallback.subjects.heading),
    },
    flashcards: {
      eyebrow:     g('flashcards.eyebrow',     fallback.flashcards.eyebrow),
      heading:     g('flashcards.heading',     fallback.flashcards.heading),
      body:        g('flashcards.body',        fallback.flashcards.body),
      browseCta:   g('flashcards.browseCta',   fallback.flashcards.browseCta),
      createCta:   g('flashcards.createCta',   fallback.flashcards.createCta),
      swipeReview: g('flashcards.swipeReview', fallback.flashcards.swipeReview),
      swipeKnew:   g('flashcards.swipeKnew',   fallback.flashcards.swipeKnew),
      stats: [0, 1, 2].map(i => ({
        val: g(`flashcards.stat_${i}_val`, fallback.flashcards.stats[i]?.val ?? ''),
        lbl: g(`flashcards.stat_${i}_lbl`, fallback.flashcards.stats[i]?.lbl ?? ''),
      })),
    },
    tests: {
      eyebrow:      g('tests.eyebrow',      fallback.tests.eyebrow),
      heading:      g('tests.heading',      fallback.tests.heading),
      body:         g('tests.body',         fallback.tests.body),
      viewAllCta:   g('tests.viewAllCta',   fallback.tests.viewAllCta),
      noTests:      g('tests.noTests',      fallback.tests.noTests),
      adaptive:     g('tests.adaptive',     fallback.tests.adaptive),
      fixedPaper:   g('tests.fixedPaper',   fallback.tests.fixedPaper),
      adaptiveBadge:g('tests.adaptiveBadge',fallback.tests.adaptiveBadge),
      fixedBadge:   g('tests.fixedBadge',   fallback.tests.fixedBadge),
      questions:    g('tests.questions',    fallback.tests.questions),
      min:          g('tests.min',          fallback.tests.min),
      oneTime:      g('tests.oneTime',      fallback.tests.oneTime),
      buyNow:       g('tests.buyNow',       fallback.tests.buyNow),
      ctaTitle:     g('tests.ctaTitle',     fallback.tests.ctaTitle),
      ctaBody:      g('tests.ctaBody',      fallback.tests.ctaBody),
      seePlans:     g('tests.seePlans',     fallback.tests.seePlans),
      startFree:    g('tests.startFree',    fallback.tests.startFree),
    },
    quiz: {
      eyebrow:      g('quiz.eyebrow',      fallback.quiz.eyebrow),
      heading:      g('quiz.heading',      fallback.quiz.heading),
      body:         g('quiz.body',         fallback.quiz.body),
      showTheory:   g('quiz.showTheory',   fallback.quiz.showTheory),
      submitAnswer: g('quiz.submitAnswer', fallback.quiz.submitAnswer),
      tryAgain:     g('quiz.tryAgain',     fallback.quiz.tryAgain),
      nextQuestion: g('quiz.nextQuestion', fallback.quiz.nextQuestion),
      features: [0, 1, 2].map(i => ({
        h: g(`quiz.feature_${i}_h`, fallback.quiz.features[i]?.h ?? ''),
        b: g(`quiz.feature_${i}_b`, fallback.quiz.features[i]?.b ?? ''),
      })),
    },
    footer: {
      tagline:   g('footer.tagline',   fallback.footer.tagline),
      copyright: g('footer.copyright', fallback.footer.copyright),
    },
  };
}
