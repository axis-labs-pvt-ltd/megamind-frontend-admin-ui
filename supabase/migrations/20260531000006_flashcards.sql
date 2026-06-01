-- ============================================================
-- Migration 006 — Flashcard collections, cards, and purchases
-- ============================================================

-- ── 1. flashcard_collections ────────────────────────────────

CREATE TABLE IF NOT EXISTS flashcard_collections (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  subject_id   UUID REFERENCES subjects(id) ON DELETE SET NULL,
  subject_name TEXT,
  level        TEXT NOT NULL DEFAULT 'A/L · Grade 12-13',
  cover_emoji  TEXT NOT NULL DEFAULT '📚',
  cover_color  TEXT NOT NULL DEFAULT '#FFF2DD',
  tutor_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tutor_name   TEXT NOT NULL DEFAULT '',
  -- pricing / visibility
  price        INTEGER NOT NULL DEFAULT 0,          -- in LKR; 0 = free
  visibility   TEXT NOT NULL DEFAULT 'public_free'  -- public_free | paid | private
                 CHECK (visibility IN ('public_free', 'paid', 'private')),
  -- stats (denormalised for fast reads)
  card_count   INTEGER NOT NULL DEFAULT 0,
  sold_count   INTEGER NOT NULL DEFAULT 0,
  rating       NUMERIC(3,1),
  -- flags
  is_bestseller BOOLEAN NOT NULL DEFAULT FALSE,
  is_new        BOOLEAN NOT NULL DEFAULT TRUE,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  tags          TEXT[] NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE flashcard_collections ENABLE ROW LEVEL SECURITY;

-- Anyone can read public/paid collections
CREATE POLICY "fc_collections_public_read"
  ON flashcard_collections FOR SELECT
  USING (
    visibility IN ('public_free', 'paid')
    AND is_active = TRUE
  );

-- Owners (tutor) and admins/teachers can read all their own
CREATE POLICY "fc_collections_owner_read"
  ON flashcard_collections FOR SELECT
  USING (auth.uid() = tutor_id);

CREATE POLICY "fc_collections_admin_read"
  ON flashcard_collections FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
  );

-- Only admins/teachers can insert
CREATE POLICY "fc_collections_insert"
  ON flashcard_collections FOR INSERT
  WITH CHECK (
    auth.uid() = tutor_id
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
  );

-- Owner or admin can update
CREATE POLICY "fc_collections_update"
  ON flashcard_collections FOR UPDATE
  USING (
    auth.uid() = tutor_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Owner or admin can delete
CREATE POLICY "fc_collections_delete"
  ON flashcard_collections FOR DELETE
  USING (
    auth.uid() = tutor_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fc_collections_tutor      ON flashcard_collections(tutor_id);
CREATE INDEX IF NOT EXISTS idx_fc_collections_visibility ON flashcard_collections(visibility, is_active);
CREATE INDEX IF NOT EXISTS idx_fc_collections_subject    ON flashcard_collections(subject_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER fc_collections_updated_at
  BEFORE UPDATE ON flashcard_collections
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ── 2. flashcards ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS flashcards (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id  UUID NOT NULL REFERENCES flashcard_collections(id) ON DELETE CASCADE,
  type           TEXT NOT NULL DEFAULT 'text'
                   CHECK (type IN ('text', 'image', 'video')),
  front          TEXT NOT NULL DEFAULT '',   -- the prompt shown face-up
  back           TEXT NOT NULL DEFAULT '',   -- theory / answer shown after flip
  image_url      TEXT,                       -- for type = 'image'
  video_url      TEXT,                       -- for type = 'video'
  "order"        INTEGER NOT NULL DEFAULT 0, -- display order within the collection
  tags           TEXT[] NOT NULL DEFAULT '{}',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- Anyone who can read the parent collection can read its cards
CREATE POLICY "flashcards_public_read"
  ON flashcards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM flashcard_collections fc
      WHERE fc.id = flashcards.collection_id
        AND fc.visibility IN ('public_free', 'paid')
        AND fc.is_active = TRUE
    )
  );

-- Tutor / admin can always read cards in their collection
CREATE POLICY "flashcards_owner_read"
  ON flashcards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM flashcard_collections fc
      WHERE fc.id = flashcards.collection_id
        AND (
          fc.tutor_id = auth.uid()
          OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
        )
    )
  );

-- Tutor / admin can insert, update, delete cards
CREATE POLICY "flashcards_write"
  ON flashcards FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM flashcard_collections fc
      WHERE fc.id = flashcards.collection_id
        AND (
          fc.tutor_id = auth.uid()
          OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
        )
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_flashcards_collection ON flashcards(collection_id, "order");


-- ── 3. flashcard_purchases ────────────────────────────────────

CREATE TABLE IF NOT EXISTS flashcard_purchases (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  collection_id  UUID NOT NULL REFERENCES flashcard_collections(id) ON DELETE CASCADE,
  price          INTEGER NOT NULL DEFAULT 0,
  purchased_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, collection_id)   -- one purchase per student per collection
);

ALTER TABLE flashcard_purchases ENABLE ROW LEVEL SECURITY;

-- Students see only their own purchases
CREATE POLICY "fc_purchases_select_own"
  ON flashcard_purchases FOR SELECT
  USING (auth.uid() = student_id);

-- Students can buy (insert)
CREATE POLICY "fc_purchases_insert_own"
  ON flashcard_purchases FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Admins/teachers can read all purchases (analytics)
CREATE POLICY "fc_purchases_admin_read"
  ON flashcard_purchases FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fc_purchases_student    ON flashcard_purchases(student_id, purchased_at DESC);
CREATE INDEX IF NOT EXISTS idx_fc_purchases_collection ON flashcard_purchases(collection_id);


-- ── 4. Helper: increment sold_count on purchase ──────────────

CREATE OR REPLACE FUNCTION increment_fc_sold_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE flashcard_collections
  SET sold_count = sold_count + 1
  WHERE id = NEW.collection_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER fc_purchase_increment_sold
  AFTER INSERT ON flashcard_purchases
  FOR EACH ROW EXECUTE FUNCTION increment_fc_sold_count();


-- ── 5. Helper: keep card_count in sync ───────────────────────

CREATE OR REPLACE FUNCTION sync_fc_card_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  cid UUID;
BEGIN
  cid := COALESCE(NEW.collection_id, OLD.collection_id);
  UPDATE flashcard_collections
  SET card_count = (SELECT COUNT(*) FROM flashcards WHERE collection_id = cid)
  WHERE id = cid;
  RETURN NULL;
END;
$$;

CREATE TRIGGER fc_card_count_sync
  AFTER INSERT OR UPDATE OR DELETE ON flashcards
  FOR EACH ROW EXECUTE FUNCTION sync_fc_card_count();
