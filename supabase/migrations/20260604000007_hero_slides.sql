-- ============================================================
-- Migration 007 — Hero slider slides
-- ============================================================

CREATE TABLE IF NOT EXISTS hero_slides (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order     INTEGER     NOT NULL DEFAULT 0,
  chip           TEXT        NOT NULL,
  title          TEXT        NOT NULL,
  body           TEXT        NOT NULL,
  primary_label  TEXT        NOT NULL,
  primary_href   TEXT        NOT NULL,
  ghost_label    TEXT        NOT NULL,
  ghost_href     TEXT        NOT NULL,
  photo_url      TEXT        NOT NULL,
  -- optional JSON arrays
  -- stats: [{ "n": "12,400+", "l": "Students learning", "star": false }]
  stats          JSONB,
  -- subject_chips: [{ "n": "Physics", "e": "⚛️" }]
  subject_chips  JSONB,
  is_active      BOOLEAN     NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Row-level security ───────────────────────────────────────

ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- Anyone can read active slides (public landing page)
CREATE POLICY "Public can read active hero slides"
  ON hero_slides FOR SELECT
  USING (is_active = true);

-- Admins can read all slides (including hidden ones)
CREATE POLICY "Admins can read all hero slides"
  ON hero_slides FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- Only admins can insert / update / delete
CREATE POLICY "Admins can insert hero slides"
  ON hero_slides FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update hero slides"
  ON hero_slides FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete hero slides"
  ON hero_slides FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- ── Seed data (3 default slides) ────────────────────────────

INSERT INTO hero_slides (sort_order, chip, title, body, primary_label, primary_href, ghost_label, ghost_href, photo_url, stats, is_active)
VALUES
  (
    0,
    'AI-powered · built for SL students',
    'Learn while' || E'\n' || 'you quiz.',
    'Every question comes with a short theory snippet — so you''re not guessing, you''re understanding. Built for O/L, A/L & university entrance prep.',
    'Try a free quiz',
    '#quiz',
    'Browse tests · from Rs.1,000',
    '/marketplace',
    '/hero-student.jpg',
    '[{"n":"12,400+","l":"Students learning"},{"n":"38","l":"Modules live"},{"n":"4.8","l":"Avg. rating","star":true}]'::jsonb,
    true
  ),
  (
    1,
    '5 subjects · 240+ modules',
    'Physics to' || E'\n' || 'English.',
    'Every subject mapped to the Sri Lankan syllabus. Adaptive modules that find your weak spots and drill them until they click.',
    'Explore subjects',
    '#subjects',
    'See all modules',
    '#subjects',
    '/hero-student-subjects.jpg',
    null,
    true
  ),
  (
    2,
    'No subscription · pay per test',
    'Buy just the' || E'\n' || 'tests you need.',
    'Full papers, topic drills and flashcard decks from top SL tutors — from Rs.1,000. Keep them forever, replay as often as you like.',
    'Browse the store',
    '/marketplace',
    'Try flashcards',
    '/flashcards',
    '/hero-student-store.jpg',
    '[{"n":"Rs.1,000","l":"Tests from"},{"n":"320+","l":"Decks & papers"},{"n":"∞","l":"Lifetime replays"}]'::jsonb,
    true
  );

-- Set subject_chips on slide 2 separately for clarity
UPDATE hero_slides
SET subject_chips = '[{"n":"Physics","e":"⚛️"},{"n":"Chemistry","e":"🧪"},{"n":"ICT","e":"💻"},{"n":"Maths","e":"📐"},{"n":"English","e":"📚"}]'::jsonb
WHERE sort_order = 1;
