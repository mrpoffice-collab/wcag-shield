/**
 * WCAG Rules Registry
 *
 * Central source of truth for WCAG checks.
 * Enables version tracking, updates, and self-diagnostics.
 */

export interface WcagRule {
  id: string;
  name: string;
  wcagVersion: '2.0' | '2.1' | '2.2' | '3.0';
  level: 'A' | 'AA' | 'AAA';
  principle: 'perceivable' | 'operable' | 'understandable' | 'robust';
  successCriterion: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  helpUrl: string;
  implemented: boolean;
  addedInVersion: string; // When this rule was added to WCAG Shield
}

// Current scanner version
export const SCANNER_VERSION = '1.0.0';
export const WCAG_TARGET_VERSION = '2.1';
export const WCAG_TARGET_LEVEL: 'A' | 'AA' | 'AAA' = 'AA';

// All known WCAG rules we should support
export const WCAG_RULES: WcagRule[] = [
  // === WCAG 2.0 Rules (implemented) ===
  {
    id: 'image-alt',
    name: 'Non-text Content',
    wcagVersion: '2.0',
    level: 'A',
    principle: 'perceivable',
    successCriterion: '1.1.1',
    impact: 'critical',
    description: 'All non-text content has a text alternative',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html',
    implemented: true,
    addedInVersion: '1.0.0',
  },
  {
    id: 'document-title',
    name: 'Page Titled',
    wcagVersion: '2.0',
    level: 'A',
    principle: 'operable',
    successCriterion: '2.4.2',
    impact: 'serious',
    description: 'Web pages have titles that describe topic or purpose',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/page-titled.html',
    implemented: true,
    addedInVersion: '1.0.0',
  },
  {
    id: 'link-name',
    name: 'Link Purpose (In Context)',
    wcagVersion: '2.0',
    level: 'A',
    principle: 'operable',
    successCriterion: '2.4.4',
    impact: 'serious',
    description: 'Purpose of each link can be determined from link text',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html',
    implemented: true,
    addedInVersion: '1.0.0',
  },
  {
    id: 'html-has-lang',
    name: 'Language of Page',
    wcagVersion: '2.0',
    level: 'A',
    principle: 'understandable',
    successCriterion: '3.1.1',
    impact: 'serious',
    description: 'Default language of each page can be programmatically determined',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html',
    implemented: true,
    addedInVersion: '1.0.0',
  },
  {
    id: 'button-name',
    name: 'Name, Role, Value',
    wcagVersion: '2.0',
    level: 'A',
    principle: 'robust',
    successCriterion: '4.1.2',
    impact: 'critical',
    description: 'User interface components have accessible names',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html',
    implemented: true,
    addedInVersion: '1.0.0',
  },
  {
    id: 'label',
    name: 'Labels or Instructions',
    wcagVersion: '2.0',
    level: 'A',
    principle: 'understandable',
    successCriterion: '3.3.2',
    impact: 'critical',
    description: 'Labels or instructions provided when content requires user input',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html',
    implemented: true,
    addedInVersion: '1.0.0',
  },
  {
    id: 'heading-order',
    name: 'Info and Relationships',
    wcagVersion: '2.0',
    level: 'A',
    principle: 'perceivable',
    successCriterion: '1.3.1',
    impact: 'moderate',
    description: 'Information and relationships conveyed through presentation are programmatically determinable',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
    implemented: true,
    addedInVersion: '1.0.0',
  },
  {
    id: 'empty-heading',
    name: 'Info and Relationships (Empty Headings)',
    wcagVersion: '2.0',
    level: 'A',
    principle: 'perceivable',
    successCriterion: '1.3.1',
    impact: 'minor',
    description: 'Headings must not be empty',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
    implemented: true,
    addedInVersion: '1.0.0',
  },
  {
    id: 'table-header',
    name: 'Info and Relationships (Table Headers)',
    wcagVersion: '2.0',
    level: 'A',
    principle: 'perceivable',
    successCriterion: '1.3.1',
    impact: 'serious',
    description: 'Data tables have header cells',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
    implemented: true,
    addedInVersion: '1.0.0',
  },

  // === WCAG 2.0 AA Rules (NOT YET implemented) ===
  {
    id: 'color-contrast',
    name: 'Contrast (Minimum)',
    wcagVersion: '2.0',
    level: 'AA',
    principle: 'perceivable',
    successCriterion: '1.4.3',
    impact: 'serious',
    description: 'Text has contrast ratio of at least 4.5:1',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html',
    implemented: false, // TODO: Requires color analysis
    addedInVersion: '',
  },
  {
    id: 'resize-text',
    name: 'Resize Text',
    wcagVersion: '2.0',
    level: 'AA',
    principle: 'perceivable',
    successCriterion: '1.4.4',
    impact: 'moderate',
    description: 'Text can be resized without assistive technology up to 200%',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html',
    implemented: false, // TODO: Requires CSS analysis
    addedInVersion: '',
  },
  {
    id: 'focus-visible',
    name: 'Focus Visible',
    wcagVersion: '2.0',
    level: 'AA',
    principle: 'operable',
    successCriterion: '2.4.7',
    impact: 'serious',
    description: 'Keyboard focus indicator is visible',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html',
    implemented: false, // TODO: Requires CSS analysis
    addedInVersion: '',
  },

  // === WCAG 2.1 Rules (NOT YET implemented) ===
  {
    id: 'orientation',
    name: 'Orientation',
    wcagVersion: '2.1',
    level: 'AA',
    principle: 'operable',
    successCriterion: '1.3.4',
    impact: 'moderate',
    description: 'Content not restricted to single display orientation',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/orientation.html',
    implemented: false,
    addedInVersion: '',
  },
  {
    id: 'input-purpose',
    name: 'Identify Input Purpose',
    wcagVersion: '2.1',
    level: 'AA',
    principle: 'perceivable',
    successCriterion: '1.3.5',
    impact: 'moderate',
    description: 'Input fields collecting user info have programmatically determinable purpose',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html',
    implemented: false,
    addedInVersion: '',
  },
  {
    id: 'reflow',
    name: 'Reflow',
    wcagVersion: '2.1',
    level: 'AA',
    principle: 'perceivable',
    successCriterion: '1.4.10',
    impact: 'serious',
    description: 'Content reflows without horizontal scrolling at 320px',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/reflow.html',
    implemented: false,
    addedInVersion: '',
  },
  {
    id: 'text-spacing',
    name: 'Text Spacing',
    wcagVersion: '2.1',
    level: 'AA',
    principle: 'perceivable',
    successCriterion: '1.4.12',
    impact: 'moderate',
    description: 'No loss of content when text spacing is adjusted',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/text-spacing.html',
    implemented: false,
    addedInVersion: '',
  },

  // === WCAG 2.2 Rules (NEW - October 2023) ===
  {
    id: 'focus-not-obscured',
    name: 'Focus Not Obscured (Minimum)',
    wcagVersion: '2.2',
    level: 'AA',
    principle: 'operable',
    successCriterion: '2.4.11',
    impact: 'serious',
    description: 'Focused component is not entirely hidden by author-created content',
    helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html',
    implemented: false,
    addedInVersion: '',
  },
  {
    id: 'dragging-movements',
    name: 'Dragging Movements',
    wcagVersion: '2.2',
    level: 'AA',
    principle: 'operable',
    successCriterion: '2.5.7',
    impact: 'moderate',
    description: 'Dragging functionality has single-pointer alternative',
    helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html',
    implemented: false,
    addedInVersion: '',
  },
  {
    id: 'target-size',
    name: 'Target Size (Minimum)',
    wcagVersion: '2.2',
    level: 'AA',
    principle: 'operable',
    successCriterion: '2.5.8',
    impact: 'moderate',
    description: 'Targets are at least 24x24 CSS pixels',
    helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html',
    implemented: false,
    addedInVersion: '',
  },
  {
    id: 'consistent-help',
    name: 'Consistent Help',
    wcagVersion: '2.2',
    level: 'A',
    principle: 'understandable',
    successCriterion: '3.2.6',
    impact: 'minor',
    description: 'Help mechanisms occur in same relative order on each page',
    helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html',
    implemented: false,
    addedInVersion: '',
  },
  {
    id: 'redundant-entry',
    name: 'Redundant Entry',
    wcagVersion: '2.2',
    level: 'A',
    principle: 'understandable',
    successCriterion: '3.3.7',
    impact: 'moderate',
    description: 'Information previously entered is auto-populated or available for selection',
    helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html',
    implemented: false,
    addedInVersion: '',
  },
  {
    id: 'accessible-authentication',
    name: 'Accessible Authentication (Minimum)',
    wcagVersion: '2.2',
    level: 'AA',
    principle: 'understandable',
    successCriterion: '3.3.8',
    impact: 'serious',
    description: 'Cognitive function test not required for authentication unless alternative exists',
    helpUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html',
    implemented: false,
    addedInVersion: '',
  },
];

