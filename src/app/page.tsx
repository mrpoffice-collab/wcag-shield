'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ScanForm } from '@/components/ScanForm';
import { ScanResults } from '@/components/ScanResults';
import { Shield, CheckCircle, FileText, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';

interface ScanResult {
  id?: string;
  url: string;
  accessibilityScore: number;
  criticalCount: number;
  seriousCount: number;
  moderateCount: number;
  minorCount: number;
  totalViolations: number;
  totalPasses: number;
  violations: Array<{
    id: string;
    impact: 'critical' | 'serious' | 'moderate' | 'minor';
    description: string;
    help: string;
    helpUrl: string;
    wcagTags: string[];
    nodes: { html: string; target: string; failureSummary: string }[];
  }>;
  passes: Array<{ id: string; description: string }>;
  wcagBreakdown: {
    perceivable: { violations: number; score: number };
    operable: { violations: number; score: number };
    understandable: { violations: number; score: number };
    robust: { violations: number; score: number };
  };
  pageTitle: string;
  pageLanguage: string;
}

function HomeContent() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get('url') || '';

  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanId, setScanId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScanComplete = (scanResult: unknown, id: string) => {
    setResult(scanResult as ScanResult);
    setScanId(id);
    window.history.pushState({}, '', `/scan/${id}`);
  };

  if (result && scanId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => {
                setResult(null);
                setScanId(null);
                window.history.pushState({}, '', '/');
              }}
              className="flex items-center gap-2 text-gray-900 hover:text-blue-600 transition-colors"
            >
              <Shield className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-xl">WCAG Shield</span>
            </button>
            <a
              href="/dashboard"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </a>
          </div>
        </header>
        <main className="py-8 px-4">
          <ScanResults result={result} scanId={scanId} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-xl text-gray-900">WCAG Shield</span>
          </div>
          <a
            href="/dashboard"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Dashboard
          </a>
        </div>
      </header>

      <section className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4" />
            2,000+ ADA lawsuits filed in 2024
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Protect Your Website from<br />
            <span className="text-blue-600">Accessibility Lawsuits</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Scan your site for WCAG violations. Build a documented audit trail.
            Get real legal protection—not just a badge.
          </p>

          <div className={isScanning ? 'opacity-75' : ''}>
            <ScanForm
              onScanComplete={handleScanComplete}
              onScanStart={() => setIsScanning(true)}
              initialUrl={initialUrl}
            />
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">69%</div>
              <div className="text-gray-700">of ADA lawsuits target e-commerce</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">$50K+</div>
              <div className="text-gray-700">average settlement cost</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">98%</div>
              <div className="text-gray-700">of sites have violations</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-white border-y border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Why WCAG Shield?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Real Compliance Checks</h3>
              <p className="text-gray-700 text-sm">
                Not an overlay widget. We scan for actual WCAG 2.1 AA violations.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Documented Audit Trail</h3>
              <p className="text-gray-700 text-sm">
                Timestamped history of scans and fixes. Court-ready PDF reports.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Track Your Progress</h3>
              <p className="text-gray-700 text-sm">
                Re-scan anytime to measure improvements. Build evidence of ongoing remediation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-700 mb-4">
              Why Overlay Widgets Do Not Protect You
            </h2>
            <ul className="space-y-2 text-red-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">×</span>
                <span>Overlays do not fix underlying code issues</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">×</span>
                <span>Courts have ruled overlays are not sufficient compliance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">×</span>
                <span>Many accessibility advocates actively criticize overlay products</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">×</span>
                <span>No documented proof of remediation efforts</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-200 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center text-gray-600 text-sm">
          <p>WCAG Shield - Accessibility Compliance Made Simple</p>
          <p className="mt-2">
            Scans based on WCAG 2.1 AA guidelines. Not legal advice.
          </p>
        </div>
      </footer>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomeContent />
    </Suspense>
  );
}
