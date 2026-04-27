-- ============================================================
-- Migration 005 — Question images
-- Adds image_url column to questions + question-images bucket
-- ============================================================

ALTER TABLE questions ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create question-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('question-images', 'question-images', TRUE)
ON CONFLICT (id) DO UPDATE SET public = TRUE;

-- Storage policies
DROP POLICY IF EXISTS "qimg_upload"  ON storage.objects;
DROP POLICY IF EXISTS "qimg_update"  ON storage.objects;
DROP POLICY IF EXISTS "qimg_delete"  ON storage.objects;
DROP POLICY IF EXISTS "qimg_read"    ON storage.objects;

-- Admin/teacher can upload question images
CREATE POLICY "qimg_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'question-images' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
  );

CREATE POLICY "qimg_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'question-images' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
  );

CREATE POLICY "qimg_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'question-images' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
  );

-- Public read
CREATE POLICY "qimg_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'question-images');
