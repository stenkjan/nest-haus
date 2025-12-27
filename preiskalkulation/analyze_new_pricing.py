"""
New Producer Pricing Analysis Tool
===================================

This script analyzes the new producer pricing (PDF + Excel) and compares it
with the current configurator pricing structure.

Usage:
1. Place the following files in /workspace/preiskalkulation/:
   - Angebot_-_15014024.pdf (producer offer)
   - book5.xlsx (producer calculation sheet)

2. Run: python3 analyze_new_pricing.py

3. Review the generated comparison report

Features:
- Extracts pricing from producer documents
- Compares with current configurator prices
- Identifies price changes (increases/decreases)
- Generates mapping recommendations
- Creates import-ready JSON for Google Sheets sync

Last Updated: 2025-11-04
"""

import pandas as pd
import json
import os
from datetime import datetime
from typing import Dict, List, Any

class PricingAnalyzer:
    def __init__(self):
        self.current_prices = {}
        self.new_prices = {}
        self.price_changes = {}
        self.mapping_recommendations = []
        
    def load_current_pricing(self):
        """Load existing pricing from Preiskalkulation.xlsx"""
        print("📊 Loading current configurator pricing...")
        
        try:
            df = pd.read_excel('Preiskalkulation.xlsx', sheet_name='Preise Website')
            
            # Parse the structure (data starts at row 2)
            current = {
                'base_combinations': [],
                'add_ons': {},
                'metadata': {}
            }
            
            # Extract header row (row 1)
            headers = df.iloc[1].fillna('').tolist()
            
            # Extract price combinations (rows 2-28)
            for idx in range(2, 29):
                if idx >= len(df):
                    break
                    
                row = df.iloc[idx]
                option_name = row.get('Unnamed: 2', '')
                
                if pd.notna(option_name) and option_name != '':
                    base_price = row.get('Unnamed: 3', 0)
                    per_module = row.get('Unnamed: 4', 0)
                    
                    # Parse combination name
                    parts = str(option_name).split(', ')
                    if len(parts) >= 3:
                        gebaeudehuelle = parts[0].strip()
                        innenverkleidung = parts[1].strip()
                        fussboden = parts[2].strip()
                        
                        current['base_combinations'].append({
                            'gebaeudehuelle': gebaeudehuelle,
                            'innenverkleidung': innenverkleidung,
                            'fussboden': fussboden,
                            'base_price': base_price if pd.notna(base_price) else 0,
                            'per_module_price': per_module if pd.notna(per_module) else 0,
                            'original_name': option_name
                        })
            
            # Extract add-on pricing from first row with data
            first_data_row = df.iloc[2]
            current['add_ons'] = {
                'pv_panele': first_data_row.get('Unnamed: 5', 0),
                'fenster_pvc': first_data_row.get('Unnamed: 6', 0),
                'fenster_fichte': first_data_row.get('Unnamed: 7', 0),
                'fenster_eiche': first_data_row.get('Unnamed: 8', 0),
                'fenster_alu': first_data_row.get('Unnamed: 9', 0),
                'planung_basis': first_data_row.get('Unnamed: 10', 0),
                'planung_plus': first_data_row.get('Unnamed: 11', 0),
                'planung_pro': first_data_row.get('Unnamed: 12', 0),
                'grundstueckscheck': first_data_row.get('Unnamed: 13', 0)
            }
            
            # Extract metadata
            current['metadata'] = {
                'last_updated': df.iloc[0].get('Unnamed: 13', 'Unknown'),
                'combinations_count': len(current['base_combinations']),
                'has_ohne_belag': any('ohne' in c['fussboden'].lower() 
                                     for c in current['base_combinations'])
            }
            
            self.current_prices = current
            
            print(f"✅ Loaded {len(current['base_combinations'])} price combinations")
            print(f"✅ Loaded {len(current['add_ons'])} add-on prices")
            print(f"📅 Last updated: {current['metadata']['last_updated']}")
            
            return current
            
        except Exception as e:
            print(f"❌ Error loading current pricing: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    def load_producer_pricing(self):
        """Load new producer pricing from book5.xlsx"""
        print("\n📊 Loading new producer pricing from book5.xlsx...")
        
        if not os.path.exists('book5.xlsx'):
            print("⚠️  book5.xlsx not found - please upload the file")
            print("📁 Expected location: /workspace/preiskalkulation/book5.xlsx")
            return None
        
        try:
            # Read all sheets to understand structure
            xl = pd.ExcelFile('book5.xlsx')
            print(f"📄 Found sheets: {xl.sheet_names}")
            
            new_prices = {
                'sheets': {},
                'extracted_prices': []
            }
            
            # Read each sheet and analyze structure
            for sheet_name in xl.sheet_names:
                df = xl.parse(sheet_name)
                new_prices['sheets'][sheet_name] = {
                    'shape': df.shape,
                    'columns': df.columns.tolist(),
                    'preview': df.head(10).to_dict()
                }
                print(f"   📋 {sheet_name}: {df.shape[0]} rows, {df.shape[1]} columns")
            
            self.new_prices = new_prices
            
            print("✅ Loaded new producer pricing structure")
            return new_prices
            
        except Exception as e:
            print(f"❌ Error loading producer pricing: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    def extract_pdf_data(self):
        """Extract pricing data from producer PDF"""
        print("\n📄 Analyzing producer PDF (Angebot_-_15014024.pdf)...")
        
        if not os.path.exists('Angebot_-_15014024.pdf'):
            print("⚠️  PDF not found - please upload the file")
            print("📁 Expected location: /workspace/preiskalkulation/Angebot_-_15014024.pdf")
            return None
        
        try:
            # Try to extract text from PDF
            # Note: This requires PyPDF2 or pdfplumber
            print("💡 PDF analysis requires additional libraries")
            print("   Install with: pip install PyPDF2 pdfplumber")
            print("   For now, manual review of PDF is recommended")
            
            return {
                'status': 'pending',
                'message': 'Manual PDF review needed'
            }
            
        except Exception as e:
            print(f"❌ Error reading PDF: {e}")
            return None
    
    def compare_prices(self):
        """Compare current vs new producer pricing"""
        print("\n🔍 Comparing current vs new pricing...")
        
        if not self.current_prices or not self.new_prices:
            print("⚠️  Missing pricing data - load both datasets first")
            return None
        
        comparison = {
            'summary': {},
            'changes': [],
            'recommendations': []
        }
        
        # This will be expanded once we have the actual producer data structure
        print("📊 Comparison ready - waiting for producer data structure")
        
        return comparison
    
    def generate_google_sheets_template(self):
        """Generate a Google Sheets template for the new pricing structure"""
        print("\n📝 Generating Google Sheets template...")
        
        template = {
            'metadata': {
                'version': '1.0.0',
                'created': datetime.now().isoformat(),
                'description': 'Hoam-House Configurator Pricing Template'
            },
            'tabs': []
        }
        
        # Tab 1: Base Module Pricing
        base_pricing_tab = {
            'name': 'Base Module Pricing',
            'columns': [
                'Gebäudehülle',
                'Innenverkleidung', 
                'Fussboden',
                'Base Price (Hoam 80)',
                'Per Module Price',
                'Notes'
            ],
            'data': []
        }
        
        # Populate with current data
        if self.current_prices and 'base_combinations' in self.current_prices:
            for combo in self.current_prices['base_combinations']:
                base_pricing_tab['data'].append([
                    combo['gebaeudehuelle'],
                    combo['innenverkleidung'],
                    combo['fussboden'],
                    combo['base_price'],
                    combo['per_module_price'],
                    ''  # Notes column
                ])
        
        template['tabs'].append(base_pricing_tab)
        
        # Tab 2: Add-On Components
        addon_tab = {
            'name': 'Add-On Components',
            'columns': [
                'Component ID',
                'Component Name',
                'Price Type',
                'Base Price',
                'Unit',
                'Scaling Formula',
                'Notes'
            ],
            'data': []
        }
        
        if self.current_prices and 'add_ons' in self.current_prices:
            for key, value in self.current_prices['add_ons'].items():
                addon_tab['data'].append([
                    key,
                    key.replace('_', ' ').title(),
                    'fixed',
                    value,
                    'per unit',
                    '',
                    ''
                ])
        
        template['tabs'].append(addon_tab)
        
        # Tab 3: Size-Dependent Pricing
        size_dependent_tab = {
            'name': 'Size-Dependent Pricing',
            'columns': [
                'Component',
                'Base Price (Hoam 80)',
                'Scaling Factor',
                'Formula',
                'Notes'
            ],
            'data': [
                ['Elektrische Fußbodenheizung', 5000, 0.25, 'base * (1 + 0.25 * additional_modules)', ''],
                ['Wassergeführte Fußbodenheizung', 7500, 0.25, 'base * (1 + 0.25 * additional_modules)', ''],
                ['Fundament', 5000, 0.25, 'base * (1 + 0.25 * additional_modules)', ''],
                ['Geschossdecke', 5000, 0.25, 'base * (1 + 0.25 * additional_modules) * quantity', 'Per unit']
            ]
        }
        
        template['tabs'].append(size_dependent_tab)
        
        # Tab 4: Percentage-Based Pricing
        percentage_tab = {
            'name': 'Percentage-Based Pricing',
            'columns': [
                'Component',
                'Percentage',
                'Base Material Price',
                'Formula',
                'Notes'
            ],
            'data': [
                ['Belichtungspaket Light', 12, 280, 'nest_size * percentage * material_price', 'PVC default'],
                ['Belichtungspaket Medium', 16, 280, 'nest_size * percentage * material_price', 'PVC default'],
                ['Belichtungspaket Bright', 22, 280, 'nest_size * percentage * material_price', 'PVC default']
            ]
        }
        
        template['tabs'].append(percentage_tab)
        
        # Save template
        output_file = 'google_sheets_pricing_template.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(template, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Template saved to: {output_file}")
        print(f"📊 {len(template['tabs'])} tabs created")
        
        return template
    
    def generate_comparison_report(self):
        """Generate a detailed comparison report"""
        print("\n📄 Generating comparison report...")
        
        report = {
            'timestamp': datetime.now().isoformat(),
            'current_pricing_summary': {},
            'new_pricing_summary': {},
            'changes': [],
            'recommendations': []
        }
        
        # Current pricing summary
        if self.current_prices:
            report['current_pricing_summary'] = {
                'total_combinations': len(self.current_prices.get('base_combinations', [])),
                'add_ons_count': len(self.current_prices.get('add_ons', {})),
                'price_range': {
                    'min': min([c['base_price'] for c in self.current_prices.get('base_combinations', [])], default=0),
                    'max': max([c['base_price'] for c in self.current_prices.get('base_combinations', [])], default=0)
                },
                'gebaeudehuelle_types': list(set([c['gebaeudehuelle'] for c in self.current_prices.get('base_combinations', [])])),
                'innenverkleidung_types': list(set([c['innenverkleidung'] for c in self.current_prices.get('base_combinations', [])])),
                'fussboden_types': list(set([c['fussboden'] for c in self.current_prices.get('base_combinations', [])]))
            }
        
        # Save report
        output_file = 'pricing_comparison_report.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Report saved to: {output_file}")
        
        # Print summary
        print("\n" + "="*60)
        print("CURRENT PRICING SUMMARY")
        print("="*60)
        
        if self.current_prices:
            print(f"\n📦 Base Combinations: {len(self.current_prices.get('base_combinations', []))}")
            print(f"🔧 Add-Ons: {len(self.current_prices.get('add_ons', {}))}")
            
            if report['current_pricing_summary']['price_range']['min'] > 0:
                print(f"\n💰 Price Range:")
                print(f"   Minimum: €{report['current_pricing_summary']['price_range']['min']:,.0f}")
                print(f"   Maximum: €{report['current_pricing_summary']['price_range']['max']:,.0f}")
            
            print(f"\n🏗️  Gebäudehülle Types: {len(report['current_pricing_summary']['gebaeudehuelle_types'])}")
            for gh in sorted(report['current_pricing_summary']['gebaeudehuelle_types']):
                print(f"   • {gh}")
            
            print(f"\n🪵 Innenverkleidung Types: {len(report['current_pricing_summary']['innenverkleidung_types'])}")
            for iv in sorted(report['current_pricing_summary']['innenverkleidung_types']):
                print(f"   • {iv}")
            
            print(f"\n🪵 Fussboden Types: {len(report['current_pricing_summary']['fussboden_types'])}")
            for fb in sorted(report['current_pricing_summary']['fussboden_types']):
                print(f"   • {fb}")
        
        print("\n" + "="*60)
        
        return report

def main():
    """Main execution flow"""
    print("="*60)
    print("NEST-HAUS PRICING ANALYSIS TOOL")
    print("="*60)
    
    analyzer = PricingAnalyzer()
    
    # Step 1: Load current pricing
    current = analyzer.load_current_pricing()
    
    # Step 2: Try to load new producer pricing
    new_pricing = analyzer.load_producer_pricing()
    
    # Step 3: Try to extract PDF data
    pdf_data = analyzer.extract_pdf_data()
    
    # Step 4: Generate Google Sheets template
    template = analyzer.generate_google_sheets_template()
    
    # Step 5: Generate comparison report
    report = analyzer.generate_comparison_report()
    
    print("\n" + "="*60)
    print("NEXT STEPS")
    print("="*60)
    print("\n1. 📤 Upload the following files to /workspace/preiskalkulation/:")
    print("   • Angebot_-_15014024.pdf (producer offer)")
    print("   • book5.xlsx (producer calculation)")
    
    print("\n2. 🔄 Re-run this script to analyze new pricing:")
    print("   python3 analyze_new_pricing.py")
    
    print("\n3. 📊 Use the generated template for Google Sheets:")
    print("   • Open: google_sheets_pricing_template.json")
    print("   • Import to Google Sheets")
    print("   • Share with service account")
    
    print("\n4. 🔧 Review the comparison report:")
    print("   • Open: pricing_comparison_report.json")
    print("   • Check for price changes")
    print("   • Validate formulas")
    
    print("\n" + "="*60)
    
    return {
        'current': current,
        'new_pricing': new_pricing,
        'pdf_data': pdf_data,
        'template': template,
        'report': report
    }

if __name__ == '__main__':
    result = main()
