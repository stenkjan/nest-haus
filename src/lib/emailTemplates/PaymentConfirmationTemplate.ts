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
  geschossdecke: { name: string; price: number; quantity?: number } | null;
  pvanlage: { name: string; price: number } | null;
  fenster: { name: string; price: number } | null;
  fundament: { name: string; price: number } | null;
  kamindurchzug: { name: string; price: number } | null;
  planungspaket: { name: string; price: number } | null;
  konzeptCheck: { completed: boolean; price: number } | null;
  terminvereinbarung: { booked: boolean; datetime?: string } | null;
  liefertermin: string | null;
  totalHousePrice: number;
  totalPrice: number;
}

/**
 * Parse configuration JSON data into structured format for email display
 */
function parseConfigurationForEmail(configData: unknown): ParsedConfiguration {
  if (!configData || typeof configData !== 'object') {
    console.warn('⚠️ No configuration data provided for email');
    return {
      nestModel: null,
      gebaeudehuelle: null,
      innenverkleidung: null,
      fussboden: null,
      geschossdecke: null,
      pvanlage: null,
      fenster: null,
      fundament: null,
      kamindurchzug: null,
      planungspaket: null,
      konzeptCheck: null,
      terminvereinbarung: null,
      liefertermin: null,
      totalHousePrice: 0,
      totalPrice: 0,
    };
  }

  const config = configData as Record<string, unknown>;
  console.log('📧 Parsing configuration for email:', Object.keys(config));

  // Helper to safely extract name and price from config item
  const extractItem = (item: unknown): { name: string; price: number } | null => {
    if (!item || typeof item !== 'object') return null;
    const obj = item as Record<string, unknown>;
    const name = obj.name as string | undefined;
    const price = obj.price as number | undefined;

    if (name && typeof price === 'number') {
      console.log(`  ✅ Extracted: ${name} = ${price}€`);
      return { name, price };
    }

    console.warn(`  ⚠️ Could not extract item:`, obj);
    return null;
  };

  const parsedItems = {
    nestModel: extractItem(config.nest),
    gebaeudehuelle: extractItem(config.gebaeudehuelle),
    innenverkleidung: extractItem(config.innenverkleidung),
    fussboden: extractItem(config.fussboden),
    geschossdecke: extractItem(config.geschossdecke),
    pvanlage: extractItem(config.pvanlage),
    fenster: extractItem(config.fenster),
    fundament: extractItem(config.fundament),
    kamindurchzug: extractItem(config.kamindurchzug),
    planungspaket: extractItem(config.planungspaket),
    konzeptCheck: config.grundstueckscheck
      ? { completed: true, price: 1500 } // €1,500 (Entwurf deposit)
      : null,
    terminvereinbarung: config.appointmentDateTime
      ? {
        booked: true,
        datetime: config.appointmentDateTime as string | undefined,
      }
      : null,
    liefertermin: (config.liefertermin as string) || null,
  };

  // Calculate totalHousePrice from individual components (excluding planungspaket and konzeptCheck)
  const totalHousePrice =
    (parsedItems.nestModel?.price || 0) +
    (parsedItems.gebaeudehuelle?.price || 0) +
    (parsedItems.innenverkleidung?.price || 0) +
    (parsedItems.fussboden?.price || 0) +
    (parsedItems.geschossdecke?.price || 0) +
    (parsedItems.pvanlage?.price || 0) +
    (parsedItems.fenster?.price || 0) +
    (parsedItems.fundament?.price || 0) +
    (parsedItems.kamindurchzug?.price || 0);

  const totalPrice = (config.totalPrice as number) || totalHousePrice;

  const parsed = {
    ...parsedItems,
    totalHousePrice,
    totalPrice,
  };

  console.log('📧 Parsed configuration - House:', totalHousePrice, '€, Total:', totalPrice, '€');
  return parsed;
}

/**
 * Format configuration price (stored in euros as integers)
 * Note: Configurator stores prices as integers in euros (e.g., 301086 = 301,086€)
 */
function formatPrice(amountInEuros: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amountInEuros);
}

/**
 * Format payment amount from Stripe (in cents)
 */
