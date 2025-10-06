import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export interface CustomerInquiryData {
    inquiryId: string;
    name: string;
    email: string;
    phone?: string;
    message?: string;
    requestType: 'contact' | 'appointment';
    preferredContact: 'EMAIL' | 'PHONE' | 'WHATSAPP';
    appointmentDateTime?: string;
    configurationData?: Record<string, unknown>;
    totalPrice?: number;
}

export interface AdminNotificationData extends CustomerInquiryData {
    sessionId?: string;
    clientIP?: string;
    userAgent?: string;
}

export class EmailService {
    private static readonly FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    private static readonly ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@nest-haus.at';
    private static readonly SALES_EMAIL = process.env.SALES_EMAIL || 'sales@nest-haus.at';

    /**
     * Send confirmation email to customer
     */
    static async sendCustomerConfirmation(data: CustomerInquiryData): Promise<boolean> {
        try {
            console.log(`📧 Sending customer confirmation email to ${data.email}`);

            const subject = data.requestType === 'appointment'
                ? 'Terminanfrage bei NEST-Haus erhalten'
                : 'Ihre Anfrage bei NEST-Haus';

            const htmlContent = this.generateCustomerEmailHTML(data);
            const textContent = this.generateCustomerEmailText(data);

            const result = await resend.emails.send({
                from: this.FROM_EMAIL,
                to: data.email,
                subject,
                html: htmlContent,
                text: textContent,
            });

            console.log('✅ Customer email sent successfully:', result.data?.id);
            return true;

        } catch (error) {
            console.error('❌ Failed to send customer email:', error);
            return false;
        }
    }

    /**
     * Send notification email to admin
     */
    static async sendAdminNotification(data: AdminNotificationData): Promise<boolean> {
        try {
            console.log(`📧 Sending admin notification for inquiry ${data.inquiryId}`);

            const subject = data.requestType === 'appointment'
                ? `🗓️ Neue Terminanfrage von ${data.name}`
                : `📧 Neue Kontaktanfrage von ${data.name}`;

            const htmlContent = this.generateAdminEmailHTML(data);
            const textContent = this.generateAdminEmailText(data);

            // Send to both admin and sales email
            const recipients = [this.ADMIN_EMAIL];
            if (this.SALES_EMAIL !== this.ADMIN_EMAIL) {
                recipients.push(this.SALES_EMAIL);
            }

            const result = await resend.emails.send({
                from: this.FROM_EMAIL,
                to: recipients,
                subject,
                html: htmlContent,
                text: textContent,
            });

            console.log('✅ Admin email sent successfully:', result.data?.id);
            return true;

        } catch (error) {
            console.error('❌ Failed to send admin email:', error);
            return false;
        }
    }

