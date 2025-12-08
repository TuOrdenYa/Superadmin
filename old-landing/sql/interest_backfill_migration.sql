-- interest_backfill_migration.sql
-- Purpose: backfill the new `interest` column from the existing `message` text,
-- create an index, and provide verification queries. Run in Supabase SQL Editor.

-- SAFETY: Inspect current schema and recent rows first
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'leads'
ORDER BY ordinal_position;

SELECT id, name, phone, email, interest, message, created_at
FROM public.leads
ORDER BY created_at DESC
LIMIT 20;

-- 1) Add `interest` column if it doesn't exist (non-destructive)
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS interest text;

-- 2) Backfill `interest` from `message` for rows where it's NULL or empty
-- This tries several common label formats and trims results. It looks for:
--  - "Interés: <value>" (Spanish)
--  - "Interest: <value>" (English)
-- It stops at the first match and trims trailing separators like '|' or newlines.
UPDATE public.leads
SET interest = TRIM(
  COALESCE(
    NULLIF(
      regexp_replace(substring(message FROM '(?i)(?:Inter[eí]s|Interest)\s*[:\-]?\s*([^|\n]+)'), '\s+$', '', 'g'),
      ''
    ),
    NULLIF(
      regexp_replace(substring(message FROM '(?i)Inter[eí]s\s*[:\-]?\s*([^|\n]+)'), '\s+$', '', 'g'),
      ''
    ),
    NULLIF(
      regexp_replace(substring(message FROM '(?i)Interest\s*[:\-]?\s*([^|\n]+)'), '\s+$', '', 'g'),
      ''
    )
  )
)
WHERE interest IS NULL OR interest = '';

-- 3) Create an index to speed up reporting
CREATE INDEX IF NOT EXISTS idx_leads_interest ON public.leads (interest);

-- 4) Optional: set a default value for new rows (uncomment to enable)
-- ALTER TABLE public.leads ALTER COLUMN interest SET DEFAULT 'No especificado';

-- 5) Optional: make column NOT NULL after you verify the backfill (uncomment only after verification)
-- ALTER TABLE public.leads ALTER COLUMN interest SET NOT NULL;

-- 6) Verification queries
SELECT interest, count(*) AS cnt
FROM public.leads
GROUP BY interest
ORDER BY cnt DESC
LIMIT 200;

SELECT count(*) AS null_or_empty_interest_count
FROM public.leads
WHERE interest IS NULL OR TRIM(interest) = '';

-- End of migration
