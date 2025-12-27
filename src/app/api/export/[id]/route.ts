import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { prisma } from '@/lib/db';
import { ComplianceReport } from '@/lib/pdf';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const scan = await prisma.scan.findUnique({
      where: { id },
      include: { site: true },
    });

    if (!scan) {
      return NextResponse.json(
        { error: 'Scan not found' },
        { status: 404 }
      );
    }

    const scanData = {
      id: scan.id,
      url: scan.url,
      accessibilityScore: scan.accessibilityScore,
      criticalCount: scan.criticalCount,
      seriousCount: scan.seriousCount,
      moderateCount: scan.moderateCount,
      minorCount: scan.minorCount,
      totalViolations: scan.totalViolations,
      totalPasses: scan.totalPasses,
      pageTitle: scan.pageTitle || 'Unknown',
      pageLanguage: scan.pageLanguage || 'unknown',
      wcagBreakdown: scan.wcagBreakdown ? JSON.parse(scan.wcagBreakdown) : {
        perceivable: { violations: 0, score: 100 },
        operable: { violations: 0, score: 100 },
        understandable: { violations: 0, score: 100 },
        robust: { violations: 0, score: 100 },
      },
      violations: scan.violations ? JSON.parse(scan.violations) : [],
      passes: scan.passes ? JSON.parse(scan.passes) : [],
      createdAt: scan.createdAt.toISOString(),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(ComplianceReport({ scan: scanData }) as any);

    const filename = `wcag-report-${scan.id.substring(0, 8)}-${new Date().toISOString().split('T')[0]}.pdf`;

    // Convert Buffer to Uint8Array for NextResponse
    const uint8Array = new Uint8Array(pdfBuffer);

    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('PDF export error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
