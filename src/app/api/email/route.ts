import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend lazily to avoid build errors when API key is not set
function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(apiKey);
}

interface ScanResult {
  url: string;
  accessibilityScore: number;
  criticalCount: number;
  seriousCount: number;
  moderateCount: number;
  minorCount: number;
  totalViolations: number;
  pageTitle: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, scanResult, scanId }: { email: string; scanResult: ScanResult; scanId: string } = body;

    if (!email || !scanResult) {
      return NextResponse.json(
        { error: 'Email and scan result are required' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://wcag-shield.vercel.app';
    const resultUrl = `${appUrl}/scan/${scanId}`;

    const scoreColor = scanResult.accessibilityScore >= 80 ? '#16a34a' :
                       scanResult.accessibilityScore >= 60 ? '#ca8a04' : '#dc2626';

    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: 'WCAG Shield <reports@wcagshield.com>',
      to: email,
      subject: `WCAG Scan Results: ${scanResult.pageTitle || scanResult.url}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a1a1a; margin-bottom: 10px;">WCAG Shield</h1>
            <p style="color: #4b5563; margin: 0;">Accessibility Compliance Report</p>
          </div>

          <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #1a1a1a; margin-top: 0;">Scan Results for</h2>
            <p style="color: #2563eb; word-break: break-all; margin-bottom: 0;">${scanResult.url}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; width: 120px; height: 120px; border-radius: 50%; background: ${scoreColor}; color: white; line-height: 120px; font-size: 42px; font-weight: bold;">
              ${scanResult.accessibilityScore}
            </div>
            <p style="color: #4b5563; margin-top: 10px;">Accessibility Score</p>
          </div>

          <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #1a1a1a; margin-top: 0;">Violations Found</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #dc2626; font-weight: 600;">Critical</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${scanResult.criticalCount}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #d97706; font-weight: 600;">Serious</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${scanResult.seriousCount}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #ca8a04; font-weight: 600;">Moderate</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${scanResult.moderateCount}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #2563eb; font-weight: 600;">Minor</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${scanResult.minorCount}</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resultUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              View Full Report
            </a>
          </div>

          <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #92400e; margin-top: 0;">Why This Matters</h3>
            <p style="color: #78350f; margin-bottom: 0;">
              Over 2,000 ADA/WCAG lawsuits were filed in 2024 alone. E-commerce sites are the #1 target.
              A documented audit trail of compliance efforts is your best legal defense.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${appUrl}/signup" style="display: inline-block; background: #16a34a; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Start Monitoring Your Site
            </a>
            <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">
              Get weekly scans, audit trail history, and court-ready compliance reports.
            </p>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 12px;">
            <p>WCAG Shield - Accessibility Compliance Made Simple</p>
            <p>This is an automated scan report. For questions, reply to this email.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Email error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, messageId: data?.id });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
}
