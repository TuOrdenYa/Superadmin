-- leads_admin_queries.sql
-- Useful admin/reporting queries for the `leads` table.
-- Run in Supabase SQL Editor or via psql. Adjust column names if your schema differs.

-- 1) Quick counts by source (overall)
SELECT COALESCE(source, 'unknown') AS source, count(*) AS cnt
FROM public.leads
GROUP BY COALESCE(source, 'unknown')
ORDER BY cnt DESC;

-- 2) Counts by source and interest (uses dedicated `interest` column)
-- This assumes your `leads` table has a text column named `interest`.
SELECT
  COALESCE(source, 'unknown') AS source,
  COALESCE(NULLIF(TRIM(interest), ''), 'unspecified') AS interest,
  count(*) AS cnt
FROM public.leads
GROUP BY COALESCE(source, 'unknown'), COALESCE(NULLIF(TRIM(interest), ''), 'unspecified')
ORDER BY cnt DESC;

-- 3) Recent leads (latest 200 rows) — useful for manual inspection/export
SELECT id, name, email, phone, interest, source, created_at
FROM public.leads
ORDER BY created_at DESC
LIMIT 200;

-- 4) Time series: daily counts by source for the last 90 days
SELECT date_trunc('day', created_at) AS day,
       COALESCE(source, 'unknown') AS source,
       count(*) AS cnt
FROM public.leads
WHERE created_at >= now() - interval '90 days'
GROUP BY day, COALESCE(source, 'unknown')
ORDER BY day DESC, cnt DESC;

-- 5) 30-day summary per source
SELECT COALESCE(source, 'unknown') AS source,
       count(*) FILTER (WHERE created_at >= now() - interval '30 days') AS last_30d
FROM public.leads
GROUP BY COALESCE(source, 'unknown')
ORDER BY last_30d DESC;

-- 6) Create a convenience view for dashboards (safe to run repeatedly)
CREATE OR REPLACE VIEW public.v_leads_by_source AS
SELECT COALESCE(source, 'unknown') AS source, count(*) AS cnt
FROM public.leads
GROUP BY COALESCE(source, 'unknown');

-- 7) Pivot example (days as columns) — helpful for quick CSV exports
-- Note: this creates a simple pivot for the last 7 days (adapt as needed)
WITH days AS (
  SELECT generate_series::date AS day
  FROM generate_series(now()::date - interval '6 days', now()::date, '1 day')
)
SELECT d.day,
       COALESCE(l.source, 'unknown') AS source,
       count(l.*) AS cnt
FROM days d
LEFT JOIN public.leads l
  ON l.created_at::date = d.day
GROUP BY d.day, COALESCE(l.source, 'unknown')
ORDER BY d.day DESC, cnt DESC;

-- 8) Export to CSV via psql (run from terminal with DB connection string)
-- Example (psql client):
-- \copy (SELECT id, name, email, phone, interest, source, created_at FROM public.leads ORDER BY created_at DESC) TO 'leads_export.csv' WITH CSV HEADER;

-- 9) Helpful indexes for reporting (if not already present)
-- CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at);
-- CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads (source);
-- CREATE INDEX IF NOT EXISTS idx_leads_interest ON public.leads (interest);

-- 10) Cleanup / safety query: show NULL / empty sources
SELECT count(*) AS null_or_empty_source_count
FROM public.leads
WHERE source IS NULL OR source = '';

-- End of admin queries file
