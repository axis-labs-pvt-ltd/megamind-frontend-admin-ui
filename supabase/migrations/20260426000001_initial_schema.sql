-- ============================================================
-- Migration 001 — Initial schema (documents existing tables)
-- Run in Supabase SQL editor if tables do not already exist.
-- ============================================================

-- ── Profiles (extends auth.users) ───────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  phone       TEXT,
  role        TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin', 'teacher')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='profiles_select_own') THEN
    CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='profiles_update_own') THEN
    CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ── Subjects ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subjects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  color       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='subjects' AND policyname='subjects_public_read') THEN
    CREATE POLICY "subjects_public_read" ON subjects FOR SELECT USING (TRUE);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='subjects' AND policyname='subjects_admin_write') THEN
    CREATE POLICY "subjects_admin_write" ON subjects FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
    );
  END IF;
END $$;


-- ── Modules ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS modules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id  UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='modules' AND policyname='modules_public_read') THEN
    CREATE POLICY "modules_public_read" ON modules FOR SELECT USING (TRUE);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='modules' AND policyname='modules_admin_write') THEN
    CREATE POLICY "modules_admin_write" ON modules FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
    );
  END IF;
END $$;


-- ── Categories ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name  TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#6B7A6B'
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='categories' AND policyname='categories_public_read') THEN
    CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (TRUE);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='categories' AND policyname='categories_admin_write') THEN
    CREATE POLICY "categories_admin_write" ON categories FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
    );
  END IF;
END $$;


-- ── Tags ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tags (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name  TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#6B7A6B'
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tags' AND policyname='tags_public_read') THEN
    CREATE POLICY "tags_public_read" ON tags FOR SELECT USING (TRUE);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tags' AND policyname='tags_admin_write') THEN
    CREATE POLICY "tags_admin_write" ON tags FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
    );
  END IF;
END $$;


-- ── Questions ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS questions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id           UUID REFERENCES modules(id) ON DELETE SET NULL,
  type                TEXT NOT NULL CHECK (type IN ('mcq','yes-no','drag-drop','fill-in-blank','multi-select','matching','true-false','text')),
  text                TEXT NOT NULL,
  options             JSONB,
  matching_pairs      JSONB,
  correct_answer      JSONB NOT NULL,
  acceptable_answers  JSONB,
  solution_video_url  TEXT,
  reference_video_url TEXT,
  difficulty          TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy','medium','hard')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='questions' AND policyname='questions_public_read') THEN
    CREATE POLICY "questions_public_read" ON questions FOR SELECT USING (TRUE);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='questions' AND policyname='questions_admin_write') THEN
    CREATE POLICY "questions_admin_write" ON questions FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
    );
  END IF;
END $$;

-- Question ↔ Category join
CREATE TABLE IF NOT EXISTS question_categories (
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (question_id, category_id)
);

-- Question ↔ Tag join
CREATE TABLE IF NOT EXISTS question_tags (
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  tag_id      UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (question_id, tag_id)
);


-- ── Tests ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tests (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title              TEXT NOT NULL,
  description        TEXT,
  type               TEXT NOT NULL CHECK (type IN ('static','dynamic')),
  time_limit         INTEGER NOT NULL DEFAULT 30,
  passing_score      INTEGER NOT NULL DEFAULT 60,
  estimated_duration INTEGER,
  cover_image        TEXT,
  tags               TEXT[] DEFAULT '{}',
  subject_id         UUID REFERENCES subjects(id) ON DELETE SET NULL,
  is_active          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tests' AND policyname='tests_public_read') THEN
    CREATE POLICY "tests_public_read" ON tests FOR SELECT USING (TRUE);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tests' AND policyname='tests_admin_write') THEN
    CREATE POLICY "tests_admin_write" ON tests FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
    );
  END IF;
END $$;

-- Static test questions (ordered)
CREATE TABLE IF NOT EXISTS test_questions (
  test_id     UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (test_id, question_id)
);

-- Dynamic test rules
CREATE TABLE IF NOT EXISTS test_dynamic_rules (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id        UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  module_id      UUID REFERENCES modules(id) ON DELETE SET NULL,
  difficulty     TEXT CHECK (difficulty IN ('easy','medium','hard')),
  question_count INTEGER NOT NULL DEFAULT 10
);


-- ── Test sessions ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS test_sessions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id      UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  student_id   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  score        INTEGER,
  time_spent   INTEGER,
  started_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='test_sessions' AND policyname='sessions_student_own') THEN
    CREATE POLICY "sessions_student_own" ON test_sessions FOR ALL USING (auth.uid() = student_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='test_sessions' AND policyname='sessions_admin_read') THEN
    CREATE POLICY "sessions_admin_read" ON test_sessions FOR SELECT USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
    );
  END IF;
END $$;


-- ── Test session answers ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS test_session_answers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  UUID NOT NULL REFERENCES test_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer      JSONB,
  is_correct  BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (session_id, question_id)
);

ALTER TABLE test_session_answers ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='test_session_answers' AND policyname='answers_via_session') THEN
    CREATE POLICY "answers_via_session" ON test_session_answers FOR ALL USING (
      EXISTS (
        SELECT 1 FROM test_sessions
        WHERE id = session_id AND student_id = auth.uid()
      )
    );
  END IF;
END $$;


-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_questions_module        ON questions(module_id);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty    ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_test_sessions_student   ON test_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_test_sessions_test      ON test_sessions(test_id);
CREATE INDEX IF NOT EXISTS idx_test_sessions_completed ON test_sessions(is_completed, completed_at DESC);
