/**
 * ========================================
 * NEST-HAUS ADMIN RESULTS CONFIGURATION
 * ========================================
 * 
 * This file controls what metrics, charts, and data are displayed in the admin panel.
 * Edit this file to customize the admin dashboard without touching complex logic.
 * 
 * IMPORTANT: Only edit the display configuration - calculations happen elsewhere.
 * 
 * Last Updated: January 2025
 * Team Review Status: [ ] Pending Review [ ] Approved
 */

// ========================================
// DASHBOARD SUMMARY METRICS
// ========================================
// These are the main KPI cards shown at the top of the admin dashboard

export const SUMMARY_METRICS = {
    // Primary metrics displayed as large cards
    primary: [
        {
            id: "total_tests",
            title: "Total Tests",
            description: "Number of tests started",
            icon: "👥",
            format: "number", // number, percentage, duration, rating
            color: "blue", // blue, green, yellow, red, purple
            priority: 1, // Display order
        },
        {
            id: "completion_rate",
            title: "Completion Rate",
            description: "Percentage of tests completed",
            icon: "✅",
            format: "percentage",
            color: "green",
            priority: 2,
        },
        {
            id: "average_rating",
            title: "Average Rating",
            description: "Overall experience rating",
            icon: "⭐",
            format: "rating", // Shows as X/10
            color: "yellow",
            priority: 3,
        },
        {
            id: "average_duration",
            title: "Avg Duration",
            description: "Average test completion time",
            icon: "⏱️",
            format: "duration", // Shows as Xm (minutes)
            color: "purple",
            priority: 4,
        },
    ],

    // Secondary metrics for detailed analysis
    secondary: [
        {
            id: "purchase_likelihood",
            title: "Purchase Intent",
            description: "Average purchase likelihood score",
            format: "rating",
            showInSummary: true, // Include in main dashboard
        },
        {
            id: "recommendation_score",
            title: "NPS Score",
            description: "Net Promoter Score equivalent",
            format: "rating",
            showInSummary: true,
        },
        {
            id: "configurator_satisfaction",
            title: "Configurator Score",
            description: "Configurator usability rating",
            format: "rating",
            showInSummary: true,
        },
        {
            id: "error_rate",
            title: "Error Rate",
            description: "Percentage of tests with errors",
            format: "percentage",
            showInSummary: false, // Only show in detailed view
        },
    ],
};

// ========================================
// QUESTION ANALYSIS CONFIGURATION
// ========================================
// Controls which questions are highlighted in the analysis section

export const QUESTION_ANALYSIS_CONFIG = {
    // Critical questions to always show prominently
    criticalQuestions: [
        {
            questionId: "purchase_likelihood",
            displayName: "Purchase Likelihood",
            description: "How likely users are to actually buy a house",
            importance: "critical", // critical, high, medium, low
            targetScore: 7.0, // Benchmark score for success
            showTrend: true, // Show trend over time
        },
        {
            questionId: "overall_experience",
            displayName: "Overall Experience",
            description: "General website satisfaction",
            importance: "critical",
            targetScore: 8.0,
            showTrend: true,
        },
        {
            questionId: "configurator_clarity",
            displayName: "Configurator Usability",
            description: "How intuitive the main tool is",
            importance: "critical",
            targetScore: 7.5,
            showTrend: true,
        },
        {
            questionId: "price_understanding",
            displayName: "Price Transparency",
            description: "Understanding of pricing logic",
            importance: "high",
            targetScore: 7.0,
            showTrend: true,
        },
    ],

    // Questions to group together for analysis
    questionGroups: [
        {
            groupName: "First Impression",
            description: "Initial website perception",
            questions: ["first_impression", "clarity", "visual_presentation"],
            showAsChart: true,
        },
        {
            groupName: "Configurator Experience",
            description: "Tool usability and satisfaction",
            questions: ["configurator_clarity", "ease_of_use", "house_visualization", "option_completeness"],
            showAsChart: true,
        },
        {
            groupName: "Process Understanding",
            description: "Clarity of purchase process",
            questions: ["payment_understanding", "included_services", "customer_responsibilities", "timeline_clarity"],
            showAsChart: true,
        },
        {
            groupName: "Trust & Confidence",
            description: "Brand trust and confidence building",
            questions: ["trust_building", "philosophy_clarity", "values_alignment", "differentiation"],
            showAsChart: false, // Show as table only
        },
    ],
};

// ========================================
// CHARTS AND VISUALIZATIONS
// ========================================
// Configure what charts and graphs are displayed

