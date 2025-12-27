import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ScanResults } from '@/components/ScanResults';
import { Shield } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ScanPage({ params }: PageProps) {
  const { id } = await params;

  const scan = await prisma.scan.findUnique({
    where: { id },
    include: { site: true },
  });

  if (!scan) {
    notFound();
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-900 hover:text-blue-600 transition-colors"
          >
            <Shield className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-xl">WCAG Shield</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </header>
      <main className="py-8 px-4">
        <ScanResults result={result} scanId={id} />
      </main>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const scan = await prisma.scan.findUnique({ where: { id } });

  if (!scan) {
    return { title: 'Scan Not Found - WCAG Shield' };
  }

  return {
    title: `WCAG Scan: ${scan.pageTitle || scan.url} - WCAG Shield`,
    description: `Accessibility score: ${scan.accessibilityScore}. ${scan.totalViolations} violations found.`,
  };
}
