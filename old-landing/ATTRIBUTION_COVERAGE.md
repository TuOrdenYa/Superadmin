# Lead Attribution - Complete Coverage Report

## ✅ Attribution Status: COMPLETE

All CTAs and navigation points to the contact form have proper lead source attribution implemented.

---

## 📊 Coverage Summary

**Total Attribution Points**: 25
- Landing Page: 10 sources
- Light Product Page: 5 sources  
- Plus Product Page: 5 sources
- Pro Product Page: 5 sources

---

## 🎯 Attribution Map by Page

### Landing Page (/) - 10 sources

| Location | Source ID | Element |
|----------|-----------|---------|
| Hero CTA (Light) | `hero_light` | "Quiero mi menú digital (Light)" button |
| Hero CTA (Plus) | `hero_plus` | "Quiero hablar de Plus" button |
| Hero CTA (Pro) | `hero_pro` | "Quiero hablar de Pro" button |
| Navbar Desktop | `contact_navbar` | "Agenda una demo" link |
| Navbar Mobile | `contact_navbar_mobile` | "Agenda una demo" link (mobile menu) |
| Products Section (Light) | `light` | "Ver más de Light" button in ProductCard |
| Products Section (Plus) | `plus` | "Ver más de Plus" button in ProductCard |
| Products Section (Pro) | `pro` | "Ver más de Pro" button in ProductCard |
| Pro Details Section | `pro_details` | "Hablar del producto Pro" CTA |
| Footer | `footer_contact` | "Contacto" link |

---

### Light Product Page (/light) - 5 sources

| Location | Source ID | Element |
|----------|-----------|---------|
| Navbar Desktop | `light_page_cta_top` | "Quiero el plan Light" button |
| Navbar Mobile | `light_page_cta_mobile` | "Quiero el plan Light" button (mobile menu) |
| Hero Section | `light_page_cta_hero` | "Quiero el plan Light" CTA |
| Suitability Card | `light_page_cta_details` | "Hablar del producto Light" button |
| Footer | `light_page_footer` | "Contacto" link |

---

### Plus Product Page (/plus) - 5 sources

| Location | Source ID | Element |
|----------|-----------|---------|
| Navbar Desktop | `plus_page_cta_top` | "Quiero el plan Plus" button |
| Navbar Mobile | `plus_page_cta_mobile` | "Quiero el plan Plus" button (mobile menu) |
| Hero Section | `plus_page_cta_hero` | "Quiero el plan Plus" CTA |
| Suitability Card | `plus_page_cta_details` | "Hablar del producto Plus" button |
| Footer | `plus_page_footer` | "Contacto" link |

---

### Pro Product Page (/pro) - 5 sources

| Location | Source ID | Element |
|----------|-----------|---------|
| Navbar Desktop | `pro_page_cta_top` | "Quiero hablar de la versión Pro" button |
| Navbar Mobile | `pro_page_cta_mobile` | "Quiero hablar de la versión Pro" button (mobile menu) |
| Hero Section | `pro_page_cta_hero` | "Quiero hablar de la versión Pro" CTA |
| Suitability Card | `pro_page_cta_details` | "Agendar una conversación sobre Pro" button |
| Footer | `pro_page_footer` | "Contacto" link |

---

## 🔧 Technical Implementation

### How It Works

1. **User clicks CTA** with `onClick={() => setLeadSource("source_id")}`
2. **sessionStorage stores** the source: `sessionStorage.setItem("leadSource", "source_id")`
3. **User navigates** to `#contacto` section
4. **LeadForm reads source** on mount AND on submit (dual read for reliability)
5. **Form submits** to Supabase with `source` and `interest` columns populated
6. **GA4 event fires** with source and interest metadata
7. **WhatsApp opens** with pre-filled message including source

### Code Flow

