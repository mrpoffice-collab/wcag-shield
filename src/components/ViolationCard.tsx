'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, AlertCircle, Info, ExternalLink } from 'lucide-react';

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
