import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

interface Finding {
  file: string;
  line: number;
  element: string;
  issue: string;
  severity: 'high' | 'medium' | 'low';
}

/**
 * Tracking Audit API
 * 
 * Scans codebase for UI elements lacking proper tracking attributes
 * Generates HTML report with findings
 * Admin-only endpoint with authentication check
 */
export async function POST() {
  try {
    // Authentication check
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminPassword) {
      const cookieStore = await cookies();
      const authCookie = cookieStore.get('nest-haus-admin-auth');

      if (!authCookie || authCookie.value !== adminPassword) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    const findings: Finding[] = [];
    const patterns = {
      buttonWithoutTracking: /<button(?![^>]*data-tracking-id)[^>]*>/gi,
      linkWithoutTracking: /<Link(?![^>]*data-tracking-id)[^>]*href/gi,
      onClickWithoutId: /onClick={[^}]*}(?![^>]*data-tracking-id)/gi,
      formWithoutTracking: /<form(?![^>]*data-tracking-id)[^>]*>/gi,
    };

    // Recursively scan for TSX/JSX files
    const srcDir = path.join(process.cwd(), 'src');
    const files = getAllTsxJsxFiles(srcDir);

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      const relativePath = path.relative(process.cwd(), filePath);

      lines.forEach((line, index) => {
        // Check for buttons without tracking
        if (patterns.buttonWithoutTracking.test(line) && !line.includes('data-tracking-id')) {
          findings.push({
            file: relativePath,
            line: index + 1,
            element: line.trim().substring(0, 80) + (line.trim().length > 80 ? '...' : ''),
            issue: 'Button without data-tracking-id attribute',
            severity: 'high',
          });
        }

        // Check for Links without tracking
        if (patterns.linkWithoutTracking.test(line) && !line.includes('data-tracking-id')) {
          findings.push({
            file: relativePath,
            line: index + 1,
            element: line.trim().substring(0, 80) + (line.trim().length > 80 ? '...' : ''),
            issue: 'Link without data-tracking-id attribute',
            severity: 'medium',
          });
        }

        // Check for forms without tracking
        if (patterns.formWithoutTracking.test(line) && !line.includes('data-tracking-id')) {
          findings.push({
            file: relativePath,
            line: index + 1,
            element: line.trim().substring(0, 80) + (line.trim().length > 80 ? '...' : ''),
            issue: 'Form without data-tracking-id attribute',
            severity: 'medium',
          });
        }
      });
    }

    // Calculate statistics
    const stats = {
      filesScanned: files.length,
      totalIssues: findings.length,
      highSeverity: findings.filter((f) => f.severity === 'high').length,
      mediumSeverity: findings.filter((f) => f.severity === 'medium').length,
      lowSeverity: findings.filter((f) => f.severity === 'low').length,
    };

    // Generate HTML report
    const reportHtml = generateHtmlReport(findings, stats);

    return NextResponse.json({
      success: true,
      stats,
      reportHtml,
    });

  } catch (error) {
    console.error('Error running tracking audit:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

/**
 * Recursively get all TSX/JSX files in a directory
 */
function getAllTsxJsxFiles(dir: string): string[] {
  const files: string[] = [];
  const excludeDirs = ['node_modules', '.next', 'test', '__tests__'];

  function scanDir(currentDir: string) {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          // Skip excluded directories
          if (!excludeDirs.includes(entry.name)) {
            scanDir(fullPath);
          }
        } else if (entry.isFile()) {
          // Include TSX and JSX files
          if (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx')) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${currentDir}:`, error);
    }
  }

  scanDir(dir);
  return files;
}

function generateHtmlReport(findings: Finding[], stats: { filesScanned: number; totalIssues: number; highSeverity: number; mediumSeverity: number; lowSeverity: number }): string {
  const groupedByFile = findings.reduce((acc, finding) => {
    if (!acc[finding.file]) {
      acc[finding.file] = [];
    }
    acc[finding.file].push(finding);
    return acc;
  }, {} as Record<string, Finding[]>);

  const severityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#dc2626';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#6b7280';
      default:
        return '#000';
    }
  };

  const fileRows = Object.entries(groupedByFile)
    .map(([file, fileFindings]) => {
      const rows = fileFindings
        .map(
          (f) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${f.line}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <span style="color: ${severityColor(f.severity)}; font-weight: bold; text-transform: uppercase; font-size: 12px;">
              ${f.severity}
            </span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${f.issue}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-family: monospace; font-size: 12px; color: #4b5563;">
            ${escapeHtml(f.element)}
          </td>
        </tr>
      `
        )
        .join('');

      return `
      <div style="margin-bottom: 32px;">
        <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px; color: #1f2937;">
          📄 ${file} <span style="color: #6b7280; font-size: 14px;">(${fileFindings.length} issues)</span>
        </h3>
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Line</th>
              <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Severity</th>
              <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Issue</th>
              <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Element</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
    })
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tracking Audit Report - ${new Date().toLocaleDateString()}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: #f9fafb;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    h1 {
      color: #111827;
      margin-bottom: 8px;
    }
    .timestamp {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 32px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .stat-card {
      padding: 20px;
      border-radius: 8px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
    }
    .stat-value {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 4px;
    }
    .stat-label {
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📋 Tracking Audit Report</h1>
    <p class="timestamp">Generated: ${new Date().toLocaleString()}</p>
    
    <div class="summary">
      <div class="stat-card">
        <div class="stat-value">${stats.filesScanned}</div>
        <div class="stat-label">Files Scanned</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.totalIssues}</div>
        <div class="stat-label">Total Issues</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #dc2626;">${stats.highSeverity}</div>
        <div class="stat-label">High Severity</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #f59e0b;">${stats.mediumSeverity}</div>
        <div class="stat-label">Medium Severity</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #6b7280;">${stats.lowSeverity}</div>
        <div class="stat-label">Low Severity</div>
      </div>
    </div>
    
    <h2 style="margin-bottom: 24px;">Findings by File</h2>
    ${fileRows || '<p style="color: #6b7280;">No issues found! All UI elements have proper tracking attributes.</p>'}
  </div>
</body>
</html>
  `;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
