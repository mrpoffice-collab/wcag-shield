# WCAG Shield - Project Instructions

## Overview
WCAG Shield is a standalone WCAG compliance audit trail and monitoring tool. It provides legal protection for websites through documented compliance history.

**IMPORTANT:** This is a standalone product. NOT part of aiso.studio.

## Design Rules (WCAG Compliant - MANDATORY)

**Follow these rules for ALL UI components:**

1. **No grey fonts** - Minimum contrast ratio 4.5:1 for normal text
2. **No dark backgrounds** - Always use light backgrounds (white, light grays)
3. **No purple colors** - Use blue, green, amber instead
4. **Text colors**:
   - Primary text: `text-gray-900` (#1a1a1a or darker)
   - Secondary text: `text-gray-600` or `text-gray-700` (never lighter)
5. **Backgrounds**:
   - Page background: `bg-gray-50` or `bg-gray-100`
   - Cards/surfaces: `bg-white`
   - Subtle sections: `bg-gray-50`
6. **Borders**: `border-gray-200` or `border-gray-300`
7. **Accent colors** (no purple):
   - Primary: `blue-600`
   - Success: `green-600/700`
   - Warning: `amber-600/700`
   - Error: `red-600/700`
   - Critical: `red-700`
   - Serious: `amber-600`
   - Moderate: `yellow-600`
   - Minor: `blue-600`

## Export Quality Requirements

All exported products (PDFs, reports) MUST be:
- Professional quality suitable for legal/business use
- Properly branded with WCAG Shield logo
- Clean typography with proper hierarchy
- Court-ready documentation

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Neon PostgreSQL
- **ORM**: Prisma
- **Email**: Resend
- **PDF**: @react-pdf/renderer
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel

## Project Structure

```
wcag-shield/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing + scan form
│   │   ├── scan/[id]/page.tsx    # Scan results
│   │   ├── dashboard/page.tsx    # User dashboard
│   │   ├── api/
│   │   │   ├── scan/route.ts     # Scan API
│   │   │   ├── email/route.ts    # Email API
│   │   │   └── export/route.ts   # PDF export API
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ScanForm.tsx
│   │   ├── ScanResults.tsx
│   │   ├── ViolationCard.tsx
│   │   ├── ScoreGauge.tsx
│   │   └── AuditTrail.tsx
│   └── lib/
│       ├── scanner.ts            # WCAG scanner
│       ├── db.ts                 # Prisma client
│       └── pdf.ts                # PDF generation
├── prisma/
│   └── schema.prisma
└── public/
    └── logo.svg
```

## Scanner Checks (WCAG 2.1 AA)

1. **image-alt** - Images must have alt text (1.1.1)
2. **link-name** - Links must have discernible text (2.4.4)
3. **button-name** - Buttons must have accessible names (4.1.2)
4. **label** - Form elements must have labels (1.3.1, 4.1.2)
5. **html-has-lang** - HTML must have lang attribute (3.1.1)
6. **heading-order** - Headings must be in order (1.3.1)
7. **empty-heading** - Headings must not be empty (1.3.1)
8. **document-title** - Pages must have titles (2.4.2)
9. **table-header** - Tables must have headers (1.3.1)

## Scoring

- **Critical violations**: -25 points each (capped at 5)
- **Serious violations**: -15 points each (capped at 5)
- **Moderate violations**: -8 points each (capped at 5)
- **Minor violations**: -3 points each (capped at 5)
- **Pass bonus**: +2 points per passing check (max +15)
- **Score range**: 0-100

## API Endpoints

- `POST /api/scan` - Scan a URL, returns scan result
- `GET /api/scan/[id]` - Get scan result by ID
- `POST /api/email` - Send scan results email
- `GET /api/export/[id]` - Export scan as PDF

## Environment Variables

```env
DATABASE_URL=postgresql://...
RESEND_API_KEY=re_...
NEXT_PUBLIC_APP_URL=https://wcag-shield.vercel.app
```

## Development

```bash
npm run dev        # Start dev server
npx prisma studio  # Database UI
npm run build      # Production build
```

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy
