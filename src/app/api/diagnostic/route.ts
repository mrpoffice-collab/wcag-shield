import { NextResponse } from 'next/server';
import {
  SCANNER_VERSION,
  WCAG_TARGET_VERSION,
  WCAG_TARGET_LEVEL,
  WCAG_VERSIONS,
  getImplementedRules,
  getUnimplementedRules,
  getScannerGaps,
  checkForUpdates,
} from '@/lib/wcag-rules';

/**
 * GET /api/diagnostic
 *
 * Returns scanner health status, rule coverage, and update recommendations.
 * Use this to:
 * 1. Check if scanner needs updating for new WCAG versions
 * 2. See which rules are implemented vs missing
 * 3. Get coverage percentage for target compliance level
 */
export async function GET() {
  const implemented = getImplementedRules();
  const unimplemented = getUnimplementedRules();
  const gaps = getScannerGaps();
  const updates = checkForUpdates();

  const response = {
    scanner: {
      version: SCANNER_VERSION,
      targetWcagVersion: WCAG_TARGET_VERSION,
      targetLevel: WCAG_TARGET_LEVEL,
      lastChecked: new Date().toISOString(),
    },

    coverage: {
      implemented: implemented.length,
      total: implemented.length + gaps.missingRules.length,
      percentage: gaps.coverage,
      status: gaps.coverage >= 90 ? 'excellent' :
              gaps.coverage >= 70 ? 'good' :
              gaps.coverage >= 50 ? 'fair' : 'needs-work',
    },

    implementedRules: implemented.map(r => ({
      id: r.id,
      name: r.name,
      wcagVersion: r.wcagVersion,
      level: r.level,
      successCriterion: r.successCriterion,
    })),

    missingRules: gaps.missingRules.map(r => ({
      id: r.id,
      name: r.name,
      wcagVersion: r.wcagVersion,
      level: r.level,
      successCriterion: r.successCriterion,
      impact: r.impact,
      priority: r.impact === 'critical' ? 1 :
                r.impact === 'serious' ? 2 :
                r.impact === 'moderate' ? 3 : 4,
    })),

    updateStatus: {
      currentVersion: updates.currentVersion,
      latestStable: updates.latestStable,
      updateAvailable: updates.updateAvailable,
      newRulesInLatest: updates.newRulesCount,
      recommendation: updates.updateAvailable
        ? `Update scanner to support WCAG ${updates.latestStable}. ${updates.newRulesCount} new AA-level rules available.`
        : 'Scanner is up to date with latest WCAG stable version.',
    },

    wcagVersions: WCAG_VERSIONS,

    recommendations: generateRecommendations(gaps, updates),
  };

  return NextResponse.json(response);
}

function generateRecommendations(
  gaps: ReturnType<typeof getScannerGaps>,
  updates: ReturnType<typeof checkForUpdates>
): string[] {
  const recommendations: string[] = [];

  // Priority 1: Critical missing rules
  const criticalMissing = gaps.missingRules.filter(r => r.impact === 'critical');
  if (criticalMissing.length > 0) {
    recommendations.push(
      `HIGH PRIORITY: Implement ${criticalMissing.length} critical rules: ${criticalMissing.map(r => r.id).join(', ')}`
    );
  }

  // Priority 2: Version update available
  if (updates.updateAvailable) {
    recommendations.push(
      `NEW VERSION: WCAG ${updates.latestStable} is available with ${updates.newRulesCount} new rules. Consider updating scanner.`
    );
  }

  // Priority 3: Coverage improvements
  if (gaps.coverage < 70) {
    recommendations.push(
      `COVERAGE: Currently at ${gaps.coverage}% of WCAG ${gaps.targetVersion} ${gaps.targetLevel}. Implement ${gaps.missing} more rules to improve.`
    );
  }

  // Priority 4: Specific rule suggestions
  const seriousMissing = gaps.missingRules.filter(r => r.impact === 'serious');
  if (seriousMissing.length > 0) {
    recommendations.push(
      `SERIOUS: ${seriousMissing.length} serious-impact rules not yet implemented: ${seriousMissing.slice(0, 3).map(r => r.name).join(', ')}${seriousMissing.length > 3 ? '...' : ''}`
    );
  }

  // Color contrast is commonly expected
  const hasColorContrast = gaps.missingRules.find(r => r.id === 'color-contrast');
  if (hasColorContrast) {
    recommendations.push(
      `COMMON REQUEST: Color contrast check (1.4.3) is not implemented. This is one of the most commonly failed WCAG criteria.`
    );
  }

  if (recommendations.length === 0) {
    recommendations.push('Scanner is well-configured. No immediate improvements needed.');
  }

  return recommendations;
}
