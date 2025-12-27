-- Create WCAG Shield tables (without affecting existing tables)

CREATE TABLE IF NOT EXISTS "wcag_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "wcag_users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "wcag_users_email_key" ON "wcag_users"("email");

CREATE TABLE IF NOT EXISTS "wcag_sites" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "wcag_sites_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "wcag_sites_userId_idx" ON "wcag_sites"("userId");
CREATE INDEX IF NOT EXISTS "wcag_sites_url_idx" ON "wcag_sites"("url");

CREATE TABLE IF NOT EXISTS "wcag_scans" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "accessibilityScore" INTEGER NOT NULL,
    "criticalCount" INTEGER NOT NULL DEFAULT 0,
    "seriousCount" INTEGER NOT NULL DEFAULT 0,
    "moderateCount" INTEGER NOT NULL DEFAULT 0,
    "minorCount" INTEGER NOT NULL DEFAULT 0,
    "totalViolations" INTEGER NOT NULL DEFAULT 0,
    "totalPasses" INTEGER NOT NULL DEFAULT 0,
    "pageTitle" TEXT,
    "pageLanguage" TEXT,
    "scanVersion" TEXT NOT NULL DEFAULT '1.0',
    "wcagBreakdown" TEXT,
    "violations" TEXT,
    "passes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "wcag_scans_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "wcag_scans_siteId_idx" ON "wcag_scans"("siteId");
CREATE INDEX IF NOT EXISTS "wcag_scans_createdAt_idx" ON "wcag_scans"("createdAt");

CREATE TABLE IF NOT EXISTS "wcag_leads" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "scanId" TEXT,
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "wcag_leads_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "wcag_leads_email_idx" ON "wcag_leads"("email");
CREATE INDEX IF NOT EXISTS "wcag_leads_status_idx" ON "wcag_leads"("status");

-- Add foreign key constraints
ALTER TABLE "wcag_sites" ADD CONSTRAINT "wcag_sites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "wcag_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "wcag_scans" ADD CONSTRAINT "wcag_scans_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "wcag_sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
