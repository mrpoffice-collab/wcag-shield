import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1a1a1a',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2px solid #2563eb',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#4b5563',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a1a',
  },
  scoreBox: {
    backgroundColor: '#f3f4f6',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 8,
    textTransform: 'uppercase',
  },
  violation: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fef2f2',
    borderRadius: 4,
    borderLeft: '3px solid #dc2626',
  },
  violationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  violationTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  violationImpact: {
    fontSize: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    textTransform: 'uppercase',
  },
  violationHelp: {
    fontSize: 9,
    color: '#4b5563',
    marginBottom: 5,
  },
  violationCount: {
    fontSize: 8,
    color: '#6b7280',
  },
  pass: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f0fdf4',
    borderRadius: 4,
  },
  passText: {
    fontSize: 9,
    color: '#166534',
  },
  checkmark: {
    width: 12,
    height: 12,
    backgroundColor: '#22c55e',
    borderRadius: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '1px solid #e5e7eb',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#6b7280',
    textAlign: 'center',
  },
  certificationBox: {
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
  },
  certificationTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  certificationText: {
    fontSize: 9,
    color: '#1e40af',
    lineHeight: 1.5,
  },
});

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
  wcagTags: string[];
  nodes: { html: string; target: string; failureSummary: string }[];
}

interface Pass {
  id: string;
  description: string;
}

interface ScanData {
  id: string;
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
  createdAt: string;
}

interface ComplianceReportProps {
  scan: ScanData;
}

export function ComplianceReport({ scan }: ComplianceReportProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#16a34a';
    if (score >= 60) return '#ca8a04';
    return '#dc2626';
  };

  const getImpactStyle = (impact: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      critical: { bg: '#fee2e2', text: '#991b1b' },
      serious: { bg: '#fef3c7', text: '#92400e' },
      moderate: { bg: '#fef9c3', text: '#854d0e' },
      minor: { bg: '#dbeafe', text: '#1e40af' },
    };
    return colors[impact] || colors.minor;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>WCAG Shield</Text>
          <Text style={styles.subtitle}>Accessibility Compliance Report</Text>
        </View>

        {/* Site Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{scan.pageTitle || 'Website Scan'}</Text>
          <Text style={{ color: '#2563eb', marginBottom: 5 }}>{scan.url}</Text>
          <Text style={{ color: '#6b7280', fontSize: 9 }}>
            Scanned: {new Date(scan.createdAt).toLocaleString()}
          </Text>
        </View>

        {/* Score */}
        <View style={styles.scoreBox}>
          <View>
            <Text style={[styles.scoreValue, { color: getScoreColor(scan.accessibilityScore) }]}>
              {scan.accessibilityScore}
            </Text>
            <Text style={styles.scoreLabel}>Accessibility Score</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1a1a1a' }}>
              WCAG 2.1 AA
            </Text>
            <Text style={{ fontSize: 9, color: '#6b7280' }}>
              Compliance Standard
            </Text>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryItem, { backgroundColor: '#fee2e2' }]}>
            <Text style={[styles.summaryValue, { color: '#dc2626' }]}>{scan.criticalCount}</Text>
            <Text style={[styles.summaryLabel, { color: '#991b1b' }]}>Critical</Text>
          </View>
          <View style={[styles.summaryItem, { backgroundColor: '#fef3c7' }]}>
            <Text style={[styles.summaryValue, { color: '#d97706' }]}>{scan.seriousCount}</Text>
            <Text style={[styles.summaryLabel, { color: '#92400e' }]}>Serious</Text>
          </View>
          <View style={[styles.summaryItem, { backgroundColor: '#fef9c3' }]}>
            <Text style={[styles.summaryValue, { color: '#ca8a04' }]}>{scan.moderateCount}</Text>
            <Text style={[styles.summaryLabel, { color: '#854d0e' }]}>Moderate</Text>
          </View>
          <View style={[styles.summaryItem, { backgroundColor: '#dbeafe' }]}>
            <Text style={[styles.summaryValue, { color: '#2563eb' }]}>{scan.minorCount}</Text>
            <Text style={[styles.summaryLabel, { color: '#1e40af' }]}>Minor</Text>
          </View>
        </View>

        {/* Violations */}
        {scan.violations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Issues Found ({scan.totalViolations})</Text>
            {scan.violations.map((v) => {
              const impactStyle = getImpactStyle(v.impact);
              return (
                <View key={v.id} style={styles.violation}>
                  <View style={styles.violationHeader}>
                    <Text style={styles.violationTitle}>{v.description}</Text>
                    <Text style={[styles.violationImpact, { backgroundColor: impactStyle.bg, color: impactStyle.text }]}>
                      {v.impact}
                    </Text>
                  </View>
                  <Text style={styles.violationHelp}>{v.help}</Text>
                  <Text style={styles.violationCount}>
                    {v.nodes.length} instance{v.nodes.length !== 1 ? 's' : ''} | {v.wcagTags.join(', ')}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Passes */}
        {scan.passes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Checks Passed ({scan.totalPasses})</Text>
            {scan.passes.map((p) => (
              <View key={p.id} style={styles.pass}>
                <View style={styles.checkmark} />
                <Text style={styles.passText}>{p.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Certification */}
        <View style={styles.certificationBox}>
          <Text style={styles.certificationTitle}>Audit Trail Certification</Text>
          <Text style={styles.certificationText}>
            This report documents the accessibility scan conducted on {new Date(scan.createdAt).toLocaleDateString()}
            at {new Date(scan.createdAt).toLocaleTimeString()}. The scan evaluated the website against WCAG 2.1 AA
            success criteria and identified {scan.totalViolations} issue{scan.totalViolations !== 1 ? 's' : ''} requiring
            attention. This document serves as evidence of compliance monitoring efforts.
          </Text>
          <Text style={[styles.certificationText, { marginTop: 8 }]}>
            Report ID: {scan.id}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Generated by WCAG Shield | {new Date().toISOString()} | This report is for documentation purposes only and does not constitute legal advice.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
