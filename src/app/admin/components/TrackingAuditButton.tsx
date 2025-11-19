'use client';

import React, { useState } from 'react';

interface AuditStats {
  filesScanned: number;
  totalIssues: number;
  highSeverity: number;
  mediumSeverity: number;
  lowSeverity: number;
}

/**
 * TrackingAuditButton - Admin utility to audit tracking implementation
 * 
 * Scans codebase for UI elements missing data-tracking-id attributes
 * and generates a downloadable HTML report.
 */
export default function TrackingAuditButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [lastAudit, setLastAudit] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AuditStats | null>(null);

  const handleAudit = async () => {
    setIsAuditing(true);
    setError(null);
    setStats(null);
    
    try {
      const response = await fetch('/api/admin/quick-actions/tracking-audit', {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate tracking audit');
      }

      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
        setLastAudit(new Date().toLocaleString());
        
        // Download the HTML report
        if (data.reportHtml) {
          const blob = new Blob([data.reportHtml], { type: 'text/html' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `tracking-audit-${new Date().toISOString().split('T')[0]}.html`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }
        
        setIsModalOpen(false);
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
      
    } catch (err) {
      console.error('Error running tracking audit:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-blue-600 font-medium">📋 Tracking Audit Report</span>
        </div>
        
        <p className="text-sm text-blue-700">
          Scan codebase for UI elements missing tracking attributes and generate a detailed report.
        </p>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isAuditing}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAuditing ? 'Generating...' : 'Generate Audit Report'}
          </button>
          
          {lastAudit && (
            <span className="text-sm text-blue-600">
              Last audit: {lastAudit}
            </span>
          )}
        </div>

        {stats && (
          <div className="text-xs text-blue-700 bg-blue-100 border border-blue-200 rounded p-2">
            <p className="font-semibold">✓ Audit Complete:</p>
            <ul className="list-disc list-inside ml-2 space-y-1 mt-1">
              <li>{stats.filesScanned} files scanned</li>
              <li>{stats.totalIssues} issues found</li>
              <li className="ml-4">
                <span className="text-red-600 font-semibold">{stats.highSeverity}</span> high severity
              </li>
              <li className="ml-4">
                <span className="text-yellow-600 font-semibold">{stats.mediumSeverity}</span> medium severity
              </li>
              <li className="ml-4">
                <span className="text-gray-600">{stats.lowSeverity}</span> low severity
              </li>
            </ul>
            <p className="mt-2 text-blue-700">Report downloaded successfully</p>
          </div>
        )}

        {error && (
          <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2">
            <p className="font-semibold">✗ Error:</p>
            <p>{error}</p>
          </div>
        )}
        
        <div className="text-xs text-blue-600">
          <p>This will scan for:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Buttons without tracking IDs</li>
            <li>Links without tracking IDs</li>
            <li>Forms without tracking IDs</li>
          </ul>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-3xl">📋</span>
              <h3 className="text-xl font-bold text-gray-900">
                Generate Tracking Audit Report
              </h3>
            </div>
            
            <div className="mb-6 space-y-3">
              <p className="text-gray-700">
                This will scan your codebase for UI elements that are missing proper tracking attributes.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-sm font-semibold text-blue-800">What it does:</p>
                <ul className="list-disc list-inside ml-2 space-y-1 text-sm text-blue-700 mt-1">
                  <li>Scans all React/TypeScript files</li>
                  <li>Identifies buttons, links, and forms without tracking</li>
                  <li>Generates detailed HTML report with findings</li>
                  <li>Downloads report to your computer</li>
                </ul>
              </div>
              
              <p className="text-xs text-gray-600">
                This operation is read-only and does not modify any files.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isAuditing}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAudit}
                disabled={isAuditing}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isAuditing ? 'Scanning...' : 'Start Audit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

