import { Resend } from 'resend';
import { GoogleCalendarService } from '../src/lib/GoogleCalendarService';
import { generateICS, generateICSFilename } from '../src/lib/utils/icsGenerator';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const resend = new Resend(process.env.RESEND_API_KEY);
const TARGET_EMAIL = 'm.janstenk@gmail.com';
const SENDER_EMAIL = process.env.RESEND_FROM_EMAIL || 'mail@nest-haus.com';

async function sendRoadmapInvites() {
  console.log(`🚀 Starting Roadmap Invites Script for ${TARGET_EMAIL}`);

  const now = new Date();
  // Start next Monday
  const startNextMonday = new Date(now);
  startNextMonday.setDate(now.getDate() + (8 - now.getDay())); 
  startNextMonday.setHours(9, 0, 0, 0);

  const phases = [
    {
      title: 'Week 1: Code Optimierung & Mobile First',
      description: 'Refactor Configurator, Safety Checks, Mobile Audit.',
      weekOffset: 0
    },
    {
      title: 'Week 2: Analysetool & SST Setup',
      description: 'Server-Side Tracking (Meta/Google), Admin Dashboard Integration.',
      weekOffset: 1
    },
    {
      title: 'Week 3: Stripe Go-Live & Final Launch',
      description: 'Stripe Production Switch, Real Money Test, SEO/Ads Final Polish.',
      weekOffset: 2
    }
  ];

  for (const phase of phases) {
    const startDate = new Date(startNextMonday);
    startDate.setDate(startDate.getDate() + (phase.weekOffset * 7));
    
    const endDate = new Date(startDate);
    endDate.setHours(10, 0, 0, 0); // 1 hour duration

    console.log(`📅 Scheduling: ${phase.title} for ${startDate.toLocaleString()}`);

    // Try to create Calendar Event (might fail due to permissions)
    try {
      const eventResult = await GoogleCalendarService.createEvent({
        summary: `NEST-Haus Roadmap: ${phase.title}`,
        description: phase.description,
        location: 'Remote / NEST-Haus HQ',
        startDateTime: startDate.toISOString(),
        endDateTime: endDate.toISOString(),
        attendeeEmail: TARGET_EMAIL,
        attendeeName: 'M. Janstenk'
      });
      if (!eventResult.success) {
        console.warn(`⚠️ Calendar API warning for ${phase.title}:`, eventResult.error);
      } else {
        console.log(`✅ Google Calendar Event Created: ${phase.title}`);
      }
    } catch (error) {
      console.warn(`⚠️ Calendar API error for ${phase.title} (proceeding with email):`, error);
    }

    // Generate ICS Attachment
    const icsContent = generateICS({
      inquiryId: `roadmap-week-${phase.weekOffset + 1}`,
      customerName: 'M. Janstenk',
      customerEmail: TARGET_EMAIL,
      appointmentDateTime: startDate,
      durationMinutes: 60,
      location: 'Remote / NEST-Haus HQ',
      description: `NEST-Haus Roadmap Phase: ${phase.title}\n\n${phase.description}`,
      organizerEmail: 'mail@nest-haus.at',
      organizerName: 'NEST-Haus Team'
    });

    try {
      // Send Notification Email via Resend with ICS
      await resend.emails.send({
        from: `NEST-Haus Team <${SENDER_EMAIL}>`,
        to: TARGET_EMAIL,
        subject: `Roadmap Invite: ${phase.title}`,
        html: `
          <h1>📅 Roadmap Phase Scheduled</h1>
          <h2>${phase.title}</h2>
          <p>${phase.description}</p>
          <p><strong>Date:</strong> ${startDate.toLocaleString()}</p>
          <p>Please accept the attached calendar invitation.</p>
        `,
        attachments: [{
          filename: generateICSFilename(`roadmap-week-${phase.weekOffset + 1}`),
          content: icsContent
        }]
      });
      console.log(`📧 Email Invite Sent: ${phase.title}`);
    } catch (error) {
      console.error(`❌ Failed to send email for ${phase.title}:`, error);
    }
  }

  console.log('🏁 Script execution completed.');
}

sendRoadmapInvites();