export const CHART_CONFIG = {
    // Main dashboard charts
    dashboardCharts: [
        {
            id: "completion_funnel",
            title: "Test Completion Funnel",
            description: "Where users drop off during the test",
            type: "funnel", // funnel, bar, line, pie, scatter
            showByDefault: true,
            position: 1,
        },
        {
            id: "rating_distribution",
            title: "Rating Distribution",
            description: "Distribution of overall experience ratings",
            type: "bar",
            showByDefault: true,
            position: 2,
        },
        {
            id: "device_breakdown",
            title: "Device Usage",
            description: "Mobile vs Desktop usage",
            type: "pie",
            showByDefault: true,
            position: 3,
        },
        {
            id: "time_analysis",
            title: "Completion Time Analysis",
            description: "How long users take for each section",
            type: "bar",
            showByDefault: false, // Hidden by default, can be enabled
            position: 4,
        },
    ],

    // Detailed analysis charts
    detailedCharts: [
        {
            id: "purchase_intent_factors",
            title: "Purchase Intent Correlation",
            description: "Which factors correlate with purchase likelihood",
            type: "scatter",
            xAxis: "purchase_likelihood",
            yAxis: "overall_experience",
        },
        {
            id: "page_performance",
            title: "Page-by-Page Performance",
            description: "Average ratings for each page section",
            type: "line",
        },
        {
            id: "improvement_priorities",
            title: "Improvement Priority Matrix",
            description: "Impact vs Effort for identified issues",
            type: "scatter",
        },
    ],
};

// ========================================
// DATA EXPORT CONFIGURATION
// ========================================
// Controls what data can be exported and in what format

export const EXPORT_CONFIG = {
    // Available export formats
    formats: [
        {
            id: "summary_report",
            name: "Executive Summary",
            description: "High-level metrics and key insights",
            format: "pdf", // pdf, excel, csv, json
            includeCharts: true,
            sections: ["summary", "critical_metrics", "key_insights", "recommendations"],
        },
        {
            id: "detailed_data",
            name: "Detailed Data Export",
            description: "All responses and metrics",
            format: "excel",
            includeCharts: false,
            sections: ["raw_data", "calculated_metrics", "user_feedback"],
        },
        {
            id: "presentation_slides",
            name: "Presentation Ready",
            description: "Charts and key metrics for presentations",
            format: "pdf",
            includeCharts: true,
            sections: ["key_charts", "summary_metrics", "action_items"],
        },
    ],

    // Custom report sections
    reportSections: [
        {
            id: "executive_summary",
            title: "Executive Summary",
            description: "Key findings and recommendations",
            includeByDefault: true,
            content: ["total_tests", "completion_rate", "key_insights", "priority_actions"],
        },
        {
            id: "user_experience_analysis",
            title: "User Experience Analysis",
            description: "Detailed UX metrics and feedback",
            includeByDefault: true,
            content: ["rating_analysis", "usability_scores", "user_feedback", "pain_points"],
        },
        {
            id: "conversion_analysis",
            title: "Conversion & Purchase Intent",
            description: "Purchase likelihood and conversion factors",
            includeByDefault: true,
            content: ["purchase_intent", "conversion_funnel", "barrier_analysis", "recommendations"],
        },
        {
            id: "technical_performance",
            title: "Technical Performance",
            description: "Error rates, device performance, technical issues",
            includeByDefault: false, // Optional section
            content: ["error_analysis", "device_performance", "loading_times", "technical_issues"],
        },
    ],
};

// ========================================
// ALERT AND NOTIFICATION THRESHOLDS
// ========================================
// Configure when to show alerts for concerning metrics

export const ALERT_THRESHOLDS = {
    // Critical alerts (red)
    critical: [
        {
            metric: "completion_rate",
            threshold: 50, // Alert if below 50%
            message: "Low completion rate - investigate user drop-off points",
        },
        {
            metric: "average_rating",
            threshold: 5.0, // Alert if below 5/10
            message: "Poor user experience ratings - immediate attention needed",
        },
        {
            metric: "error_rate",
            threshold: 10, // Alert if above 10%
            message: "High error rate - check for technical issues",
        },
    ],

    // Warning alerts (yellow)
    warning: [
        {
            metric: "completion_rate",
            threshold: 70, // Warn if below 70%
            message: "Completion rate could be improved",
        },
        {
            metric: "purchase_likelihood",
            threshold: 6.0, // Warn if below 6/10
            message: "Purchase intent lower than target",
        },
        {
            metric: "configurator_satisfaction",
            threshold: 7.0, // Warn if below 7/10
            message: "Configurator usability needs attention",
        },
    ],

    // Success thresholds (green)
    success: [
        {
            metric: "completion_rate",
            threshold: 85, // Success if above 85%
            message: "Excellent completion rate!",
        },
        {
            metric: "average_rating",
            threshold: 8.0, // Success if above 8/10
            message: "Outstanding user satisfaction!",
        },
        {
            metric: "purchase_likelihood",
            threshold: 7.5, // Success if above 7.5/10
            message: "Strong purchase intent!",
        },
    ],
};

