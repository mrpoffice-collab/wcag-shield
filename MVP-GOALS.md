# WCAG Shield - MVP Goals & Testable Criteria

## Problem Statement
Small business websites (Shopify stores, vibe-coded apps, small business sites) are being hit with ADA/WCAG compliance demand letters and lawsuits. They have no documented proof of compliance efforts, making them easy targets for legal action. Existing "solutions" are overlay widgets that don't provide real legal protection.

## Target Users
1. **Shopify store owners** - 69% of ADA web lawsuits target e-commerce
2. **Small business website owners** - Local businesses with basic websites
3. **Vibe-coded app developers** - AI-built apps with zero accessibility consideration
4. **Web agencies** - Managing multiple client sites

## Success Metric
User can demonstrate a documented audit trail proving remediation efforts over time, which serves as legal evidence of good faith compliance.

---

## MVP Goals

### Goal 1: Scan Any Website for WCAG Violations
**Problem:** Site owners don't know what's wrong with their site
**Target:** Anyone with a URL
**Success:** System accurately identifies WCAG 2.1 AA violations

### Goal 2: Professional Violation Report
**Problem:** Technical WCAG jargon is confusing
**Target:** Non-technical business owners
**Success:** Clear, actionable report with severity levels and fix instructions

### Goal 3: Email-Driven Lead Generation
**Problem:** Site owners don't know they're at risk
**Target:** Sites in high-risk verticals (e-commerce, healthcare, education)
**Success:** Automated outreach converts scans to signups

### Goal 4: Audit Trail Dashboard
**Problem:** No proof of remediation efforts
**Target:** Paying customers
**Success:** Timestamped history of scans, violations found, and fixes applied

### Goal 5: Professional PDF Export
**Problem:** Need evidence for legal defense
**Target:** Site owners facing demand letters
**Success:** Court-ready PDF documenting compliance journey

---

## Testable Criteria

### Scanning (Core Feature)
- [ ] **SCAN-01:** User can enter any URL and initiate a scan
- [ ] **SCAN-02:** System detects missing image alt text (WCAG 1.1.1)
- [ ] **SCAN-03:** System detects empty links (WCAG 2.4.4)
- [ ] **SCAN-04:** System detects empty buttons (WCAG 4.1.2)
- [ ] **SCAN-05:** System detects missing form labels (WCAG 1.3.1)
- [ ] **SCAN-06:** System detects missing HTML lang attribute (WCAG 3.1.1)
- [ ] **SCAN-07:** System detects heading order issues (WCAG 1.3.1)
- [ ] **SCAN-08:** System detects missing page title (WCAG 2.4.2)
- [ ] **SCAN-09:** Scan completes within 30 seconds for typical page
- [ ] **SCAN-10:** System calculates accessibility score (0-100)

### Report Display (UI)
- [ ] **REPORT-01:** Violations grouped by severity (Critical, Serious, Moderate, Minor)
- [ ] **REPORT-02:** Each violation shows element location and fix suggestion
- [ ] **REPORT-03:** Score displayed prominently with color coding
- [ ] **REPORT-04:** WCAG principle breakdown shown (Perceivable, Operable, Understandable, Robust)
- [ ] **REPORT-05:** Report is readable (no grey text, proper contrast per design rules)

### Email System
- [ ] **EMAIL-01:** System can send scan results to any email address
- [ ] **EMAIL-02:** Email contains summary of violations found
- [ ] **EMAIL-03:** Email includes CTA to view full report
- [ ] **EMAIL-04:** Email includes CTA to sign up for monitoring
- [ ] **EMAIL-05:** Email renders correctly in major clients (Gmail, Outlook)

### User Authentication
- [ ] **AUTH-01:** User can sign up with email
- [ ] **AUTH-02:** User can log in
- [ ] **AUTH-03:** User session persists across page loads
- [ ] **AUTH-04:** User can log out

### Dashboard
- [ ] **DASH-01:** User sees list of their scanned sites
- [ ] **DASH-02:** Each site shows latest scan date and score
- [ ] **DASH-03:** User can view scan history for any site
- [ ] **DASH-04:** User can trigger new scan from dashboard
- [ ] **DASH-05:** Dashboard shows trend (improving/declining) per site

### Audit Trail
- [ ] **AUDIT-01:** Every scan is timestamped and stored
- [ ] **AUDIT-02:** Historical scans are preserved (not overwritten)
- [ ] **AUDIT-03:** User can view any past scan result
- [ ] **AUDIT-04:** System shows what changed between scans
- [ ] **AUDIT-05:** Audit trail spans at least 12 months

### PDF Export
- [ ] **PDF-01:** User can export audit trail as PDF
- [ ] **PDF-02:** PDF includes company branding (WCAG Shield logo)
- [ ] **PDF-03:** PDF shows scan history with dates and scores
- [ ] **PDF-04:** PDF shows violations found and remediation status
- [ ] **PDF-05:** PDF is professionally formatted (suitable for legal use)
- [ ] **PDF-06:** PDF includes certification statement with timestamp

### UI/UX (Design Rules)
- [ ] **UI-01:** No grey fonts - minimum contrast 4.5:1 for all text
- [ ] **UI-02:** Light backgrounds only (white, light grays)
- [ ] **UI-03:** No purple colors - use blue, green, amber
- [ ] **UI-04:** Primary text uses text-gray-900 or darker
- [ ] **UI-05:** Secondary text uses text-gray-600 or text-gray-700
- [ ] **UI-06:** Mobile responsive design
- [ ] **UI-07:** Professional appearance suitable for business use

### SEO (Required per whiteboard rules)
- [ ] **SEO-01:** Page title present and descriptive (10+ chars)
- [ ] **SEO-02:** Meta description present
- [ ] **SEO-03:** H1 heading on each page
- [ ] **SEO-04:** robots.txt allows crawling
- [ ] **SEO-05:** SEO score >= 70 (via crawl-simulator)

---

## Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Database:** Neon PostgreSQL (production-ready)
- **ORM:** Prisma
- **Auth:** Clerk or NextAuth
- **Email:** Resend
- **PDF:** @react-pdf/renderer
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **Scanner:** Cheerio-based (ported pattern from aiso.studio)

---

## Build Priority

### Phase 1: Core Scanning (MVP-essential)
1. Project setup
2. Scanner implementation
3. Basic results page
4. Database schema

### Phase 2: User System
1. Authentication
2. Dashboard
3. Site management
4. Scan history

### Phase 3: Audit Trail & Export
1. Historical data storage
2. Trend calculation
3. PDF generation
4. Professional formatting

### Phase 4: Email Outreach
1. Resend integration
2. Email templates
3. Lead capture
4. Signup flow

### Phase 5: Polish & Deploy
1. Design review (aesthetic rules)
2. SEO compliance
3. Vercel deployment
4. Final testing

---

## Not in MVP (Future)

- Auto-fix functionality
- Monitoring/scheduled scans
- Shopify app integration
- Legal response templates
- White-label for agencies
- Pricing/payments
