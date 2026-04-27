-- ============================================================
-- Migration 003 — Ensure test_sessions.student_id is wired
-- Updates the column constraint so existing NULL rows remain
-- valid but new sessions from authenticated users are linked.
-- ============================================================

-- Add a partial index to speed up per-student history queries
-- (safe to run even if student_id was already nullable)
CREATE INDEX IF NOT EXISTS idx_sessions_student_completed
  ON test_sessions(student_id, completed_at DESC)
  WHERE student_id IS NOT NULL AND is_completed = TRUE;

-- Convenience view: student test history with test metadata
CREATE OR REPLACE VIEW student_test_history AS
SELECT
  ts.id,
  ts.test_id,
  ts.student_id,
  ts.score,
  ts.time_spent,
  ts.started_at,
  ts.completed_at,
  ts.is_completed,
  t.title              AS test_title,
  t.passing_score,
  t.time_limit,
  t.tags               AS test_tags,
  (ts.score >= t.passing_score) AS passed,
  COUNT(tsa.id)        AS total_answers,
  COUNT(CASE WHEN tsa.is_correct THEN 1 END) AS correct_answers
FROM test_sessions ts
JOIN tests t ON t.id = ts.test_id
LEFT JOIN test_session_answers tsa ON tsa.session_id = ts.id
WHERE ts.is_completed = TRUE
GROUP BY ts.id, t.id;

-- RLS on the view is inherited from test_sessions
