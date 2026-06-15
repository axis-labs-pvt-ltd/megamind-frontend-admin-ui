-- ============================================================
-- Migration 010 — Module Videos
-- Videos uploaded to S3, metadata stored here.
-- ============================================================

CREATE TABLE module_videos (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id        UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT,
  s3_key           TEXT NOT NULL,          -- S3 object key for the video file
  thumbnail_s3_key TEXT,                   -- S3 key for optional thumbnail image
  duration_seconds INT,
  sort_order       INT NOT NULL DEFAULT 0,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX module_videos_module_idx ON module_videos(module_id);

ALTER TABLE module_videos ENABLE ROW LEVEL SECURITY;

-- Students can view active videos
CREATE POLICY "anyone_view_active_videos" ON module_videos
  FOR SELECT USING (is_active = true);

-- Admin / teacher can manage videos
CREATE POLICY "admin_manage_videos" ON module_videos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_module_videos_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;
CREATE TRIGGER trg_module_videos_updated_at
  BEFORE UPDATE ON module_videos
  FOR EACH ROW EXECUTE FUNCTION update_module_videos_updated_at();
