export interface AdminPaymentNotificationEmailData {
  inquiryId: string;
  name: string;
  email: string;
  paymentAmount: number;
  paymentCurrency: string;
  paymentMethod: string;
  paymentIntentId: string;
  stripeCustomerId: string;
  paidAt?: Date;
  configurationData?: unknown;
  sessionId?: string;
  clientIP?: string;
  userAgent?: string;
}

interface ParsedConfiguration {
  nestModel: { name: string; price: number } | null;
  gebaeudehuelle: { name: string; price: number } | null;
  innenverkleidung: { name: string; price: number } | null;
  fussboden: { name: string; price: number } | null;
  pvanlage: { name: string; price: number } | null;
  fenster: { name: string; price: number } | null;
  planungspaket: { name: string; price: number } | null;
  konzeptCheck: { completed: boolean; price: number } | null;
  terminvereinbarung: { booked: boolean; datetime?: string } | null;
  totalHousePrice: number;
  totalPrice: number;
}

/**
 * Parse configuration JSON data into structured format for email display
 */
function parseConfigurationForEmail(configData: unknown): ParsedConfiguration {
  if (!configData || typeof configData !== 'object') {
    return {
      nestModel: null,
      gebaeudehuelle: null,
      innenverkleidung: null,
      fussboden: null,
      pvanlage: null,
      fenster: null,
      planungspaket: null,
      konzeptCheck: null,
      terminvereinbarung: null,
      totalHousePrice: 0,
      totalPrice: 0,
    };
  }

  const config = configData as Record<string, unknown>;

  // Helper to safely extract name and price from config item
  const extractItem = (item: unknown): { name: string; price: number } | null => {
    if (!item || typeof item !== 'object') return null;
    const obj = item as Record<string, unknown>;
    const name = obj.name as string | undefined;
    const price = obj.price as number | undefined;
    if (name && typeof price === 'number') {
      return { name, price };
    }
    return null;
  };

  return {
    nestModel: extractItem(config.nest),
    gebaeudehuelle: extractItem(config.gebaeudehuelle),
    innenverkleidung: extractItem(config.innenverkleidung),
    fussboden: extractItem(config.fussboden),
    pvanlage: extractItem(config.pvanlage),
    fenster: extractItem(config.fenster),
    planungspaket: extractItem(config.planungspaket),
    konzeptCheck: config.grundstueckscheck
      ? { completed: true, price: 15000 } // €150 in cents
      : null,
    terminvereinbarung: config.appointmentDateTime
      ? {
          booked: true,
          datetime: config.appointmentDateTime as string | undefined,
        }
      : null,
    totalHousePrice: (config.totalPrice as number) || 0,
    totalPrice: (config.totalPrice as number) || 0,
  };
}

/**
 * Format price in cents to EUR string
 */
function formatPrice(amountInCents: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amountInCents / 100);
}

/**
 * Get readable payment method name
 */
function getPaymentMethodText(method: string): string {
  const methods: Record<string, string> = {
    card: 'Kreditkarte',
    sepa_debit: 'SEPA-Lastschrift',
    sofort: 'Sofort',
    giropay: 'Giropay',
    eps: 'EPS',
    bancontact: 'Bancontact',
    ideal: 'iDEAL',
  };
  return methods[method] || method;
}

