-- ============================================================
-- Migration 004 — Extended profile fields + avatars bucket
-- ============================================================

-- Add address column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address TEXT;

-- Create (or ensure) avatars storage bucket is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', TRUE)
ON CONFLICT (id) DO UPDATE SET public = TRUE;

-- Storage RLS policies — drop first so re-runs are safe
DROP POLICY IF EXISTS "avatars_upload_own"  ON storage.objects;
DROP POLICY IF EXISTS "avatars_update_own"  ON storage.objects;
DROP POLICY IF EXISTS "avatars_delete_own"  ON storage.objects;
DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects;

-- Authenticated users can upload into their own folder ({user_id}/filename)
CREATE POLICY "avatars_upload_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Authenticated users can overwrite their own avatar
CREATE POLICY "avatars_update_own"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Authenticated users can delete their own avatar
CREATE POLICY "avatars_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Anyone can read avatars (public bucket)
CREATE POLICY "avatars_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');
