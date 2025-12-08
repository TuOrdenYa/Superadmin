#!/usr/bin/env ts-node
/*
  Attribution Coverage Verification Script
  ---------------------------------------
  Checks Supabase `leads` table for presence of all expected attribution sources.
  Requires environment variables:
    SUPABASE_SERVICE_ROLE_KEY  (service role, NOT exposed client-side)
    NEXT_PUBLIC_SUPABASE_URL

  Usage:
    npx ts-node scripts/verifyAttribution.ts

  Output:
    - Table of counts per source
    - Missing sources list
    - Summary percentage coverage
*/
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url) throw new Error('Environment variable NEXT_PUBLIC_SUPABASE_URL is required');
if (!serviceKey) throw new Error('Environment variable SUPABASE_SERVICE_ROLE_KEY is required');

// Complete expected sources list (25) from docs
const expectedSources = [
  // Landing (10)
  'hero_light','hero_plus','hero_pro','contact_navbar','contact_navbar_mobile',
  'light','plus','pro','pro_details','footer_contact',
  // Light (5)
  'light_page_cta_top','light_page_cta_mobile','light_page_cta_hero','light_page_cta_details','light_page_footer',
  // Plus (5)
  'plus_page_cta_top','plus_page_cta_mobile','plus_page_cta_hero','plus_page_cta_details','plus_page_footer',
  // Pro (5)
  'pro_page_cta_top','pro_page_cta_mobile','pro_page_cta_hero','pro_page_cta_details','pro_page_footer'
];

async function main() {
  const supabase = createClient(url as string, serviceKey as string, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await supabase
    .from('leads')
    .select('source')
    .limit(5000); // safety limit

  if (error) {
    console.error('Supabase query error:', error.message);
    process.exit(1);
  }

  const counts: Record<string, number> = {};
  data?.forEach(row => {
    const src = (row.source || '').trim();
    if (!src) return;
    counts[src] = (counts[src] || 0) + 1;
  });

  const missing = expectedSources.filter(src => !counts[src]);
  const present = expectedSources.length - missing.length;
  const coveragePct = ((present / expectedSources.length) * 100).toFixed(2);

  console.log('\nAttribution Coverage Report');
  console.log('============================');
  console.log(`Total expected sources: ${expectedSources.length}`);
  console.log(`Present: ${present}`);
  console.log(`Missing: ${missing.length}`);
  console.log(`Coverage: ${coveragePct}%\n`);

  // Output table
  console.log('Counts by source (sorted desc):');
  const sorted = Object.entries(counts).sort((a,b) => b[1]-a[1]);
  sorted.forEach(([src, count]) => {
    const mark = expectedSources.includes(src) ? ' ' : '*';
    console.log(`${src.padEnd(28)} ${String(count).padStart(5)}${mark}`);
  });

  if (missing.length) {
    console.log('\nMissing sources:');
    missing.forEach(s => console.log('- ' + s));
  } else {
    console.log('\nAll sources present ✔');
  }

  // Suggest next QA actions
  console.log('\nNext Actions:');
  if (missing.length) {
    console.log('- Trigger each missing CTA and submit a test lead.');
  }
  console.log('- Run GA event check for a sampling of sources.');
  console.log('- Verify WhatsApp message contains correct source & interest.');
}

main().catch(e => {
  console.error('Unexpected error:', e);
  process.exit(1);
});
