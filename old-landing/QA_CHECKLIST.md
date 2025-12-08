# End-to-End QA Checklist - Lead Flow & Attribution

## Overview
This checklist ensures all lead attribution points are working correctly, both languages function properly, and data persists to Supabase with correct source/interest values.

---

## 🎯 Attribution Sources Coverage

### Landing Page (Main Site)

#### Hero Section
- [ ] **hero_light** - Click "Quiero mi menú digital (Light)" CTA
- [ ] **hero_plus** - Click "Quiero hablar de Plus" CTA  
- [ ] **hero_pro** - Click "Quiero hablar de Pro" CTA

#### Navbar
- [ ] **contact_navbar** - Click "Agenda una demo" (desktop)
- [ ] **contact_navbar_mobile** - Click "Agenda una demo" (mobile menu)

#### Products Section (ProductCard)
- [ ] **light** - Click "Ver más de Light" button
- [ ] **plus** - Click "Ver más de Plus" button
- [ ] **pro** - Click "Ver más de Pro" button

#### Pro Details Section
- [ ] **pro_details** - Click "Hablar del producto Pro" CTA

#### Footer
- [ ] **footer_contact** - Click "Contacto" link in footer

---

### Light Product Page (`/light`)

- [ ] **light_page_cta_top** - Click navbar CTA (desktop)
- [ ] **light_page_cta_mobile** - Click navbar CTA (mobile menu)
- [ ] **light_page_cta_hero** - Click "Quiero el plan Light" in hero section
- [ ] **light_page_cta_details** - Click "Hablar del producto Light" in suitability card
- [ ] **light_page_footer** - Click "Contacto" in footer

---

### Plus Product Page (`/plus`)

- [ ] **plus_page_cta_top** - Click navbar CTA (desktop)
- [ ] **plus_page_cta_mobile** - Click navbar CTA (mobile menu)
- [ ] **plus_page_cta_hero** - Click "Quiero el plan Plus" in hero section
- [ ] **plus_page_cta_details** - Click "Hablar del producto Plus" in suitability card
- [ ] **plus_page_footer** - Click "Contacto" in footer

---

### Pro Product Page (`/pro`)

- [ ] **pro_page_cta_top** - Click navbar CTA (desktop)
- [ ] **pro_page_cta_mobile** - Click navbar CTA (mobile menu)
- [ ] **pro_page_cta_hero** - Click "Quiero hablar de la versión Pro" in hero section
- [ ] **pro_page_cta_details** - Click "Agendar una conversación sobre Pro" in suitability card
- [ ] **pro_page_footer** - Click "Contacto" in footer

---

## 📊 Database Verification Tests

### Test Flow (for each source above):

1. **Click CTA** → Should navigate to `#contacto` section
2. **Fill form** with test data:
   - Name: `QA Test - [SOURCE_NAME]`
   - Restaurant: `Test Restaurant`
   - WhatsApp: `+573001234567`
   - Email: `qa+[source]@test.com`
   - Interest: Select one (Light/Plus/Pro/Not sure)
3. **Submit form**
4. **Verify Supabase** `leads` table:
   ```sql
   SELECT id, name, source, interest, created_at 
   FROM leads 
   WHERE name LIKE 'QA Test%' 
   ORDER BY created_at DESC 
   LIMIT 20;
   ```
5. **Expected Results**:
   - ✅ `source` column = exact source identifier (e.g., `hero_light`, `plus_page_cta_hero`)
   - ✅ `interest` column = selected option value (`light`, `plus`, `pro`, `unsure`)
   - ✅ `message` field contains WhatsApp-formatted message

---

## 🌐 Multi-Language Testing

### Spanish (ES) - Default

- [ ] Load site → Should auto-detect Spanish or default to ES
- [ ] Verify navbar labels in Spanish
- [ ] Submit lead form → Check WhatsApp message format:
  ```
  Hola, me interesa saber más sobre TuOrdenYa.

  Nombre: [name]
  Restaurante: [restaurant]
  Correo: [email]
  Interés: [interest_label_spanish]
  Fuente: [source]
  ```

### English (EN)

- [ ] Click **EN** in LanguageSwitcher
- [ ] Verify all content switches to English:
  - [ ] Navbar links
  - [ ] Hero section (title, subtitle, CTAs)
  - [ ] Product cards
  - [ ] Form labels (Name, Restaurant, WhatsApp, Email, Interest)
  - [ ] Footer
- [ ] Submit lead form → Check WhatsApp message format:
  ```
  Hello, I'm interested in learning more about TuOrdenYa.

  Name: [name]
  Restaurant: [restaurant]
  Email: [email]
  Interest: [interest_label_english]
  Source: [source]
  ```

### Language Switcher UI

- [ ] **Desktop** - Switcher visible in navbar (≥640px screens)
- [ ] **Mobile** - Switcher in mobile menu dropdown
- [ ] **Active state** - Selected language has orange background
- [ ] **Persistence** - Language choice persists across page navigation
- [ ] Test on all pages:
  - [ ] Landing page (`/`)
  - [ ] Light page (`/light`)
  - [ ] Plus page (`/plus`)
  - [ ] Pro page (`/pro`)

---

## 📈 Google Analytics Verification

### GA4 Events to Monitor

Open browser DevTools → Network tab → Filter for `google-analytics` or `gtag`

#### Form View Event
- [ ] **Event**: `view_lead_form`
- [ ] **Triggered**: When form becomes visible in viewport
- [ ] **Parameters**:
  - `source`: sessionStorage value or "direct"

