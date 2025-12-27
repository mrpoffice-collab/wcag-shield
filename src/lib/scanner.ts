/**
 * WCAG Scanner - Analyzes HTML for accessibility violations
 * Checks against WCAG 2.1 AA success criteria
 */

import * as cheerio from 'cheerio';

export interface AccessibilityViolation {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  help: string;
  helpUrl: string;
  wcagTags: string[];
  nodes: {
    html: string;
    target: string;
    failureSummary: string;
  }[];
}

export interface WcagBreakdown {
  perceivable: { violations: number; score: number };
  operable: { violations: number; score: number };
  understandable: { violations: number; score: number };
  robust: { violations: number; score: number };
}

export interface ScanResult {
  url: string;
  accessibilityScore: number;
  criticalCount: number;
  seriousCount: number;
  moderateCount: number;
  minorCount: number;
  totalViolations: number;
  totalPasses: number;
  violations: AccessibilityViolation[];
  passes: { id: string; description: string }[];
  wcagBreakdown: WcagBreakdown;
  scanVersion: string;
  pageTitle: string;
  pageLanguage: string;
}

type CheerioAPI = ReturnType<typeof cheerio.load>;

// Fetch HTML from URL
async function fetchHTML(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'WCAGShield-Scanner/1.0',
      'Accept': 'text/html,application/xhtml+xml',
    },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
  }

  return await response.text();
}

// Check: Images must have alt text (WCAG 1.1.1)
function checkImageAlt($: CheerioAPI): AccessibilityViolation | null {
  const violations: AccessibilityViolation['nodes'] = [];

  $('img').each((idx, el) => {
    const alt = $(el).attr('alt');
    if (alt === undefined) {
      violations.push({
        html: $.html(el).substring(0, 200),
        target: `img:nth-of-type(${idx + 1})`,
        failureSummary: 'Image does not have an alt attribute',
      });
    }
  });

  if (violations.length === 0) return null;

  return {
    id: 'image-alt',
    impact: 'critical',
    description: 'Images must have alternate text',
    help: 'Ensure every image has an alt attribute that describes its content or purpose. Use alt="" for decorative images.',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html',
    wcagTags: ['wcag2a', 'wcag111'],
    nodes: violations,
  };
}

// Check: Links must have discernible text (WCAG 2.4.4)
function checkLinkName($: CheerioAPI): AccessibilityViolation | null {
  const violations: AccessibilityViolation['nodes'] = [];

  $('a[href]').each((idx, el) => {
    const text = $(el).text().trim();
    const ariaLabel = $(el).attr('aria-label');
    const title = $(el).attr('title');
    const hasImg = $(el).find('img[alt]').length > 0;

    if (!text && !ariaLabel && !title && !hasImg) {
      violations.push({
        html: $.html(el).substring(0, 200),
        target: `a:nth-of-type(${idx + 1})`,
        failureSummary: 'Link has no discernible text',
      });
    }
  });

  if (violations.length === 0) return null;

  return {
    id: 'link-name',
    impact: 'serious',
    description: 'Links must have discernible text',
    help: 'Add text content, aria-label, or title attribute to describe the link destination.',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html',
    wcagTags: ['wcag2a', 'wcag244'],
    nodes: violations,
  };
}

// Check: Buttons must have accessible names (WCAG 4.1.2)
function checkButtonName($: CheerioAPI): AccessibilityViolation | null {
  const violations: AccessibilityViolation['nodes'] = [];

  $('button, [role="button"], input[type="button"], input[type="submit"]').each((idx, el) => {
    const text = $(el).text().trim();
    const ariaLabel = $(el).attr('aria-label');
    const title = $(el).attr('title');
    const value = $(el).attr('value');

    if (!text && !ariaLabel && !title && !value) {
      violations.push({
        html: $.html(el).substring(0, 200),
        target: `button:nth-of-type(${idx + 1})`,
        failureSummary: 'Button has no accessible name',
      });
    }
  });

  if (violations.length === 0) return null;

  return {
    id: 'button-name',
    impact: 'critical',
    description: 'Buttons must have discernible text',
    help: 'Add text content, aria-label, or title attribute to describe the button action.',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html',
    wcagTags: ['wcag2a', 'wcag412'],
    nodes: violations,
  };
}