function formatPaymentAmount(amountInCents: number): string {
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
  const formattedAmount = formatPaymentAmount(data.paymentAmount);
  const paymentMethodText = getPaymentMethodText(data.paymentMethod);
  const paymentDate = data.paidAt || new Date();
  const formattedDate = paymentDate.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const config = parseConfigurationForEmail(data.configurationData);

  const subject = `Zahlungsbestätigung - ${formattedAmount} erhalten`;

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
      color: #1a1a1a;
      background: #ffffff;
      padding: 0;
    }
    .email-container {
      max-width: 680px;
      margin: 0 auto;
      background: #ffffff;
    }
    .content {
      padding: 60px 40px;
    }
    
    /* Header Section */
    .header-section {
      text-align: center;
      margin-bottom: 48px;
    }
    h1 {
      font-size: 32px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 12px;
      line-height: 1.2;
    }
    .subtitle {
      font-size: 18px;
      color: #666;
      font-weight: 400;
    }
    
    /* Payment Success Card */
    .payment-card {
      background: #ffffff;
      border: 2px solid #3D6CE1;
      border-radius: 16px;
      padding: 32px;
      margin: 32px 0;
    }
    .payment-card h2 {
      font-size: 24px;
      font-weight: 600;
      color: #3D6CE1;
      margin: 0 0 24px 0;
      text-align: center;
    }
    .payment-details {
      display: grid;
      gap: 16px;
    }
    .payment-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      border-bottom: 1px solid #f4f4f4;
    }
    .payment-item:last-child {
      border-bottom: none;
    }
    .payment-label {
      color: #666;
      font-size: 15px;
      font-weight: 400;
      padding-right: 24px;
      flex: 1;
    }
    .payment-value {
      color: #1a1a1a;
      font-weight: 500;
      font-size: 16px;
      text-align: right;
      word-break: break-all;
    }
    .payment-amount {
      color: #1a1a1a;
      font-weight: 700;
      font-size: 24px;
    }
    
    /* Configuration Cards */
    .config-card {
      background: #F4F4F4;
      border-radius: 16px;
      padding: 32px;
      margin: 32px 0;
    }
    .config-card h2 {
      font-size: 22px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 24px 0;
    }
    .config-items {
      display: grid;
      gap: 12px;
    }
    .config-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    .config-item:last-child {
      border-bottom: none;
    }
    .config-info {
      flex: 1;
    }
    .config-label {
      color: #666;
      font-size: 13px;
      font-weight: 400;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .config-name {
      color: #1a1a1a;
      font-weight: 500;
      font-size: 16px;
    }
    .config-price {
      color: #1a1a1a;
      font-weight: 600;
      font-size: 18px;
      white-space: nowrap;
      text-align: right;
      min-width: 120px;
    }
    
    /* Summary Section */
    .summary-card {
      background: #F4F4F4;
      border-radius: 16px;
      padding: 32px;
      margin: 32px 0;
    }
    .summary-card h2 {
      font-size: 22px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 24px 0;
    }
    .summary-items {
      display: grid;
      gap: 12px;
    }
    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      font-size: 16px;
    }
    .summary-item-label {
      color: #1a1a1a;
      font-weight: 400;
      padding-right: 24px;
      flex: 1;
    }
    .summary-item-value {
      color: #1a1a1a;
      font-weight: 600;
      font-size: 18px;
      text-align: right;
      min-width: 120px;
    }
    .summary-divider {
      height: 2px;
      background: #e0e0e0;
      margin: 16px 0;
    }
    .summary-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0 0 0;
      font-size: 18px;
    }
    .summary-total-label {
      color: #1a1a1a;
      font-weight: 600;
      font-size: 18px;
      padding-right: 24px;
      flex: 1;
    }
    .summary-total-value {
      color: #1a1a1a;
      font-weight: 700;
      font-size: 18px;
      text-align: right;
      min-width: 120px;
    }
    
    /* Next Steps Card */
    .steps-card {
      background: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 16px;
      padding: 32px;
      margin: 32px 0;
    }
    .steps-card h2 {
      font-size: 22px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 20px 0;
    }
    .steps-card p {
      font-size: 16px;
      color: #666;
      line-height: 1.8;
      margin-bottom: 0;
    }
    
    /* Button */
    .btn-primary {
      display: inline-block;
      background: #3D6CE1;
      color: white !important;
      padding: 16px 40px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      margin: 24px 0;
      transition: background 0.3s;
    }
    .btn-primary:hover {
      background: #2d5ad0;
    }
    .button-center {
      text-align: center;
    }
    
    /* Contact Section */
    .contact-section {
      margin: 48px 0;
      padding: 32px;
      background: #F4F4F4;
      border-radius: 16px;
    }
    .contact-boxes {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    .contact-box h3 {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 16px 0;
    }
    .contact-box:last-child h3 {
      margin-top: 24px;
    }
    .contact-grid {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 8px 16px;
      font-size: 15px;
    }
    .contact-label {
      color: #666;
      font-weight: 400;
    }
    .contact-value {
      color: #1a1a1a;
      font-weight: 500;
    }
    
    /* Footer */
    .footer {
      background: #F4F4F4;
      padding: 40px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .footer p {
      margin: 8px 0;
      color: #666;
    }
    .footer a {
      color: #3D6CE1;
      text-decoration: none;
      font-weight: 500;
    }
    .footer strong {
      color: #1a1a1a;
      font-weight: 600;
    }
    .inquiry-id {
      font-size: 13px;
      color: #999;
      margin-top: 32px;
      text-align: center;
    }
    
    /* Mobile Responsive */
    @media only screen and (max-width: 600px) {
      .content {
        padding: 40px 24px;
      }
      .payment-card,
      .config-card,
      .summary-card,
      .steps-card,
      .contact-section {
        padding: 24px;
      }
      h1 {
        font-size: 28px;
      }
      .contact-boxes {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      .config-item,
      .summary-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      .config-price,
      .summary-item-value {
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
    <!-- Main Content -->
    <div class="content">
      <!-- Header -->
      <div class="header-section">
        <h1>Konzept-Check bestellt</h1>
        <p class="subtitle">Vielen Dank, ${data.name}! Ihre Bestellung für die Grundstücksanalyse und den Entwurf war erfolgreich.</p>
      </div>
      
      <!-- Payment Success Card -->
      <div class="payment-card">
        <h2>Zahlung bestätigt</h2>
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
          ${data.paymentIntentId
      ? `
          <div class="payment-item">
            <span class="payment-label">Transaktions-ID</span>
            <span class="payment-value" style="font-family: monospace; font-size: 14px;">${data.paymentIntentId}</span>
          </div>
          `
      : ''
    }
        </div>
      </div>

      ${config.nestModel
      ? `
      <!-- Configuration Selection Card -->
      <div class="config-card">
        <h2>Dein Nest - Deine Auswahl</h2>
        <div class="config-items">
          ${config.nestModel
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
          ${config.gebaeudehuelle
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
          ${config.innenverkleidung
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
          ${config.fussboden
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
          ${config.pvanlage
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
          ${config.fenster
        ? `
          <div class="config-item">
            <div class="config-info">
              <div class="config-label">Belichtungspaket</div>
              <span class="config-name">${config.fenster.name}</span>
            </div>
            <span class="config-price">${formatPrice(config.fenster.price)}</span>
          </div>
          `
        : ''
      }
          ${config.geschossdecke
        ? `
          <div class="config-item">
            <div class="config-info">
              <div class="config-label">Geschossdecke</div>
              <span class="config-name">${config.geschossdecke.name}</span>
            </div>
            <span class="config-price">${formatPrice(config.geschossdecke.price)}</span>
          </div>
          `
        : ''
      }
          ${config.fundament
        ? `
          <div class="config-item">
            <div class="config-info">
              <div class="config-label">Fundament</div>
              <span class="config-name">${config.fundament.name}</span>
            </div>
            <span class="config-price">${formatPrice(config.fundament.price)}</span>
          </div>
          `
        : ''
      }
          ${config.kamindurchzug
        ? `
          <div class="config-item">
            <div class="config-info">
              <div class="config-label">Kamin</div>
              <span class="config-name">${config.kamindurchzug.name}</span>
            </div>
            <span class="config-price">${formatPrice(config.kamindurchzug.price)}</span>
          </div>
          `
        : ''
      }
        </div>
      </div>

      <!-- Overview Summary Card -->
      <div class="summary-card">
        <h2>Dein Nest - Preisgefühl</h2>
        <div class="summary-items">
          <div class="summary-item">
            <span class="summary-item-label">Dein Nest Haus</span>
            <span class="summary-item-value">${formatPrice(config.totalHousePrice)}</span>
          </div>
          ${config.planungspaket
        ? `
          <div class="summary-item">
            <span class="summary-item-label">Planungspaket - ${config.planungspaket.name}</span>
            <span class="summary-item-value">${formatPrice(config.planungspaket.price)}</span>
          </div>
          `
        : ''
      }
          ${config.konzeptCheck
        ? `
          <div class="summary-item">
            <span class="summary-item-label">Konzept-Check</span>
            <span class="summary-item-value">${formatPrice(config.konzeptCheck.price)}</span>
          </div>
          `
        : ''
      }
          ${config.terminvereinbarung?.booked
        ? `
          <div class="summary-item">
            <span class="summary-item-label">Terminvereinbarung</span>
            <span class="summary-item-value">${config.terminvereinbarung.datetime || 'Gebucht'}</span>
          </div>
          `
        : ''
      }
          ${config.liefertermin
        ? `
          <div class="summary-item">
            <span class="summary-item-label">Liefertermin</span>
            <span class="summary-item-value">${config.liefertermin}</span>
          </div>
          `
        : ''
      }
          <div class="summary-divider"></div>
          <div class="summary-total">
            <span class="summary-total-label">Gesamtsumme</span>
            <span class="summary-total-value">${formatPrice(config.totalPrice)}</span>
          </div>
        </div>
      </div>
      `
      : ''
    }
      
      <!-- Next Steps Card -->
      <div class="steps-card">
        <h2>Die nächsten Schritte</h2>
        <p>
          <strong>1. Bestätigung:</strong> Sie erhalten diese E-Mail als Zahlungsnachweis<br><br>
          <strong>2. Kontaktaufnahme:</strong> Wir melden uns innerhalb von 24 Stunden bei Ihnen<br><br>
          <strong>3. Planung:</strong> Gemeinsam besprechen wir die Details Ihres Nest-Haus Projekts<br><br>
          <strong>4. Umsetzung:</strong> Wir starten mit der professionellen Planung und Ausführung
        </p>
        
        <div class="button-center">
          <a href="https://nest-haus.at/konfigurator" class="btn-primary">
            Jetzt konfigurieren
          </a>
        </div>
      </div>
      
      <!-- Contact Info -->
      <div class="contact-section">
        <div class="contact-boxes">
          <!-- Kontakt Box -->
          <div class="contact-box">
            <h3>Kontakt</h3>
            <div class="contact-grid">
              <span class="contact-label">Telefon 1:</span>
              <span class="contact-value">+43 (0) 664 3949605</span>
              <span class="contact-label">Telefon 2:</span>
              <span class="contact-value">+43 (0) 660 5649683</span>
              <span class="contact-label">Email:</span>
              <span class="contact-value">mail@nest-haus.at</span>
            </div>
          </div>
          
          <!-- Adresse Box -->
          <div class="contact-box">
            <h3>Adresse</h3>
            <div class="contact-grid">
              <span class="contact-label">Straße:</span>
              <span class="contact-value">Zösenberg 51</span>
              <span class="contact-label">Stadt:</span>
              <span class="contact-value">8045, Weinitzen, Steiermark</span>
              <span class="contact-label">Land:</span>
              <span class="contact-value">Österreich</span>
            </div>
          </div>
        </div>
      </div>
      
      <p class="inquiry-id">Anfrage-ID: ${data.inquiryId}</p>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>
        <strong>Nest-Haus Team</strong><br>
        Modulares Wohnen. Nachhaltig. Österreichisch.
      </p>
      <p style="margin-top: 16px;">
        <a href="https://nest-haus.at">Website</a> ·
        <a href="https://nest-haus.at/impressum">Impressum</a> ·
        <a href="https://nest-haus.at/datenschutz">Datenschutz</a>
      </p>
    </div>
    
    <!-- Anti-clipping whitespace for Gmail -->
    <div style="display:none; white-space:nowrap; font:15px courier; line-height:0;">
      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Nest-Haus - Zahlungsbestätigung

Konzept-Check bestellt

Vielen Dank, ${data.name}! Ihre Bestellung für die Grundstücksanalyse und den Entwurf war erfolgreich.

ZAHLUNGSDETAILS:
- Betrag: ${formattedAmount}
- Zahlungsmethode: ${paymentMethodText}
- Datum: ${formattedDate}
${data.paymentIntentId ? `- Transaktions-ID: ${data.paymentIntentId}` : ''}

${config.nestModel
      ? `
DEIN NEST - DEINE AUSWAHL:
${config.nestModel ? `- Nest-Modell: ${config.nestModel.name} - ${formatPrice(config.nestModel.price)}` : ''}
${config.gebaeudehuelle ? `- Gebäudehülle: ${config.gebaeudehuelle.name} - ${formatPrice(config.gebaeudehuelle.price)}` : ''}
${config.innenverkleidung ? `- Innenverkleidung: ${config.innenverkleidung.name} - ${formatPrice(config.innenverkleidung.price)}` : ''}
${config.fussboden ? `- Fußboden: ${config.fussboden.name} - ${formatPrice(config.fussboden.price)}` : ''}
${config.pvanlage ? `- PV-Anlage: ${config.pvanlage.name} - ${formatPrice(config.pvanlage.price)}` : ''}
${config.fenster ? `- Fenster: ${config.fenster.name} - ${formatPrice(config.fenster.price)}` : ''}

DEIN NEST - PREISGEFÜHL:
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
3. Planung: Gemeinsam besprechen wir die Details Ihres Nest-Haus Projekts
4. Umsetzung: Wir starten mit der professionellen Planung und Ausführung

KONTAKT:
Telefon 1: +43 (0) 664 3949605
Telefon 2: +43 (0) 660 5649683
E-Mail: mail@nest-haus.at
Website: nest-haus.at

Anfrage-ID: ${data.inquiryId}

--
Nest-Haus
Modulares Wohnen. Nachhaltig. Österreichisch.

Website: https://nest-haus.at
Impressum: https://nest-haus.at/impressum
Datenschutz: https://nest-haus.at/datenschutz
  `;

  return { subject, html, text };
}