#### Form Submit Event
- [ ] **Event**: `submit_lead_form`
- [ ] **Triggered**: On successful form submission
- [ ] **Parameters**:
  - `source`: attribution source
  - `interest`: selected interest value
  - `language`: current locale (es/en)

### How to Test:
1. Open DevTools → Console
2. Type: `dataLayer` (should show array of GA events)
3. Submit a test lead
4. Check `dataLayer` for new event with correct parameters

---

## 🔗 WhatsApp Integration

### Message Format Tests

For each language:

- [ ] **Spanish Message** includes:
  - Opening: "Hola, me interesa saber más sobre TuOrdenYa."
  - Name field
  - Restaurant field
  - Email field
  - Interest field (Spanish label)
  - Source field (Spanish label)

- [ ] **English Message** includes:
  - Opening: "Hello, I'm interested in learning more about TuOrdenYa."
  - Name field
  - Restaurant field
  - Email field
  - Interest field (English label)
  - Source field (English label)

- [ ] **WhatsApp Link Opens** correctly:
  - URL format: `https://wa.me/PHONE?text=[encoded_message]`
  - Message is URL-encoded properly
  - Opens WhatsApp web/app with pre-filled message

---

## 🐛 Edge Cases & Error Handling

### Form Validation

- [ ] Submit empty form → Should show validation errors
- [ ] Invalid email format → Should show error
- [ ] Invalid phone format → Should show error
- [ ] All fields required → Cannot submit until filled

### Attribution Edge Cases

- [ ] Direct navigation to `#contacto` (no CTA click) → `source` = "direct"
- [ ] Refresh page after clicking CTA → sessionStorage cleared
- [ ] Multiple CTA clicks before submit → Last click wins
- [ ] Form submit reads source twice (mount + submit) → Handles race conditions

### Network Issues

- [ ] Supabase insert fails → User sees error message
- [ ] Network timeout → Graceful error handling
- [ ] WhatsApp still opens even if DB fails → User can still contact

---

## 📱 Responsive Testing

### Breakpoints to Test

- [ ] **Mobile** (< 640px)
  - Mobile menu opens
  - Language switcher in mobile menu
  - Form layout stacks vertically
  - CTAs are full-width

- [ ] **Tablet** (640px - 1024px)
  - Navbar items visible
  - Language switcher in navbar
  - Form layout optimized

- [ ] **Desktop** (> 1024px)
  - All elements visible
  - Product cards side-by-side
  - Proper spacing and alignment

---

## ✅ Summary Verification Queries

### Run these in Supabase SQL Editor after testing:

```sql
-- 1. Check all unique sources captured
SELECT source, COUNT(*) as count
FROM leads
WHERE name LIKE 'QA Test%'
GROUP BY source
ORDER BY count DESC;

-- 2. Verify interest values
SELECT interest, COUNT(*) as count
FROM leads
WHERE name LIKE 'QA Test%'
GROUP BY interest
ORDER BY count DESC;

-- 3. Check for any NULL sources (should be none except "direct")
SELECT COUNT(*) as null_sources
FROM leads
WHERE source IS NULL OR source = '';

-- 4. Recent test leads with all fields
SELECT 
  id,
  name,
  source,
  interest,
  created_at,
  LEFT(message, 100) as message_preview
FROM leads
WHERE name LIKE 'QA Test%'
ORDER BY created_at DESC
LIMIT 20;
```

---

## 🎯 Expected Attribution Sources (Complete List)

Total: **23 unique source identifiers**

### Landing Page (9)
1. `hero_light`
2. `hero_plus`
3. `hero_pro`
4. `contact_navbar`
5. `contact_navbar_mobile`
6. `light` (ProductCard)
7. `plus` (ProductCard)
8. `pro` (ProductCard)
9. `pro_details`
10. `footer_contact`

### Light Page (5)
11. `light_page_cta_top`
12. `light_page_cta_mobile`
13. `light_page_cta_hero`
14. `light_page_cta_details`
15. `light_page_footer`

### Plus Page (5)
16. `plus_page_cta_top`
17. `plus_page_cta_mobile`
18. `plus_page_cta_hero`
19. `plus_page_cta_details`
20. `plus_page_footer`

### Pro Page (5)
21. `pro_page_cta_top`
22. `pro_page_cta_mobile`
23. `pro_page_cta_hero`
24. `pro_page_cta_details`
25. `pro_page_footer`

---

## 🚨 Known Issues / Notes

- [ ] Document any issues found during QA here
- [ ] Note browser-specific behaviors
- [ ] Track any discrepancies between Spanish/English versions

---

## ✅ QA Sign-Off

- **Tester**: _______________
- **Date**: _______________
- **Browser(s) Tested**: _______________
- **Result**: ⬜ PASS / ⬜ FAIL
- **Notes**: _______________

---

## 🔄 Automated Attribution Verification

Use `scripts/verifyAttribution.ts` to quickly assess coverage.

### Setup
1. Ensure env vars:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
2. Install dependencies if needed: `npm install`

### Run
```bash
npx ts-node scripts/verifyAttribution.ts
```

### Output
- Counts per source
- Missing sources list
- Coverage percentage

### After Running
1. Trigger missing CTAs and submit test leads (name prefix `QA Test - SOURCE`).
2. Re-run script until coverage is 100%.
3. Spot-check GA events & WhatsApp messages for a sample.

---