    /**
     * Generate HTML email content for customer
     */
    private static generateCustomerEmailHTML(data: CustomerInquiryData): string {
        const configurationSummary = data.configurationData ? this.generateConfigurationSummary(data.configurationData) : '';
        const appointmentInfo = data.requestType === 'appointment' && data.appointmentDateTime
            ? `<p><strong>Gewünschter Termin:</strong> ${new Date(data.appointmentDateTime).toLocaleString('de-DE')}</p>`
            : '';

        return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NEST-Haus Bestätigung</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2c5530; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .highlight { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .footer { text-align: center; margin-top: 30px; font-size: 0.9em; color: #666; }
    .button { display: inline-block; background: #2c5530; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>NEST-Haus</h1>
    <p>Modulare Häuser für nachhaltiges Wohnen</p>
  </div>
  
  <div class="content">
    <h2>Vielen Dank für Ihre ${data.requestType === 'appointment' ? 'Terminanfrage' : 'Anfrage'}!</h2>
    
    <p>Liebe/r ${data.name},</p>
    
    <p>wir haben Ihre ${data.requestType === 'appointment' ? 'Terminanfrage' : 'Anfrage'} erfolgreich erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
    
    ${appointmentInfo}
    
    <div class="highlight">
      <h3>Ihre Kontaktdaten:</h3>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>E-Mail:</strong> ${data.email}</p>
      ${data.phone ? `<p><strong>Telefon:</strong> ${data.phone}</p>` : ''}
      <p><strong>Bevorzugter Kontakt:</strong> ${this.getContactMethodText(data.preferredContact)}</p>
      ${data.message ? `<p><strong>Nachricht:</strong> ${data.message}</p>` : ''}
    </div>
    
    ${configurationSummary}
    
    <div class="highlight">
      <h3>Nächste Schritte:</h3>
      <ul>
        <li>${data.requestType === 'appointment'
                ? 'Wir melden uns innerhalb von 24 Stunden für die Terminbestätigung'
                : 'Wir melden uns innerhalb von 2 Werktagen bei Ihnen'}</li>
        <li>Persönliche Beratung zu Ihrem Traumhaus</li>
        <li>Detaillierte Kostenaufstellung</li>
        <li>Planungsservice und Baubegleitung</li>
      </ul>
    </div>
    
    <p>Bei Fragen können Sie uns jederzeit kontaktieren:</p>
    <p>📧 E-Mail: hello@nest-haus.at<br>
    📞 Telefon: +43 384 775 090</p>
    
    <a href="https://nest-haus.at/konfigurator" class="button">Konfiguration fortsetzen</a>
  </div>
  
  <div class="footer">
    <p>© 2025 NEST-Haus | SustainNest GmbH<br>
    Karmeliterplatz 8, 8010 Graz, Österreich</p>
  </div>
</body>
</html>`;
    }

    /**
     * Generate text email content for customer
     */
    private static generateCustomerEmailText(data: CustomerInquiryData): string {
        const appointmentInfo = data.requestType === 'appointment' && data.appointmentDateTime
            ? `Gewünschter Termin: ${new Date(data.appointmentDateTime).toLocaleString('de-DE')}\n\n`
            : '';

        return `
NEST-Haus - ${data.requestType === 'appointment' ? 'Terminanfrage' : 'Anfrage'} Bestätigung

Liebe/r ${data.name},

vielen Dank für Ihre ${data.requestType === 'appointment' ? 'Terminanfrage' : 'Anfrage'}! Wir haben sie erfolgreich erhalten.

${appointmentInfo}Ihre Kontaktdaten:
- Name: ${data.name}
- E-Mail: ${data.email}
${data.phone ? `- Telefon: ${data.phone}\n` : ''}- Bevorzugter Kontakt: ${this.getContactMethodText(data.preferredContact)}
${data.message ? `- Nachricht: ${data.message}\n` : ''}
Nächste Schritte:
- ${data.requestType === 'appointment'
                ? 'Wir melden uns innerhalb von 24 Stunden für die Terminbestätigung'
                : 'Wir melden uns innerhalb von 2 Werktagen bei Ihnen'}
- Persönliche Beratung zu Ihrem Traumhaus
- Detaillierte Kostenaufstellung
- Planungsservice und Baubegleitung

Kontakt:
E-Mail: hello@nest-haus.at
Telefon: +43 384 775 090

Besuchen Sie uns: https://nest-haus.at

© 2025 NEST-Haus | SustainNest GmbH
Karmeliterplatz 8, 8010 Graz, Österreich
`;
    }

    /**
     * Generate HTML email content for admin
     */
    private static generateAdminEmailHTML(data: AdminNotificationData): string {
        const configurationSummary = data.configurationData ? this.generateConfigurationSummary(data.configurationData) : '';
        const appointmentInfo = data.requestType === 'appointment' && data.appointmentDateTime
            ? `<p><strong>Gewünschter Termin:</strong> ${new Date(data.appointmentDateTime).toLocaleString('de-DE')}</p>`
            : '';

        return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neue Kundenanfrage - NEST-Haus</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px; }
    .header { background: #d32f2f; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .priority { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .customer-info { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .technical-info { background: #f3e5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .button { display: inline-block; background: #d32f2f; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🚨 Neue Kundenanfrage</h1>
    <p>NEST-Haus Admin Dashboard</p>
  </div>
  
  <div class="content">
    ${data.requestType === 'appointment' ?
                '<div class="priority"><h3>⏰ TERMINANFRAGE - Hohe Priorität</h3><p>Kunde möchte einen Termin vereinbaren. Bitte innerhalb von 24 Stunden antworten!</p></div>' :
                '<div class="priority"><h3>📧 Neue Kontaktanfrage</h3><p>Antwort innerhalb von 2 Werktagen empfohlen.</p></div>'
            }
    
    <div class="customer-info">
      <h3>👤 Kundendaten:</h3>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>E-Mail:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
      ${data.phone ? `<p><strong>Telefon:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>` : ''}
      <p><strong>Bevorzugter Kontakt:</strong> ${this.getContactMethodText(data.preferredContact)}</p>
      ${appointmentInfo}
      ${data.message ? `<p><strong>Nachricht:</strong><br>${data.message}</p>` : ''}
    </div>
    
    ${configurationSummary}
    
    <div class="technical-info">
      <h3>🔧 Technische Informationen:</h3>
      <p><strong>Anfrage-ID:</strong> ${data.inquiryId}</p>
      ${data.sessionId ? `<p><strong>Session-ID:</strong> ${data.sessionId}</p>` : ''}
      <p><strong>Zeitstempel:</strong> ${new Date().toLocaleString('de-DE')}</p>
      ${data.clientIP ? `<p><strong>IP-Adresse:</strong> ${data.clientIP}</p>` : ''}
      ${data.userAgent ? `<p><strong>Browser:</strong> ${data.userAgent}</p>` : ''}
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://nest-haus.at/admin/customer-inquiries/${data.inquiryId}" class="button">Anfrage bearbeiten</a>
      <a href="mailto:${data.email}?subject=Re: Ihre Anfrage bei NEST-Haus" class="button">E-Mail antworten</a>
      ${data.phone ? `<a href="tel:${data.phone}" class="button">Anrufen</a>` : ''}
    </div>
  </div>
</body>
</html>`;
    }

    /**
     * Generate text email content for admin
     */
    private static generateAdminEmailText(data: AdminNotificationData): string {
        const appointmentInfo = data.requestType === 'appointment' && data.appointmentDateTime
            ? `Gewünschter Termin: ${new Date(data.appointmentDateTime).toLocaleString('de-DE')}\n`
            : '';

        return `
NEST-Haus - Neue Kundenanfrage

${data.requestType === 'appointment' ? '⏰ TERMINANFRAGE - Hohe Priorität' : '📧 Neue Kontaktanfrage'}

Kundendaten:
- Name: ${data.name}
- E-Mail: ${data.email}
${data.phone ? `- Telefon: ${data.phone}\n` : ''}- Bevorzugter Kontakt: ${this.getContactMethodText(data.preferredContact)}
${appointmentInfo}${data.message ? `- Nachricht: ${data.message}\n` : ''}
${data.totalPrice ? `- Konfigurationswert: €${(data.totalPrice / 100).toLocaleString('de-DE')}\n` : ''}
Technische Informationen:
- Anfrage-ID: ${data.inquiryId}
${data.sessionId ? `- Session-ID: ${data.sessionId}\n` : ''}- Zeitstempel: ${new Date().toLocaleString('de-DE')}

Admin-Panel: https://nest-haus.at/admin/customer-inquiries/${data.inquiryId}
E-Mail antworten: mailto:${data.email}?subject=Re: Ihre Anfrage bei NEST-Haus
`;
    }

    /**
     * Generate configuration summary for email
     */
    private static generateConfigurationSummary(configData: Record<string, unknown>): string {
        if (!configData) return '';

        const items = [];

        // Extract configuration items
        if (configData.nest?.name) items.push(`Nest-Modell: ${configData.nest.name}`);
        if (configData.gebaeudehuelle?.name) items.push(`Gebäudehülle: ${configData.gebaeudehuelle.name}`);
        if (configData.innenverkleidung?.name) items.push(`Innenverkleidung: ${configData.innenverkleidung.name}`);
        if (configData.fussboden?.name) items.push(`Fußboden: ${configData.fussboden.name}`);
        if (configData.pvanlage?.name) items.push(`PV-Anlage: ${configData.pvanlage.name}`);
        if (configData.fenster?.name) items.push(`Fenster: ${configData.fenster.name}`);
        if (configData.planungspaket?.name) items.push(`Planungspaket: ${configData.planungspaket.name}`);
        if (configData.grundstueckscheck?.name) items.push(`Grundstückscheck: ${configData.grundstueckscheck.name}`);

        if (items.length === 0) return '';

        const totalPrice = configData.totalPrice ? `<p><strong>Gesamtpreis:</strong> €${(configData.totalPrice / 100).toLocaleString('de-DE')}</p>` : '';

        return `
    <div class="highlight">
      <h3>🏠 Konfiguration:</h3>
      <ul>
        ${items.map(item => `<li>${item}</li>`).join('')}
      </ul>
      ${totalPrice}
    </div>`;
    }

    /**
     * Convert contact method enum to readable text
     */
    private static getContactMethodText(method: string): string {
        switch (method) {
            case 'EMAIL': return 'E-Mail';
            case 'PHONE': return 'Telefon';
            case 'WHATSAPP': return 'WhatsApp';
            default: return method;
        }
    }
}
