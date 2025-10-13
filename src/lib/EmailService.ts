import { Resend } from 'resend';

// Initialize Resend with API key - handle missing key gracefully during build
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  
  // Handle build-time placeholder key
  if (apiKey === 're_build_placeholder_key_123') {
    console.warn('⚠️  Using build placeholder - emails will be skipped');
    return null;
  }
  
  if (!apiKey) {
    console.warn('⚠️  RESEND_API_KEY not found - emails will be skipped');
    return null;
  }
  
  return new Resend(apiKey);
};

const resend = getResendClient();

export interface CustomerInquiryData {
  inquiryId: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  requestType: 'contact' | 'appointment';
  preferredContact: 'EMAIL' | 'PHONE' | 'WHATSAPP';
  appointmentDateTime?: string;
  configurationData?: unknown;
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

  // From name for better email presentation
  private static readonly FROM_NAME = 'NEST-Haus Team';

  /**
   * Send confirmation email to customer
   */
  static async sendCustomerConfirmation(data: CustomerInquiryData): Promise<boolean> {
    try {
      // Handle build-time when resend is null
      if (!resend) {
        console.warn('⚠️  Resend client not available - skipping email');
        return false;
      }

      console.log(`📧 Sending customer confirmation email to ${data.email}`);

      const subject = data.requestType === 'appointment'
        ? 'Terminanfrage bei NEST-Haus erhalten'
        : 'Ihre Anfrage bei NEST-Haus';

      const htmlContent = this.generateCustomerEmailHTML(data);
      const textContent = this.generateCustomerEmailText(data);

      const result = await resend.emails.send({
        from: `${this.FROM_NAME} <${this.FROM_EMAIL}>`,
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
      // Handle build-time when resend is null
      if (!resend) {
        console.warn('⚠️  Resend client not available - skipping admin notification');
        return false;
      }

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
        from: `${this.FROM_NAME} <${this.FROM_EMAIL}>`,
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
      ? `<p class="appointment-info"><strong>Gewünschter Termin:</strong> ${new Date(data.appointmentDateTime).toLocaleString('de-DE')}</p>`
      : '';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NEST-Haus Bestätigung</title>
  <style>
    /* Base styles matching website design system */
    * {
      letter-spacing: -0.015em;
      box-sizing: border-box;
    }
    
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6; 
      color: #171717; 
      margin: 0; 
      padding: 0;
      background-color: #ffffff;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    
    /* Header styling matching website header */
    .header { 
      background: #3B82F6; 
      color: white; 
      padding: 32px 24px; 
      text-align: center;
    }
    
    .header h1 {
      font-size: 32px;
      font-weight: bold;
      margin: 0 0 8px 0;
      letter-spacing: -0.02em;
    }
    
    .header p {
      font-size: 16px;
      margin: 0;
      opacity: 0.9;
    }
    
    /* Content area styling */
    .content { 
      background: #ffffff; 
      padding: 40px 32px;
    }
    
    /* Typography classes matching website */
    .h2-title {
      font-size: 28px;
      font-weight: 600;
      color: #171717;
      margin: 0 0 24px 0;
      letter-spacing: -0.02em;
    }
    
    .p-primary {
      font-size: 16px;
      color: #171717;
      line-height: 1.5;
      margin: 16px 0;
    }
    
    .h3-secondary {
      font-size: 18px;
      font-weight: 600;
      color: #171717;
      margin: 24px 0 12px 0;
      letter-spacing: -0.015em;
    }
    
    /* Info boxes matching website card styling */
    .info-box { 
      background: #F4F4F4; 
      padding: 24px; 
      border-radius: 16px; 
      margin: 24px 0;
      border: 1px solid #E5E7EB;
    }
    
    .info-box h3 {
      color: #171717;
      margin-top: 0;
    }
    
    .info-box p {
      margin: 8px 0;
    }
    
    .info-box ul {
      margin: 12px 0;
      padding-left: 20px;
    }
    
    .info-box li {
      margin: 8px 0;
      color: #171717;
    }
    
    /* Configuration summary styling */
    .config-summary {
      background: #EFF6FF;
      border: 1px solid #DBEAFE;
      border-radius: 16px;
      padding: 24px;
      margin: 24px 0;
    }
    
    .config-summary h3 {
      color: #1E40AF;
      margin-top: 0;
    }
    
    .config-summary ul {
      margin: 12px 0;
      padding-left: 20px;
    }
    
    .config-summary li {
      margin: 6px 0;
      color: #1E40AF;
    }
    
    .config-price {
      font-size: 18px;
      font-weight: 600;
      color: #1E40AF;
      margin-top: 16px;
    }
    
    /* Button styling matching website buttons */
    .button { 
      display: inline-block; 
      background: #3B82F6; 
      color: white; 
      padding: 12px 24px; 
      text-decoration: none; 
      border-radius: 9999px;
      font-weight: 500;
      font-size: 16px;
      margin: 24px 0;
      transition: background-color 0.3s ease;
      letter-spacing: -0.015em;
    }
    
    .button:hover {
      background: #2563EB;
    }
    
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    
    /* Contact info styling */
    .contact-info {
      background: #F9FAFB;
      padding: 20px;
      border-radius: 12px;
      margin: 24px 0;
      border-left: 4px solid #3B82F6;
    }
    
    .appointment-info {
      background: #FEF3C7;
      padding: 16px;
      border-radius: 12px;
      border-left: 4px solid #F59E0B;
      margin: 16px 0;
    }
    
    .appointment-info strong {
      color: #92400E;
    }
    
    /* Footer styling */
    .footer { 
      text-align: center; 
      padding: 32px 24px;
      background: #F9FAFB;
      border-top: 1px solid #E5E7EB;
      font-size: 14px; 
      color: #6B7280;
    }
    
    /* Responsive adjustments */
    @media (max-width: 640px) {
      .content {
        padding: 24px 20px;
      }
      
      .header {
        padding: 24px 20px;
      }
      
      .header h1 {
        font-size: 24px;
      }
      
      .h2-title {
        font-size: 24px;
      }
      
      .info-box, .config-summary {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
  <div class="header">
    <h1>NEST-Haus</h1>
    <p>Modulare Häuser für nachhaltiges Wohnen</p>
  </div>
  
  <div class="content">
      <h2 class="h2-title">Vielen Dank für Ihre ${data.requestType === 'appointment' ? 'Terminanfrage' : 'Anfrage'}!</h2>
    
      <p class="p-primary">Liebe/r ${data.name},</p>
    
      <p class="p-primary">wir haben Ihre ${data.requestType === 'appointment' ? 'Terminanfrage' : 'Anfrage'} erfolgreich erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
    
    ${appointmentInfo}
    
      <div class="info-box">
        <h3 class="h3-secondary">Ihre Kontaktdaten:</h3>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>E-Mail:</strong> ${data.email}</p>
      ${data.phone ? `<p><strong>Telefon:</strong> ${data.phone}</p>` : ''}
      <p><strong>Bevorzugter Kontakt:</strong> ${this.getContactMethodText(data.preferredContact)}</p>
      ${data.message ? `<p><strong>Nachricht:</strong> ${data.message}</p>` : ''}
    </div>
    
    ${configurationSummary}
    
      <div class="info-box">
        <h3 class="h3-secondary">Nächste Schritte:</h3>
      <ul>
        <li>${data.requestType === 'appointment'
        ? 'Wir melden uns innerhalb von 24 Stunden für die Terminbestätigung'
        : 'Wir melden uns innerhalb von 2 Werktagen bei Ihnen'}</li>
        <li>Persönliche Beratung zu Ihrem Traumhaus</li>
        <li>Detaillierte Kostenaufstellung</li>
        <li>Planungsservice und Baubegleitung</li>
      </ul>
    </div>
    
      <div class="contact-info">
        <p class="p-primary">Bei Fragen können Sie uns jederzeit kontaktieren:</p>
        <p><strong>📧 E-Mail:</strong> markus@sustain-nest.com<br>
        <strong>📞 Telefon:</strong> +43 664 2531869</p>
      </div>
      
      <div class="button-container">
    <a href="https://nest-haus.at/konfigurator" class="button">Konfiguration fortsetzen</a>
      </div>
  </div>
  
  <div class="footer">
    <p>© 2025 NEST-Haus | SustainNest GmbH<br>
    Karmeliterplatz 8, 8010 Graz, Österreich</p>
    </div>
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
      ? `<p class="appointment-info"><strong>Gewünschter Termin:</strong> ${new Date(data.appointmentDateTime).toLocaleString('de-DE')}</p>`
      : '';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neue Kundenanfrage - NEST-Haus</title>
  <style>
    /* Base styles matching website design system */
    * {
      letter-spacing: -0.015em;
      box-sizing: border-box;
    }
    
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6; 
      color: #171717; 
      margin: 0; 
      padding: 0;
      background-color: #ffffff;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    .email-container {
      max-width: 700px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    
    /* Admin header styling - urgent red theme */
    .header { 
      background: #DC2626; 
      color: white; 
      padding: 32px 24px; 
      text-align: center;
    }
    
    .header h1 {
      font-size: 32px;
      font-weight: bold;
      margin: 0 0 8px 0;
      letter-spacing: -0.02em;
    }
    
    .header p {
      font-size: 16px;
      margin: 0;
      opacity: 0.9;
    }
    
    /* Content area styling */
    .content { 
      background: #ffffff; 
      padding: 40px 32px;
    }
    
    /* Typography classes matching website */
    .h2-title {
      font-size: 28px;
      font-weight: 600;
      color: #171717;
      margin: 0 0 24px 0;
      letter-spacing: -0.02em;
    }
    
    .p-primary {
      font-size: 16px;
      color: #171717;
      line-height: 1.5;
      margin: 16px 0;
    }
    
    .h3-secondary {
      font-size: 18px;
      font-weight: 600;
      color: #171717;
      margin: 24px 0 12px 0;
      letter-spacing: -0.015em;
    }
    
    /* Priority alert styling */
    .priority-alert { 
      background: ${data.requestType === 'appointment' ? '#FEF3C7' : '#EFF6FF'}; 
      border: 1px solid ${data.requestType === 'appointment' ? '#FCD34D' : '#DBEAFE'};
      border-left: 4px solid ${data.requestType === 'appointment' ? '#F59E0B' : '#3B82F6'};
      padding: 24px; 
      border-radius: 16px; 
      margin: 24px 0;
    }
    
    .priority-alert h3 {
      color: ${data.requestType === 'appointment' ? '#92400E' : '#1E40AF'};
      margin-top: 0;
    }
    
    .priority-alert p {
      color: ${data.requestType === 'appointment' ? '#92400E' : '#1E40AF'};
      margin: 8px 0;
    }
    
    /* Customer info box */
    .customer-info { 
      background: #EFF6FF; 
      border: 1px solid #DBEAFE;
      padding: 24px; 
      border-radius: 16px; 
      margin: 24px 0;
    }
    
    .customer-info h3 {
      color: #1E40AF;
      margin-top: 0;
    }
    
    .customer-info p {
      margin: 8px 0;
    }
    
    .customer-info a {
      color: #3B82F6;
      text-decoration: none;
    }
    
    .customer-info a:hover {
      text-decoration: underline;
    }
    
    /* Technical info box */
    .technical-info { 
      background: #F3E8FF; 
      border: 1px solid #E9D5FF;
      padding: 24px; 
      border-radius: 16px; 
      margin: 24px 0;
    }
    
    .technical-info h3 {
      color: #7C3AED;
      margin-top: 0;
    }
    
    .technical-info p {
      margin: 8px 0;
      color: #6B46C1;
    }
    
    /* Configuration summary styling */
    .config-summary {
      background: #ECFDF5;
      border: 1px solid #BBF7D0;
      border-radius: 16px;
      padding: 24px;
      margin: 24px 0;
    }
    
    .config-summary h3 {
      color: #059669;
      margin-top: 0;
    }
    
    .config-summary ul {
      margin: 12px 0;
      padding-left: 20px;
    }
    
    .config-summary li {
      margin: 6px 0;
      color: #047857;
    }
    
    .config-price {
      font-size: 18px;
      font-weight: 600;
      color: #059669;
      margin-top: 16px;
    }
    
    /* Button styling matching website buttons */
    .button { 
      display: inline-block; 
      background: #DC2626; 
      color: white; 
      padding: 12px 24px; 
      text-decoration: none; 
      border-radius: 9999px;
      font-weight: 500;
      font-size: 16px;
      margin: 8px 4px;
      transition: background-color 0.3s ease;
      letter-spacing: -0.015em;
    }
    
    .button:hover {
      background: #B91C1C;
    }
    
    .button-secondary {
      background: #3B82F6;
    }
    
    .button-secondary:hover {
      background: #2563EB;
    }
    
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    
    .appointment-info {
      background: #FEF3C7;
      padding: 16px;
      border-radius: 12px;
      border-left: 4px solid #F59E0B;
      margin: 16px 0;
    }
    
    .appointment-info strong {
      color: #92400E;
    }
    
    /* Responsive adjustments */
    @media (max-width: 640px) {
      .content {
        padding: 24px 20px;
      }
      
      .header {
        padding: 24px 20px;
      }
      
      .header h1 {
        font-size: 24px;
      }
      
      .h2-title {
        font-size: 24px;
      }
      
      .priority-alert, .customer-info, .technical-info, .config-summary {
        padding: 20px;
      }
      
      .button-container {
        text-align: left;
      }
      
      .button {
        display: block;
        margin: 8px 0;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
  <div class="header">
    <h1>🚨 Neue Kundenanfrage</h1>
    <p>NEST-Haus Admin Dashboard</p>
  </div>
  
  <div class="content">
      <div class="priority-alert">
        <h3>${data.requestType === 'appointment' ? '⏰ TERMINANFRAGE - Hohe Priorität' : '📧 Neue Kontaktanfrage'}</h3>
        <p>${data.requestType === 'appointment'
        ? 'Kunde möchte einen Termin vereinbaren. Bitte innerhalb von 24 Stunden antworten!'
        : 'Antwort innerhalb von 2 Werktagen empfohlen.'}</p>
      </div>
    
    <div class="customer-info">
        <h3 class="h3-secondary">👤 Kundendaten:</h3>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>E-Mail:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
      ${data.phone ? `<p><strong>Telefon:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>` : ''}
      <p><strong>Bevorzugter Kontakt:</strong> ${this.getContactMethodText(data.preferredContact)}</p>
      ${appointmentInfo}
      ${data.message ? `<p><strong>Nachricht:</strong><br>${data.message}</p>` : ''}
    </div>
    
    ${configurationSummary}
    
    <div class="technical-info">
        <h3 class="h3-secondary">🔧 Technische Informationen:</h3>
      <p><strong>Anfrage-ID:</strong> ${data.inquiryId}</p>
      ${data.sessionId ? `<p><strong>Session-ID:</strong> ${data.sessionId}</p>` : ''}
      <p><strong>Zeitstempel:</strong> ${new Date().toLocaleString('de-DE')}</p>
      ${data.clientIP ? `<p><strong>IP-Adresse:</strong> ${data.clientIP}</p>` : ''}
      ${data.userAgent ? `<p><strong>Browser:</strong> ${data.userAgent}</p>` : ''}
    </div>
    
      <div class="button-container">
      <a href="https://nest-haus.at/admin/customer-inquiries/${data.inquiryId}" class="button">Anfrage bearbeiten</a>
        <a href="mailto:${data.email}?subject=Re: Ihre Anfrage bei NEST-Haus" class="button button-secondary">E-Mail antworten</a>
        ${data.phone ? `<a href="tel:${data.phone}" class="button button-secondary">Anrufen</a>` : ''}
      </div>
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
  private static generateConfigurationSummary(configData: unknown): string {
    if (!configData || typeof configData !== 'object') return '';

    const config = configData as Record<string, unknown>;
    const items = [];

    // Extract configuration items
    const nest = config.nest as { name?: string } | undefined;
    const gebaeudehuelle = config.gebaeudehuelle as { name?: string } | undefined;
    const innenverkleidung = config.innenverkleidung as { name?: string } | undefined;
    const fussboden = config.fussboden as { name?: string } | undefined;
    const pvanlage = config.pvanlage as { name?: string } | undefined;
    const fenster = config.fenster as { name?: string } | undefined;
    const planungspaket = config.planungspaket as { name?: string } | undefined;
    const grundstueckscheck = config.grundstueckscheck as { name?: string } | undefined;

    if (nest?.name) items.push(`Nest-Modell: ${nest.name}`);
    if (gebaeudehuelle?.name) items.push(`Gebäudehülle: ${gebaeudehuelle.name}`);
    if (innenverkleidung?.name) items.push(`Innenverkleidung: ${innenverkleidung.name}`);
    if (fussboden?.name) items.push(`Fußboden: ${fussboden.name}`);
    if (pvanlage?.name) items.push(`PV-Anlage: ${pvanlage.name}`);
    if (fenster?.name) items.push(`Fenster: ${fenster.name}`);
    if (planungspaket?.name) items.push(`Planungspaket: ${planungspaket.name}`);
    if (grundstueckscheck?.name) items.push(`Grundstückscheck: ${grundstueckscheck.name}`);

    if (items.length === 0) return '';

    const totalPrice = config.totalPrice ? `<p class="config-price"><strong>Gesamtpreis:</strong> €${(Number(config.totalPrice) / 100).toLocaleString('de-DE')}</p>` : '';

    return `
    <div class="config-summary">
      <h3 class="h3-secondary">🏠 Konfiguration:</h3>
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
