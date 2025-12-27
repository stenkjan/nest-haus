"""
Price Audit Script for Hoam-House Configurator
==============================================

This script reads the Excel price table (Preiskalkulation.xlsx) and displays
all pricing data for verification and auditing purposes.

Usage:
1. Ensure pandas and openpyxl are installed: python -m pip install pandas openpyxl
2. Run: python read_prices.py
3. Compare output with src/constants/configurator.ts prices

Last Updated: 2025-01-31 (after major price corrections)
"""

import pandas as pd
import json

# Read the Excel file
try:
    df = pd.read_excel('Preiskalkulation.xlsx', sheet_name='Preise Website')
    
    print("=== Sheet Structure ===")
    print(f"Shape: {df.shape}")
    print(f"\nColumns: {list(df.columns)}")
    
    print("\n=== First 20 rows ===")
    print(df.head(20).to_string())
    
    print("\n=== All data ===")
    for idx, row in df.iterrows():
        print(f"\nRow {idx}:")
        for col in df.columns:
            if pd.notna(row[col]):
                print(f"  {col}: {row[col]}")
    
except Exception as e:
    print(f"Error reading Excel file: {e}")
    import traceback
    traceback.print_exc() 