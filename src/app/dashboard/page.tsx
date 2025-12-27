import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Shield, Globe, Clock, TrendingUp, TrendingDown, Minus, ExternalLink, RefreshCw } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface SiteWithScans {
  id: string;
  url: string;
  name: string | null;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  scans: {
    id: string;
    accessibilityScore: number;
    createdAt: Date;
  }[];
}

export default async function DashboardPage() {
  const sites: SiteWithScans[] = await prisma.wcagSite.findMany({
    include: {
      scans: {
        orderBy: { createdAt: 'desc' },
        take: 2,
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  const getTrend = (scans: { accessibilityScore: number }[]) => {
    if (scans.length < 2) return null;
    const diff = scans[0].accessibilityScore - scans[1].accessibilityScore;
    if (diff > 0) return { direction: 'up', value: diff };
    if (diff < 0) return { direction: 'down', value: Math.abs(diff) };
    return { direction: 'same', value: 0 };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-700 bg-green-50 border-green-200';
    if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
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
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Scan
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your sites and track compliance over time.</p>
        </div>

        {sites.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Sites Yet</h2>
            <p className="text-gray-600 mb-6">
              Scan a website to start tracking its accessibility compliance.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Scan Your First Site
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sites.map((site) => {
              const latestScan = site.scans[0];
              const trend = getTrend(site.scans);

              return (
                <div
                  key={site.id}
                  className="bg-white rounded-lg border border-gray-200 p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Globe className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <h2 className="font-semibold text-gray-900 truncate">
                          {site.name || site.url}
                        </h2>
                      </div>
                      <p className="text-sm text-blue-600 truncate">{site.url}</p>
                      {latestScan && (
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-2">
                          <Clock className="w-4 h-4" />
                          Last scanned: {new Date(latestScan.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      {latestScan && (
                        <>
                          <div className={`px-4 py-2 rounded-lg border ${getScoreColor(latestScan.accessibilityScore)}`}>
                            <div className="text-2xl font-bold">{latestScan.accessibilityScore}</div>
                            <div className="text-xs">Score</div>
                          </div>

                          {trend && (
                            <div className="flex items-center gap-1 text-sm">
                              {trend.direction === 'up' && (
                                <>
                                  <TrendingUp className="w-4 h-4 text-green-600" />
                                  <span className="text-green-700">+{trend.value}</span>
                                </>
                              )}
                              {trend.direction === 'down' && (
                                <>
                                  <TrendingDown className="w-4 h-4 text-red-600" />
                                  <span className="text-red-700">-{trend.value}</span>
                                </>
                              )}
                              {trend.direction === 'same' && (
                                <>
                                  <Minus className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-600">No change</span>
                                </>
                              )}
                            </div>
                          )}
                        </>
                      )}

                      <div className="flex gap-2">
                        <Link
                          href={`/?url=${encodeURIComponent(site.url)}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Re-scan
                        </Link>
                        {latestScan && (
                          <Link
                            href={`/scan/${latestScan.id}`}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1"
                          >
                            View Report
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Scan History */}
                  {site.scans.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Recent Scans</h3>
                      <div className="flex gap-2 overflow-x-auto">
                        {site.scans.map((scan) => (
                          <Link
                            key={scan.id}
                            href={`/scan/${scan.id}`}
                            className="flex-shrink-0 px-3 py-2 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
                          >
                            <div className="text-sm font-medium text-gray-900">
                              Score: {scan.accessibilityScore}
                            </div>
                            <div className="text-xs text-gray-600">
                              {new Date(scan.createdAt).toLocaleDateString()}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export const metadata = {
  title: 'Dashboard - WCAG Shield',
  description: 'Monitor your website accessibility compliance and track improvements over time.',
};
