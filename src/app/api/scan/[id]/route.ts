import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const scan = await prisma.wcagScan.findUnique({
      where: { id },
      include: {
        site: true,
      },
    });

    if (!scan) {
      return NextResponse.json(
        { error: 'Scan not found' },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const result = {
      id: scan.id,
      url: scan.url,
      accessibilityScore: scan.accessibilityScore,
      criticalCount: scan.criticalCount,
      seriousCount: scan.seriousCount,
      moderateCount: scan.moderateCount,
      minorCount: scan.minorCount,
      totalViolations: scan.totalViolations,
      totalPasses: scan.totalPasses,
      pageTitle: scan.pageTitle,
      pageLanguage: scan.pageLanguage,
      scanVersion: scan.scanVersion,
      wcagBreakdown: scan.wcagBreakdown ? JSON.parse(scan.wcagBreakdown) : null,
      violations: scan.violations ? JSON.parse(scan.violations) : [],
      passes: scan.passes ? JSON.parse(scan.passes) : [],
      createdAt: scan.createdAt,
      site: scan.site,
    };

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Get scan error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get scan' },
      { status: 500 }
    );
  }
}
