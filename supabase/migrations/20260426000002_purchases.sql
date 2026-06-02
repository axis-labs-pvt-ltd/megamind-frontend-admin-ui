-- ============================================================
-- Migration 002 — Purchases table
-- Enables the mock payment / test purchase flow.
-- ============================================================

CREATE TABLE IF NOT EXISTS purchases (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_id      UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  price        INTEGER NOT NULL DEFAULT 0,   -- in LKR (e.g. 1500)
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, test_id)              -- one purchase per student per test
);

ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Students can only see and insert their own purchases
CREATE POLICY "purchases_select_own"
  ON purchases FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "purchases_insert_own"
  ON purchases FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Admins can read all purchases (for analytics)
CREATE POLICY "purchases_admin_read"
  ON purchases FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
  );

-- Index for fast "my purchases" lookups
CREATE INDEX IF NOT EXISTS idx_purchases_student ON purchases(student_id, purchased_at DESC);
CREATE INDEX IF NOT EXISTS idx_purchases_test    ON purchases(test_id);
