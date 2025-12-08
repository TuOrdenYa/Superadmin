# Landing Page Integration - TODO

## Objective
Integrate the existing www.tuordenya.com landing page into app.tuordenya.com codebase, using the best elements from both versions.

## Current State
- **www.tuordenya.com**: Existing landing page (separate project)
- **app.tuordenya.com**: New landing page just created (in `app/page.tsx`)

## Task
Merge the two landing pages by:
1. Taking content/copy from www.tuordenya.com
2. Using design/components from app.tuordenya.com 
3. Ensuring shared components (LanguageSwitcher, pricing tiers, translations)
4. Maintaining consistent branding across landing + app

## Benefits of Integration
✅ Single codebase (easier maintenance)
✅ Shared components and translations
✅ Consistent pricing and feature information
✅ Same domain (www.tuordenya.com = app.tuordenya.com)
✅ One deployment

## Files to Update
- `app/page.tsx` - Main landing page
- `messages/es.json` & `messages/en.json` - Landing page translations
- Shared components in `app/components/`

## Reference
- Current new landing: app.tuordenya.com (live)
- Existing landing: www.tuordenya.com (to be migrated)

## Priority
Medium - After completing core features (#8-10)
