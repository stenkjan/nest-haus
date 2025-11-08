/**
 * Test endpoint to check Google Sheets access
 */

import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

function isAdmin(request: NextRequest): boolean {
  const adminPassword = request.headers.get('x-admin-password') || 
                       new URL(request.url).searchParams.get('password');
  return adminPassword === process.env.ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const spreadsheetId = process.env.PRICING_SPREADSHEET_ID;
    
    if (!spreadsheetId) {
      return NextResponse.json({ error: 'PRICING_SPREADSHEET_ID not set' }, { status: 500 });
    }

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Get spreadsheet metadata
    const metadata = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheetNames = metadata.data.sheets?.map(sheet => ({
      title: sheet.properties?.title,
      sheetId: sheet.properties?.sheetId,
      index: sheet.properties?.index,
    }));

    return NextResponse.json({
      success: true,
      spreadsheetId,
      spreadsheetTitle: metadata.data.properties?.title,
      sheets: sheetNames,
      totalSheets: sheetNames?.length,
    });

  } catch (error) {
    console.error('Sheets info error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

