-- lead_source_migration.sql
-- Purpose: safely ensure the `leads.source` column exists, is backfilled,
-- and optionally indexed/defaulted. Run these statements in your Supabase
-- SQL editor or via psql as a DB superuser.

-- 1) Inspect existing columns on `leads`
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'leads'
ORDER BY ordinal_position;

-- 2) Inspect existing indexes on `leads`
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public' AND tablename = 'leads';

-- 3) Quick sample of recent rows (see if `source` already exists)
SELECT id, email, name, source, created_at
FROM public.leads
ORDER BY created_at DESC
LIMIT 10;

-- 4) Add `source` column if it doesn't exist
-- NOTE: If you already have the column, skip this ALTER.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'leads' AND column_name = 'source'
    ) THEN
        ALTER TABLE public.leads ADD COLUMN source text;
    END IF;
END$$;

-- 5) Backfill existing NULL/empty sources to a sensible default
-- Change 'contact_section' to another default if you prefer (e.g., 'legacy' or 'unknown').
UPDATE public.leads
SET source = 'contact_section'
WHERE (source IS NULL OR source = '');

-- 6) Create an index on source for reporting queries (safe to run repeatedly)
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads (source);

-- 7) Optional: set a DEFAULT value for new rows (run AFTER you backfill)
-- Uncomment if you want new inserts that omit `source` to default to 'contact_section'.
-- ALTER TABLE public.leads ALTER COLUMN source SET DEFAULT 'contact_section';

-- 8) Optional: mark column NOT NULL AFTER backfill (only if you are sure every row has a value)
-- Uncomment only after verifying the backfill above.
-- ALTER TABLE public.leads ALTER COLUMN source SET NOT NULL;

-- 9) Verification: counts per source
SELECT source, count(*) AS cnt
FROM public.leads
GROUP BY source
ORDER BY cnt DESC;

-- End of migration file
