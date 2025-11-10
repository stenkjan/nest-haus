import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

function isAdmin(request: NextRequest): boolean {
  const adminPassword = request.headers.get('x-admin-password') || 
                       new URL(request.url).searchParams.get('password');
  return adminPassword === process.env.ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const spreadsheetId = process.env.PRICING_SPREADSHEET_ID;
    if (!spreadsheetId) {
      throw new Error('PRICING_SPREADSHEET_ID environment variable not set');
    }

    const credentials = {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.replace(/\\n/g, '\n'),
    };

    console.log('[DEBUG] Using project:', credentials.client_email?.split('@')[1]);
    console.log('[DEBUG] Spreadsheet ID:', spreadsheetId);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    console.log('[DEBUG] Attempting to get spreadsheet metadata...');
    
    // Try to get just the metadata first
    const metadata = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: 'properties,sheets.properties'
    });

    console.log('[DEBUG] Metadata retrieved successfully');

    const sheetsList = metadata.data.sheets?.map(sheet => ({
      sheetId: sheet.properties?.sheetId,
      title: sheet.properties?.title,
      index: sheet.properties?.index,
      sheetType: sheet.properties?.sheetType,
    })) || [];

    return NextResponse.json({
      success: true,
      spreadsheetId,
      title: metadata.data.properties?.title,
      locale: metadata.data.properties?.locale,
      timeZone: metadata.data.properties?.timeZone,
      sheets: sheetsList,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[ERROR] Error fetching metadata:', error);
    
    const errorDetails: Record<string, unknown> = {
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };

    // Extract more error details if available
    if (error && typeof error === 'object') {
      const e = error as { code?: number; status?: number; response?: { data?: unknown } };
      if (e.code) errorDetails.code = e.code;
      if (e.status) errorDetails.status = e.status;
      if (e.response?.data) errorDetails.responseData = e.response.data;
    }

    return NextResponse.json({
      success: false,
      ...errorDetails
    }, { status: 500 });
  }
}