// ========================================
// FILTER AND SEGMENTATION OPTIONS
// ========================================
// Controls how data can be filtered and segmented

export const FILTER_CONFIG = {
    // Time-based filters
    timeFilters: [
        { id: "24h", label: "Last 24 Hours", value: 1 },
        { id: "7d", label: "Last 7 Days", value: 7 },
        { id: "30d", label: "Last 30 Days", value: 30 },
        { id: "90d", label: "Last 90 Days", value: 90 },
        { id: "all", label: "All Time", value: null },
    ],

    // Segmentation options
    segments: [
        {
            id: "device_type",
            label: "Device Type",
            options: ["mobile", "desktop", "tablet"],
            showByDefault: true,
        },
        {
            id: "completion_status",
            label: "Completion Status",
            options: ["completed", "abandoned", "in_progress"],
            showByDefault: true,
        },
        {
            id: "rating_range",
            label: "Rating Range",
            options: ["high (8-10)", "medium (5-7)", "low (1-4)"],
            showByDefault: false,
        },
        {
            id: "test_duration",
            label: "Test Duration",
            options: ["quick (<10min)", "normal (10-20min)", "long (>20min)"],
            showByDefault: false,
        },
    ],
};

// ========================================
// DASHBOARD LAYOUT CONFIGURATION
// ========================================
// Controls the layout and organization of the admin dashboard

export const LAYOUT_CONFIG = {
    // Main sections and their order
    sections: [
        {
            id: "summary_metrics",
            title: "Key Metrics Overview",
            position: 1,
            collapsible: false,
            showByDefault: true,
        },
        {
            id: "critical_questions",
            title: "Critical Question Analysis",
            position: 2,
            collapsible: true,
            showByDefault: true,
        },
        {
            id: "charts_visualization",
            title: "Charts & Visualizations",
            position: 3,
            collapsible: true,
            showByDefault: true,
        },
        {
            id: "recent_tests",
            title: "Recent Test Results",
            position: 4,
            collapsible: true,
            showByDefault: true,
        },
        {
            id: "detailed_analysis",
            title: "Detailed Analysis",
            position: 5,
            collapsible: true,
            showByDefault: false, // Hidden by default
        },
        {
            id: "export_tools",
            title: "Export & Reports",
            position: 6,
            collapsible: true,
            showByDefault: false, // Hidden by default
        },
    ],

    // Refresh and update settings
    refreshSettings: {
        autoRefresh: true,
        refreshInterval: 30, // seconds
        showLastUpdated: true,
        allowManualRefresh: true,
    },
};

/**
 * ========================================
 * EDITING GUIDELINES FOR TEAM REVIEW
 * ========================================
 * 
 * TO MODIFY DISPLAYED METRICS:
 * 1. Edit SUMMARY_METRICS to change the main dashboard cards
 * 2. Change titles, descriptions, icons, and colors
 * 3. Adjust priority to change display order
 * 
 * TO HIGHLIGHT DIFFERENT QUESTIONS:
 * 1. Edit criticalQuestions in QUESTION_ANALYSIS_CONFIG
 * 2. Add/remove questions from questionGroups
 * 3. Adjust targetScore for success benchmarks
 * 
 * TO CUSTOMIZE CHARTS:
 * 1. Edit CHART_CONFIG to show/hide charts
 * 2. Change chart types (bar, line, pie, funnel, scatter)
 * 3. Modify showByDefault to control initial visibility
 * 
 * TO ADJUST ALERT THRESHOLDS:
 * 1. Edit ALERT_THRESHOLDS values
 * 2. Change threshold numbers for warnings/alerts
 * 3. Modify alert messages
 * 
 * TO CHANGE EXPORT OPTIONS:
 * 1. Edit EXPORT_CONFIG formats and sections
 * 2. Add/remove report sections
 * 3. Control what data is included in exports
 * 
 * AVAILABLE CHART TYPES:
 * - "bar": Bar charts for comparisons
 * - "line": Line charts for trends over time
 * - "pie": Pie charts for proportions
 * - "funnel": Funnel charts for conversion analysis
 * - "scatter": Scatter plots for correlations
 * 
 * AVAILABLE COLORS:
 * - "blue": Primary metrics
 * - "green": Success/positive metrics
 * - "yellow": Warning/attention metrics
 * - "red": Critical/negative metrics
 * - "purple": Secondary/neutral metrics
 * 
 * BEST PRACTICES:
 * - Keep critical metrics visible by default
 * - Use appropriate chart types for data
 * - Set realistic target scores
 * - Provide clear descriptions for all metrics
 * - Group related questions together
 */
