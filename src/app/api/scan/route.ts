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

    // Normalize and validate URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.match(/^https?:\/\//i)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    try {
      new URL(normalizedUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format. Please enter a valid website address.' },
        { status: 400 }
      );
    }

    // Scan the URL
    const result = await scanUrl(normalizedUrl);

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

    // Provide user-friendly error messages
    let errorMessage = 'Scan failed';
    let statusCode = 500;

    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('fetch failed') || msg.includes('enotfound') || msg.includes('getaddrinfo')) {
        errorMessage = 'Unable to reach the website. Please check the URL and try again.';
        statusCode = 400;
      } else if (msg.includes('timeout') || msg.includes('etimedout')) {
        errorMessage = 'The website took too long to respond. Please try again.';
        statusCode = 408;
      } else if (msg.includes('certificate') || msg.includes('ssl')) {
        errorMessage = 'SSL certificate error. The website may have security issues.';
        statusCode = 400;
      } else if (msg.includes('invalid url') || msg.includes('invalid protocol')) {
        errorMessage = 'Invalid URL format. Please enter a valid website address.';
        statusCode = 400;
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