```typescript
// 1. CTA Click
<a onClick={() => setLeadSource("hero_light")} href="/#contacto">
  {cta_label}
</a>

// 2. sessionStorage Helper (components/lib/leadSource.ts)
export function setLeadSource(source: string) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("leadSource", source);
  }
}

// 3. LeadForm Reads (components/LeadForm.tsx)
useEffect(() => {
  const stored = sessionStorage.getItem("leadSource");
  if (stored) {
    setResolvedSource(stored);
    sessionStorage.removeItem("leadSource");
  }
}, []);

// 4. Submit Handler
const handleSubmit = async () => {
  const stored = sessionStorage.getItem("leadSource");
  const finalSource = stored || resolvedSource || "direct";
  
  // Insert to Supabase
  await supabase.from("leads").insert({
    name, phone, email, restaurant, 
    interest: formState.interest,
    source: finalSource,
    message: buildMessageLines(true)
  });
  
  // Fire GA4 event
  gaEvent("submit_lead_form", {
    source: finalSource,
    interest: formState.interest
  });
};
```

---

## 📈 Expected Database Schema

### Leads Table Structure

```sql
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  restaurant text NOT NULL,
  interest text,           -- "light" | "plus" | "pro" | "unsure"
  source text,             -- One of the 25 source IDs above
  message text,            -- Full WhatsApp message
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_leads_interest ON leads (interest);
CREATE INDEX idx_leads_source ON leads (source);
```

---

## 🧪 QA Testing Priorities

### Critical Path Tests (Must Test)

1. **One source from each page**:
   - Landing: `hero_light`
   - Light page: `light_page_cta_hero`
   - Plus page: `plus_page_cta_hero`
   - Pro page: `pro_page_cta_hero`

2. **Both languages**:
   - Submit in Spanish (ES)
   - Submit in English (EN)
   - Verify WhatsApp message format differs

3. **All interest options**:
   - Light
   - Plus
   - Pro
   - Not sure

4. **Database verification**:
   - Check `source` column populated
   - Check `interest` column populated
   - Check `message` field formatted correctly

### Extended Tests (Recommended)

- Mobile vs Desktop CTAs
- Footer attribution
- ProductCard attribution
- Direct navigation (no source) → should be "direct"

---

## 🐛 Edge Cases Handled

✅ **Race Conditions**: Form reads sessionStorage on mount AND submit  
✅ **Page Refresh**: sessionStorage cleared after first read  
✅ **Direct Navigation**: Falls back to "direct" if no source found  
✅ **Multiple Clicks**: Last click before submit wins  
✅ **Missing Source**: Defaults to "direct" instead of null  
✅ **Browser Compatibility**: Checks `typeof window !== "undefined"`

---

## 📊 Analytics Integration

### GA4 Events Tracked

**Event 1: view_lead_form**
- Triggered: When form enters viewport
- Parameters:
  - `source`: Current sessionStorage value or "direct"

**Event 2: submit_lead_form**
- Triggered: On successful form submission
- Parameters:
  - `source`: Final resolved source
  - `interest`: Selected interest value
  - `language`: Current locale (es/en)

---

## ✅ Verification Queries

### Check Attribution Coverage

```sql
-- All unique sources captured (should see ~25)
SELECT source, COUNT(*) as lead_count
FROM leads
GROUP BY source
ORDER BY lead_count DESC;

-- Sources by date range
SELECT 
  source,
  DATE(created_at) as date,
  COUNT(*) as count
FROM leads
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY source, DATE(created_at)
ORDER BY date DESC, count DESC;

-- Interest distribution by source
SELECT 
  source,
  interest,
  COUNT(*) as count
FROM leads
GROUP BY source, interest
ORDER BY source, count DESC;
```

---

## 🎯 Next Steps for Analytics

Once QA is complete, you can:

1. **Build Admin Dashboard** to visualize:
   - Leads by source (bar chart)
   - Conversion funnel by product interest
   - Time-series trends
   - Top performing CTAs

2. **Set Up Alerts**:
   - Email when lead submitted
   - Slack notification with source/interest
   - Daily summary reports

3. **A/B Testing**:
   - Track which CTAs convert best
   - Compare mobile vs desktop performance
   - Measure Spanish vs English lead quality

---

## 📝 Notes

- All product pages use identical attribution patterns (consistent naming)
- Footer and navbar attribution work across all pages
- ProductCard uses dynamic source based on product variant
- Language switcher doesn't affect attribution (source still captured)
- WhatsApp message includes source label in user's language

---

**Last Updated**: December 1, 2025  
**Status**: ✅ All attribution points implemented and ready for QA
