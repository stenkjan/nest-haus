#!/usr/bin/env node

/**
 * Tracking Audit Script
 * 
 * Scans codebase for UI elements that lack proper tracking attributes
 * Generates an HTML report with findings
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

interface Finding {
  file: string;
  line: number;
  element: string;
  issue: string;
  severity: 'high' | 'medium' | 'low';
}

const findings: Finding[] = [];

// Patterns to scan for
const patterns = {
  buttonWithoutTracking: /<button(?![^>]*data-tracking-id)[^>]*>/gi,
  linkWithoutTracking: /<Link(?![^>]*data-tracking-id)[^>]*href/gi,
  onClickWithoutId: /onClick={[^}]*}(?![^>]*data-tracking-id)/gi,
  formWithoutTracking: /<form(?![^>]*data-tracking-id)[^>]*>/gi
};

/**
 * Scan a file for tracking issues
 */
function scanFile(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Check for buttons without tracking
    if (patterns.buttonWithoutTracking.test(line) && !line.includes('data-tracking-id')) {
      findings.push({
        file: filePath,
        line: index + 1,
        element: line.trim().substring(0, 80) + '...',
        issue: 'Button without data-tracking-id attribute',
        severity: 'high'
      });
    }

    // Check for Links without tracking
    if (patterns.linkWithoutTracking.test(line) && !line.includes('data-tracking-id')) {
      findings.push({
        file: filePath,
        line: index + 1,
        element: line.trim().substring(0, 80) + '...',
        issue: 'Link without data-tracking-id attribute',
        severity: 'medium'
      });
    }

    // Check for forms without tracking
    if (patterns.formWithoutTracking.test(line) && !line.includes('data-tracking-id')) {
      findings.push({
        file: filePath,
        line: index + 1,
        element: line.trim().substring(0, 80) + '...',
        issue: 'Form without data-tracking-id attribute',
        severity: 'medium'
      });
    }
  });
}

/**
 * Generate HTML report
 */
function generateReport(): string {
  const groupedByFile = findings.reduce((acc, finding) => {
    if (!acc[finding.file]) {
      acc[finding.file] = [];
    }
    acc[finding.file].push(finding);
    return acc;
  }, {} as Record<string, Finding[]>);

  const highCount = findings.filter(f => f.severity === 'high').length;
  const mediumCount = findings.filter(f => f.severity === 'medium').length;
  const lowCount = findings.filter(f => f.severity === 'low').length;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tracking Audit Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .header {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 20px;
    }
    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }
    .stat-card.high { border-top: 4px solid #ef4444; }
    .stat-card.medium { border-top: 4px solid #f59e0b; }
    .stat-card.low { border-top: 4px solid #10b981; }
    .stat-number {
      font-size: 3em;
      font-weight: bold;
      margin: 10px 0;
    }
    .file-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    .file-path {
      font-weight: bold;
      color: #2563eb;
      margin-bottom: 15px;
      font-size: 1.1em;
    }
    .finding {
      padding: 15px;
      margin-bottom: 10px;
      border-left: 4px solid;
      background: #f9fafb;
      border-radius: 4px;
    }
    .finding.high { border-left-color: #ef4444; }
    .finding.medium { border-left-color: #f59e0b; }
    .finding.low { border-left-color: #10b981; }
    .finding-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .severity-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75em;
      font-weight: bold;
      text-transform: uppercase;
    }
    .severity-badge.high { background: #fee2e2; color: #991b1b; }
    .severity-badge.medium { background: #fef3c7; color: #92400e; }
    .severity-badge.low { background: #d1fae5; color: #065f46; }
    .issue-text {
      color: #374151;
      margin-bottom: 8px;
    }
    .code-snippet {
      background: #1f2937;
      color: #f3f4f6;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
      font-family: "Monaco", "Courier New", monospace;
      font-size: 0.9em;
    }
    .line-number {
      color: #9ca3af;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔍 Tracking Audit Report</h1>
    <p>Generated: ${new Date().toLocaleString()}</p>
    <p>Total files scanned: ${Object.keys(groupedByFile).length}</p>
    <p>Total issues found: ${findings.length}</p>
  </div>

  <div class="stats">
    <div class="stat-card high">
      <div>High Severity</div>
      <div class="stat-number">${highCount}</div>
      <div>Critical issues requiring immediate attention</div>
    </div>
    <div class="stat-card medium">
      <div>Medium Severity</div>
      <div class="stat-number">${mediumCount}</div>
      <div>Important but not critical</div>
    </div>
    <div class="stat-card low">
      <div>Low Severity</div>
      <div class="stat-number">${lowCount}</div>
      <div>Minor improvements</div>
    </div>
  </div>

  ${Object.entries(groupedByFile).map(([file, fileFindings]) => `
    <div class="file-section">
      <div class="file-path">${file}</div>
      ${fileFindings.map(finding => `
        <div class="finding ${finding.severity}">
          <div class="finding-header">
            <span class="line-number">Line ${finding.line}</span>
            <span class="severity-badge ${finding.severity}">${finding.severity}</span>
          </div>
          <div class="issue-text">${finding.issue}</div>
          <div class="code-snippet">${finding.element.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        </div>
      `).join('')}
    </div>
  `).join('')}

  ${findings.length === 0 ? `
    <div class="file-section" style="text-align: center; padding: 60px;">
      <h2 style="color: #10b981;">✅ No tracking issues found!</h2>
      <p style="color: #6b7280;">All interactive elements have proper tracking attributes.</p>
    </div>
  ` : ''}

</body>
</html>
  `;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Starting tracking audit...\n');

  // Scan configurator components
  const configuratorFiles = await glob('src/app/konfigurator/**/*.{tsx,ts}', {
    ignore: ['**/*.test.*', '**/node_modules/**']
  });

  // Scan content pages
  const contentFiles = await glob('src/app/(content)/**/*.{tsx,ts}', {
    ignore: ['**/*.test.*', '**/node_modules/**']
  });

  // Scan shared components
  const componentFiles = await glob('src/components/**/*.{tsx,ts}', {
    ignore: ['**/*.test.*', '**/node_modules/**']
  });

  const allFiles = [...configuratorFiles, ...contentFiles, ...componentFiles];

  console.log(`📂 Scanning ${allFiles.length} files...\n`);

  allFiles.forEach(file => {
    scanFile(file);
  });

  console.log(`✅ Scan complete!\n`);
  console.log(`📊 Found ${findings.length} issues across ${Object.keys(
    findings.reduce((acc, f) => ({ ...acc, [f.file]: true }), {})
  ).length} files\n`);

  // Generate report
  const report = generateReport();
  const reportPath = path.join(process.cwd(), 'docs', 'tracking-audit-report.html');

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, report);

  console.log(`📄 Report generated: ${reportPath}\n`);
  console.log(`🌐 Open the report in your browser to view details.\n`);
}

// Run the script
main().catch(error => {
  console.error('❌ Audit failed:', error);
  process.exit(1);
});

export {};

