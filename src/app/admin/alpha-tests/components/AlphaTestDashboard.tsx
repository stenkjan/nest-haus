"use client";

import React, { useState, useEffect, useCallback } from "react";
// Using emoji icons instead of lucide-react to avoid dependency issues

interface TestSummary {
  totalTests: number;
  completedTests: number;
  abandonedTests: number;
  errorTests: number;
  completionRate: number;
  averageRating: number;
  averageDuration: number;
  avgTestDuration: number;
  avgErrorRate: number;
  avgCompletionRate: number;
}

interface QuestionAnalysis {
  questionId: string;
  questionText: string;
  questionType: string;
  averageRating?: number;
  responseCount: number;
  responses: Array<Record<string, unknown>>;
}

interface RecentTest {
  id: string;
  testId: string;
  status: string;
  participantName: string;
  startedAt: string;
  completedAt?: string;
  overallRating?: number;
  completionRate?: number;
  errorCount: number;
  duration?: number;
  deviceType: string;
  interactionCount?: number;
}

interface _SessionTracking {
  totalInteractions: number;
  pageVisits: number;
  buttonClicks: number;
  configuratorSelections: number;
  formInteractions: number;
  avgPagesPerSession: number;
  sessionsWithTracking: number;
}

interface QualitativeInsights {
  totalResponses: number;
  averageLength: number;
  keyThemes: Array<{ theme: string; count: number; examples: string[] }>;
  sentiment: { positive: number; neutral: number; negative: number };
}

interface PerformanceMetrics {
  testDurations: number[];
  errorRates: number[];
  completionRates: number[];
  averages: {
    duration: number;
    errorRate: number;
    completionRate: number;
  };
}

interface TestDetails {
  id: string;
  testId: string;
  status: string;
  participantName?: string;
  overallRating?: number;
  totalDuration?: number;
  completionRate?: number;
  deviceInfo?: Record<string, unknown>;
  responses?: Array<Record<string, unknown>>;
  interactions?: Array<Record<string, unknown>>;
}

interface TestAnalytics {
  summary: TestSummary;
  sessionTracking?: {
    totalInteractions: number;
    pageVisits: number;
    buttonClicks: number;
    configuratorSelections: number;
    formInteractions: number;
    avgPagesPerSession: number;
    sessionsWithTracking: number;
  };
  configurationAnalytics?: {
    configSelections: Array<{
      category: string;
      value: string;
      name: string;
      count: number;
    }>;
    pageTimeData: Array<{
      path: string;
      title: string;
      totalTime: number;
      avgTime: number;
      visits: number;
      sessions: number;
    }>;
    clickedPages: Array<{
      path: string;
      title: string;
      totalTime: number;
      avgTime: number;
      visits: number;
      sessions: number;
    }>;
    sectionTimeData: Array<{
      section: string;
      path: string;
      totalTime: number;
      avgTime: number;
      visits: number;
      sessions: number;
    }>;
  };
  questionAnalysis: QuestionAnalysis[];
  deviceStats: Record<string, number>;
  browserStats: Record<string, number>;
  platformStats: Record<string, number>;
  performanceMetrics: PerformanceMetrics;
  qualitativeInsights: QualitativeInsights;
  errorAnalysis: {
    totalErrors: number;
    consoleErrors: number;
    interactionErrors: number;
  };
  recentTests: RecentTest[];
  timeRange: string;
  generatedAt: string;
}

// Configuration Analytics Component
interface ConfigurationAnalyticsProps {
  analytics: TestAnalytics | null;
}

// Override outdated question texts coming from historical analytics payloads
const QUESTION_TEXT_OVERRIDES: Record<string, string> = {
  "purchase-to-move-in-process":
    "Erkläre den Prozess von Kauf bis zum bezugsfertigen Haus in eigenen Worten.",
  "window-wall-positioning":
    "Wie wird die Positionierung von Fenstern und Innenwänden festgelegt?",
};

const getOverriddenQuestionText = (questionId: string, original: string) =>
  QUESTION_TEXT_OVERRIDES[questionId] ?? original;

interface _ConfigSelection {
  category: string;
  value: string;
  name: string;
  count: number;
}

interface PageTimeData {
  path: string;
  title: string;
  totalTime: number;
  avgTime: number;
  visits: number;
}

interface SectionTimeData {
  section: string;
  path: string;
  totalTime: number;
  avgTime: number;
  visits: number;
}