// Check: Form elements must have labels (WCAG 1.3.1, 4.1.2)
function checkFormLabels($: CheerioAPI): AccessibilityViolation | null {
  const violations: AccessibilityViolation['nodes'] = [];

  $('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="image"]), textarea, select').each((idx, el) => {
    const id = $(el).attr('id');
    const ariaLabel = $(el).attr('aria-label');
    const ariaLabelledBy = $(el).attr('aria-labelledby');
    const placeholder = $(el).attr('placeholder');

    let hasLabel = false;
    if (id) {
      const label = $(`label[for="${id}"]`);
      if (label.length > 0) hasLabel = true;
    }

    // Check if wrapped in label
    if ($(el).closest('label').length > 0) hasLabel = true;

    if (!hasLabel && !ariaLabel && !ariaLabelledBy) {
      violations.push({
        html: $.html(el).substring(0, 200),
        target: `input:nth-of-type(${idx + 1})`,
        failureSummary: placeholder
          ? 'Form element uses placeholder instead of label (placeholder is not accessible)'
          : 'Form element does not have a label',
      });
    }
  });

  if (violations.length === 0) return null;

  return {
    id: 'label',
    impact: 'critical',
    description: 'Form elements must have labels',
    help: 'Add a <label> element with for attribute matching the input id, or use aria-label.',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
    wcagTags: ['wcag2a', 'wcag131', 'wcag412'],
    nodes: violations,
  };
}

// Check: HTML must have lang attribute (WCAG 3.1.1)
function checkHtmlLang($: CheerioAPI): AccessibilityViolation | null {
  const lang = $('html').attr('lang');

  if (!lang) {
    return {
      id: 'html-has-lang',
      impact: 'serious',
      description: '<html> element must have a lang attribute',
      help: 'Add lang="en" (or appropriate language code) to the <html> element.',
      helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html',
      wcagTags: ['wcag2a', 'wcag311'],
      nodes: [{
        html: '<html>',
        target: 'html',
        failureSummary: 'The <html> element does not have a lang attribute',
      }],
    };
  }

  return null;
}

// Check: Heading levels should only increase by one (WCAG 1.3.1)
function checkHeadingOrder($: CheerioAPI): AccessibilityViolation | null {
  const violations: AccessibilityViolation['nodes'] = [];
  let lastLevel = 0;

  $('h1, h2, h3, h4, h5, h6').each((idx, el) => {
    const tagName = el.tagName.toLowerCase();
    const level = parseInt(tagName[1]);

    if (lastLevel > 0 && level > lastLevel + 1) {
      violations.push({
        html: $.html(el).substring(0, 200),
        target: `${tagName}:nth-of-type(${idx + 1})`,
        failureSummary: `Heading level skipped from H${lastLevel} to H${level}`,
      });
    }
    lastLevel = level;
  });

  if (violations.length === 0) return null;

  return {
    id: 'heading-order',
    impact: 'moderate',
    description: 'Heading levels should only increase by one',
    help: 'Ensure heading levels are in logical order (H1 -> H2 -> H3, not H1 -> H3).',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
    wcagTags: ['wcag2a', 'wcag131'],
    nodes: violations,
  };
}

// Check: Headings must not be empty (WCAG 1.3.1)
function checkEmptyHeadings($: CheerioAPI): AccessibilityViolation | null {
  const violations: AccessibilityViolation['nodes'] = [];

  $('h1, h2, h3, h4, h5, h6').each((idx, el) => {
    const tagName = el.tagName.toLowerCase();
    if (!$(el).text().trim()) {
      violations.push({
        html: $.html(el).substring(0, 200),
        target: `${tagName}:nth-of-type(${idx + 1})`,
        failureSummary: 'Heading is empty',
      });
    }
  });

  if (violations.length === 0) return null;

  return {
    id: 'empty-heading',
    impact: 'minor',
    description: 'Headings must not be empty',
    help: 'Add text content to the heading or remove the empty heading element.',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
    wcagTags: ['wcag2a', 'wcag131'],
    nodes: violations,
  };
}

// Check: Documents must have a title (WCAG 2.4.2)
function checkDocumentTitle($: CheerioAPI): AccessibilityViolation | null {
  const title = $('title').text().trim();

  if (!title) {
    return {
      id: 'document-title',
      impact: 'serious',
      description: 'Documents must have <title> element',
      help: 'Add a descriptive <title> element in the <head> section.',
      helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/page-titled.html',
      wcagTags: ['wcag2a', 'wcag242'],
      nodes: [{
        html: '<head>...</head>',
        target: 'head',
        failureSummary: 'Document does not have a title element',
      }],
    };
  }

  return null;
}

