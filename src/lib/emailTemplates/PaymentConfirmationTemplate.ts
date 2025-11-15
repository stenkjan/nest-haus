export interface PaymentConfirmationEmailData {
  inquiryId: string;
  name: string;
  email: string;
  paymentAmount: number;
  paymentCurrency: string;
  paymentMethod: string;
  paymentIntentId?: string;
  paidAt?: Date;
  configurationData?: unknown;
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

export function generatePaymentConfirmationEmail(data: PaymentConfirmationEmailData): {
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

  const config = parseConfigurationForEmail(data.configurationData);

  const subject = `✅ Zahlungsbestätigung - ${formattedAmount} erhalten`;

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
      font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f4f4f4;
      padding: 20px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }
    .hero-section {
      padding: 30px;
      background: #f4f4f4;
    }
    .contact-boxes {
      display: grid;
      gap: 16px;
      margin-bottom: 0;
    }
    .contact-box {
      background: #ffffff;
      border-radius: 24px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    .contact-box h2 {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 16px 0;
    }
    .contact-box h2 .gray-text {
      color: #737373;
      font-weight: 400;
    }
    .contact-grid {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 4px 16px;
      font-size: 15px;
      line-height: 1.6;
    }
    .contact-label {
      color: #737373;
    }
    .contact-value {
      color: #1a1a1a;
      font-weight: 500;
    }
    .hero-image {
      width: 100%;
      height: auto;
      display: block;
    }
    .content {
      padding: 40px 30px;
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 30px;
      margin: 20px 0;
      border: 1px solid rgba(61, 108, 225, 0.1);
      box-shadow: 0 4px 20px rgba(61, 108, 225, 0.08);
    }
    .success-card {
      background: rgba(61, 108, 225, 0.05);
      border: 1px solid rgba(61, 108, 225, 0.2);
    }
    h1 {
      font-size: 28px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 10px;
      line-height: 1.2;
    }
    h2 {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 20px 0 12px 0;
    }
    p {
      font-size: 16px;
      color: #4a4a4a;
      margin-bottom: 16px;
      line-height: 1.6;
    }
    .success-icon {
      font-size: 48px;
      text-align: center;
      margin-bottom: 16px;
    }
    .payment-details {
      display: grid;
      gap: 12px;
      margin: 20px 0;
    }
    .payment-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: #f9f9f9;
      border-radius: 12px;
    }
    .payment-label {
      color: #666;
      font-size: 14px;
    }
    .payment-value {
      color: #1a1a1a;
      font-weight: 500;
      font-size: 15px;
    }
    .payment-amount {
      color: #3d6ce1;
      font-weight: 600;
      font-size: 18px;
    }
    .config-items {
      display: grid;
      gap: 16px;
      margin: 20px 0;
    }
    .config-item {
      padding: 16px;
      background: #f9f9f9;
      border-radius: 12px;
      display: flex;
      justify-content: space-between;
      align-items: start;
    }
    .config-label {
      color: #666;
      font-size: 13px;
      margin-bottom: 4px;
    }
    .config-info {
      flex: 1;
    }
    .config-name {
      color: #1a1a1a;
      font-weight: 500;
      font-size: 15px;
      display: block;
      margin-bottom: 4px;
    }
    .config-price {
      color: #3D6CE1;
      font-weight: 600;
      font-size: 15px;
      white-space: nowrap;
      margin-left: 16px;
    }
    .summary-items {
      display: grid;
      gap: 12px;
      margin: 20px 0;
    }
    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #f9f9f9;
      border-radius: 12px;
      font-size: 15px;
    }
    .summary-divider {
      height: 2px;
      background: #e5e7eb;
      margin: 8px 0;
    }
    .summary-item-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: linear-gradient(135deg, rgba(61, 108, 225, 0.1) 0%, rgba(61, 108, 225, 0.05) 100%);
      border-radius: 12px;
      font-weight: 600;
      font-size: 18px;
    }
    .price-highlight {
      color: #3D6CE1;
      font-weight: 600;
    }
    .total-price {
      color: #3D6CE1;
      font-weight: 600;
      font-size: 20px;
    }
    .btn-primary {
      display: inline-block;
      background: #3D6CE1;
      color: white !important;
      padding: 14px 32px;
      border-radius: 9999px;
      text-decoration: none;
      font-weight: 500;
      font-size: 16px;
      margin: 10px 0;
      transition: background 0.3s;
    }
    .btn-primary:hover {
      background: #2d5ad0;
    }
    .highlight {
      color: #3D6CE1;
      font-weight: 500;
    }
    .footer {
      background: #f9f9f9;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .footer a {
      color: #3D6CE1;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .hero-section {
        padding: 20px;
      }
      .contact-box {
        padding: 20px;
      }
      .content {
        padding: 30px 20px;
      }
      .glass-card {
        padding: 20px;
      }
      h1 {
        font-size: 24px;
      }
      .config-item {
        flex-direction: column;
        gap: 8px;
      }
      .config-price {
        margin-left: 0;
      }
      .btn-primary {
        display: block;
        text-align: center;
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Contact Info Boxes -->
    <div class="hero-section">
      <div class="contact-boxes">
        <!-- Kontakt Box -->
        <div class="contact-box">
          <h2>Kontakt <span class="gray-text">Melde dich!</span></h2>
          <div class="contact-grid">
            <span class="contact-label">Telefon:</span>
            <span class="contact-value">+43 (0) 664 1001947</span>
            <span class="contact-label">Mobil:</span>
            <span class="contact-value">+43 (0) 664 2531869</span>
            <span class="contact-label">Email:</span>
            <span class="contact-value">nest@nest-haus.at</span>
          </div>
        </div>
        
        <!-- Adresse Box -->
        <div class="contact-box">
          <h2>Adresse <span class="gray-text">Komm vorbei!</span></h2>
          <div class="contact-grid">
            <span class="contact-label">Straße:</span>
            <span class="contact-value">Karmeliterplatz 8</span>
            <span class="contact-label">Stadt:</span>
            <span class="contact-value">8010, Graz, Steiermark</span>
            <span class="contact-label">Land:</span>
            <span class="contact-value">Österreich</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="content">
      <h1>Zahlung erfolgreich! 🎉</h1>
      <p>Vielen Dank, ${data.name}! Ihre Zahlung wurde erfolgreich verarbeitet.</p>
      
      <!-- Payment Success Card -->
      <div class="glass-card success-card">
        <div class="success-icon">✅</div>
        <h2 style="text-align: center; color: #3d6ce1; margin-top: 0;">Zahlung bestätigt</h2>
        <div class="payment-details">
          <div class="payment-item">
            <span class="payment-label">Betrag</span>
            <span class="payment-amount">${formattedAmount}</span>
          </div>
          <div class="payment-item">
            <span class="payment-label">Zahlungsmethode</span>
            <span class="payment-value">${paymentMethodText}</span>
          </div>
          <div class="payment-item">
            <span class="payment-label">Datum</span>
            <span class="payment-value">${formattedDate}</span>
          </div>
          ${
            data.paymentIntentId
              ? `
          <div class="payment-item">
            <span class="payment-label">Transaktions-ID</span>
            <span class="payment-value" style="font-family: monospace; font-size: 12px;">${data.paymentIntentId}</span>
          </div>
          `
              : ''
          }
        </div>
      </div>

      ${
        config.nestModel
          ? `
      <!-- Configuration Selection Card -->
      <div class="glass-card">
        <h2>🏠 Dein Nest - Deine Auswahl</h2>
        <div class="config-items">
          ${
            config.nestModel
              ? `
          <div class="config-item">
            <div class="config-info">
              <div class="config-label">Nest-Modell</div>
              <span class="config-name">${config.nestModel.name}</span>
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
            <div class="config-info">
              <div class="config-label">Gebäudehülle</div>
              <span class="config-name">${config.gebaeudehuelle.name}</span>
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
            <div class="config-info">
              <div class="config-label">Innenverkleidung</div>
              <span class="config-name">${config.innenverkleidung.name}</span>
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
            <div class="config-info">
              <div class="config-label">Fußboden</div>
              <span class="config-name">${config.fussboden.name}</span>
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
            <div class="config-info">
              <div class="config-label">PV-Anlage</div>
              <span class="config-name">${config.pvanlage.name}</span>
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
            <div class="config-info">
              <div class="config-label">Fenster</div>
              <span class="config-name">${config.fenster.name}</span>
            </div>
            <span class="config-price">${formatPrice(config.fenster.price)}</span>
          </div>
          `
              : ''
          }
        </div>
      </div>

      <!-- Overview Summary Card -->
      <div class="glass-card">
        <h2>📊 Dein Nest - Überblick</h2>
        <div class="summary-items">
          <div class="summary-item">
            <span>Dein Nest Haus</span>
            <span class="price-highlight">${formatPrice(config.totalHousePrice)}</span>
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
            <span>Konzept-Check ✓</span>
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
          <div class="summary-divider"></div>
          <div class="summary-item-total">
            <span>Gesamtsumme</span>
            <span class="total-price">${formatPrice(config.totalPrice)}</span>
          </div>
        </div>
      </div>
      `
          : ''
      }
      
      <!-- Next Steps Card -->
      <div class="glass-card">
        <h2>⏭️ Die nächsten Schritte</h2>
        <p>
          1. <strong>Bestätigung:</strong> Sie erhalten diese E-Mail als Zahlungsnachweis<br>
          2. <strong>Kontaktaufnahme:</strong> Wir melden uns innerhalb von 24 Stunden bei Ihnen<br>
          3. <strong>Planung:</strong> Gemeinsam besprechen wir die Details Ihres NEST-Haus Projekts<br>
          4. <strong>Umsetzung:</strong> Wir starten mit der professionellen Planung und Ausführung
        </p>
        
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://nest-haus.at/konfigurator" class="btn-primary">
            Konfiguration ansehen
          </a>
        </div>
      </div>
      
      <!-- Contact Info -->
      <div style="margin-top: 30px; padding: 20px; background: #f9f9f9; border-radius: 16px;">
        <h2 style="margin-top: 0;">📧 Kontakt</h2>
        <p style="margin: 0;">
          <strong>E-Mail:</strong> <a href="mailto:mail@nest-haus.com" style="color: #3D6CE1; text-decoration: none;">mail@nest-haus.com</a><br>
          <strong>Telefon:</strong> <span class="highlight">+43 664 2531869</span><br>
          <strong>Website:</strong> <a href="https://nest-haus.at" style="color: #3D6CE1; text-decoration: none;">nest-haus.at</a>
        </p>
      </div>
      
      <p style="font-size: 13px; color: #999; margin-top: 20px;">
        Anfrage-ID: ${data.inquiryId}
      </p>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>
        <strong>NEST-Haus</strong><br>
        Modulares Wohnen. Nachhaltig. Österreichisch.
      </p>
      <p style="margin-top: 16px;">
        <a href="https://nest-haus.at">Website</a> ·
        <a href="https://nest-haus.at/impressum">Impressum</a> ·
        <a href="https://nest-haus.at/datenschutz">Datenschutz</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
NEST-Haus - Zahlungsbestätigung

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KONTAKT - Melde dich!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Telefon: +43 (0) 664 1001947
Mobil: +43 (0) 664 2531869
Email: nest@nest-haus.at

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADRESSE - Komm vorbei!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Straße: Karmeliterplatz 8
Stadt: 8010, Graz, Steiermark
Land: Österreich

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Zahlung erfolgreich! 🎉

Vielen Dank, ${data.name}! Ihre Zahlung wurde erfolgreich verarbeitet.

ZAHLUNGSDETAILS:
- Betrag: ${formattedAmount}
- Zahlungsmethode: ${paymentMethodText}
- Datum: ${formattedDate}
${data.paymentIntentId ? `- Transaktions-ID: ${data.paymentIntentId}` : ''}

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
${config.konzeptCheck ? `- Konzept-Check: ${formatPrice(config.konzeptCheck.price)}` : ''}
${config.terminvereinbarung?.booked ? '- Terminvereinbarung: Gebucht ✓' : ''}
-----------------------------------------
GESAMTSUMME: ${formatPrice(config.totalPrice)}
`
    : ''
}

DIE NÄCHSTEN SCHRITTE:
1. Bestätigung: Sie erhalten diese E-Mail als Zahlungsnachweis
2. Kontaktaufnahme: Wir melden uns innerhalb von 24 Stunden bei Ihnen
3. Planung: Gemeinsam besprechen wir die Details Ihres NEST-Haus Projekts
4. Umsetzung: Wir starten mit der professionellen Planung und Ausführung

KONTAKT:
E-Mail: mail@nest-haus.com
Telefon: +43 664 2531869
Website: nest-haus.at

Anfrage-ID: ${data.inquiryId}

--
NEST-Haus
Modulares Wohnen. Nachhaltig. Österreichisch.

Website: https://nest-haus.at
Impressum: https://nest-haus.at/impressum
Datenschutz: https://nest-haus.at/datenschutz
  `;

  return { subject, html, text };
}

