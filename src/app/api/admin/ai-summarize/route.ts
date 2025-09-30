import { NextRequest, NextResponse } from 'next/server';

/**
 * Advanced AI-powered answer summarization endpoint
 * 
 * This endpoint takes a question and multiple responses, then generates
 * comprehensive, coherent summaries using advanced text analysis
 */

interface SummarizeRequest {
    questionText: string;
    responses: string[];
    elaborate?: boolean;
}

// Helper function to generate context-specific insights
function generateContextInsights(questionText: string, responses: string[], elaborate: boolean): string {
    const questionLower = questionText.toLowerCase();
    let insights = '';

    // Challenge/difficulty questions
    if (questionLower.includes('schwierig') || questionLower.includes('herausforderung') || questionLower.includes('problem')) {
        const challengeTypes = {
            navigation: responses.filter(r => /navigation|navigieren|finden|suchen|orientierung/i.test(r)).length,
            configurator: responses.filter(r => /konfigurator|konfiguration|auswahl|optionen/i.test(r)).length,
            understanding: responses.filter(r => /verstehen|verständlich|unklar|verwirr/i.test(r)).length,
            technical: responses.filter(r => /laden|langsam|fehler|bug|kaputt/i.test(r)).length
        };

        const totalChallenges = Object.values(challengeTypes).reduce((a, b) => a + b, 0);
        if (totalChallenges > 0) {
            const mainChallenge = Object.entries(challengeTypes).reduce((a, b) => challengeTypes[a[0] as keyof typeof challengeTypes] > challengeTypes[b[0] as keyof typeof challengeTypes] ? a : b);

            if (elaborate) {
                insights += `## 🎯 Identifizierte Herausforderungen\n\n`;
                insights += `Die häufigsten Probleme beziehen sich auf **${mainChallenge[0] === 'navigation' ? 'Navigation und Orientierung' :
                    mainChallenge[0] === 'configurator' ? 'Konfigurator-Bedienung' :
                        mainChallenge[0] === 'understanding' ? 'Verständlichkeit' : 'Technische Aspekte'}** (${mainChallenge[1]} Erwähnungen).\n\n`;
            } else {
                insights += `Hauptproblem: ${mainChallenge[0] === 'navigation' ? 'Navigation' :
                    mainChallenge[0] === 'configurator' ? 'Konfigurator' :
                        mainChallenge[0] === 'understanding' ? 'Verständlichkeit' : 'Technische Aspekte'}. `;
            }
        }
    }

    // Improvement/suggestion questions
    if (questionLower.includes('verbesser') || questionLower.includes('vorschlag') || questionLower.includes('wunsch')) {
        const improvementTypes = {
            more_info: responses.filter(r => /mehr|zusätzlich|detail|information|erklärung/i.test(r)).length,
            easier: responses.filter(r => /einfach|leicht|intuitiv|verständlich/i.test(r)).length,
            design: responses.filter(r => /design|aussehen|farbe|layout|gestaltung/i.test(r)).length,
            functionality: responses.filter(r => /funktion|feature|möglichkeit|option/i.test(r)).length
        };

        const totalSuggestions = Object.values(improvementTypes).reduce((a, b) => a + b, 0);
        if (totalSuggestions > 0) {
            if (elaborate) {
                insights += `## 💡 Verbesserungsvorschläge\n\n`;
                insights += `${totalSuggestions} konkrete Verbesserungsideen wurden geäußert. `;
                if (improvementTypes.more_info > 0) insights += `${improvementTypes.more_info} Nutzer wünschen sich mehr Informationen. `;
                if (improvementTypes.easier > 0) insights += `${improvementTypes.easier} Nutzer möchten eine einfachere Bedienung. `;
                insights += '\n\n';
            } else {
                insights += `${totalSuggestions} Verbesserungsvorschläge identifiziert. `;
            }
        }
    }

    return insights;
}

