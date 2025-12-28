'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, AlertCircle, Info, ExternalLink, Wrench, Clock, CheckCircle2 } from 'lucide-react';
import { SHOPIFY_FIXES, type ShopifyFix } from '@/lib/shopify-fixes';

interface ViolationNode {
  html: string;
  target: string;
  failureSummary: string;
}

interface Violation {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  help: string;
  helpUrl: string;
  wcagTags: string[];
  nodes: ViolationNode[];
}

interface ViolationCardProps {
  violation: Violation;
}

export function ViolationCard({ violation }: ViolationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFix, setShowFix] = useState(true);

  // Get Shopify-specific fix instructions
  const shopifyFix: ShopifyFix | undefined = SHOPIFY_FIXES[violation.id];

  const difficultyStyles = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  };

  const impactStyles = {
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-700',
      icon: AlertTriangle,
      iconColor: 'text-red-600',
    },
    serious: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-700',
      icon: AlertCircle,
      iconColor: 'text-amber-600',
    },
    moderate: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      badge: 'bg-yellow-100 text-yellow-700',
      icon: Info,
      iconColor: 'text-yellow-600',
    },
    minor: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-700',
      icon: Info,
      iconColor: 'text-blue-600',
    },
  };

  const styles = impactStyles[violation.impact];
  const Icon = styles.icon;

  return (
    <div className={`rounded-lg border ${styles.border} ${styles.bg} overflow-hidden`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-start gap-3 text-left hover:bg-black/5 transition-colors"
      >
        <Icon className={`w-5 h-5 ${styles.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`px-2 py-0.5 text-xs font-semibold rounded ${styles.badge} uppercase`}>
              {violation.impact}
            </span>
            <span className="text-xs text-gray-600">
              {violation.nodes.length} instance{violation.nodes.length !== 1 ? 's' : ''}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900">{violation.description}</h3>
          <p className="text-sm text-gray-700 mt-1">{violation.help}</p>
        </div>
        <div className="flex-shrink-0">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 bg-white p-4">
          {/* Shopify Fix Instructions */}
          {shopifyFix && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <button
                onClick={() => setShowFix(!showFix)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-gray-900">How to Fix This (Shopify DIY)</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${difficultyStyles[shopifyFix.difficulty]}`}>
                    {shopifyFix.difficulty}
                  </span>
                  <span className="text-xs text-gray-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {shopifyFix.timeToFix}
                  </span>
                  {showFix ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
                </div>
              </button>

              {showFix && (
                <div className="mt-4 space-y-4">
                  {/* Why It Matters */}
                  <div className="bg-white rounded-lg p-3 border border-green-100">
                    <h5 className="font-medium text-gray-900 text-sm mb-1">Why This Matters</h5>
                    <p className="text-sm text-gray-700">{shopifyFix.whyItMatters}</p>
                  </div>

                  {/* Step by Step Instructions */}
                  {shopifyFix.steps.map((step, stepIdx) => (
                    <div key={stepIdx} className="bg-white rounded-lg p-3 border border-green-100">
                      <h5 className="font-medium text-gray-900 text-sm mb-2">{step.location}</h5>
                      <ol className="list-decimal list-inside space-y-1">
                        {step.instructions.map((instruction, instIdx) => (
                          <li key={instIdx} className="text-sm text-gray-700">{instruction}</li>
                        ))}
                      </ol>
                      {step.tip && (
                        <p className="mt-2 text-sm text-green-700 bg-green-100 rounded p-2">
                          <strong>Tip:</strong> {step.tip}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Examples */}
                  {shopifyFix.examples.length > 0 && (
                    <div className="bg-white rounded-lg p-3 border border-green-100">
                      <h5 className="font-medium text-gray-900 text-sm mb-2">Examples</h5>
                      <div className="space-y-3">
                        {shopifyFix.examples.map((example, exIdx) => (
                          <div key={exIdx} className="text-sm">
                            <div className="flex items-start gap-2 mb-1">
                              <span className="text-red-600 font-medium">Before:</span>
                              <code className="bg-red-50 text-red-700 px-1 rounded text-xs">{example.before}</code>
                            </div>
                            <div className="flex items-start gap-2 mb-1">
                              <span className="text-green-600 font-medium">After:</span>
                              <code className="bg-green-50 text-green-700 px-1 rounded text-xs">{example.after}</code>
                            </div>
                            <p className="text-gray-600 text-xs ml-4">{example.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Can't Fix Warning */}
                  {shopifyFix.cantFix && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-sm text-amber-800">
                        <strong>Note:</strong> {shopifyFix.cantFix}
                      </p>
                    </div>
                  )}

                  {/* Success Indicator */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t border-green-100">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>After fixing, click <strong>Re-scan</strong> above to verify the fix worked.</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {violation.wcagTags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
            <a
              href={violation.helpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center gap-1"
            >
              Learn more about this issue
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <h4 className="font-medium text-gray-900 mb-3">
            Affected Elements ({violation.nodes.length})
          </h4>
          <div className="space-y-3">
            {violation.nodes.map((node, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-sm text-gray-700 mb-2">{node.failureSummary}</p>
                <div className="bg-gray-900 rounded p-2 overflow-x-auto">
                  <code className="text-green-400 text-xs whitespace-pre-wrap break-all">
                    {node.html}
                  </code>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Selector: <code className="bg-gray-200 px-1 rounded">{node.target}</code>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
