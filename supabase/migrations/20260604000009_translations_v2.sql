-- ============================================================
-- Migration 009 — Translations: Flashcards, Tests, Quiz sections
-- Adds new rows to the translations table created in migration 008.
-- ============================================================

INSERT INTO translations (key, section, en, si) VALUES

-- FLASHCARDS SECTION
('flashcards.eyebrow',     'flashcards', 'New · Flashcards',  'නව · ෆ්ලෑෂ් කාඩ්'),
('flashcards.heading',     'flashcards', 'Swipe, flip, remember.', 'ස්වයිප්, පෙරළ, මතක තබාගන්.'),
('flashcards.body',        'flashcards',
 'Curated decks from top Sri Lankan tutors. Plain text, images, even short videos — swipe left to review, right when you''ve nailed it.',
 'ශ්‍රී ලාංකික ශ්‍රේෂ්ඨ ගුරුවරුන්ගෙන් සකසූ ඩෙක්. සරල පෙළ, රූප, කෙටි වීඩියෝ — හදාරන්නට වමට, ජය ගත්තා නම් දකුණට ස්වයිප් කරන්න.'),
('flashcards.browseCta',   'flashcards', 'Browse decks →',    'ඩෙක් බලන්න →'),
('flashcards.createCta',   'flashcards', 'Create a deck',     'ඩෙකක් සාදන්න'),
('flashcards.stat_0_val',  'flashcards', '18+',               '18+'),
('flashcards.stat_0_lbl',  'flashcards', 'Curated decks',     'සකසූ ඩෙක්'),
('flashcards.stat_1_val',  'flashcards', 'Rs. 500+',          'Rs. 500+'),
('flashcards.stat_1_lbl',  'flashcards', 'From, one-time',    'සිට, ඒකාරාශිය'),
('flashcards.stat_2_val',  'flashcards', '3',                 '3'),
('flashcards.stat_2_lbl',  'flashcards', 'Card types',        'කාඩ් වර්ග'),
('flashcards.swipeReview', 'flashcards', '← REVIEW',          '← හදාරන්න'),
('flashcards.swipeKnew',   'flashcards', 'I KNEW IT →',       'දැනෙනවා →'),

-- TEST MARKETPLACE SECTION
('tests.eyebrow',       'tests', 'Test marketplace',
 'ප්‍රශ්නාවලිය වෙළඳපළ'),
('tests.heading',       'tests', 'No subscription? Buy a single test and keep it forever.',
 'දායකත්වයක් නැතිව? තනි ප්‍රශ්නාවලිය ගෙන සදාකාලිකව තබාගන්.'),
('tests.body',          'tests', 'Past papers, model tests and subject packs — from Rs. 1,000. Yours permanently, AI feedback included.',
 'පසු ප්‍රශ්නාවලි, ආකෘති ප්‍රශ්නාවලි සහ විෂය පැකේජ — Rs. 1,000 සිට. ඔබේ, ස්ථිරව, AI ප්‍රතිපෝෂණ සහිතව.'),
('tests.viewAllCta',    'tests', 'View all tests →',          'සියලු ප්‍රශ්නාවලි →'),
('tests.noTests',       'tests', 'No tests available yet. Check back soon.',
 'තවම ප්‍රශ්නාවලි නොමැත. ඉදිරියේදී නැවත බලන්න.'),
('tests.adaptive',      'tests', 'AI adaptive',               'AI අනුවර්තිත'),
('tests.fixedPaper',    'tests', 'Fixed paper',               'ස්ථාවර ප්‍රශ්නාවලිය'),
('tests.adaptiveBadge', 'tests', 'Adaptive',                  'අනුවර්තිත'),
('tests.fixedBadge',    'tests', 'Fixed',                     'ස්ථාවර'),
('tests.questions',     'tests', 'questions',                  'ප්‍රශ්න'),
('tests.min',           'tests', 'min',                        'මිනිත්තු'),
('tests.oneTime',       'tests', 'one-time · keep forever',    'ඒකාරාශිය · සදාකාලිකව'),
('tests.buyNow',        'tests', 'Buy now →',                  'දැන් ගන්න →'),
('tests.ctaTitle',      'tests', 'Need the full library?',
 'සම්පූර්ණ පුස්තකාලය අවශ්‍යද?'),
('tests.ctaBody',       'tests', 'Scholar plan gives you unlimited access for Rs. 1,490/month',
 'Scholar සැලැස්ම Rs. 1,490/මාසයෙන් අසීමිත ප්‍රවේශය ලබා දෙයි'),
('tests.seePlans',      'tests', 'See plans',                  'සැලැස්ම බලන්න'),
('tests.startFree',     'tests', 'Start free →',               'නොමිලේ ආරම්භ →'),

-- QUIZ PREVIEW SECTION
('quiz.eyebrow',       'quiz', 'Try it live',                   'සජීවී අත්හදා බලන්න'),
('quiz.heading',       'quiz', 'Stuck? Tap "show theory" — we''ll teach you in 30 seconds.',
 'හිරවී ද? "න්‍යාය පෙන්වන්න" ස්පර්ශ කරන්න — තත්පර 30 ක් ඇතුළත ඉගෙන දෙමු.'),
('quiz.body',          'quiz', 'This is the actual Megamind question format. Answer first, or peek the theory and learn the concept before you commit.',
 'මෙය ඇත්ත Megamind ප්‍රශ්න ආකෘතිය. මුලින් පිළිතුරු දෙන්න, හෝ න්‍යාය බලා සංකල්පය ඉගෙනගෙන ඉදිරියට යන්න.'),
('quiz.feature_0_h',   'quiz', 'Bite-sized theory',             'කෙටි න්‍යාය'),
('quiz.feature_0_b',   'quiz', 'Each concept in 30–60 seconds, not a 20-page PDF.',
 'සෑම සංකල්පයක් තත්පර 30–60 ක් ඇතුළත, 20-පිටු PDF නොවේ.'),
('quiz.feature_1_h',   'quiz', 'AI hints on demand',            'AI ඉඟි ඉල්ලීම පරිදි'),
('quiz.feature_1_b',   'quiz', 'Stuck after 15 seconds? The AI nudges, doesn''t spoil.',
 'තත්පර 15 කින් හිරවී ද? AI ඉඟිය දෙයි, පිළිතුර නොකියයි.'),
('quiz.feature_2_h',   'quiz', 'No penalty for peeking',        'බලන්නට දඩයක් නැත'),
('quiz.feature_2_b',   'quiz', 'Learning is the point — score is secondary.',
 'ඉගෙනීම ඉලක්කය — ලකුණු ද්විතියික.'),
('quiz.showTheory',    'quiz', '📖 Show theory · no penalty',  '📖 න්‍යාය පෙන්වන්න · දඩයක් නැත'),
('quiz.submitAnswer',  'quiz', 'Submit answer →',               'පිළිතුර ඉදිරිපත් කරන්න →'),
('quiz.tryAgain',      'quiz', 'Try again',                     'නැවත උත්සාහ කරන්න'),
('quiz.nextQuestion',  'quiz', 'Next question →',               'ඊළඟ ප්‍රශ්නය →');
