/**
 * Google Sheets Pricing Connection Test Endpoint
 * 
 * Tests Google Sheets API connectivity and validates sheet structure
 * Used for debugging and verifying pricing sheet access
 */

import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

function getCredentials() {
  const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE;
  
  if (keyFile) {
    if (!keyFile.endsWith('.json')) {
      throw new Error('Key file must be a JSON file');
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require('path');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require('fs');
      const keyFilePath = path.resolve(process.cwd(), keyFile);
      
      if (!fs.existsSync(keyFilePath)) {
        throw new Error(`Key file not found: ${keyFilePath}`);
      }
      
      const keyFileContent = fs.readFileSync(keyFilePath, 'utf8');
      return JSON.parse(keyFileContent);
    } catch (error) {
      console.warn('Could not load key file, trying environment variables:', error);
    }
  }

  // Load from environment variables (production)
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!email || !key) {
    throw new Error(
      'Google Service Account credentials not configured. ' +
      'Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_KEY'
    );
  }

  return {
    client_email: email,
    private_key: key.replace(/\\n/g, '\n'), // Handle escaped newlines
  };
}

export async function GET(_request: NextRequest) {
  try {
    const spreadsheetId = process.env.PRICING_SPREADSHEET_ID;
    
    if (!spreadsheetId) {
      return NextResponse.json({
        success: false,
        message: 'PRICING_SPREADSHEET_ID environment variable not set',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    // Initialize Google Sheets API
    const credentials = getCredentials();
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Test 1: Fetch sheet metadata
    console.log('📊 Fetching spreadsheet metadata...');
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheetNames = spreadsheet.data.sheets?.map(s => s.properties?.title || '').filter(Boolean) || [];
    
    // Test 2: Check if "Preistabelle Verkauf" sheet exists
    const targetSheet = 'Preistabelle Verkauf';
    const sheetExists = sheetNames.includes(targetSheet);
    
    if (!sheetExists) {
      return NextResponse.json({
        success: false,
        message: `Sheet "${targetSheet}" not found`,
        availableSheets: sheetNames,
        timestamp: new Date().toISOString()
      }, { status: 404 });
    }

    // Test 3: Fetch sample data from the sheet (first 100 rows, columns A-N)
    console.log(`📊 Fetching data from "${targetSheet}"...`);
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${targetSheet}!A1:N100`,
    });

    const rows = response.data.values || [];
    
    // Test 4: Validate structure - check column E for section headers
    const columnE = rows.map((row, index) => ({
      row: index + 1,
      value: row[4] || '', // Column E (0-indexed: 4)
    })).filter(item => item.value);

    // Test 5: Check specific cells mentioned in requirements
    const testCells: Record<string, { row: number; col: string; expected?: string }> = {
      nest80_price: { row: 11, col: 'F' }, // F11
      nest100_price: { row: 11, col: 'H' }, // H11
      nest120_price: { row: 11, col: 'J' }, // J11
      nest140_price: { row: 11, col: 'L' }, // L11
      nest160_price: { row: 11, col: 'N' }, // N11
      geschossdecke_base: { row: 7, col: 'D' }, // D7
      geschossdecke_max_80: { row: 7, col: 'G' }, // G7
    };

    const cellValues: Record<string, unknown> = {};
    for (const [key, { row, col }] of Object.entries(testCells)) {
      const colIndex = col.charCodeAt(0) - 65; // Convert A=0, B=1, etc.
      const cellRow = rows[row - 1];
      if (cellRow && cellRow[colIndex] !== undefined) {
        cellValues[key] = cellRow[colIndex];
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Google Sheets connection successful',
      data: {
        spreadsheetId,
        sheetName: targetSheet,
        totalRows: rows.length,
        columnESections: columnE.slice(0, 20), // First 20 non-empty values from column E
        testCellValues: cellValues,
        availableSheets: sheetNames,
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('❌ Google Sheets connection test failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Google Sheets connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

