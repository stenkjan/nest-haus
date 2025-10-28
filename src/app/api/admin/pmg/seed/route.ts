import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdminAuth } from '@/lib/admin-auth';

const prisma = new PrismaClient();

const initialProjectData = [
    { taskId: "P1", task: "Phase 1: Rechtliche Basis & Kontaktfunnel", responsible: "ALLE", startDate: "2025-10-06", endDate: "2025-10-09", duration: 4, milestone: false, priority: "HOCH", notes: "Fokus auf essenzielle Funktionalität und Rechtssicherheit." },
    { taskId: "1.1", task: "Impressum, Datenschutz, Kontakt (Basis-Setup)", responsible: "JST", startDate: "2025-10-06", endDate: "2025-10-07", duration: 2, milestone: false, priority: "HOCH", notes: "Implementierung Google Kalender/Mail Anbindung." },
    { taskId: "1.2", task: "E-Commerce & Rechtliche Klärung (Basis)", responsible: "JST", startDate: "2025-10-06", endDate: "2025-10-07", duration: 2, milestone: false, priority: "MITTEL", notes: "Integration von Stripe (Basis)." },
    { taskId: "1.3", task: "Baugesetzüberprüfung/Gewerberecht & Trademark ®", responsible: "JWS", startDate: "2025-10-06", endDate: "2025-10-08", duration: 3, milestone: false, priority: "HOCH", notes: "Erste Abklärung mit Benji Freundin." },
    { taskId: "1.4", task: "Kundenprobleme eruieren (UPS)", responsible: "JWS", startDate: "2025-10-08", endDate: "2025-10-08", duration: 1, milestone: false, priority: "MITTEL", notes: "Basis für die 'Warum Wir'-Struktur schaffen." },
    { taskId: "1.5", task: "UX/UI Planung: Vorentwurf & CTAs positionieren", responsible: "iNEST", startDate: "2025-10-06", endDate: "2025-10-08", duration: 3, milestone: false, priority: "HOCH", notes: "Vorbereitung für die UI-Umsetzung in P2." },
    { taskId: "M1", task: "MEETING GF: Abnahme Phase 1 (BGr, MSc)", responsible: "ALLE", startDate: "2025-10-08", endDate: "2025-10-08", duration: 1, milestone: true, priority: "HOCH", notes: "Reguläres Team-Meeting (Do 16:30) und Geschäftsführungs-Meeting." },
    { taskId: "P2", task: "Phase 2: UX/UI-Fokus & Kernfunktionalität", responsible: "ALLE", startDate: "2025-10-10", endDate: "2025-10-17", duration: 8, milestone: false, priority: "HOCH", notes: "Ziel: Beratungsgespräch-Funnel optisch und funktional verbessern." },
    { taskId: "2.1", task: "Vorentwurf stärker positionieren (UX/UI Umsetzung)", responsible: "iNEST", startDate: "2025-10-10", endDate: "2025-10-15", duration: 6, milestone: false, priority: "HOCH", notes: "Umsetzung 'ohne Konfiguration fortfahren' / auf Pages / im Warenkorb." },
    { taskId: "2.2", task: "Darstellung Haus auf realistischer Basis (Grafik-Tausch)", responsible: "iNEST", startDate: "2025-10-10", endDate: "2025-10-15", duration: 6, milestone: false, priority: "HOCH", notes: "Austausch von 1-2 Grafiken." },
    { taskId: "2.3", task: "Konfigurator Fehlerbehebung (Overlays, Mismatch, Ansichten)", responsible: "JST", startDate: "2025-10-10", endDate: "2025-10-17", duration: 8, milestone: false, priority: "HOCH", notes: "Stirn-/Seiten-/Fensteransicht, Videos/3D." },
    { taskId: "2.4", task: "Code aufräumen und optimieren (Klassen, Components)", responsible: "JWS, JST", startDate: "2025-10-10", endDate: "2025-10-17", duration: 8, milestone: false, priority: "MITTEL", notes: "Basis schaffen für saubere Weiterentwicklung." },
    { taskId: "M2", task: "TEAM-MEETING: Review UX/UI Phase 2", responsible: "ALLE", startDate: "2025-10-15", endDate: "2025-10-15", duration: 1, milestone: true, priority: "HOCH", notes: "Reguläres Team-Meeting (Mi)." },
    { taskId: "P3", task: "Phase 3: Finalisierung Inhalte & Kaufprozess", responsible: "ALLE", startDate: "2025-10-20", endDate: "2025-10-24", duration: 5, milestone: false, priority: "HOCH", notes: "Ziel: Alle Texte und der Bezahlschritt stehen." },
    { taskId: "3.1", task: "Kaufprozess Bezahlen (Stripe) End-Implementierung", responsible: "JST", startDate: "2025-10-20", endDate: "2025-10-22", duration: 3, milestone: false, priority: "HOCH", notes: "Finales Checkout-Erlebnis." },
    { taskId: "3.2", task: "Mit Markus abstimmen: Texte ändern/anpassen", responsible: "ALLE", startDate: "2025-10-20", endDate: "2025-10-22", duration: 3, milestone: false, priority: "HOCH", notes: "Aktualisierung der Überschriften und Texte." },
    { taskId: "3.3", task: "'Warum Wir'-Struktur (iNEST) & Inhalte (JWS)", responsible: "iNEST, JWS", startDate: "2025-10-23", endDate: "2025-10-24", duration: 2, milestone: false, priority: "MITTEL", notes: "Struktur, Über uns, Referenzen (Zarnhofer, TU Graz)." },
    { taskId: "M3", task: "TEAM-MEETING: Content-Freeze & Funktionalität", responsible: "ALLE", startDate: "2025-10-24", endDate: "2025-10-24", duration: 1, milestone: true, priority: "HOCH", notes: "Abnahme aller Inhalte und Checkout-Prozesse (Do 16:30)." },
    { taskId: "P4", task: "Phase 4: Funnel-Feinschliff & End-Polishing", responsible: "ALLE", startDate: "2025-10-27", endDate: "2025-11-06", duration: 11, milestone: false, priority: "HOCH", notes: "Fokus: Letzte UX-Optimierungen vor dem Launch-Check." },
    { taskId: "4.1", task: "Video vom Nest Bau einbinden (Video kommt 10.11)", responsible: "JWS", startDate: "2025-10-27", endDate: "2025-10-30", duration: 4, milestone: false, priority: "MITTEL", notes: "Platzhalter-Logik erstellen." },
    { taskId: "4.2", task: "Warenkorb letzte Page & Footer/Lightboxen Funktionalität", responsible: "JST", startDate: "2025-10-27", endDate: "2025-11-03", duration: 8, milestone: false, priority: "MITTEL", notes: "Code-Fixes/UX-Endpunkt." },
    { taskId: "4.3", task: "UX/UI Finalisierung (Buttons, Zurück bei Warenkorb)", responsible: "iNEST", startDate: "2025-10-27", endDate: "2025-11-03", duration: 8, milestone: false, priority: "HOCH", notes: "Einarbeitung aller gesammelten Feedbacks." },
    { taskId: "4.4", task: "Recherche Competitor", responsible: "iNEST", startDate: "2025-11-04", endDate: "2025-11-06", duration: 3, milestone: false, priority: "MITTEL", notes: "Vorbereitung für die Go-Live Strategie." },
    { taskId: "M4", task: "TEAM-MEETING: Go/No-Go Check", responsible: "ALLE", startDate: "2025-11-06", endDate: "2025-11-06", duration: 1, milestone: true, priority: "HOCH", notes: "End-Abnahme des Gesamtauftritts (Do 16:30)." },
    { taskId: "P5", task: "Phase 5: Puffer, Testing & Launch", responsible: "ALLE", startDate: "2025-11-07", endDate: "2025-11-15", duration: 9, milestone: false, priority: "HOCH", notes: "Pufferzeit zur Fehlerbehebung und finale Vorbereitung." },
    { taskId: "5.1", task: "End-to-End Testing (Customer Journey: Klick -> Beratung)", responsible: "ALLE", startDate: "2025-11-07", endDate: "2025-11-13", duration: 7, milestone: false, priority: "HOCH", notes: "Intensives Testing aller Funktionalitäten und des Konfigurators." },
    { taskId: "5.2", task: "Vorbereitung Launch / Monitoring-Setup", responsible: "JST, JWS", startDate: "2025-11-14", endDate: "2025-11-14", duration: 1, milestone: false, priority: "HOCH", notes: "Finaler Check der Systeme." },
    { taskId: "ZIEL", task: "PROJEKTZIEL ERREICHT: LAUNCH", responsible: "ALLE", startDate: "2025-11-15", endDate: "2025-11-15", duration: 1, milestone: true, priority: "HÖCHST", notes: "Website ist live und führt zum Beratungsgespräch." }
];

/**
 * POST /api/admin/pmg/seed - Seed the database with initial project data
 */
export async function POST(request: NextRequest) {
    try {
        // Validate admin authentication via cookie
        const authError = await requireAdminAuth(request);
        if (authError) return authError;

        // Clear existing data
        await prisma.projectTask.deleteMany();

        // Insert initial data
        const tasks = await Promise.all(
            initialProjectData.map(data =>
                prisma.projectTask.create({
                    data: {
                        taskId: data.taskId,
                        task: data.task,
                        responsible: data.responsible,
                        startDate: new Date(data.startDate),
                        endDate: new Date(data.endDate),
                        duration: data.duration,
                        milestone: data.milestone,
                        priority: data.priority as 'HÖCHST' | 'HOCH' | 'MITTEL' | 'NIEDRIG',
                        notes: data.notes,
                        status: 'PENDING'
                    }
                })
            )
        );

        return NextResponse.json({
            message: 'Database seeded successfully',
            tasksCreated: tasks.length
        });
    } catch (error) {
        console.error('Error seeding project tasks:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