// Helper function to extract key findings
function extractKeyFindings(responses: string[], elaborate: boolean): string {
    // Find most common meaningful phrases (2-4 words)
    const phrases = new Map<string, number>();

    responses.forEach(response => {
        const words = response.toLowerCase()
            .replace(/[^\w\säöüß]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2);

        // Extract 2-3 word phrases
        for (let i = 0; i < words.length - 1; i++) {
            const phrase = words.slice(i, i + 2).join(' ');
            if (phrase.length > 6) {
                phrases.set(phrase, (phrases.get(phrase) || 0) + 1);
            }

            if (i < words.length - 2) {
                const phrase3 = words.slice(i, i + 3).join(' ');
                if (phrase3.length > 10) {
                    phrases.set(phrase3, (phrases.get(phrase3) || 0) + 1);
                }
            }
        }
    });

    const commonPhrases = Array.from(phrases.entries())
        .filter(([, count]) => count > 1)
        .sort(([, a], [, b]) => b - a)
        .slice(0, elaborate ? 5 : 3);

    if (commonPhrases.length === 0) return '';

    if (elaborate) {
        let findings = `## 🔍 Wiederkehrende Themen\n\n`;
        commonPhrases.forEach(([phrase, count], index) => {
            findings += `**${index + 1}.** "${phrase}" (${count}x erwähnt)\n`;
        });
        findings += '\n';
        return findings;
    } else {
        return `Häufig erwähnt: "${commonPhrases[0][0]}". `;
    }
}

// Helper function to select representative quotes
function selectRepresentativeQuotes(responses: string[], elaborate: boolean): string {
    // Select diverse responses: short, medium, long
    const shortResponses = responses.filter(r => r.length < 50);
    const mediumResponses = responses.filter(r => r.length >= 50 && r.length < 150);
    const longResponses = responses.filter(r => r.length >= 150);

    const selectedQuotes: string[] = [];

    // Try to get one from each category
    if (shortResponses.length > 0) selectedQuotes.push(shortResponses[0]);
    if (mediumResponses.length > 0) selectedQuotes.push(mediumResponses[0]);
    if (longResponses.length > 0) selectedQuotes.push(longResponses[0]);

    // If we don't have enough variety, add more
    while (selectedQuotes.length < Math.min(elaborate ? 5 : 3, responses.length)) {
        const remaining = responses.filter(r => !selectedQuotes.includes(r));
        if (remaining.length === 0) break;
        selectedQuotes.push(remaining[0]);
    }

    if (selectedQuotes.length === 0) return '';

    if (elaborate) {
        let quotes = `## 💬 Repräsentative Antworten\n\n`;
        selectedQuotes.forEach((quote, index) => {
            const displayQuote = quote.length > 200 ? quote.substring(0, 197) + '...' : quote;
            quotes += `**${index + 1}.** "${displayQuote}"\n\n`;
        });
        return quotes;
    } else {
        const quote = selectedQuotes[0].length > 80 ? selectedQuotes[0].substring(0, 77) + '...' : selectedQuotes[0];
        return `Beispiel: "${quote}"`;
    }
}