// Check: Data tables must have headers (WCAG 1.3.1)
function checkTableHeaders($: CheerioAPI): AccessibilityViolation | null {
  const violations: AccessibilityViolation['nodes'] = [];

  $('table').each((idx, el) => {
    // Skip layout tables
    const role = $(el).attr('role');
    if (role === 'presentation' || role === 'none') return;

    const hasHeaders = $(el).find('th').length > 0;
    const hasCaption = $(el).find('caption').length > 0;

    // Only flag if it looks like a data table (multiple rows/cells)
    const rows = $(el).find('tr').length;
    const cells = $(el).find('td').length;

    if (rows > 1 && cells > 2 && !hasHeaders) {
      violations.push({
        html: $.html(el).substring(0, 300),
        target: `table:nth-of-type(${idx + 1})`,
        failureSummary: 'Data table does not have header cells (<th>)',
      });
    }
  });

  if (violations.length === 0) return null;

  return {
    id: 'table-header',
    impact: 'serious',
    description: 'Data tables must have headers',
    help: 'Add <th> elements to identify row and column headers.',
    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
    wcagTags: ['wcag2a', 'wcag131'],
    nodes: violations,
  };
}

// Calculate accessibility score
function calculateScore(violations: AccessibilityViolation[]): number {
  const weights = {
    critical: 25,
    serious: 15,
    moderate: 8,
    minor: 3,
  };

  let deductions = 0;
  for (const v of violations) {
    // Cap each violation type at 5 instances
    const count = Math.min(v.nodes.length, 5);
    deductions += weights[v.impact] * count;
  }

  // Pass bonus (9 checks total, +2 each, max +15)
  const passCount = 9 - violations.length;
  const passBonus = Math.min(passCount * 2, 15);

  return Math.max(0, Math.min(100, 100 - deductions + passBonus));
}

// Map violations to WCAG principles
function getWcagBreakdown(violations: AccessibilityViolation[]): WcagBreakdown {
  const breakdown: WcagBreakdown = {
    perceivable: { violations: 0, score: 100 },
    operable: { violations: 0, score: 100 },
    understandable: { violations: 0, score: 100 },
    robust: { violations: 0, score: 100 },
  };

  const principleMap: Record<string, keyof WcagBreakdown> = {
    'image-alt': 'perceivable',
    'link-name': 'operable',
    'button-name': 'robust',
    'label': 'understandable',
    'html-has-lang': 'understandable',
    'heading-order': 'perceivable',
    'empty-heading': 'perceivable',
    'document-title': 'operable',
    'table-header': 'perceivable',
  };

  for (const v of violations) {
    const principle = principleMap[v.id] || 'robust';
    breakdown[principle].violations += v.nodes.length;

    const deduction = v.impact === 'critical' ? 20 :
                      v.impact === 'serious' ? 12 :
                      v.impact === 'moderate' ? 6 : 3;
    breakdown[principle].score = Math.max(0, breakdown[principle].score - deduction);
  }

  return breakdown;
}

// Main scan function
export async function scanUrl(url: string): Promise<ScanResult> {
  // Normalize URL
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  // Fetch HTML
  const html = await fetchHTML(url);
  const $ = cheerio.load(html);

  // Get page metadata
  const pageTitle = $('title').text().trim() || 'Unknown';
  const pageLanguage = $('html').attr('lang') || 'unknown';

  // Run all checks
  const checks: { fn: (api: CheerioAPI) => AccessibilityViolation | null; name: string }[] = [
    { fn: checkImageAlt, name: 'image-alt' },
    { fn: checkLinkName, name: 'link-name' },
    { fn: checkButtonName, name: 'button-name' },
    { fn: checkFormLabels, name: 'label' },
    { fn: checkHtmlLang, name: 'html-has-lang' },
    { fn: checkHeadingOrder, name: 'heading-order' },
    { fn: checkEmptyHeadings, name: 'empty-heading' },
    { fn: checkDocumentTitle, name: 'document-title' },
    { fn: checkTableHeaders, name: 'table-header' },
  ];

  const violations: AccessibilityViolation[] = [];
  const passes: { id: string; description: string }[] = [];

  for (const check of checks) {
    const result = check.fn($);
    if (result) {
      violations.push(result);
    } else {
      passes.push({
        id: check.name,
        description: `${check.name} check passed`,
      });
    }
  }

  // Count by severity
  const criticalCount = violations.filter(v => v.impact === 'critical').length;
  const seriousCount = violations.filter(v => v.impact === 'serious').length;
  const moderateCount = violations.filter(v => v.impact === 'moderate').length;
  const minorCount = violations.filter(v => v.impact === 'minor').length;

  // Calculate scores
  const accessibilityScore = calculateScore(violations);
  const wcagBreakdown = getWcagBreakdown(violations);

  return {
    url,
    accessibilityScore,
    criticalCount,
    seriousCount,
    moderateCount,
    minorCount,
    totalViolations: violations.length,
    totalPasses: passes.length,
    violations,
    passes,
    wcagBreakdown,
    scanVersion: '1.0',
    pageTitle,
    pageLanguage,
  };
}