export function generateAdminPaymentNotificationEmail(
  data: AdminPaymentNotificationEmailData
): {
  subject: string;
  html: string;
  text: string;
} {
  const formattedAmount = formatPrice(data.paymentAmount);
  const paymentMethodText = getPaymentMethodText(data.paymentMethod);
  const paymentDate = data.paidAt || new Date();
  const formattedDate = paymentDate.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const formattedTime = paymentDate.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const config = parseConfigurationForEmail(data.configurationData);

  const subject = `💰 Zahlung erhalten: ${formattedAmount} - ${data.name}`;

  const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f4f4f4;
      padding: 20px;
    }
    .email-container {
      max-width: 700px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    }
    .header {
      background: linear-gradient(135deg, #3d6ce1 0%, #2d5ad0 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      font-size: 26px;
      font-weight: 600;
      margin: 0;
    }
    .header-icon {
      font-size: 40px;
      margin-bottom: 10px;
    }
    .content {
      padding: 30px;
    }
    .section {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .section-urgent {
      background: #fef3c7;
      border: 2px solid #fbbf24;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 160px 1fr;
      gap: 12px;
      margin: 12px 0;
    }
    .info-label {
      color: #6b7280;
      font-size: 14px;
      font-weight: 500;
    }
    .info-value {
      color: #1f2937;
      font-size: 14px;
      word-break: break-word;
    }
    .info-value-highlight {
      color: #3d6ce1;
      font-weight: 600;
      font-size: 18px;
    }
    .config-items {
      display: grid;
      gap: 10px;
      margin: 12px 0;
    }
    .config-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 12px;
      background: white;
      border-radius: 8px;
      font-size: 14px;
    }
    .config-label {
      color: #6b7280;
      font-size: 12px;
    }
    .config-name {
      color: #1f2937;
      font-weight: 500;
    }
    .config-price {
      color: #3D6CE1;
      font-weight: 600;
      white-space: nowrap;
      margin-left: 12px;
    }
    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 12px;
      background: white;
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 8px;
    }
    .summary-total {
      background: linear-gradient(135deg, rgba(61, 108, 225, 0.1) 0%, rgba(61, 108, 225, 0.05) 100%);
      font-weight: 600;
      font-size: 16px;
      padding: 14px;
      color: #3D6CE1;
    }
    .btn-primary {
      display: inline-block;
      background: #3d6ce1;
      color: white !important;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
      margin: 5px 5px 5px 0;
    }
    .btn-secondary {
      background: #3D6CE1;
    }
    .monospace {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      background: white;
      padding: 4px 8px;
      border-radius: 4px;
    }
    .footer {
      background: #f9fafb;
      padding: 20px;
      text-align: center;
      font-size: 13px;
      color: #6b7280;
    }
    @media only screen and (max-width: 600px) {
      .info-grid {
        grid-template-columns: 1fr;
        gap: 8px;
      }
      .content {
        padding: 20px;
      }
      .section {
        padding: 16px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="header-icon">💰</div>
      <h1>Zahlung erfolgreich eingegangen</h1>
      <p style="margin: 8px 0 0 0; opacity: 0.95; font-size: 15px;">NEST-Haus Konfiguration</p>
    </div>
    
    <!-- Content -->
    <div class="content">
      <!-- Urgent Action Section -->
      <div class="section section-urgent">
        <div class="section-title">⚡ Aktion erforderlich</div>
        <p style="margin: 0; font-size: 14px;">
          <strong>Bitte kontaktieren Sie den Kunden innerhalb von 24 Stunden</strong>, um die nächsten Schritte zu besprechen und das Projekt zu starten.
        </p>
      </div>
      
      <!-- Payment Details -->
      <div class="section">
        <div class="section-title">💳 Zahlungsdetails</div>
        <div class="info-grid">
          <span class="info-label">Betrag</span>
          <span class="info-value-highlight">${formattedAmount}</span>
          
          <span class="info-label">Zahlungsmethode</span>
          <span class="info-value">${paymentMethodText}</span>
          
          <span class="info-label">Datum & Uhrzeit</span>
          <span class="info-value">${formattedDate} um ${formattedTime}</span>
          
          <span class="info-label">Payment Intent</span>
          <span class="info-value"><span class="monospace">${data.paymentIntentId}</span></span>
          
          <span class="info-label">Stripe Customer</span>
          <span class="info-value"><span class="monospace">${data.stripeCustomerId}</span></span>
        </div>
      </div>
      
      <!-- Customer Information -->
      <div class="section">
        <div class="section-title">👤 Kundendaten</div>
        <div class="info-grid">
          <span class="info-label">Name</span>
          <span class="info-value"><strong>${data.name}</strong></span>
          
          <span class="info-label">E-Mail</span>
          <span class="info-value"><a href="mailto:${data.email}" style="color: #3D6CE1; text-decoration: none;">${data.email}</a></span>
          
          <span class="info-label">Anfrage-ID</span>
          <span class="info-value"><span class="monospace">${data.inquiryId}</span></span>
          
          ${
            data.sessionId
              ? `
          <span class="info-label">Session-ID</span>
          <span class="info-value"><span class="monospace">${data.sessionId}</span></span>
          `
              : ''
          }
        </div>
      </div>

      ${
        config.nestModel
          ? `
      <!-- Configuration Selection -->
      <div class="section">
        <div class="section-title">🏠 Dein Nest - Deine Auswahl</div>
        <div class="config-items">
          ${
            config.nestModel
              ? `
          <div class="config-item">
            <div>
              <div class="config-label">Nest-Modell</div>
              <div class="config-name">${config.nestModel.name}</div>
            </div>
            <span class="config-price">${formatPrice(config.nestModel.price)}</span>
          </div>
          `
              : ''
          }
          ${
            config.gebaeudehuelle
              ? `
          <div class="config-item">
            <div>
              <div class="config-label">Gebäudehülle</div>
              <div class="config-name">${config.gebaeudehuelle.name}</div>
            </div>
            <span class="config-price">${formatPrice(config.gebaeudehuelle.price)}</span>
          </div>
          `
              : ''
          }
          ${
            config.innenverkleidung
              ? `
          <div class="config-item">
            <div>
              <div class="config-label">Innenverkleidung</div>
              <div class="config-name">${config.innenverkleidung.name}</div>
            </div>
            <span class="config-price">${formatPrice(config.innenverkleidung.price)}</span>
          </div>
          `
              : ''
          }
          ${
            config.fussboden
              ? `
          <div class="config-item">
            <div>
              <div class="config-label">Fußboden</div>
              <div class="config-name">${config.fussboden.name}</div>
            </div>
            <span class="config-price">${formatPrice(config.fussboden.price)}</span>
          </div>
          `
              : ''
          }
          ${
            config.pvanlage
              ? `
          <div class="config-item">
            <div>
              <div class="config-label">PV-Anlage</div>
              <div class="config-name">${config.pvanlage.name}</div>
            </div>
            <span class="config-price">${formatPrice(config.pvanlage.price)}</span>
          </div>
          `
              : ''
          }
          ${
            config.fenster
              ? `
          <div class="config-item">
            <div>
              <div class="config-label">Fenster</div>
              <div class="config-name">${config.fenster.name}</div>
            </div>
            <span class="config-price">${formatPrice(config.fenster.price)}</span>
          </div>
          `
              : ''
          }
        </div>
      </div>

      <!-- Configuration Overview -->
      <div class="section">
        <div class="section-title">📊 Dein Nest - Überblick</div>
        <div>
          <div class="summary-item">
            <span>Dein Nest Haus</span>
            <span style="color: #3D6CE1; font-weight: 600;">${formatPrice(config.totalHousePrice)}</span>
          </div>
          ${
            config.planungspaket
              ? `
          <div class="summary-item">
            <span>Planungspaket - ${config.planungspaket.name}</span>
            <span>${formatPrice(config.planungspaket.price)}</span>
          </div>
          `
              : ''
          }
          ${
            config.konzeptCheck
              ? `
          <div class="summary-item">
            <span>Konzeptcheck ✓</span>
            <span>${formatPrice(config.konzeptCheck.price)}</span>
          </div>
          `
              : ''
          }
          ${
            config.terminvereinbarung?.booked
              ? `
          <div class="summary-item">
            <span>Terminvereinbarung ✓</span>
            <span style="color: #3d6ce1; font-weight: 500;">Gebucht</span>
          </div>
          `
              : ''
          }
          <div class="summary-total">
            <div style="display: flex; justify-content: space-between;">
              <span>Gesamtsumme</span>
              <span>${formatPrice(config.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
      `
          : ''
      }
      
      <!-- Technical Information -->
      ${
        data.clientIP || data.userAgent
          ? `
      <div class="section">
        <div class="section-title">🔧 Technische Informationen</div>
        <div class="info-grid">
          ${
            data.clientIP
              ? `
          <span class="info-label">IP-Adresse</span>
          <span class="info-value">${data.clientIP}</span>
          `
              : ''
          }
          ${
            data.userAgent
              ? `
          <span class="info-label">Browser</span>
          <span class="info-value" style="font-size: 12px;">${data.userAgent}</span>
          `
              : ''
          }
        </div>
      </div>
      `
          : ''
      }
      
      <!-- Action Buttons -->
      <div style="text-align: center; margin: 30px 0 20px 0;">
        <a href="https://nest-haus.at/admin/customer-inquiries/${data.inquiryId}" class="btn-primary">
          📋 Anfrage öffnen
        </a>
        <a href="mailto:${data.email}" class="btn-primary btn-secondary">
          ✉️ Kunde kontaktieren
        </a>
        <a href="https://dashboard.stripe.com/payments/${data.paymentIntentId}" class="btn-primary btn-secondary">
          💳 Stripe öffnen
        </a>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>Automatische Benachrichtigung vom NEST-Haus System</p>
      <p style="margin-top: 8px;">Zeitstempel: ${new Date().toLocaleString('de-DE')}</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
NEST-Haus - Zahlung erfolgreich eingegangen

💰 Zahlung erhalten: ${formattedAmount}

⚡ AKTION ERFORDERLICH:
Bitte kontaktieren Sie den Kunden innerhalb von 24 Stunden, um die nächsten Schritte zu besprechen.

ZAHLUNGSDETAILS:
- Betrag: ${formattedAmount}
- Zahlungsmethode: ${paymentMethodText}
- Datum & Uhrzeit: ${formattedDate} um ${formattedTime}
- Payment Intent: ${data.paymentIntentId}
- Stripe Customer: ${data.stripeCustomerId}

KUNDENDATEN:
- Name: ${data.name}
- E-Mail: ${data.email}
- Anfrage-ID: ${data.inquiryId}
${data.sessionId ? `- Session-ID: ${data.sessionId}` : ''}

${
  config.nestModel
    ? `
DEIN NEST - DEINE AUSWAHL:
${config.nestModel ? `- Nest-Modell: ${config.nestModel.name} - ${formatPrice(config.nestModel.price)}` : ''}
${config.gebaeudehuelle ? `- Gebäudehülle: ${config.gebaeudehuelle.name} - ${formatPrice(config.gebaeudehuelle.price)}` : ''}
${config.innenverkleidung ? `- Innenverkleidung: ${config.innenverkleidung.name} - ${formatPrice(config.innenverkleidung.price)}` : ''}
${config.fussboden ? `- Fußboden: ${config.fussboden.name} - ${formatPrice(config.fussboden.price)}` : ''}
${config.pvanlage ? `- PV-Anlage: ${config.pvanlage.name} - ${formatPrice(config.pvanlage.price)}` : ''}
${config.fenster ? `- Fenster: ${config.fenster.name} - ${formatPrice(config.fenster.price)}` : ''}

DEIN NEST - ÜBERBLICK:
- Dein Nest Haus: ${formatPrice(config.totalHousePrice)}
${config.planungspaket ? `- Planungspaket: ${formatPrice(config.planungspaket.price)}` : ''}
${config.konzeptCheck ? `- Konzeptcheck: ${formatPrice(config.konzeptCheck.price)}` : ''}
${config.terminvereinbarung?.booked ? '- Terminvereinbarung: Gebucht ✓' : ''}
GESAMTSUMME: ${formatPrice(config.totalPrice)}
`
    : ''
}

${
  data.clientIP || data.userAgent
    ? `
TECHNISCHE INFORMATIONEN:
${data.clientIP ? `- IP-Adresse: ${data.clientIP}` : ''}
${data.userAgent ? `- Browser: ${data.userAgent}` : ''}
`
    : ''
}

AKTIONEN:
- Anfrage öffnen: https://nest-haus.at/admin/customer-inquiries/${data.inquiryId}
- Kunde kontaktieren: ${data.email}
- Stripe öffnen: https://dashboard.stripe.com/payments/${data.paymentIntentId}

--
Automatische Benachrichtigung vom NEST-Haus System
Zeitstempel: ${new Date().toLocaleString('de-DE')}
  `;

  return { subject, html, text };
}