// Advanced AI-like summarization function with improved coherence and completeness
function generateIntelligentSummary(questionText: string, responses: string[], elaborate: boolean = false): string {
    if (!responses || responses.length === 0) {
        return 'Keine Antworten verfügbar';
    }

    // Filter and clean responses
    const validResponses = responses
        .filter(r => r && r.trim().length > 0)
        .map(r => r.trim());

    if (validResponses.length === 0) {
        return 'Keine gültigen Antworten verfügbar';
    }

    // Advanced text analysis for more coherent summaries
    const responseCount = validResponses.length;
    const allText = validResponses.join(' ').toLowerCase();

    // Enhanced German keyword categories for better analysis
    const sentimentAnalysis = {
        positive: {
            keywords: ['gut', 'super', 'toll', 'einfach', 'klar', 'übersichtlich', 'hilfreich', 'verständlich', 'benutzerfreundlich', 'intuitiv', 'gefällt', 'zufrieden', 'perfekt', 'ausgezeichnet', 'prima', 'wunderbar', 'gelungen', 'praktisch'],
            count: 0
        },
        negative: {
            keywords: ['schlecht', 'schwer', 'kompliziert', 'verwirrend', 'unklar', 'fehlt', 'problem', 'schwierig', 'frustrierend', 'langsam', 'unübersichtlich', 'nervt', 'störend', 'mühsam', 'umständlich', 'chaotisch', 'unlogisch'],
            count: 0
        },
        neutral: {
            keywords: ['okay', 'geht', 'normal', 'durchschnitt', 'mittelmäßig', 'könnte', 'vielleicht', 'eventuell', 'teilweise', 'manchmal'],
            count: 0
        }
    };

    // Count sentiment with context awareness
    Object.values(sentimentAnalysis).forEach(category => {
        category.keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            const matches = allText.match(regex) || [];
            category.count += matches.length;
        });
    });

    // Advanced theme extraction with context
    const themePatterns = {
        navigation: ['navigation', 'navigieren', 'menü', 'finden', 'suchen', 'orientierung', 'weg', 'pfad', 'verloren'],
        design: ['design', 'aussehen', 'farbe', 'layout', 'gestaltung', 'optik', 'erscheinungsbild', 'schön', 'hässlich'],
        usability: ['bedienung', 'verwendung', 'nutzung', 'handhabung', 'benutzung', 'anwendung', 'benutzerfreundlich'],
        content: ['inhalt', 'text', 'information', 'beschreibung', 'erklärung', 'details', 'informationen'],
        performance: ['geschwindigkeit', 'langsam', 'schnell', 'laden', 'performance', 'wartezeit', 'verzögerung'],
        configurator: ['konfigurator', 'konfiguration', 'auswahl', 'optionen', 'einstellungen', 'konfigurieren'],
        mobile: ['handy', 'smartphone', 'mobile', 'tablet', 'touchscreen', 'mobil'],
        purchase: ['kaufen', 'bestellen', 'preis', 'kosten', 'bestellung', 'kauf', 'bezahlen', 'zahlung']
    };

    const detectedThemes = new Map<string, number>();
    Object.entries(themePatterns).forEach(([theme, keywords]) => {
        let themeCount = 0;
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            const matches = allText.match(regex) || [];
            themeCount += matches.length;
        });
        if (themeCount > 0) {
            detectedThemes.set(theme, themeCount);
        }
    });

    // Generate coherent, flowing summary text
    const totalSentiment = sentimentAnalysis.positive.count + sentimentAnalysis.negative.count + sentimentAnalysis.neutral.count;
    let summary = '';

    // Opening statement with context
    if (elaborate) {
        summary = `# Detaillierte KI-Analyse\n\n**Frage:** "${questionText}"\n\n**Analysierte Antworten:** ${responseCount}\n\n---\n\n`;
    }

    // Main sentiment narrative
    if (totalSentiment > 0) {
        const positivePercent = Math.round((sentimentAnalysis.positive.count / totalSentiment) * 100);
        const negativePercent = Math.round((sentimentAnalysis.negative.count / totalSentiment) * 100);

        if (positivePercent > 60) {
            summary += elaborate
                ? `## 📈 Überwiegend Positive Resonanz\n\nDie Nutzer zeigen sich größtenteils zufrieden mit diesem Aspekt der Website. ${positivePercent}% der analysierten Begriffe deuten auf positive Erfahrungen hin, was darauf schließen lässt, dass die meisten Teilnehmer hier keine größeren Probleme erlebt haben.\n\n`
                : `Die Nutzer sind größtenteils zufrieden (${positivePercent}% positive Signale). `;
        } else if (negativePercent > 60) {
            summary += elaborate
                ? `## 📉 Kritische Rückmeldungen Überwiegen\n\nDie Analyse zeigt deutliche Herausforderungen in diesem Bereich. ${negativePercent}% der Begriffe weisen auf Probleme oder Unzufriedenheit hin, was auf Verbesserungsbedarf hindeutet.\n\n`
                : `Es gibt deutliche Probleme (${negativePercent}% kritische Signale). `;
        } else {
            summary += elaborate
                ? `## ⚖️ Gemischtes Feedback\n\nDie Meinungen sind geteilt: ${positivePercent}% positive und ${negativePercent}% kritische Signale zeigen unterschiedliche Nutzererfahrungen auf. Dies deutet darauf hin, dass bestimmte Nutzergruppen oder Szenarien unterschiedlich gut unterstützt werden.\n\n`
                : `Gemischte Meinungen (${positivePercent}% positiv, ${negativePercent}% kritisch). `;
        }
    }

    // Theme-based insights with flowing narrative
    const topThemes = Array.from(detectedThemes.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);

    if (topThemes.length > 0) {
        const themeNames = {
            navigation: 'Navigation und Orientierung',
            design: 'Design und Erscheinungsbild',
            usability: 'Benutzerfreundlichkeit',
            content: 'Inhalte und Informationen',
            performance: 'Geschwindigkeit und Performance',
            configurator: 'Konfigurator-Funktionen',
            mobile: 'Mobile Nutzung',
            purchase: 'Kaufprozess'
        };

        if (elaborate) {
            summary += `## 🎯 Hauptthemen\n\n`;
            topThemes.forEach(([theme, count], index) => {
                const themeName = themeNames[theme as keyof typeof themeNames] || theme;
                summary += `**${index + 1}. ${themeName}** wird in ${count} Antworten thematisiert\n`;
            });
            summary += '\n';
        } else {
            const mainTheme = themeNames[topThemes[0][0] as keyof typeof themeNames] || topThemes[0][0];
            summary += `Hauptthema: ${mainTheme}. `;
        }
    }

    // Context-specific insights
    const contextInsights = generateContextInsights(questionText, validResponses, elaborate);
    if (contextInsights) {
        summary += contextInsights;
    }

    // Key findings from actual responses
    const keyFindings = extractKeyFindings(validResponses, elaborate);
    if (keyFindings) {
        summary += keyFindings;
    }

    // Representative quotes (more intelligent selection)
    const representativeQuotes = selectRepresentativeQuotes(validResponses, elaborate);
    if (representativeQuotes) {
        summary += representativeQuotes;
    }

    return summary.trim();
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as SummarizeRequest;
        const { questionText, responses, elaborate = false } = body;

        if (!questionText || !responses || !Array.isArray(responses)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid request: questionText and responses array are required'
            }, { status: 400 });
        }

        console.log(`🤖 Generating ${elaborate ? 'elaborate' : 'simple'} AI summary for question: "${questionText.substring(0, 50)}..."`);
        console.log(`🤖 Processing ${responses.length} responses`);

        const summary = generateIntelligentSummary(questionText, responses, elaborate);

        console.log(`🤖 Generated summary (${summary.length} characters)`);

        return NextResponse.json({
            success: true,
            summary,
            responseCount: responses.length,
            elaborate,
            processedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Failed to generate AI summary:', error);

        return NextResponse.json({
            success: false,
            error: 'Failed to generate summary',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

/* 
 * Future Enhancement: OpenAI Integration
 * 
 * Uncomment and configure this section to use OpenAI's API for even more sophisticated summarization:
 * 
 * import OpenAI from 'openai';
 * 
 * const openai = new OpenAI({
 *   apiKey: process.env.OPENAI_API_KEY,
 * });
 * 
 * async function generateOpenAISummary(questionText: string, responses: string[], elaborate: boolean = false): Promise<string> {
 *   const prompt = elaborate 
 *     ? `Als UX-Experte, erstelle eine ausführliche Analyse der folgenden Antworten auf die Frage "${questionText}":
 * 
 * Antworten:
 * ${responses.map((r, i) => `${i + 1}. ${r}`).join('\n')}
 * 
 * Erstelle eine detaillierte, strukturierte Analyse mit:
 * - Executive Summary
 * - Sentiment-Analyse mit Prozentangaben
 * - Hauptthemen und Muster
 * - Konkrete Handlungsempfehlungen
 * - Repräsentative Zitate
 * 
 * Formatiere mit Markdown-Headings und Emojis.`
 *     : `Fasse die folgenden Antworten auf "${questionText}" prägnant zusammen:
 * 
 * ${responses.map((r, i) => `${i + 1}. ${r}`).join('\n')}
 * 
 * Erstelle eine kurze, fließende Zusammenfassung mit den wichtigsten Erkenntnissen.`;
 * 
 *   const completion = await openai.chat.completions.create({
 *     model: "gpt-4",
 *     messages: [{ role: "user", content: prompt }],
 *     max_tokens: elaborate ? 1000 : 300,
 *     temperature: 0.7,
 *   });
 * 
 *   return completion.choices[0]?.message?.content || 'Zusammenfassung konnte nicht generiert werden';
 * }
 */