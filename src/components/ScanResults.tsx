'use client';

import { ScoreGauge } from './ScoreGauge';
import { ViolationCard } from './ViolationCard';
import { CheckCircle2, XCircle, Download, Mail, Clock, Globe } from 'lucide-react';

interface WcagBreakdown {
  perceivable: { violations: number; score: number };
  operable: { violations: number; score: number };
  understandable: { violations: number; score: number };
  robust: { violations: number; score: number };
}

interface Violation {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  help: string;
  helpUrl: string;
  wcagTags: string[];
  nodes: { html: string; target: string; failureSummary: string }[];
}

interface Pass {
  id: string;
  description: string;
}

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
  violations: Violation[];
  passes: Pass[];
  wcagBreakdown: WcagBreakdown;
  pageTitle: string;
  pageLanguage: string;
  createdAt?: string;
}

interface ScanResultsProps {
  result: ScanResult;
  scanId?: string;
}

export function ScanResults({ result, scanId }: ScanResultsProps) {
  const handleExportPDF = () => {
    if (scanId) {
      window.open(`/api/export/${scanId}`, '_blank');
    }
  };

  const handleEmailResults = async () => {
    const email = prompt('Enter your email address to receive the report:');
    if (!email) return;

    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          scanResult: result,
          scanId,
        }),
      });

      if (response.ok) {
        alert('Report sent to your email!');
      } else {
        alert('Failed to send email. Please try again.');
      }
    } catch {
      alert('Failed to send email. Please try again.');
    }
  };

  const principleLabels = {
    perceivable: 'Perceivable',
    operable: 'Operable',
    understandable: 'Understandable',
    robust: 'Robust',
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{result.pageTitle || 'Scan Results'}</h1>
            <p className="text-blue-600 flex items-center gap-1 mt-1">
              <Globe className="w-4 h-4" />
              {result.url}
            </p>
            {result.createdAt && (
              <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                <Clock className="w-4 h-4" />
                {new Date(result.createdAt).toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {scanId && (
              <button
                onClick={handleExportPDF}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            )}
            <button
              onClick={handleEmailResults}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Email Report
            </button>
          </div>
        </div>

        {/* Score and Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex justify-center md:justify-start">
            <ScoreGauge score={result.accessibilityScore} size="lg" />
          </div>

          <div className="md:col-span-2">
            <h2 className="font-semibold text-gray-900 mb-3">Violation Summary</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-red-700">{result.criticalCount}</div>
                <div className="text-sm text-red-600">Critical</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-amber-700">{result.seriousCount}</div>
                <div className="text-sm text-amber-600">Serious</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-yellow-700">{result.moderateCount}</div>
                <div className="text-sm text-yellow-600">Moderate</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-700">{result.minorCount}</div>
                <div className="text-sm text-blue-600">Minor</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WCAG Principles Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">WCAG Principles</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(Object.keys(result.wcagBreakdown) as Array<keyof WcagBreakdown>).map((principle) => {
            const data = result.wcagBreakdown[principle];
            const scoreColor = data.score >= 80 ? 'text-green-700' :
                              data.score >= 60 ? 'text-amber-700' : 'text-red-700';
            return (
              <div key={principle} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-medium text-gray-900 text-sm mb-2">
                  {principleLabels[principle]}
                </h3>
                <div className={`text-2xl font-bold ${scoreColor}`}>{data.score}</div>
                <div className="text-xs text-gray-600">
                  {data.violations} violation{data.violations !== 1 ? 's' : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Violations */}
      {result.violations.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            Issues Found ({result.totalViolations})
          </h2>
          <div className="space-y-3">
            {result.violations.map((violation) => (
              <ViolationCard key={violation.id} violation={violation} />
            ))}
          </div>
        </div>
      )}

      {/* Passes */}
      {result.passes.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Checks Passed ({result.totalPasses})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {result.passes.map((pass) => (
              <div
                key={pass.id}
                className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200"
              >
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-green-700">{pass.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Protect Your Business from ADA Lawsuits
        </h2>
        <p className="text-gray-700 mb-4">
          Start monitoring your site and build a documented audit trail of compliance efforts.
        </p>
        <a
          href="/signup"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start Free Monitoring
        </a>
      </div>
    </div>
  );
}
