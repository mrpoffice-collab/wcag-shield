import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { scanUrl } from '@/lib/scanner';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, email } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Scan the URL
    const result = await scanUrl(url);

    // Find or create site
    let site = await prisma.wcagSite.findFirst({
      where: { url: result.url },
    });

    if (!site) {
      site = await prisma.wcagSite.create({
        data: {
          url: result.url,
          name: result.pageTitle,
        },
      });
    }

    // Store the scan
    const scan = await prisma.wcagScan.create({
      data: {
        siteId: site.id,
        url: result.url,
        accessibilityScore: result.accessibilityScore,
        criticalCount: result.criticalCount,
        seriousCount: result.seriousCount,
        moderateCount: result.moderateCount,
        minorCount: result.minorCount,
        totalViolations: result.totalViolations,
        totalPasses: result.totalPasses,
        pageTitle: result.pageTitle,
        pageLanguage: result.pageLanguage,
        scanVersion: result.scanVersion,
        wcagBreakdown: JSON.stringify(result.wcagBreakdown),
        violations: JSON.stringify(result.violations),
        passes: JSON.stringify(result.passes),
      },
    });

    // If email provided, capture as lead
    if (email) {
      await prisma.wcagLead.create({
        data: {
          email,
          url: result.url,
          scanId: scan.id,
          source: 'scan',
        },
      });
    }

    return NextResponse.json({
      success: true,
      scanId: scan.id,
      result: {
        ...result,
        id: scan.id,
      },
    });
  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Scan failed' },
      { status: 500 }
    );
  }
}