// Get rules by implementation status
export function getImplementedRules(): WcagRule[] {
  return WCAG_RULES.filter(r => r.implemented);
}

export function getUnimplementedRules(): WcagRule[] {
  return WCAG_RULES.filter(r => !r.implemented);
}

// Get rules by WCAG version
export function getRulesByVersion(version: string): WcagRule[] {
  return WCAG_RULES.filter(r => r.wcagVersion === version);
}

// Get rules by level
export function getRulesByLevel(level: 'A' | 'AA' | 'AAA'): WcagRule[] {
  const levels = level === 'AAA' ? ['A', 'AA', 'AAA'] :
                 level === 'AA' ? ['A', 'AA'] : ['A'];
  return WCAG_RULES.filter(r => levels.includes(r.level));
}

// Diagnostic: What should we implement to reach target version?
export function getScannerGaps(): {
  targetVersion: string;
  targetLevel: string;
  implemented: number;
  missing: number;
  coverage: number;
  missingRules: WcagRule[];
} {
  const targetRules = WCAG_RULES.filter(r => {
    const versionOk = parseFloat(r.wcagVersion) <= parseFloat(WCAG_TARGET_VERSION);
    const levelOk = WCAG_TARGET_LEVEL === 'AAA' ? true :
                    WCAG_TARGET_LEVEL === 'AA' ? r.level !== 'AAA' :
                    r.level === 'A';
    return versionOk && levelOk;
  });

  const implemented = targetRules.filter(r => r.implemented);
  const missing = targetRules.filter(r => !r.implemented);

  return {
    targetVersion: WCAG_TARGET_VERSION,
    targetLevel: WCAG_TARGET_LEVEL,
    implemented: implemented.length,
    missing: missing.length,
    coverage: Math.round((implemented.length / targetRules.length) * 100),
    missingRules: missing,
  };
}

// Latest WCAG version info (for update checks)
export const WCAG_VERSIONS = {
  '2.0': { released: '2008-12-11', status: 'recommendation' },
  '2.1': { released: '2018-06-05', status: 'recommendation' },
  '2.2': { released: '2023-10-05', status: 'recommendation' },
  '3.0': { released: null, status: 'working-draft' },
};

// Check if we're behind
export function checkForUpdates(): {
  currentVersion: string;
  latestStable: string;
  updateAvailable: boolean;
  newRulesCount: number;
  newRules: WcagRule[];
} {
  const latestStable = '2.2';
  const newRules = WCAG_RULES.filter(r =>
    parseFloat(r.wcagVersion) > parseFloat(WCAG_TARGET_VERSION) &&
    r.level !== 'AAA'
  );

  return {
    currentVersion: WCAG_TARGET_VERSION,
    latestStable,
    updateAvailable: parseFloat(latestStable) > parseFloat(WCAG_TARGET_VERSION),
    newRulesCount: newRules.length,
    newRules,
  };
}