function ConfigurationAnalytics({ analytics }: ConfigurationAnalyticsProps) {
  const [expandedBox, setExpandedBox] = useState<string | null>(null);

  if (!analytics) return null;

  // Use data from API
  const configSelections =
    analytics?.configurationAnalytics?.configSelections || [];
  const pageTimeData = analytics?.configurationAnalytics?.pageTimeData || [];
  const clickedPages = analytics?.configurationAnalytics?.clickedPages || [];
  const sectionTimeData =
    analytics?.configurationAnalytics?.sectionTimeData || [];

  // Debug logging
  console.log("🔍 Configuration Analytics Data:", {
    configSelections: configSelections.length,
    pageTimeData: pageTimeData.length,
    clickedPages: clickedPages.length,
    sectionTimeData: sectionTimeData.length,
    pageTimeDataSample: pageTimeData.slice(0, 2),
    clickedPagesSample: clickedPages.slice(0, 2),
  });

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${remainingSeconds}s`;
  };

  // Calculate category totals for percentage calculation
  const categoryTotals = configSelections.reduce(
    (acc, selection) => {
      acc[selection.category] =
        (acc[selection.category] || 0) + selection.count;
      return acc;
    },
    {} as Record<string, number>
  );

  const renderExpandableBox = <T,>(
    title: string,
    icon: string,
    mainValue: string,
    subtitle: string,
    boxId: string,
    data: T[],
    renderItem: (item: T, _index: number) => React.ReactNode
  ) => {
    const isExpanded = expandedBox === boxId;
    const displayData = isExpanded ? data.slice(0, 10) : data.slice(0, 1);

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div
          className="cursor-pointer"
          onClick={() => setExpandedBox(isExpanded ? null : boxId)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {icon} {title}
            </h3>
            <button className="text-blue-600 hover:text-blue-800">
              {isExpanded ? "▼" : "▶"}
            </button>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {mainValue}
          </div>
          <div className="text-sm text-gray-600">{subtitle}</div>
        </div>

        {isExpanded && (
          <div className="mt-6 space-y-3">
            <h4 className="font-medium text-gray-800">Top 10 Results</h4>
            <div className="space-y-2">
              {displayData.map((item, index) => renderItem(item, index))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Configuration Selections Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          ⚙️ Configuration Selection Analytics
        </h3>

        {configSelections.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Selection
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % of Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % of Total Tests
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {configSelections.map((selection, _index) => {
                  const testPercentage = Math.round(
                    (selection.count / analytics.summary.totalTests) * 100
                  );
                  const categoryPercentage = Math.round(
                    (selection.count / categoryTotals[selection.category]) * 100
                  );
                  return (
                    <tr key={`${selection.category}-${selection.value}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                        {selection.category.replace("_", " ")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {selection.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {selection.count}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-50 text-gray-500">
                          {categoryPercentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {testPercentage}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">⚙️</div>
            <div className="text-lg font-medium mb-2">
              No Configuration Data
            </div>
            <div className="text-sm">
              Configuration selections will appear here once users interact with
              the configurator.
            </div>
          </div>
        )}
      </div>

      {/* Analytics Boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Page Time Analytics */}
        {renderExpandableBox(
          "Most Time Spent",
          "⏱️",
          pageTimeData[0]?.title || "No Data",
          pageTimeData[0]
            ? `Avg: ${formatTime(pageTimeData[0].avgTime)}`
            : "No page data available",
          "page-time",
          pageTimeData,
          (item: PageTimeData, index: number) => (
            <div
              key={item.path}
              className="flex items-center justify-between p-3 bg-gray-50 rounded"
            >
              <div>
                <div className="font-medium text-gray-900">
                  #{index + 1} {item.title}
                </div>
                <div className="text-sm text-gray-500">{item.path}</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-blue-600">
                  {formatTime(item.avgTime)}
                </div>
                <div className="text-xs text-gray-500">
                  {item.visits} visits
                </div>
              </div>
            </div>
          )
        )}

        {/* Most Clicked Pages */}
        {renderExpandableBox(
          "Most Clicked Pages",
          "🖱️",
          clickedPages[0]?.title || "No Data",
          clickedPages[0]
            ? `${clickedPages[0].visits} clicks`
            : "No click data available",
          "clicked-pages",
          clickedPages,
          (item: PageTimeData, index: number) => (
            <div
              key={item.path}
              className="flex items-center justify-between p-3 bg-gray-50 rounded"
            >
              <div>
                <div className="font-medium text-gray-900">
                  #{index + 1} {item.title}
                </div>
                <div className="text-sm text-gray-500">{item.path}</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-green-600">
                  {item.visits} clicks
                </div>
              </div>
            </div>
          )
        )}

        {/* Section Routes Analytics */}
        {renderExpandableBox(
          "Section Time Analytics",
          "📍",
          sectionTimeData[0]?.section || "No Data",
          sectionTimeData[0]
            ? `Avg: ${formatTime(sectionTimeData[0].avgTime)}`
            : "No section data available",
          "section-time",
          sectionTimeData,
          (item: SectionTimeData, index: number) => (
            <div
              key={item.path}
              className="flex items-center justify-between p-3 bg-gray-50 rounded"
            >
              <div>
                <div className="font-medium text-gray-900">
                  #{index + 1} {item.section}
                </div>
                <div className="text-sm text-gray-500">{item.path}</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-purple-600">
                  {formatTime(item.avgTime)}
                </div>
                <div className="text-xs text-gray-500">
                  {item.visits} visits
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default function AlphaTestDashboard() {
  const [analytics, setAnalytics] = useState<TestAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("7d");
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [_selectedTest, setSelectedTest] = useState<string | null>(null);
  const [testDetails, setTestDetails] = useState<TestDetails | null>(null);
  const [showTestModal, setShowTestModal] = useState(false);
  const [isQuestionRatingsExpanded, setIsQuestionRatingsExpanded] =
    useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [commentsData, setCommentsData] = useState<Array<{
    testId: string;
    participantName: string | null;
    comments: string;
    createdAt: string;
  }>>([]);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedComments, setSelectedComments] = useState<{
    testId: string;
    participantName: string;
    comments: string;
    createdAt: string;
  } | null>(null);
  const [deletingTests, setDeletingTests] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    testId: string;
    participantName: string;
  } | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [exportingAllPDFs, setExportingAllPDFs] = useState(false);

  // Helper function to extract key findings from responses
  const extractKeyFindings = (
    responses: Array<Record<string, unknown>>
  ): string[] => {
    const allText = responses
      .map((r) => String(r.value || "").trim())
      .filter((text) => text.length > 2)
      .join(" ");

    if (!allText) return [];

    // Simple keyword extraction - split by common separators and get frequent words
    const words = allText
      .toLowerCase()
      .replace(/[.,!?;()]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .filter(
        (word) =>
          ![
            "dass",
            "eine",
            "sind",
            "haben",
            "kann",
            "wird",
            "auch",
            "sehr",
            "mehr",
            "aber",
            "oder",
            "und",
            "der",
            "die",
            "das",
            "ein",
            "ist",
            "für",
            "mit",
            "auf",
            "von",
            "zu",
            "im",
            "es",
            "sich",
            "nicht",
            "war",
            "bei",
            "ich",
            "sie",
            "er",
            "wir",
            "ihr",
          ].includes(word)
      );

    // Count word frequency
    const wordCount = words.reduce((acc: Record<string, number>, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    // Return top 5-6 most frequent words
    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([word]) => word);
  };

  // Helper function to generate summary
  const generateSummary = (
    responses: Array<Record<string, unknown>>
  ): string => {
    const validResponses = responses
      .map((r) => String(r.value || "").trim())
      .filter((text) => text.length > 5);

    if (validResponses.length === 0) return "Keine Antworten verfügbar";
    if (validResponses.length === 1) return validResponses[0];

    // For multiple responses, create a simple summary
    const commonThemes = extractKeyFindings(responses);
    const avgLength = Math.round(
      validResponses.reduce((sum, text) => sum + text.length, 0) /
      validResponses.length
    );

    return `${validResponses.length} Antworten mit durchschnittlich ${avgLength} Zeichen. Häufige Themen: ${commonThemes.slice(0, 3).join(", ")}.`;
  };

  // Helper function to detect tendency with improved context awareness (German-focused)
  const detectTendency = (
    questionId: string,
    questionText: string,
    responses: Array<Record<string, unknown>>
  ): { tendency: string; explanation: string; percentage: number } => {
    const texts = responses
      .map((r) =>
        String(r.value || "")
          .trim()
          .toLowerCase()
      )
      .filter((t) => t.length > 0);

    if (texts.length === 0) {
      return {
        tendency: "Neutral",
        explanation: "Keine Antworten verfügbar",
        percentage: 0,
      };
    }

    const q = questionText.toLowerCase();

    // Question intent classification
    const isMissing =
      q.includes("vermisst") ||
      q.includes("zusätzlich") ||
      q.includes("genauer");
    const isProblems =
      q.includes("problem") ||
      q.includes("herausforderung") ||
      q.includes("schwierig");
    const isConfusing =
      q.includes("irritiert") ||
      q.includes("verunsichert") ||
      q.includes("verwirrend");
    const isUnclear = q.includes("unklar") || q.includes("fragezeichen");
    const isDisplay =
      q.includes("darstellung") ||
      q.includes("erkennbar") ||
      q.includes("lade");

    // Generic lexicons (German)
    const yesWords = ["ja", "jep", "jo", "y", "yes"]; // rarely used, but keep
    const noWords = [
      "nein",
      "kein",
      "keine",
      "keines",
      "nichts",
      "nix",
      "keinerlei",
    ];

    const positiveCues = [
      "gut",
      "super",
      "klar",
      "verständlich",
      "übersichtlich",
      "alles",
      "erkennbar",
      "passt",
      "ok",
      "in ordnung",
    ];

    const negativeCues = [
      "schlecht",
      "probleme",
      "problem",
      "lade",
      "fehlt",
      "fehlend",
      "unklar",
      "verwirrend",
      "schwierig",
      "irritiert",
      "verunsichert",
      "nicht sichtbar",
      "nicht erkennbar",
    ];

    // Special handling: words that imply mixed/uncertain
    const mixedCues = [
      "jein",
      "teilweise",
      "manchmal",
      "kommt drauf an",
      "teils",
    ];

    // Per-intent polarity mapping where "no/none" should be treated as positive
    const noMeansPositive =
      isMissing || isProblems || isConfusing || isUnclear || isDisplay;

    let pos = 0;
    let neg = 0;
    let neu = 0;

    const countWords = (t: string) => t.split(/\s+/).filter(Boolean).length;
    const looksLikeSteps = (t: string) =>
      /(\b1\.|\b2\.|\b3\.|\b4\.|\b5\.|\bfirst\b|\bzweit|\bdritt)/i.test(t);

    // Specialized handling for instructional questions
    if (
      questionId === "advantages-disadvantages" ||
      questionId === "purchase-to-move-in-process" ||
      questionId === "window-wall-positioning" ||
      questionId === "house-categorization" ||
      questionId === "additional-costs"
    ) {
      for (const t of texts) {
        const w = countWords(t);

        if (questionId === "advantages-disadvantages") {
          // Detailed listing desired: long answers positive, very short negative
          if (w >= 20) pos++;
          else if (w <= 6) neg++;
          else neu++;
          continue;
        }

        if (questionId === "purchase-to-move-in-process") {
          // Detailed multi-step description desired
          if (w >= 18 || looksLikeSteps(t)) pos++;
          else if (w <= 6) neg++;
          else neu++;
          continue;
        }

        if (questionId === "window-wall-positioning") {
          // Short answer acceptable, empty negative
          if (w === 0) neg++;
          else if (w >= 2) pos++;
          else neu++;
          continue;
        }

        if (questionId === "house-categorization") {
          // Short single-word answer fine, empty negative
          if (w === 0) neg++;
          else pos++;
          continue;
        }

        if (questionId === "additional-costs") {
          // At least one sentence desired; 1-2 words negative
          if (w <= 2) neg++;
          else if (w >= 8) pos++;
          else neu++;
          continue;
        }
      }

      const totalS = Math.max(1, pos + neg + neu);
      const pPctS = Math.round((pos / totalS) * 100);
      const nPctS = Math.round((neg / totalS) * 100);
      const uPctS = Math.round((neu / totalS) * 100);
      if (pos > neg && pos >= neu)
        return {
          tendency: "Positiv",
          explanation: `${pPctS}% positive Antworten (${pos}/${totalS})`,
          percentage: pPctS,
        };
      if (neg > pos && neg >= neu)
        return {
          tendency: "Negativ",
          explanation: `${nPctS}% negative Antworten (${neg}/${totalS})`,
          percentage: nPctS,
        };
      return {
        tendency: "Neutral",
        explanation: `${uPctS}% neutrale/unklare Antworten (${neu}/${totalS})`,
        percentage: uPctS,
      };
    }

    const countMatches = (text: string, list: string[]) =>
      list.reduce((acc, w) => acc + (text.includes(w) ? 1 : 0), 0);

    for (const t of texts) {
      // quick exits
      if (mixedCues.some((m) => t.includes(m))) {
        neu++;
        continue;
      }

      const hasNo = noWords.some(
        (n) =>
          // treat stand-alone "kein/keine/keines" or in tokenized forms
          t === n ||
          t.startsWith(n + " ") ||
          t.includes(" " + n + " ") ||
          t.endsWith(" " + n)
      );

      // If question intent is of type "problems/missing/unclear/display",
      // then "no/none" answers are positive (no problems / nothing missing)
      if (hasNo && noMeansPositive) {
        pos++;
        continue;
      }

      // Token-based polarity counts
      const pCount =
        countMatches(t, positiveCues) +
        (yesWords.some((y) => t.includes(y)) ? 1 : 0);
      const nCount = countMatches(t, negativeCues);

      if (pCount > 0 && nCount === 0) {
        pos++;
      } else if (nCount > 0 && pCount === 0) {
        neg++;
      } else if (nCount > 0 && pCount > 0) {
        // Mixed within a single answer: decide by ratio; fall back to Neutral if close
        const total = pCount + nCount;
        const ratio = pCount / total;
        if (ratio >= 0.66) pos++;
        else if (ratio <= 0.33) neg++;
        else neu++;
      } else {
        // Unknown/short reply handling
        if (t.length <= 3) {
          // Short tokens like "ok", "gut", "top" -> treat if known, else neutral
          if (t === "ok" || t === "gut" || t === "top") pos++;
          else neu++;
        } else {
          neu++;
        }
      }
    }

    const total = pos + neg + neu;
    const toPct = (v: number) => Math.round((v / Math.max(1, total)) * 100);
    const pPct = toPct(pos);
    const nPct = toPct(neg);
    const uPct = toPct(neu);

    // Decide tendency with clear priority, otherwise mark as mixed
    if (pos > neg && pos >= neu) {
      return {
        tendency: "Positiv",
        explanation: `${pPct}% positive Antworten (${pos}/${total})`,
        percentage: pPct,
      };
    }
    if (neg > pos && neg >= neu) {
      return {
        tendency: "Negativ",
        explanation: `${nPct}% negative Antworten (${neg}/${total})`,
        percentage: nPct,
      };
    }
    if (neu >= pos && neu >= neg) {
      return {
        tendency: "Neutral",
        explanation: `${uPct}% neutrale/unklare Antworten (${neu}/${total})`,
        percentage: uPct,
      };
    }

    return {
      tendency: "Gemischt",
      explanation: `Gemischte Antworten: ${pPct}% positiv, ${nPct}% negativ, ${uPct}% neutral`,
      percentage: Math.max(pPct, nPct, uPct),
    };
  };

  const toggleQuestionExpansion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      console.log("📊 Fetching analytics for timeRange:", timeRange);

      const response = await fetch(
        `/api/admin/usability-tests?timeRange=${timeRange}`
      );
      const data = await response.json();

      console.log("📊 Analytics API response:", data);

      if (data.success) {
        console.log("📊 Analytics data received:", data.data);
        setAnalytics(data.data);
        setError(null);
      } else {
        console.error("📊 Analytics API error:", data.error);
        setError(data.error || "Failed to fetch analytics");
      }
    } catch (err) {
      console.error("📊 Analytics fetch error:", err);
      setError("Network error while fetching analytics");
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalytics();
    fetchCommentsData();
  }, [timeRange, fetchAnalytics]);

  const fetchCommentsData = async () => {
    try {
      const response = await fetch("/api/usability-test/comments");
      const result = await response.json();

      if (result.success) {
        setCommentsData(result.data);
      } else {
        console.error("Failed to fetch comments:", result.error);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const resetTestData = async () => {
    if (
      !confirm(
        "⚠️ Are you sure you want to reset ALL test data? This action cannot be undone!"
      )
    ) {
      return;
    }

    try {
      setIsResetting(true);
      setError(null);
      setResetSuccess(null);

      const response = await fetch("/api/admin/usability-tests", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to reset test data");
      }

      setResetSuccess(
        `Successfully deleted ${result.deletedCounts.total} records (${result.deletedCounts.tests} tests, ${result.deletedCounts.responses} responses, ${result.deletedCounts.interactions} interactions)`
      );

      // Refresh analytics after reset
      await fetchAnalytics();

      // Clear success message after 5 seconds
      setTimeout(() => setResetSuccess(null), 5000);
    } catch (err) {
      console.error("Failed to reset test data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to reset test data"
      );
    } finally {
      setIsResetting(false);
    }
  };

  const viewTestDetails = async (testId: string) => {
    try {
      setSelectedTest(testId);
      console.log("📊 Fetching detailed test data for:", testId);

      const response = await fetch(
        `/api/admin/usability-tests?testId=${testId}`
      );
      const result = await response.json();

      if (result.success) {
        console.log("🔍 Raw API response:", result.data);

        // Flatten the nested structure from API
        const flattenedTestDetails = {
          ...result.data.test,
          responses: result.data.responsesByStep
            ? Object.values(result.data.responsesByStep).flat()
            : [],
          interactions: result.data.interactions || [],
          timeline: result.data.timeline || [],
        };

        console.log("🔍 Flattened test details:", flattenedTestDetails);
        setTestDetails(flattenedTestDetails);
        setShowTestModal(true);
      } else {
        console.error("Failed to fetch test details:", result.error);
      }
    } catch (error) {
      console.error("Error fetching test details:", error);
    }
  };

  const exportToExcel = async () => {
    try {
      console.log("📊 Exporting test data to Excel...");

      // Fetch all detailed test data
      const response = await fetch(
        `/api/admin/usability-tests/export?format=excel&timeRange=${timeRange}`
      );
      const blob = await response.blob();

      if (response.ok) {
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `alpha-test-results-${timeRange}-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log("✅ Excel export completed successfully");
      } else {
        console.error("❌ Excel export failed");
        alert("Failed to export Excel file. Please try again.");
      }
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Failed to export Excel file. Please try again.");
    }
  };

  const exportToPDF = async () => {
    try {
      console.log("📄 Exporting dashboard to PDF...");

      // Use browser's print functionality to generate PDF
      const printContent = document.getElementById("admin-dashboard-content");
      if (printContent) {
        const originalTitle = document.title;
        document.title = `Alpha Test Dashboard - ${timeRange} - ${new Date().toLocaleDateString()}`;

        // Add print styles
        const printStyles = `
          <style>
            @media print {
              body * { visibility: hidden; }
              #admin-dashboard-content, #admin-dashboard-content * { visibility: visible; }
              #admin-dashboard-content { position: absolute; left: 0; top: 0; width: 100%; }
              .no-print { display: none !important; }
              .bg-gradient-to-br { background: #f3f4f6 !important; }
              .shadow { box-shadow: none !important; border: 1px solid #e5e7eb !important; }
            }
          </style>
        `;

        const head = document.head.innerHTML;
        document.head.innerHTML = head + printStyles;

        window.print();

        // Restore original title
        document.title = originalTitle;

        console.log("✅ PDF export initiated");
      }
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      alert("Failed to export PDF. Please try again.");
    }
  };

  const exportTestToPDF = async (testId: string, participantName?: string) => {
    try {
      console.log("📄 Exporting individual test to PDF:", testId);

      // Open PDF generation page in new window
      const pdfUrl = `/api/admin/usability-tests/pdf?testId=${testId}`;
      const printWindow = window.open(pdfUrl, '_blank', 'width=800,height=600');

      if (!printWindow) {
        alert("Please allow popups to generate PDF reports.");
        return;
      }

      console.log("✅ PDF generation window opened");
    } catch (error) {
      console.error("Error exporting test to PDF:", error);
      alert("Failed to export test PDF. Please try again.");
    }
  };

  const exportAllTestsToPDF = async () => {
    try {
      setExportingAllPDFs(true);
      console.log("📄 Exporting all tests to bundled PDF...");

      // Check if there are any tests to export
      if (!analytics?.recentTests || analytics.recentTests.length === 0) {
        alert("No test results found to export.");
        return;
      }

      // Open bundled PDF generation page in new window
      const pdfUrl = `/api/admin/usability-tests/pdf/all?timeRange=${timeRange}`;
      const printWindow = window.open(pdfUrl, '_blank', 'width=800,height=600');
      
      if (!printWindow) {
        alert("Please allow popups to generate PDF reports.");
        return;
      }
      
      console.log(`✅ Bundled PDF generation window opened for ${analytics.recentTests.length} tests`);
      
      // Reset the loading state after a short delay
      setTimeout(() => {
        setExportingAllPDFs(false);
      }, 2000);
    } catch (error) {
      console.error("Error exporting all tests to PDF:", error);
      alert("Failed to export bundled PDF. Please try again.");
      setExportingAllPDFs(false);
    }
  };

  const deleteTest = async (testId: string) => {
    try {
      setDeletingTests(prev => new Set(prev).add(testId));
      console.log("🗑️ Deleting test:", testId);

      const response = await fetch(`/api/admin/usability-tests/delete?testId=${encodeURIComponent(testId)}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        console.log("✅ Test deleted successfully:", result);
        // Refresh analytics to update the UI
        await fetchAnalytics();
        setResetSuccess(`Test ${testId.substring(0, 8)}... deleted successfully`);
        setTimeout(() => setResetSuccess(null), 3000);
      } else {
        console.error("❌ Failed to delete test:", result.error);
        alert(`Failed to delete test: ${result.error}`);
      }
    } catch (error) {
      console.error("❌ Delete test failed:", error);
      alert("Failed to delete test. Please try again.");
    } finally {
      setDeletingTests(prev => {
        const newSet = new Set(prev);
        newSet.delete(testId);
        return newSet;
      });
      setShowDeleteConfirm(null);
    }
  };

  const bulkDeleteOldTests = async () => {
    try {
      setBulkDeleting(true);
      console.log("🗑️ Bulk deleting tests older than 7 days...");

      // Calculate date 7 days ago (September 20, 2025)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const response = await fetch('/api/admin/usability-tests/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          beforeDate: sevenDaysAgo.toISOString()
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("✅ Bulk delete completed:", result);
        // Refresh analytics to update the UI
        await fetchAnalytics();
        setResetSuccess(`Deleted ${result.deletedCounts.tests} old tests (before ${sevenDaysAgo.toLocaleDateString()})`);
        setTimeout(() => setResetSuccess(null), 5000);
      } else {
        console.error("❌ Failed to bulk delete tests:", result.error);
        alert(`Failed to bulk delete tests: ${result.error}`);
      }
    } catch (error) {
      console.error("❌ Bulk delete failed:", error);
      alert("Failed to bulk delete tests. Please try again.");
    } finally {
      setBulkDeleting(false);
    }
  };

  const confirmDeleteTest = (testId: string, participantName: string) => {
    setShowDeleteConfirm({ testId, participantName });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2">
          <span className="text-red-600">⚠️</span>
          <span className="text-red-800 font-medium">
            Error loading analytics
          </span>
        </div>
        <p className="text-red-700 mt-2">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl text-gray-400 mb-4">👥</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No test data available
        </h3>
        <p className="text-gray-600">No alpha tests have been completed yet.</p>
      </div>
    );
  }

  const { summary, deviceStats, errorAnalysis, recentTests } = analytics;

  return (
    <div id="admin-dashboard-content" className="space-y-8">
      {/* Print-only header */}
      <div className="hidden print:block text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          NEST-Haus Alpha Test Dashboard
        </h1>
        <p className="text-gray-600">
          Report Period:{" "}
          {timeRange === "7d"
            ? "Last 7 days"
            : timeRange === "30d"
              ? "Last 30 days"
              : "Last 90 days"}{" "}
          | Generated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between no-print">
        <div className="flex space-x-4">
          {["7d", "30d", "90d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === range
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
            >
              {range === "7d"
                ? "Last 7 days"
                : range === "30d"
                  ? "Last 30 days"
                  : "Last 90 days"}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex space-x-3 no-print">
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              📊 Export Excel
            </button>
            <button
              onClick={exportToPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              📄 Export PDF
            </button>
            <button
              onClick={resetTestData}
              disabled={isResetting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isResetting ? "🗑️ Resetting..." : "🗑️ Reset All Data"}
            </button>
          </div>
          <div className="text-sm text-gray-500">
            Generated: {new Date(analytics.generatedAt).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {resetSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span className="text-green-800 font-medium">Reset Successful</span>
          </div>
          <p className="text-green-700 mt-1 text-sm">{resetSuccess}</p>
        </div>
      )}

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Test Status Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">📊</span>
                <span className="text-gray-900 font-medium">Total Tests</span>
              </div>
              <span className="font-bold text-lg">{summary.totalTests}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✅</span>
                <span className="text-gray-700">Completed</span>
              </div>
              <span className="font-medium">{summary.completedTests}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-red-600">❌</span>
                <span className="text-gray-700">Abandoned</span>
              </div>
              <span className="font-medium">{summary.abandonedTests}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-600">⚠️</span>
                <span className="text-gray-700">Errors</span>
              </div>
              <span className="font-medium">{summary.errorTests}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            📱 Device & Browser Breakdown
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Device Stats */}
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-4">
                Devices
              </h4>
              <div className="space-y-3">
                {Object.entries(deviceStats).map(([device, count]) => (
                  <div
                    key={device}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      {device === "Mobile" ? (
                        <span className="text-blue-600">📱</span>
                      ) : device === "Tablet" ? (
                        <span className="text-purple-600">📱</span>
                      ) : (
                        <span className="text-gray-600">💻</span>
                      )}
                      <span className="text-gray-700">{device}</span>
                    </div>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Browser Stats */}
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-4">
                Browsers
              </h4>
              <div className="space-y-3">
                {Object.entries(analytics.browserStats || {}).map(
                  ([browser, count]) => (
                    <div
                      key={browser}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600">🌐</span>
                        <span className="text-gray-700">{browser}</span>
                      </div>
                      <span className="font-medium">{count}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Themes Section */}
      {analytics.qualitativeInsights &&
        analytics.qualitativeInsights.keyThemes.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🎯 Key Feedback Themes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.qualitativeInsights.keyThemes
                .slice(0, 6)
                .map((theme) => (
                  <div key={theme.theme} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">
                        {theme.theme}
                      </h4>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {theme.count}
                      </span>
                    </div>
                    {theme.examples.length > 0 && (
                      <div className="space-y-1">
                        {theme.examples.slice(0, 2).map((example, idx) => (
                          <p key={idx} className="text-xs text-gray-600 italic">
                            &quot;
                            {example.length > 60
                              ? example.substring(0, 60) + "..."
                              : example}
                            &quot;
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

      {/* Session Tracking Overview */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          🔍 Session Tracking Summary
        </h3>

        {analytics.sessionTracking &&
          analytics.sessionTracking.sessionsWithTracking > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {analytics.sessionTracking.totalInteractions}
              </div>
              <div className="text-sm text-blue-700 font-medium">
                Total Interactions
              </div>
              <div className="text-xs text-gray-500 mt-1">
                All tracked actions
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {analytics.sessionTracking.avgPagesPerSession}
              </div>
              <div className="text-sm text-green-700 font-medium">
                Avg Pages/Session
              </div>
              <div className="text-xs text-gray-500 mt-1">Navigation depth</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {analytics.sessionTracking.sessionsWithTracking}
              </div>
              <div className="text-sm text-purple-700 font-medium">
                Sessions Tracked
              </div>
              <div className="text-xs text-gray-500 mt-1">
                With interaction data
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">📊</div>
            <div className="text-lg font-medium mb-2">
              No Session Tracking Data
            </div>
            <div className="text-sm">
              Session tracking data will appear here once users complete alpha
              tests with the new tracking system.
            </div>
          </div>
        )}
      </div>

      {/* Rating Charts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          📊 Rating Distribution & Analysis
        </h3>

        {/* Overall Rating Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
            <div className="text-3xl font-bold text-gray-600 mb-2">
              {analytics.summary.totalTests}
            </div>
            <div className="text-sm text-gray-700 font-medium">Total Tests</div>
            <div className="text-xs text-gray-600 mt-1">All test sessions</div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {analytics.summary.averageRating.toFixed(1)}/6
            </div>
            <div className="text-sm text-blue-700 font-medium">
              Average Rating
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Based on {analytics.summary.completedTests} completed tests
            </div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {analytics.summary.completionRate.toFixed(0)}%
            </div>
            <div className="text-sm text-green-700 font-medium">
              Completion Rate
            </div>
            <div className="text-xs text-green-600 mt-1">
              {analytics.summary.completedTests} of{" "}
              {analytics.summary.totalTests} tests
            </div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {analytics.summary.avgTestDuration
                ? `${analytics.summary.avgTestDuration.toFixed(2)}m`
                : "N/A"}
            </div>
            <div className="text-sm text-purple-700 font-medium">
              Avg Duration
            </div>
            <div className="text-xs text-purple-600 mt-1">
              Time to complete test
            </div>
          </div>
        </div>

        {/* Rating Distribution Chart */}
        {(() => {
          // Define the expected question order and labels
          const questionOrder = [
            { id: "navigation-ease", label: "1. Orientierung/Navigation" },
            {
              id: "configurator-usability",
              label: "2. Benutzerfreundlichkeit",
            },
            {
              id: "nest-haus-understanding",
              label: "3. Nest-Haus-Verständnis",
            },
            { id: "purchase-process", label: "4. Bestellprozess" },
            { id: "configurator-options", label: "5. Auswahlmöglichkeiten" },
            { id: "website-overall", label: "6. Website" },
            { id: "purchase-intention", label: "7. Eigenes Nest" },
          ];

          // Get rating questions and sort them according to our defined order
          const ratingQuestions = analytics.questionAnalysis.filter(
            (q) => q.questionType === "RATING" && q.averageRating
          );

          const sortedRatingQuestions = questionOrder
            .map((orderItem) => ({
              ...orderItem,
              data: ratingQuestions.find((q) => q.questionId === orderItem.id),
            }))
            .filter((item) => item.data); // Only include questions that have data

          const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

          sortedRatingQuestions.forEach((item) => {
            item.data?.responses.forEach(
              (response: Record<string, unknown>) => {
                const value = response?.value;
                if (typeof value === "number" && value >= 1 && value <= 6) {
                  ratingCounts[value as keyof typeof ratingCounts]++;
                }
              }
            );
          });

          const _totalRatings = Object.values(ratingCounts).reduce(
            (a, b) => a + b,
            0
          );
          const _maxCount = Math.max(...Object.values(ratingCounts));

          return sortedRatingQuestions.length > 0 ? (
            <div className="mb-8">
              <h4 className="text-md font-medium text-gray-900 mb-4">
                Rating Distribution by Question ({sortedRatingQuestions.length}{" "}
                Fragen)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
                {sortedRatingQuestions.map((item) => {
                  const question = item.data!;
                  const questionAverage = question.averageRating || 0;
                  const responseCount = question.responseCount;

                  return (
                    <div key={question.questionId} className="text-center">
                      <div className="relative h-32 bg-gray-100 rounded-t-lg mb-2 flex items-end">
                        <div
                          className={`w-full rounded-t-lg transition-all duration-500 ${questionAverage <= 2
                              ? "bg-red-400"
                              : questionAverage <= 4
                                ? "bg-yellow-400"
                                : "bg-green-400"
                            }`}
                          style={{
                            height: `${questionAverage > 0 ? (questionAverage / 6) * 100 : 0}%`,
                          }}
                        ></div>
                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                          {questionAverage.toFixed(1)}
                        </div>
                      </div>
                      <div className="text-xs font-medium text-gray-900 mb-1">
                        {item.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {responseCount} Antworten
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mb-8 text-center py-8 text-gray-500">
              Keine Rating-Fragen verfügbar
            </div>
          );
        })()}

        {/* Individual Question Rating Distributions */}
        {(() => {
          // Define the expected question order and labels
          const questionOrder = [
            { id: "navigation-ease", label: "1. Orientierung/Navigation" },
            {
              id: "configurator-usability",
              label: "2. Benutzerfreundlichkeit",
            },
            {
              id: "nest-haus-understanding",
              label: "3. Nest-Haus-Verständnis",
            },
            { id: "purchase-process", label: "4. Bestellprozess" },
            { id: "configurator-options", label: "5. Auswahlmöglichkeiten" },
            { id: "website-overall", label: "6. Website" },
            { id: "purchase-intention", label: "7. Eigenes Nest" },
          ];

          const ratingQuestions = analytics.questionAnalysis.filter(
            (q) => q.questionType === "RATING" && q.averageRating
          );

          // Sort questions according to our defined order
          const sortedRatingQuestions = questionOrder
            .map((orderItem) => ({
              ...orderItem,
              data: ratingQuestions.find((q) => q.questionId === orderItem.id),
            }))
            .filter((item) => item.data); // Only include questions that have data

          return sortedRatingQuestions.length > 0 ? (
            <div className="mb-8">
              <div
                className="flex items-center justify-between cursor-pointer mb-6 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() =>
                  setIsQuestionRatingsExpanded(!isQuestionRatingsExpanded)
                }
              >
                <h4 className="text-md font-medium text-gray-900">
                  📊 Rating Distribution by Question (
                  {sortedRatingQuestions.length} questions)
                </h4>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {isQuestionRatingsExpanded
                      ? "Click to collapse"
                      : "Click to expand details"}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 text-lg">
                    {isQuestionRatingsExpanded ? "▼" : "▶"}
                  </button>
                </div>
              </div>

              {isQuestionRatingsExpanded && (
                <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                  {sortedRatingQuestions.map((item, _index) => {
                    const question = item.data!;
                    // Calculate rating distribution for this specific question
                    const questionRatingCounts = {
                      1: 0,
                      2: 0,
                      3: 0,
                      4: 0,
                      5: 0,
                      6: 0,
                    };

                    question.responses.forEach(
                      (response: Record<string, unknown>) => {
                        const value = response?.value;
                        if (
                          typeof value === "number" &&
                          value >= 1 &&
                          value <= 6
                        ) {
                          questionRatingCounts[
                            value as keyof typeof questionRatingCounts
                          ]++;
                        }
                      }
                    );

                    const questionTotalRatings = Object.values(
                      questionRatingCounts
                    ).reduce((a, b) => a + b, 0);
                    const questionMaxCount = Math.max(
                      ...Object.values(questionRatingCounts)
                    );

                    return questionTotalRatings > 0 ? (
                      <div
                        key={question.questionId}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <div className="mb-4">
                          <h5 className="font-medium text-gray-900 mb-1">
                            {getOverriddenQuestionText(
                              question.questionId,
                              question.questionText
                            )}
                          </h5>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>
                              Average:{" "}
                              <strong className="text-blue-600">
                                {question.averageRating?.toFixed(1)}/6
                              </strong>
                            </span>
                            <span>
                              Responses: <strong>{questionTotalRatings}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Horizontal Rating Bars */}
                        <div className="space-y-2">
                          {Object.entries(questionRatingCounts).map(
                            ([rating, count]) => {
                              const percentage =
                                questionTotalRatings > 0
                                  ? (count / questionTotalRatings) * 100
                                  : 0;
                              const width =
                                questionMaxCount > 0
                                  ? (count / questionMaxCount) * 100
                                  : 0;

                              return (
                                <div
                                  key={rating}
                                  className="flex items-center space-x-3"
                                >
                                  <div className="w-8 text-sm font-medium text-gray-700 text-right">
                                    {rating}/6
                                  </div>
                                  <div className="flex-1 relative">
                                    <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full transition-all duration-500 ${parseInt(rating) <= 2
                                            ? "bg-red-400"
                                            : parseInt(rating) <= 4
                                              ? "bg-yellow-400"
                                              : "bg-green-400"
                                          }`}
                                        style={{ width: `${width}%` }}
                                      ></div>
                                    </div>
                                    {count > 0 && (
                                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                                        {count} ({percentage.toFixed(1)}%)
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          ) : null;
        })()}

        {/* Top Rated Questions */}
        {(() => {
          const ratingQuestions = analytics.questionAnalysis
            .filter((q) => q.questionType === "RATING" && q.averageRating)
            .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
            .slice(0, 5);

          return ratingQuestions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  🏆 Highest Rated Aspects
                </h4>
                <div className="space-y-3">
                  {ratingQuestions.slice(0, 3).map((question, index) => (
                    <div
                      key={question.questionId}
                      className="flex items-center space-x-3"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${index === 0
                            ? "bg-yellow-500"
                            : index === 1
                              ? "bg-gray-400"
                              : "bg-orange-400"
                          }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {question.questionText.length > 50
                            ? `${question.questionText.substring(0, 50)}...`
                            : question.questionText}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-lg font-bold text-green-600">
                            {question.averageRating?.toFixed(1)}/6
                          </div>
                          <div className="text-xs text-gray-500">
                            ({question.responseCount} responses)
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  📉 Areas for Improvement
                </h4>
                <div className="space-y-3">
                  {ratingQuestions
                    .slice()
                    .reverse()
                    .slice(0, 3)
                    .map((question, _index) => (
                      <div
                        key={question.questionId}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-sm font-bold">
                          !
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {question.questionText.length > 50
                              ? `${question.questionText.substring(0, 50)}...`
                              : question.questionText}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-lg font-bold text-red-600">
                              {question.averageRating?.toFixed(1)}/6
                            </div>
                            <div className="text-xs text-gray-500">
                              ({question.responseCount} responses)
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : null;
        })()}
      </div>

      {/* Question Analysis - Offene Fragen */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Question Analysis - Offene Fragen
        </h3>
        {(() => {
          // Define the expected open text question order
          const openQuestionOrder = [
            "content-display-issues",
            "main-challenge",
            "nest-haus-concept-understanding",
            "missing-information",
            "improvement-suggestions",
            "advantages-disadvantages",
            "purchase-to-move-in-process",
            "window-wall-positioning",
            "house-categorization",
            "additional-costs",
            "unclear-topics",
            "confusing-elements",
            "detailed-description-needs",
          ];

          // Filter and sort open text questions
          const openTextQuestions = analytics.questionAnalysis
            .filter((q) => q.questionType === "TEXT")
            .sort((a, b) => {
              const aIndex = openQuestionOrder.indexOf(a.questionId);
              const bIndex = openQuestionOrder.indexOf(b.questionId);
              if (aIndex === -1) return 1;
              if (bIndex === -1) return -1;
              return aIndex - bIndex;
            });

          return openTextQuestions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Question
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Key Findings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Summary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tendency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {openTextQuestions.map((question) => {
                    const keyFindings = extractKeyFindings(question.responses);
                    const summary = generateSummary(question.responses);
                    const tendencyData = detectTendency(
                      question.questionId,
                      question.questionText,
                      question.responses
                    );
                    const isExpanded = expandedQuestions.has(
                      question.questionId
                    );

                    return (
                      <React.Fragment key={question.questionId}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="max-w-sm">
                              {question.questionText}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 text-center">
                            {question.responseCount}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <div className="max-w-xs">
                              {keyFindings.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {keyFindings.map((finding, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                    >
                                      {finding}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-400">
                                  Keine Schlüsselbegriffe
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <div className="max-w-sm">{summary}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="flex flex-col items-start space-y-1">
                              <button
                                onClick={() => {
                                  /* TODO: Show tendency explanation */
                                }}
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 ${tendencyData.tendency === "Positiv"
                                    ? "bg-green-100 text-green-800"
                                    : tendencyData.tendency === "Negativ"
                                      ? "bg-red-100 text-red-800"
                                      : tendencyData.tendency === "Gemischt"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800"
                                  }`}
                                title={tendencyData.explanation}
                              >
                                {tendencyData.tendency}
                              </button>
                              {tendencyData.percentage > 0 && (
                                <span className="text-xs text-gray-500 font-medium">
                                  {tendencyData.percentage}%
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <button
                              onClick={() =>
                                toggleQuestionExpansion(question.questionId)
                              }
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              {isExpanded ? "Ausblenden" : "Alle Antworten"}
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 bg-gray-50">
                              <div className="space-y-3">
                                <h5 className="font-medium text-gray-900 mb-3">
                                  Alle Antworten zu: &quot;
                                  {question.questionText}&quot;
                                </h5>
                                {question.responses.length > 0 ? (
                                  <div className="space-y-2">
                                    {question.responses.map(
                                      (
                                        response: Record<string, unknown>,
                                        idx
                                      ) => (
                                        <div
                                          key={idx}
                                          className="bg-white p-3 rounded border"
                                        >
                                          <div className="text-sm text-gray-900">
                                            {String(
                                              response.value || "Keine Antwort"
                                            )}
                                          </div>
                                          <div className="text-xs text-gray-500 mt-1">
                                            Antwortzeit:{" "}
                                            {response.responseTime
                                              ? `${Math.round(Number(response.responseTime) / 1000)}s`
                                              : "N/A"}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-gray-500 italic">
                                    Keine Antworten verfügbar
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Keine offenen Fragen verfügbar
            </div>
          );
        })()}
      </div>

      {/* Recent Tests */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Tests
          </h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={exportAllTestsToPDF}
              disabled={exportingAllPDFs}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                exportingAllPDFs
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800'
              }`}
              title="Export all test results as a single bundled PDF"
            >
              <span>{exportingAllPDFs ? '⏳' : '📄'}</span>
              <span>{exportingAllPDFs ? 'Generating PDF...' : 'Export All PDFs'}</span>
            </button>
            <button
              onClick={bulkDeleteOldTests}
              disabled={bulkDeleting}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${bulkDeleting
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800'
                }`}
              title="Delete all tests older than 7 days (before September 20, 2025)"
            >
              <span>{bulkDeleting ? '⏳' : '🗑️'}</span>
              <span>{bulkDeleting ? 'Deleting old tests...' : 'Delete Tests >7 Days Old'}</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Started
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interactions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider no-print">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTests.map((test) => (
                <tr key={test.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">
                    {test.testId.substring(0, 12)}...
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {test.participantName}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${test.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : test.status === "ABANDONED"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {test.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {test.overallRating ? (
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">⭐</span>
                        <span>{test.overallRating.toFixed(1)}/6</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {test.duration
                      ? `${(test.duration / 1000 / 60).toFixed(2)}m`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      {test.deviceType === "mobile" ? (
                        <span className="text-blue-600">📱</span>
                      ) : (
                        <span className="text-gray-600">💻</span>
                      )}
                      <span className="capitalize">{test.deviceType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(test.startedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600">📊</span>
                      <span className="text-xs">
                        {test.interactionCount || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm no-print">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => viewTestDetails(test.testId)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="View test details"
                      >
                        <span>👁️</span>
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => exportTestToPDF(test.testId, test.participantName)}
                        className="flex items-center space-x-1 text-green-600 hover:text-green-800 transition-colors"
                        title="Export test as PDF"
                      >
                        <span>📄</span>
                        <span>PDF</span>
                      </button>
                      <button
                        onClick={() => confirmDeleteTest(test.testId, test.participantName || 'Unknown')}
                        disabled={deletingTests.has(test.testId)}
                        className={`flex items-center space-x-1 transition-colors ${deletingTests.has(test.testId)
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-red-600 hover:text-red-800'
                          }`}
                        title="Delete this test"
                      >
                        <span>{deletingTests.has(test.testId) ? '⏳' : '🗑️'}</span>
                        <span>{deletingTests.has(test.testId) ? 'Deleting...' : 'Delete'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Anmerkungen
        </h3>
        {commentsData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teilnehmer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Datum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Anmerkungen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {commentsData.map((comment) => (
                  <tr key={comment.testId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {comment.testId.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {comment.participantName || "Anonymous"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString("de-DE")}
                    </td>
                    <td className="px-6 py-4 text-sm no-print">
                      <button
                        onClick={() => {
                          setSelectedComments({
                            testId: comment.testId,
                            participantName:
                              comment.participantName || "Anonymous",
                            comments: comment.comments,
                            createdAt: comment.createdAt,
                          });
                          setShowCommentsModal(true);
                        }}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <span>💬</span>
                        <span>Anzeigen</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            Noch keine Anmerkungen vorhanden
          </p>
        )}
      </div>

      {/* Error Analysis */}
      {errorAnalysis.totalErrors > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Error Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {errorAnalysis.totalErrors}
              </div>
              <div className="text-sm text-red-700">Total Errors</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {errorAnalysis.consoleErrors}
              </div>
              <div className="text-sm text-orange-700">Console Errors</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {errorAnalysis.interactionErrors}
              </div>
              <div className="text-sm text-yellow-700">Interaction Errors</div>
            </div>
          </div>
        </div>
      )}

      {/* Test Details Modal */}
      {showTestModal && testDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Test Details: {testDetails.participantName || "Anonymous"}
                </h2>
                <button
                  onClick={() => setShowTestModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Test Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">
                    Status
                  </div>
                  <div className="text-lg font-semibold text-blue-900">
                    {testDetails.status}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">
                    Rating
                  </div>
                  <div className="text-lg font-semibold text-green-900">
                    {testDetails.overallRating
                      ? `${testDetails.overallRating.toFixed(1)}/6`
                      : "N/A"}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium">
                    Duration
                  </div>
                  <div className="text-lg font-semibold text-purple-900">
                    {testDetails.totalDuration
                      ? `${Math.round(testDetails.totalDuration / 1000 / 60)}m`
                      : "N/A"}
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-sm text-orange-600 font-medium">
                    Completion
                  </div>
                  <div className="text-lg font-semibold text-orange-900">
                    {testDetails.completionRate
                      ? `${testDetails.completionRate.toFixed(0)}%`
                      : "N/A"}
                  </div>
                </div>
              </div>

              {/* Device Info */}
              {testDetails.deviceInfo && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Device Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Platform:</span>{" "}
                      {String(
                        (testDetails.deviceInfo as Record<string, unknown>)
                          ?.platform
                      ) || "Unknown"}
                    </div>
                    <div>
                      <span className="font-medium">Language:</span>{" "}
                      {String(
                        (testDetails.deviceInfo as Record<string, unknown>)
                          ?.language
                      ) || "Unknown"}
                    </div>
                    <div>
                      <span className="font-medium">Viewport:</span>{" "}
                      {(() => {
                        const viewport = (
                          testDetails.deviceInfo as Record<string, unknown>
                        )?.viewport as Record<string, unknown>;
                        return viewport
                          ? `${viewport.width}×${viewport.height}`
                          : "Unknown";
                      })()}
                    </div>
                    <div>
                      <span className="font-medium">Screen:</span>{" "}
                      {(() => {
                        const screen = (
                          testDetails.deviceInfo as Record<string, unknown>
                        )?.screen as Record<string, unknown>;
                        return screen
                          ? `${screen.width}×${screen.height}`
                          : "Unknown";
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* Responses */}
              {testDetails.responses && testDetails.responses.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Responses ({testDetails.responses.length})
                  </h3>
                  <div className="space-y-3">
                    {testDetails.responses.map(
                      (response: Record<string, unknown>, index: number) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="font-medium text-gray-900 mb-2">
                            {String(response.questionText)}
                          </div>
                          <div className="text-gray-700">
                            {response.questionType === "RATING"
                              ? `Rating: ${response.response || "N/A"}/6`
                              : String(response.response) || "No response"}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Interactions Timeline */}
              {testDetails.interactions &&
                testDetails.interactions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Interactions Timeline ({testDetails.interactions.length})
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {testDetails.interactions.map(
                        (
                          interaction: Record<string, unknown>,
                          index: number
                        ) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 text-sm"
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            <div className="flex-1">
                              <span className="font-medium">
                                {String(interaction.eventType)}
                              </span>
                              {typeof interaction.stepId === "string" &&
                                interaction.stepId ? (
                                <span className="text-gray-500">
                                  {" "}
                                  on {interaction.stepId}
                                </span>
                              ) : null}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {new Date(
                                String(interaction.timestamp)
                              ).toLocaleTimeString()}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Session Tracking Data */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                  🔍 Detailed Session Tracking
                </h3>

                {/* Debug Info */}
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                  <strong>Debug Info:</strong>
                  <div>
                    Total interactions: {testDetails.interactions?.length || 0}
                  </div>
                  <div>
                    Interactions data:{" "}
                    {JSON.stringify(
                      testDetails.interactions?.slice(0, 2) || [],
                      null,
                      2
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {testDetails.interactions?.filter(
                        (i: Record<string, unknown>) =>
                          String(i.eventType) === "page_visit"
                      ).length || 0}
                    </div>
                    <div className="text-sm text-blue-700">Page Visits</div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {testDetails.interactions?.filter(
                        (i: Record<string, unknown>) =>
                          String(i.eventType) === "button_click"
                      ).length || 0}
                    </div>
                    <div className="text-sm text-green-700">Button Clicks</div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {testDetails.interactions?.filter(
                        (i: Record<string, unknown>) =>
                          String(i.eventType) === "configurator_selection"
                      ).length || 0}
                    </div>
                    <div className="text-sm text-purple-700">
                      Config Selections
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {testDetails.interactions?.filter(
                        (i: Record<string, unknown>) =>
                          String(i.eventType) === "form_interaction"
                      ).length || 0}
                    </div>
                    <div className="text-sm text-orange-700">
                      Form Interactions
                    </div>
                  </div>
                </div>

                {/* Button Clicks Detail */}
                <div className="mb-8">
                  <h4 className="text-md font-medium text-gray-800 mb-4">
                    🖱️ Button Clicks
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                    {(() => {
                      const buttonClicks =
                        testDetails.interactions?.filter(
                          (i: Record<string, unknown>) =>
                            String(i.eventType) === "button_click"
                        ) || [];

                      return buttonClicks.length > 0 ? (
                        <div className="space-y-2">
                          {buttonClicks.map(
                            (click: Record<string, unknown>, index: number) => {
                              const additionalData =
                                (click.additionalData as Record<
                                  string,
                                  unknown
                                >) || {};
                              const data =
                                (additionalData.data as Record<
                                  string,
                                  unknown
                                >) || {};
                              const timestamp = new Date(
                                String(click.timestamp || click.createdAt)
                              );

                              return (
                                <div
                                  key={index}
                                  className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                                >
                                  <div>
                                    <span className="text-sm font-medium text-gray-800">
                                      {String(
                                        data.buttonText ||
                                        click.elementText ||
                                        "Unknown Button"
                                      )}
                                    </span>
                                    <div className="text-xs text-gray-500">
                                      {String(data.path || click.stepId || "/")}{" "}
                                      • {timestamp.toLocaleTimeString()}
                                    </div>
                                  </div>
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    {String(data.elementType || "button")}
                                  </span>
                                </div>
                              );
                            }
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 text-center py-4">
                          No button clicks recorded
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Page Navigation */}
                <div className="mb-8">
                  <h4 className="text-md font-medium text-gray-800 mb-4">
                    📄 Page Navigation
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                    {(() => {
                      const pageVisits =
                        testDetails.interactions?.filter(
                          (i: Record<string, unknown>) =>
                            String(i.eventType) === "page_visit"
                        ) || [];

                      return pageVisits.length > 0 ? (
                        <div className="space-y-2">
                          {pageVisits.map(
                            (visit: Record<string, unknown>, index: number) => {
                              const additionalData =
                                (visit.additionalData as Record<
                                  string,
                                  unknown
                                >) || {};
                              const data =
                                (additionalData.data as Record<
                                  string,
                                  unknown
                                >) || {};
                              const timestamp = new Date(
                                String(visit.timestamp || visit.createdAt)
                              );

                              return (
                                <div
                                  key={index}
                                  className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                                >
                                  <div>
                                    <span className="text-sm font-medium text-gray-800">
                                      {String(data.path || visit.stepId || "/")}
                                    </span>
                                    <div className="text-xs text-gray-500">
                                      {String(data.title || "Unknown Page")} •{" "}
                                      {timestamp.toLocaleTimeString()}
                                    </div>
                                  </div>
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    visit
                                  </span>
                                </div>
                              );
                            }
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 text-center py-4">
                          No page visits recorded
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Configurator Selections */}
                <div className="mb-8">
                  <h4 className="text-md font-medium text-gray-800 mb-4">
                    ⚙️ Configurator Selections
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                    {(() => {
                      const configSelections =
                        testDetails.interactions?.filter(
                          (i: Record<string, unknown>) =>
                            String(i.eventType) === "configurator_selection"
                        ) || [];

                      return configSelections.length > 0 ? (
                        <div className="space-y-3">
                          {configSelections.map(
                            (
                              selection: Record<string, unknown>,
                              index: number
                            ) => {
                              const additionalData =
                                (selection.additionalData as Record<
                                  string,
                                  unknown
                                >) || {};
                              const data =
                                (additionalData.data as Record<
                                  string,
                                  unknown
                                >) || {};
                              const timestamp = new Date(
                                String(
                                  selection.timestamp || selection.createdAt
                                )
                              );

                              return (
                                <div
                                  key={index}
                                  className="border border-gray-200 rounded p-3"
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <span className="text-sm font-medium text-gray-800 capitalize">
                                        {String(
                                          data.category || "Unknown Category"
                                        ).replace("_", " ")}
                                      </span>
                                      <div className="text-sm text-gray-600 mt-1">
                                        {String(
                                          data.name ||
                                          data.value ||
                                          "Unknown Selection"
                                        )}
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        {timestamp.toLocaleTimeString()}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-sm font-medium text-green-600">
                                        €{String(data.price || "0")}
                                      </span>
                                      <div className="text-xs text-gray-500">
                                        Total: €{String(data.totalPrice || "0")}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 text-center py-4">
                          No configurator selections recorded
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Form Interactions */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-800 mb-4">
                    📝 Form Interactions
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                    {(() => {
                      const formInteractions =
                        testDetails.interactions?.filter(
                          (i: Record<string, unknown>) =>
                            String(i.eventType) === "form_interaction"
                        ) || [];

                      return formInteractions.length > 0 ? (
                        <div className="space-y-2">
                          {formInteractions.map(
                            (
                              interaction: Record<string, unknown>,
                              index: number
                            ) => {
                              const additionalData =
                                (interaction.additionalData as Record<
                                  string,
                                  unknown
                                >) || {};
                              const data =
                                (additionalData.data as Record<
                                  string,
                                  unknown
                                >) || {};
                              const timestamp = new Date(
                                String(
                                  interaction.timestamp || interaction.createdAt
                                )
                              );

                              return (
                                <div
                                  key={index}
                                  className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                                >
                                  <div>
                                    <span className="text-sm font-medium text-gray-800">
                                      {String(
                                        data.fieldName || "Unknown Field"
                                      )}
                                    </span>
                                    <div className="text-xs text-gray-500">
                                      {String(data.action || "unknown")} •{" "}
                                      {String(data.path || "/")} •{" "}
                                      {timestamp.toLocaleTimeString()}
                                    </div>
                                  </div>
                                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                                    {String(data.fieldType || "input")}
                                  </span>
                                </div>
                              );
                            }
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 text-center py-4">
                          No form interactions recorded
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl">⚠️</span>
                <h2 className="text-xl font-semibold text-gray-900">
                  Confirm Test Deletion
                </h2>
              </div>

              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this test? This action cannot be undone.
              </p>

              <div className="bg-gray-50 rounded-lg p-3 mb-6">
                <div className="text-sm">
                  <div><strong>Test ID:</strong> {showDeleteConfirm.testId.substring(0, 12)}...</div>
                  <div><strong>Participant:</strong> {showDeleteConfirm.participantName}</div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteTest(showDeleteConfirm.testId)}
                  disabled={deletingTests.has(showDeleteConfirm.testId)}
                  className={`px-4 py-2 rounded-lg transition-colors ${deletingTests.has(showDeleteConfirm.testId)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                >
                  {deletingTests.has(showDeleteConfirm.testId) ? 'Deleting...' : 'Delete Test'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {showCommentsModal && selectedComments && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Anmerkungen: {selectedComments.participantName}
                </h2>
                <button
                  onClick={() => setShowCommentsModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Test ID: {selectedComments.testId} •{" "}
                {new Date(selectedComments.createdAt).toLocaleString("de-DE")}
              </div>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Notizen des Teilnehmers:
                </h3>
                <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedComments.comments}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setShowCommentsModal(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Analytics Section */}
      <ConfigurationAnalytics analytics={analytics} />
    </div>
  );
}
