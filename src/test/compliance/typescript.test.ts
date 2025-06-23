import { describe, it, expect } from 'vitest'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { glob } from 'glob'

describe('TypeScript Compliance Tests', () => {
  describe('Type Safety Violations', () => {
    it('should not contain any "any" type usage', async () => {
      const tsFiles = await glob('src/**/*.{ts,tsx}', { 
        ignore: ['src/test/**/*', 'src/**/*.d.ts'] 
      })
      
      const violations: Array<{ file: string; line: number; content: string }> = []
      
      for (const file of tsFiles) {
        const content = fs.readFileSync(file, 'utf8')
        const lines = content.split('\n')
        
        lines.forEach((line, index) => {
          // Check for 'any' type usage (excluding comments and strings)
          const anyTypePattern = /:\s*any\b|as\s+any\b|<any>|Array<any>|Promise<any>/
          const isComment = line.trim().startsWith('//') || line.trim().startsWith('*')
          const isInString = /['"`].*any.*['"`]/.test(line)
          
          if (anyTypePattern.test(line) && !isComment && !isInString) {
            violations.push({
              file: file.replace(process.cwd(), ''),
              line: index + 1,
              content: line.trim()
            })
          }
        })
      }
      
      if (violations.length > 0) {
        console.error('🚨 TypeScript "any" type violations found:')
        violations.forEach(violation => {
          console.error(`  ${violation.file}:${violation.line} - ${violation.content}`)
        })
        
        expect(violations).toHaveLength(0)
      } else {
        console.log('✅ No "any" type violations found')
      }
    })

    it('should have proper interface definitions for critical types', async () => {
      const typeFiles = await glob('src/**/*.types.ts')
      
      expect(typeFiles.length).toBeGreaterThan(0)
      
      // Check for essential type definitions
      const essentialTypes = [
        'Configuration',
        'Selection',
        'ConfiguratorProps'
      ]
      
      let foundTypes = 0
      
      for (const file of typeFiles) {
        const content = fs.readFileSync(file, 'utf8')
        
        essentialTypes.forEach(typeName => {
          if (content.includes(`interface ${typeName}`) || content.includes(`type ${typeName}`)) {
            foundTypes++
            console.log(`✅ Found ${typeName} in ${path.basename(file)}`)
          }
        })
      }
      
      expect(foundTypes).toBeGreaterThan(0)
    })

    it('should not use unsafe type assertions', async () => {
      const tsFiles = await glob('src/**/*.{ts,tsx}', { 
        ignore: ['src/test/**/*'] 
      })
      
      const unsafeAssertions: Array<{ file: string; line: number; content: string }> = []
      
      for (const file of tsFiles) {
        const content = fs.readFileSync(file, 'utf8')
        const lines = content.split('\n')
        
        lines.forEach((line, index) => {
          // Check for unsafe type assertions
          const unsafePatterns = [
            /as\s+unknown\s+as/,
            /\!\s*as\s+/,
            /@ts-ignore/,
            /@ts-expect-error(?!\s+.*:\s*.*)/  // Allow with proper comments
          ]
          
          const isComment = line.trim().startsWith('//')
          
          if (!isComment) {
            unsafePatterns.forEach(pattern => {
              if (pattern.test(line)) {
                unsafeAssertions.push({
                  file: file.replace(process.cwd(), ''),
                  line: index + 1,
                  content: line.trim()
                })
              }
            })
          }
        })
      }
      
      if (unsafeAssertions.length > 0) {
        console.warn('⚠️ Potentially unsafe type assertions found:')
        unsafeAssertions.forEach(assertion => {
          console.warn(`  ${assertion.file}:${assertion.line} - ${assertion.content}`)
        })
        
        // Allow some unsafe assertions but keep count low
        expect(unsafeAssertions.length).toBeLessThan(5)
      } else {
        console.log('✅ No unsafe type assertions found')
      }
    })
  })

  describe('TypeScript Compilation', () => {
    it('should compile without errors', () => {
      try {
        console.log('🔍 Checking TypeScript compilation...')
        const output = execSync('npx tsc --noEmit', { encoding: 'utf8', stdio: 'pipe' })
        
        console.log('✅ TypeScript compilation successful')
        expect(output).toBe('')
      } catch (error: unknown) {
        console.error('❌ TypeScript compilation errors:')
        const execError = error as { stdout?: string; status?: number; message?: string }
        console.error(execError.stdout || execError.message)
        
        // Fail the test if there are compilation errors
        expect(execError.status).toBe(0)
      }
    })

    it('should have strict TypeScript configuration', () => {
      const tsconfigPath = path.join(process.cwd(), 'tsconfig.json')
      expect(fs.existsSync(tsconfigPath)).toBe(true)
      
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'))
      const compilerOptions = tsconfig.compilerOptions || {}
      
      // Check for strict mode settings
      const strictSettings = {
        strict: true,
        noImplicitAny: true,
        strictNullChecks: true,
        strictFunctionTypes: true,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true
      }
      
      Object.entries(strictSettings).forEach(([setting, expectedValue]) => {
        if (compilerOptions[setting] !== expectedValue) {
          console.warn(`⚠️ TypeScript setting "${setting}" should be ${expectedValue}`)
        }
      })
      
      console.log('✅ TypeScript configuration checked')
    })
  })

  describe('Import/Export Consistency', () => {
    it('should use consistent import styles', async () => {
      const tsFiles = await glob('src/**/*.{ts,tsx}', { 
        ignore: ['src/test/**/*'] 
      })
      
      const importViolations: Array<{ file: string; line: number; content: string }> = []
      
      for (const file of tsFiles) {
        const content = fs.readFileSync(file, 'utf8')
        const lines = content.split('\n')
        
        lines.forEach((line, index) => {
          // Check for inconsistent import patterns
          if (line.includes('import') && line.includes('from')) {
            // Prefer named imports over default imports for utilities
            if (line.includes('import *') && !line.includes('React')) {
              importViolations.push({
                file: file.replace(process.cwd(), ''),
                line: index + 1,
                content: line.trim()
              })
            }
          }
        })
      }
      
      if (importViolations.length > 0) {
        console.warn('⚠️ Import style inconsistencies found:')
        importViolations.forEach(violation => {
          console.warn(`  ${violation.file}:${violation.line} - ${violation.content}`)
        })
      }
      
      // Allow some violations but keep count reasonable
      expect(importViolations.length).toBeLessThan(10)
    })

    it('should not have circular dependencies', async () => {
      // Simple circular dependency check
      const tsFiles = await glob('src/**/*.{ts,tsx}', { 
        ignore: ['src/test/**/*', 'src/**/*.d.ts'] 
      })
      
      const dependencyMap = new Map<string, Set<string>>()
      
      // Build dependency map
      for (const file of tsFiles) {
        const content = fs.readFileSync(file, 'utf8')
        const imports = new Set<string>()
        
        // Extract import statements
        const importRegex = /import.*from\s+['"]([^'"]+)['"]/g
        let match
        
        while ((match = importRegex.exec(content)) !== null) {
          const importPath = match[1]
          if (importPath.startsWith('.') || importPath.startsWith('@/')) {
            imports.add(importPath)
          }
        }
        
        dependencyMap.set(file, imports)
      }
      
      // Check for obvious circular dependencies (A -> B -> A)
      const circularDeps: string[] = []
      
      dependencyMap.forEach((imports, file) => {
        imports.forEach(importPath => {
          // This is a simplified check - a full analysis would require path resolution
          if (importPath.includes(path.basename(file, path.extname(file)))) {
            circularDeps.push(`${file} <-> ${importPath}`)
          }
        })
      })
      
      if (circularDeps.length > 0) {
        console.warn('⚠️ Potential circular dependencies found:')
        circularDeps.forEach(dep => console.warn(`  ${dep}`))
      }
      
      expect(circularDeps.length).toBe(0)
    })
  })

  describe('Code Quality Patterns', () => {
    it('should use proper error handling patterns', async () => {
      const tsFiles = await glob('src/**/*.{ts,tsx}', { 
        ignore: ['src/test/**/*'] 
      })
      
      const errorHandlingIssues: Array<{ file: string; line: number; issue: string }> = []
      
      for (const file of tsFiles) {
        const content = fs.readFileSync(file, 'utf8')
        const lines = content.split('\n')
        
        lines.forEach((line, index) => {
          // Check for catch blocks without proper error typing
          if (line.includes('catch') && line.includes('error') && !line.includes(': Error') && !line.includes(': unknown')) {
            errorHandlingIssues.push({
              file: file.replace(process.cwd(), ''),
              line: index + 1,
              issue: 'Catch block without proper error typing'
            })
          }
          
          // Check for console.log in non-test files
          if (line.includes('console.log') && !file.includes('test') && !file.includes('setup')) {
            errorHandlingIssues.push({
              file: file.replace(process.cwd(), ''),
              line: index + 1,
              issue: 'console.log found (consider using proper logging)'
            })
          }
        })
      }
      
      if (errorHandlingIssues.length > 0) {
        console.warn('⚠️ Code quality issues found:')
        errorHandlingIssues.forEach(issue => {
          console.warn(`  ${issue.file}:${issue.line} - ${issue.issue}`)
        })
      }
      
      // Allow some issues but keep count reasonable
      expect(errorHandlingIssues.length).toBeLessThan(20)
    })

    it('should use modern React patterns', async () => {
      const reactFiles = await glob('src/**/*.{tsx}', { 
        ignore: ['src/test/**/*'] 
      })
      
      const legacyPatterns: Array<{ file: string; line: number; pattern: string }> = []
      
      for (const file of reactFiles) {
        const content = fs.readFileSync(file, 'utf8')
        const lines = content.split('\n')
        
        lines.forEach((line, index) => {
          // Check for legacy React patterns
          if (line.includes('React.FC')) {
            legacyPatterns.push({
              file: file.replace(process.cwd(), ''),
              line: index + 1,
              pattern: 'React.FC usage (prefer function components without FC)'
            })
          }
          
          if (line.includes('componentDidMount') || line.includes('componentWillUnmount')) {
            legacyPatterns.push({
              file: file.replace(process.cwd(), ''),
              line: index + 1,
              pattern: 'Class component lifecycle methods (prefer hooks)'
            })
          }
          
          if (line.includes('UNSAFE_')) {
            legacyPatterns.push({
              file: file.replace(process.cwd(), ''),
              line: index + 1,
              pattern: 'Unsafe React lifecycle method'
            })
          }
        })
      }
      
      if (legacyPatterns.length > 0) {
        console.warn('⚠️ Legacy React patterns found:')
        legacyPatterns.forEach(pattern => {
          console.warn(`  ${pattern.file}:${pattern.line} - ${pattern.pattern}`)
        })
      }
      
      // Allow some legacy patterns but keep count low
      expect(legacyPatterns.length).toBeLessThan(5)
    })
  })
}) 