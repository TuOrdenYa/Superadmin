# Leads Admin Dashboard

## Access

Local: `http://localhost:3000/admin/leads`

Production: `https://www.tuordenya.com/admin/leads` (protected by Basic Auth)

## Features

### 📊 Stats Cards
- **Total Leads**: All-time lead count
- **Today**: Leads submitted today
- **Last 7 Days**: Weekly lead count

### 📈 Analytics Charts

**Top Sources Chart**
- Visual bar chart showing leads by attribution source
- Sorted by volume (highest first)
- Shows top 10 sources
- Percentage-based progress bars

**Interest Distribution Chart**
- Breakdown by product interest (Light/Plus/Pro/Unsure)
- Color-coded by product:
  - Light: Yellow (#F7C325)
  - Plus: Green (#2ECC71)
  - Pro: Blue (#4A90E2)
  - Unsure: Gray

### 🔍 Advanced Filters

1. **Date Range**
   - From/To date pickers
   - Filter leads by submission date

2. **Source Filter**
   - Dropdown with all unique sources
   - Shows count per source

3. **Interest Filter**
   - Dropdown with all interest options
   - Shows count per interest

4. **Search**
   - Full-text search across:
     - Name
     - Email
     - Phone
     - Restaurant name

5. **Clear Filters Button**
   - Reset all filters to default

### 📋 Leads Table

**Columns**:
- Fecha (Date & Time)
- Nombre (Name)
- Restaurante (Restaurant)
- Contacto (Phone & Email)
- Interés (Interest with color badge)
- Fuente (Attribution source)

**Features**:
- Sortable columns
- Hover highlighting
- Responsive design
- Scrollable on mobile

### 📥 CSV Export

**Export Button**
- Downloads filtered results as CSV
- Includes all fields
- Filename: `leads_YYYY-MM-DD.csv`
- UTF-8 encoded for Spanish characters

**CSV Columns**:
- ID
- Fecha
- Nombre
- Restaurante
- Teléfono
- Email
- Interés
- Fuente

## Usage Examples

### Find all Light product leads this week
1. Set "Interés" filter to `light`
2. Set "Desde" to 7 days ago
3. Click "Exportar CSV" to download

### Track specific campaign performance
1. Set "Fuente" filter to campaign source (e.g., `hero_light`)
2. Review count and export for analysis

### Search for specific lead
1. Type name, email, or phone in "Buscar" field
2. View matching results instantly

## Security Notes

⚠️ **Important**: This admin panel is protected by Basic Auth in production via `proxy.ts` (Next.js Proxy file convention replacing deprecated middleware).

### Authentication Setup (Production)

1. Set environment variables in your hosting provider:
   - `ADMIN_USER=your_admin_username`
   - `ADMIN_PASS=your_strong_password`
2. Deploy the app. In production, all `/admin` routes require Basic Auth.
3. In local development (`NODE_ENV=development`), auth is bypassed for convenience.

### Supabase RLS (Row Level Security) [Optional]
   ```sql
   -- Only allow authenticated users to read leads
   CREATE POLICY "Admins can view leads"
   ON leads FOR SELECT
   USING (auth.role() = 'authenticated');
   ```

### IP Whitelist (Production) [Optional]
   - Restrict access via nginx/cloudflare
   - Only allow office/VPN IPs

## Performance

**Optimizations Included**:
- ✅ Single data fetch on mount
- ✅ Client-side filtering (fast for <10k records)
- ✅ Memoized stats calculations
- ✅ Efficient re-renders with React hooks

**For Large Datasets** (>10k leads):
- Consider server-side pagination
- Add Supabase query filters
- Implement infinite scroll

## Customization

### Change Date Format
```typescript
// Line ~380
{new Date(lead.created_at).toLocaleDateString("es-CO", {
  year: "numeric",
  month: "short",  // Change to "long" for full month name
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})}
```

### Add More Stats Cards
```typescript
// After existing stats cards
<div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
  <p className="text-sm text-slate-400">This Month</p>
  <p className="text-3xl font-bold mt-2">{stats.thisMonth}</p>
</div>
```

### Modify Color Scheme
```typescript
// Change primary color from orange to another
className="bg-[#FF6F3C]"  // Orange
className="bg-[#3B82F6]"  // Blue
className="bg-[#8B5CF6]"  // Purple
```

## Troubleshooting

### No leads showing
1. Check Supabase connection in `/lib/supabase.js`
2. Verify `leads` table exists
3. Check browser console for errors
4. Ensure RLS policies allow read access
5. If on production, confirm Basic Auth credentials are set and correct (`ADMIN_USER`, `ADMIN_PASS`)

### CSV export not working
- Check browser popup blocker
- Ensure filtered leads exist
- Verify UTF-8 encoding support

### Slow performance
- Reduce chart data points
- Implement pagination
- Add database indexes on `created_at`, `source`, `interest`

## Future Enhancements

- [ ] Real-time updates (Supabase subscriptions)
- [ ] Email notifications for new leads
- [ ] Lead status tracking (new/contacted/converted)
- [ ] Custom date range presets (Yesterday, Last Month, etc.)
- [ ] Charts with time-series data (leads over time)
- [ ] WhatsApp integration (click to message)
- [ ] Notes/comments per lead
- [ ] Export to Google Sheets
- [ ] Dark/Light theme toggle
