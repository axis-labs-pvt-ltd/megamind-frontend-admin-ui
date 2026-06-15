-- ============================================================
-- Migration 008 — UI Translations (EN + SI)
-- Flat key-value rows; section groups them in the admin UI.
-- Features stored as newline-separated text for easy editing.
-- ============================================================

CREATE TABLE IF NOT EXISTS translations (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  key        TEXT        NOT NULL UNIQUE,
  section    TEXT        NOT NULL,
  en         TEXT        NOT NULL,
  si         TEXT        NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Anyone can read (landing page is public)
CREATE POLICY "Public can read translations"
  ON translations FOR SELECT USING (true);

-- Only admins can modify
CREATE POLICY "Admins can insert translations"
  ON translations FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update translations"
  ON translations FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ── Seed ────────────────────────────────────────────────────

INSERT INTO translations (key, section, en, si) VALUES

-- NAV
('nav.howItWorks', 'nav', 'How it works',            'ක්‍රියාවලිය'),
('nav.subjects',   'nav', 'Subjects',                'විෂයයන්'),
('nav.tryAQuiz',   'nav', 'Try a quiz',              'ප්‍රශ්නාවලිය'),
('nav.pricing',    'nav', 'Pricing',                 'මිල ගණන්'),
('nav.flashcards', 'nav', '🃏 Flashcards',           '🃏 ෆ්ලෑෂ් කාඩ්'),
('nav.login',      'nav', 'Log in',                  'පිවිසෙන්න'),
('nav.startFree',  'nav', 'Start free →',            'නොමිලේ ආරම්භ →'),
('nav.myProfile',  'nav', '👤 My profile',           '👤 මගේ පැතිකඩ'),

-- HOW IT WORKS
('how.eyebrow', 'how', 'How it works',
 'ක්‍රියාවලිය'),
('how.heading', 'how', 'A tutor that rebuilds itself every time you answer.',
 'ඔබේ පිළිතුරු සමඟ ස්වයංක්‍රීයව ප්‍රශ්නාවලිය ගොඩනඟන උපකාරකයෙකු.'),
('how.body', 'how', 'Megamind watches how you answer — speed, confidence, mistakes — and quietly rewrites tomorrow''s quiz to close the gaps.',
 'Megamind ඔබ පිළිතුරු දෙන ආකාරය නිරීක්ෂණය කරයි — වේගය, විශ්වාසය, වැරදි — ඉන් හෙට ප්‍රශ්නාවලිය ශ්‍රේෂ්ඨ ලෙස සකස් කරයි.'),
('how.step_0_title', 'how', 'Pick a subject',
 'විෂයයක් තෝරන්න'),
('how.step_0_body', 'how', 'Choose from ICT, Physics, Chemistry, Maths or English. Tell us your grade and your target.',
 'ICT, භෞතික විද්‍යාව, රසායන විද්‍යාව, ගණිතය හෝ ඉංග්‍රීසි. ශ්‍රේණිය සහ ඔබේ ඉලක්කය සඳහන් කරන්න.'),
('how.step_1_title', 'how', 'AI builds your quiz',
 'AI ප්‍රශ්නාවලිය සකසයි'),
('how.step_1_body', 'how', 'Our AI picks questions based on what you know, where you slipped, and what''s next on your syllabus.',
 'AI ඔබ දන්නා දේ, ඔබ අසාර්ථකව ජය ගත් ස්ථාන සහ ඔබේ විෂය නිර්දේශයේ ඊළඟ දෙය මත ප්‍රශ්න තෝරාගනී.'),
('how.step_2_title', 'how', 'Learn as you answer',
 'පිළිතුරු දෙමින් ඉගෙනෙන්'),
('how.step_2_body', 'how', 'Every question has a short theory snippet. Stuck? Tap it. Learn the concept in 30 seconds, then answer.',
 'සෑම ප්‍රශ්නයකම කෙටි න්‍යාය දිනාමිය ඇත. හිරවී ද? ස්පර්ශ කරන්න. තත්පර 30 ක් ඇතුළත සංකල්පය ඉගෙනෙන්න.'),
('how.step_3_title', 'how', 'Skill graph updates',
 'කුසලතා ප්‍රස්තාරය යාවත්කාලීනය'),
('how.step_3_body', 'how', 'Your weak spots get revisited. Your strengths graduate to harder questions. It adapts every day.',
 'ඔබේ දුර්වල ස්ථාන නැවත සමාලෝචනය කෙරේ. ශක්‍ය ස්ථාන දීර්ඝ ප්‍රශ්නවලට ශ්‍රේණිගත වේ. සෑම දිනකම රිද්මය ගැලපේ.'),

-- PRICING
('pricing.eyebrow', 'pricing', 'Pricing',
 'මිල ගණන්'),
('pricing.heading', 'pricing', 'Pay monthly. Cancel anytime. Or buy a single test.',
 'මාසිකව ගෙවන්න. ඕනෑ වේලාවක අවලංගු කරන්න. හෝ තනි ප්‍රශ්නාවලිය ගන්න.'),
('pricing.body', 'pricing', 'Full access to all 5 subjects from Rs. 1,490/month. Or grab individual tests from Rs. 1,000.',
 'Rs. 1,490/මාසයෙන් විෂය 5 ම ලබාගන්න. හෝ Rs. 1,000 සිට තනි ප්‍රශ්නාවලිය ලබාගන්න.'),
('pricing.plan_0_name',     'pricing', 'Free',    'නොමිලේ'),
('pricing.plan_0_unit',     'pricing', 'forever', 'සදාකාලිකව'),
('pricing.plan_0_cta',      'pricing', 'Start free →', 'නොමිලේ ආරම්භ →'),
('pricing.plan_0_desc',     'pricing', 'Taste the product. No credit card.',
 'නිෂ්පාදිතය රස ඉගෙනෙන්න. ක්‍රෙඩිට් කාඩ් නැත.'),
('pricing.plan_0_features', 'pricing',
 '2 subjects'||E'\n'||'5 quizzes / week'||E'\n'||'Basic theory snippets'||E'\n'||'Community support',
 'විෂය 2ක්'||E'\n'||'සතියකට ප්‍රශ්නාවලිය 5ක්'||E'\n'||'මූලික න්‍යාය දිනාමිය'||E'\n'||'ප්‍රජා සහය'),
('pricing.plan_1_name',     'pricing', 'Scholar', 'ශිෂ්‍යත්ව'),
('pricing.plan_1_unit',     'pricing', 'per month', 'මාසිකව'),
('pricing.plan_1_cta',      'pricing', 'Go Scholar →', 'ශිෂ්‍යත්ව ලබාගන්න →'),
('pricing.plan_1_badge',    'pricing', 'most popular', 'වඩාත් ජනප්‍රිය'),
('pricing.plan_1_desc',     'pricing', 'For the student going all-in on their exam.',
 'විභාගය ජය ගැනීමට නිවෙදිත ශිෂ්‍යයා සඳහා.'),
('pricing.plan_1_features', 'pricing',
 'All 5 subjects'||E'\n'||'Unlimited AI quizzes'||E'\n'||'Full theory library'||E'\n'||'Weak-spot analytics'||E'\n'||'Priority support',
 'විෂය 5 ම'||E'\n'||'AI ප්‍රශ්නාවලිය නොසීමිත'||E'\n'||'සම්පූර්ණ න්‍යාය පුස්තකාලය'||E'\n'||'දුර්වල ස්ථාන විශ්ලේෂණය'||E'\n'||'ප්‍රමුඛ සහය'),
('pricing.plan_2_name',     'pricing', 'Family', 'පවුල'),
('pricing.plan_2_unit',     'pricing', 'per month', 'මාසිකව'),
('pricing.plan_2_cta',      'pricing', 'Pick Family →', 'පවුල තෝරන්න →'),
('pricing.plan_2_desc',     'pricing', 'Two siblings, two syllabi, one bill.',
 'සොහොයුරියෝ දෙදෙනා, විෂය දෙකක්, එක් බිල් එකක්.'),
('pricing.plan_2_features', 'pricing',
 'Everything in Scholar'||E'\n'||'2 student accounts'||E'\n'||'Parent dashboard'||E'\n'||'Progress reports'||E'\n'||'Shared test library',
 'ශිෂ්‍යත්ව සෑම දෙයක්ම'||E'\n'||'ශිෂ්‍ය ගිණුම් 2ක්'||E'\n'||'දෙමව්පිය කළමනාකරු'||E'\n'||'ප්‍රගති වාර්තා'||E'\n'||'හෙළිදරව් ප්‍රශ්නාවලිය'),

-- FAQ
('faq.eyebrow',    'faq', 'FAQ',                         'නිතර අසන ප්‍රශ්න'),
('faq.heading',    'faq', 'Common\nquestions.',           'සාමාන්‍ය\nප්‍රශ්න.'),
('faq.body',       'faq', 'Can''t find what you''re looking for? Message our team — we reply within an hour on weekdays.',
 'ඔබේ ප්‍රශ්නය නොපෙනෙනවාද? අප කණ්ඩායමට ලිඛිත කරන්න — සතියේ දිනවල පැයක් ඇතුළත අපි පිළිතුරු දෙමු.'),
('faq.supportCta', 'faq', 'Email support →',             'සහය ඊමේල් →'),
('faq.item_0_q',   'faq', 'Does Megamind follow the Sri Lankan syllabus?',
 'Megamind ශ්‍රී ලංකා විෂය නිර්දේශය අනුගමනය කරනවාද?'),
('faq.item_0_a',   'faq', 'Yes. Every module is mapped to the national O/L and A/L syllabus, including Combined Maths, Pure Physics, ICT and the standard English stream.',
 'ඔව්. සෑම ඒකකයක්ම ජාතික O/L සහ A/L විෂය නිර්දේශයට, ඒකාබද්ධ ගණිතය, Pure Physics, ICT සහ සම්මත ඉංග්‍රීසි ධාරාව ඇතුළත් කරමින් සිතියම්ගත කර ඇත.'),
('faq.item_1_q',   'faq', 'How does the AI actually work?',
 'AI ඇත්තටමා ක්‍රියා කරන්නේ කෙලෙසද?'),
('faq.item_1_a',   'faq', 'Every answer you give updates your skill graph. The AI uses that to pick the next question — harder if you''re on a roll, or a fresh angle on the same concept if you''re stuck.',
 'ඔබ ලබා දෙන සෑම පිළිතුරක්ම ඔබේ කුසලතා ප්‍රස්තාරය යාවත්කාලීන කරයි. AI ඒ භාවිතා කර ඊළඟ ප්‍රශ්නය තෝරා ගනී — ඔබ හොඳින් ගොස් නම් දීර්ඝ, හිරවී නම් නව කෝණයකින්.'),
('faq.item_2_q',   'faq', 'Can I buy just one test instead of subscribing?',
 'දායකත්වය නොගෙන තනි ප්‍රශ්නාවලිය මිලදී ගත හැකිද?'),
('faq.item_2_a',   'faq', 'Yes — individual tests are Rs. 1,000 to Rs. 2,000 one-time. You keep the test, your answers and the AI feedback forever.',
 'ඔව් — Rs. 1,000 සිට Rs. 2,000 ක් ඒකාරාශිය. ඔබ ප්‍රශ්නාවලිය, ඔබේ පිළිතුරු සහ AI ප්‍රතිපෝෂණය සදාකාලිකව ලබා ගනී.'),
('faq.item_3_q',   'faq', 'What grades are supported?',
 'කුමන ශ්‍රේණිවලට සහය දැක්වෙනවාද?'),
('faq.item_3_a',   'faq', 'O/L (Grade 6–11), A/L (Grade 12–13), and university entrance prep. We''re adding primary-grade content in 2026.',
 'O/L (ශ්‍රේණිය 6–11), A/L (ශ්‍රේණිය 12–13), සහ විශ්ව විද්‍යාල ප්‍රවේශ සූදානම. 2026 දී ප්‍රාථමික ශ්‍රේණි අන්තර්ගතය එකතු කෙරේ.'),
('faq.item_4_q',   'faq', 'Can I cancel anytime?',
 'ඕනෑ වේලාවක අවලංගු කළ හැකිද?'),
('faq.item_4_a',   'faq', 'Yes. Cancel from your dashboard, no phone calls, no awkwardness. Your single-test purchases stay yours forever even after you cancel.',
 'ඔව්. ඔබේ කළමනාකරු දළු මතින් අවලංගු කරන්න — දුරකථන ඇමතුම් නොමැත. ඒකාරාශිය ප්‍රශ්නාවලිය ලබීම දිගටම ලැබේ.'),

-- SUBJECTS
('subjects.eyebrow', 'subjects', 'Subjects',                    'විෂයයන්'),
('subjects.heading', 'subjects', 'Every subject. Every level.', 'සෑම විෂයයක්. සෑම මට්ටමක්.'),

-- FOOTER
('footer.tagline',   'footer', 'AI-powered learning for Sri Lankan students.',
 'ශ්‍රී ලාංකික සිසුන් සඳහා AI-ශක්‍ය ඉගෙනීම.'),
('footer.copyright', 'footer', '© 2026 Megamind. All rights reserved.',
 '© 2026 Megamind. සියලු හිමිකම් ඇවිරිණි.');
