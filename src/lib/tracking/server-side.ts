import crypto from 'crypto';

interface UserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
}

interface EventData {
  eventName: string;
  eventTime: number;
  eventId?: string;
  eventSourceUrl: string;
  userData: UserData;
  customData?: Record<string, unknown>;
}

export class ServerSideTracking {
  private static readonly META_PIXEL_ID = process.env.META_PIXEL_ID;
  private static readonly META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
  private static readonly META_API_VERSION = 'v19.0';

  /**
   * Hash data using SHA-256 (required for CAPI)
   */
  private static hashData(data: string): string {
    return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
  }

  /**
   * Send event to Meta Conversions API
   */
  static async trackMetaEvent(event: EventData): Promise<void> {
    if (!this.META_PIXEL_ID || !this.META_ACCESS_TOKEN) {
      console.warn('⚠️ Meta CAPI credentials missing. Skipping event.');
      return;
    }

    const userData = {
      em: event.userData.email ? [this.hashData(event.userData.email)] : undefined,
      ph: event.userData.phone ? [this.hashData(event.userData.phone)] : undefined,
      fn: event.userData.firstName ? [this.hashData(event.userData.firstName)] : undefined,
      ln: event.userData.lastName ? [this.hashData(event.userData.lastName)] : undefined,
      client_ip_address: event.userData.clientIp,
      client_user_agent: event.userData.userAgent,
      fbp: event.userData.fbp,
      fbc: event.userData.fbc,
    };

    const payload = {
      data: [
        {
          event_name: event.eventName,
          event_time: Math.floor(event.eventTime / 1000),
          event_id: event.eventId,
          event_source_url: event.eventSourceUrl,
          action_source: 'website',
          user_data: userData,
          custom_data: event.customData,
        },
      ],
      access_token: this.META_ACCESS_TOKEN,
    };

    try {
      const response = await fetch(
        `https://graph.facebook.com/${this.META_API_VERSION}/${this.META_PIXEL_ID}/events`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Meta CAPI Error:', error);
      } else {
        console.log(`✅ Meta CAPI Event Sent: ${event.eventName}`);
      }
    } catch (error) {
      console.error('❌ Failed to send Meta CAPI event:', error);
    }
  }

  /**
   * Send event to Google Ads (Skeleton)
   * Note: Full implementation requires Google Ads API client or GTM Server Side
   */
  static async trackGoogleAdsEvent(event: EventData): Promise<void> {
    // Placeholder for Google Ads Enhanced Conversions
    console.log(`📝 [Skeleton] Google Ads Event: ${event.eventName}`, event);
    // Implementation would involve google-ads-api client here
  }

  /**
   * Track event across all configured platforms
   */
  static async track(event: EventData): Promise<void> {
    await Promise.allSettled([
      this.trackMetaEvent(event),
      this.trackGoogleAdsEvent(event),
    ]);
  }
}

