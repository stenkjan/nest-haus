# Comprehensive Testing Guide - NEST-Haus

## Table of Contents
1. [Overview](#overview)
2. [Testing Infrastructure Setup](#testing-infrastructure-setup)
3. [Test Categories](#test-categories)
4. [Testing Rules & Standards](#testing-rules--standards)
5. [Automated Testing Pipeline](#automated-testing-pipeline)
6. [Performance Testing](#performance-testing)
7. [Accessibility Testing](#accessibility-testing)
8. [TypeScript Compliance Testing](#typescript-compliance-testing)
9. [Image System Testing](#image-system-testing)
10. [CI/CD Integration](#cicd-integration)
11. [Test Cleanup & Maintenance](#test-cleanup--maintenance)

## Overview

This guide establishes comprehensive testing standards for the NEST-Haus configurator application, ensuring code quality, performance, and reliability while adhering to React/Next.js best practices and our cursor rules.

### Key Testing Principles
- **Never use `any` type** - All tests must have proper TypeScript typing
- **Test cleanup** - All test artifacts must be removed after execution
- **Non-blocking tests** - Tests should not interfere with user experience
- **Performance monitoring** - Track response times and bundle sizes
- **Accessibility compliance** - All UI components must pass a11y tests

## Testing Infrastructure Setup

### Required Dependencies

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev @playwright/test
npm install --save-dev jest jest-environment-jsdom
npm install --save-dev @types/jest
npm install --save-dev jest-axe
npm install --save-dev web-vitals
```

### Configuration Files

#### `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'src/generated/**',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
```

#### `src/test/setup.ts`
```typescript
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}))

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: vi.fn(({ src, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  )),
}))

// Mock environment variables
process.env.NODE_ENV = 'test'
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
  sessionStorage.clear()
})
```

#### `playwright.config.ts`
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Test Categories

### 1. Unit Tests
Test individual components and functions in isolation.

#### Example: ConfiguratorStore Test
```typescript
// src/store/__tests__/configuratorStore.test.ts
import { renderHook, act } from '@testing-library/react'
import { useConfiguratorStore } from '../configuratorStore'
import type { Selection } from '@/types/configurator'

describe('ConfiguratorStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useConfiguratorStore.getState().reset?.()
  })

  afterEach(() => {
    // Cleanup test artifacts
    useConfiguratorStore.getState().reset?.()
  })

  it('should initialize with default configuration', () => {
    const { result } = renderHook(() => useConfiguratorStore())
    
    expect(result.current.configuration).toEqual(
      expect.objectContaining({
        nest: null,
        material: null,
        pvanlage: null,
        fenster: null,
        innenverkleidung: null,
        planungspaket: null
      })
    )
  })

  it('should update selection correctly', async () => {
    const { result } = renderHook(() => useConfiguratorStore())
    
    const testSelection: Selection = {
      category: 'nest',
      value: 'nest80',
      name: 'NEST 80',
      price: 89000,
      description: '80m² NEST House'
    }

    await act(async () => {
      await result.current.updateSelection(testSelection)
    })

    expect(result.current.configuration.nest).toEqual(
      expect.objectContaining({
        value: 'nest80',
        name: 'NEST 80',
        price: 89000
      })
    )
  })

  it('should calculate price correctly', async () => {
    const { result } = renderHook(() => useConfiguratorStore())
    
    const selections: Selection[] = [
      {
        category: 'nest',
        value: 'nest80',
        name: 'NEST 80',
        price: 89000,
        description: '80m² NEST House'
      },
      {
        category: 'material',
        value: 'trapezblech',
        name: 'Trapezblech',
        price: 0,
        description: 'Standard material'
      }
    ]

    for (const selection of selections) {
      await act(async () => {
        await result.current.updateSelection(selection)
      })
    }

    expect(result.current.currentPrice).toBe(89000)
  })
})
```

### 2. Integration Tests
Test component interactions and data flow.

#### Example: Configurator Integration Test
```typescript
// src/app/konfigurator/__tests__/integration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfiguratorShell } from '../components/ConfiguratorShell'
import { useConfiguratorStore } from '@/store/configuratorStore'
import type { Configuration } from '@/types/configurator'

// Mock store with proper typing
vi.mock('@/store/configuratorStore')
const mockStore = vi.mocked(useConfiguratorStore)

describe('Configurator Integration', () => {
  const mockUpdateSelection = vi.fn()
  const mockInitializeSession = vi.fn()
  const mockFinalizeSession = vi.fn()

  const defaultConfiguration: Configuration = {
    nest: null,
    material: null,
    pvanlage: null,
    fenster: null,
    innenverkleidung: null,
    planungspaket: null
  }

  beforeEach(() => {
    mockStore.mockReturnValue({
      configuration: defaultConfiguration,
      currentPrice: 0,
      updateSelection: mockUpdateSelection,
      initializeSession: mockInitializeSession,
      finalizeSession: mockFinalizeSession,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should handle NEST selection correctly', async () => {
    const user = userEvent.setup()
    render(<ConfiguratorShell />)
    
    const nest80Option = screen.getByTestId('nest-80-option')
    await user.click(nest80Option)

    await waitFor(() => {
      expect(mockUpdateSelection).toHaveBeenCalledWith(
        expect.objectContaining({
          category: 'nest',
          value: 'nest80',
          name: 'NEST 80'
        })
      )
    })
  })

  it('should update price display when selection changes', async () => {
    // Mock store with selection
    mockStore.mockReturnValue({
      configuration: {
        ...defaultConfiguration,
        nest: { 
          category: 'nest',
          value: 'nest80', 
          name: 'NEST 80', 
          price: 89000,
          description: '80m² NEST House'
        }
      },
      currentPrice: 89000,
      updateSelection: mockUpdateSelection,
      initializeSession: mockInitializeSession,
      finalizeSession: mockFinalizeSession,
    })

    render(<ConfiguratorShell />)
    
    expect(screen.getByTestId('price-display')).toHaveTextContent('89.000')
  })

  it('should handle PV quantity changes correctly', async () => {
    const user = userEvent.setup()
    
    // Mock store with PV selection
    mockStore.mockReturnValue({
      configuration: {
        ...defaultConfiguration,
        pvanlage: {
          category: 'pvanlage',
          value: 'pv-standard',
          name: 'PV Standard',
          price: 15000,
          description: 'Standard PV system',
          quantity: 1
        }
      },
      currentPrice: 15000,
      updateSelection: mockUpdateSelection,
      initializeSession: mockInitializeSession,
      finalizeSession: mockFinalizeSession,
    })

    render(<ConfiguratorShell />)
    
    const quantityInput = screen.getByTestId('pv-quantity-input')
    await user.clear(quantityInput)
    await user.type(quantityInput, '3')

    await waitFor(() => {
      expect(mockUpdateSelection).toHaveBeenCalledWith(
        expect.objectContaining({
          quantity: 3
        })
      )
    })
  })
})
```

### 3. End-to-End Tests
Test complete user workflows using Playwright.

#### Example: E2E Configurator Test
```typescript
// tests/e2e/configurator.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Configurator E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/konfigurator')
    await page.waitForLoadState('networkidle')
  })

  test.afterEach(async ({ page }) => {
    // Clean up any test data
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  })

  test('should complete full configuration flow', async ({ page }) => {
    // Select NEST model
    await page.click('[data-testid="nest-80-option"]')
    await expect(page.locator('[data-testid="price-display"]')).toContainText('89.000')

    // Select material
    await page.click('[data-testid="trapezblech-option"]')
    await expect(page.locator('[data-testid="price-display"]')).toContainText('89.000')

    // Add PV system
    await page.click('[data-testid="pv-standard-option"]')
    await page.fill('[data-testid="pv-quantity-input"]', '2')
    await expect(page.locator('[data-testid="price-display"]')).toContainText('119.000')

    // Add to cart
    await page.click('[data-testid="add-to-cart"]')
    await expect(page.locator('[data-testid="cart-count"]')).toContainText('1')

    // Verify cart contents
    await page.goto('/warenkorb')
    await expect(page.locator('[data-testid="cart-item"]')).toContainText('NEST 80')
    await expect(page.locator('[data-testid="cart-total"]')).toContainText('119.000')
  })

  test('should maintain state across page navigation', async ({ page }) => {
    // Configure house
    await page.click('[data-testid="nest-80-option"]')
    await page.click('[data-testid="trapezblech-option"]')

    // Navigate away and back
    await page.goto('/')
    await page.goto('/konfigurator')

    // Verify state is maintained
    await expect(page.locator('[data-testid="nest-80-option"]')).toHaveClass(/selected/)
    await expect(page.locator('[data-testid="trapezblech-option"]')).toHaveClass(/selected/)
  })

  test('should handle mobile responsive design', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Test mobile-specific interactions
    await expect(page.locator('[data-testid="mobile-preview"]')).toBeVisible()
    await expect(page.locator('[data-testid="desktop-menu"]')).toBeHidden()

    // Test configurator on mobile
    await page.click('[data-testid="nest-80-option"]')
    await expect(page.locator('[data-testid="mobile-preview"]')).toBeVisible()
    
    // Test scroll behavior
    await page.evaluate(() => window.scrollTo(0, 100))
    await expect(page.locator('[data-testid="navbar"]')).toHaveCSS('transform', /translateY/)
  })

  test('should handle error states gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/**', route => route.abort())
    
    await page.click('[data-testid="nest-80-option"]')
    
    // Should show error state without crashing
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible()
  })
})
```

## Testing Rules & Standards

### TypeScript Compliance
- **NEVER use `any` type** in tests
- Use proper type assertions and guards
- Define test-specific interfaces when needed

```typescript
// ✅ CORRECT: Proper typing
interface MockConfiguratorStore {
  configuration: Configuration
  currentPrice: number
  updateSelection: (selection: Selection) => Promise<void>
}

// ❌ INCORRECT: Using any
const mockStore: any = { ... }
```

### Test Data Management
- Use factories for test data creation
- Clean up all test artifacts after execution
- Use deterministic test data (no random values)

```typescript
// src/test/factories/configuratorFactory.ts
import type { Configuration, Selection } from '@/types/configurator'

export const createMockConfiguration = (): Configuration => ({
  nest: {
    category: 'nest',
    value: 'nest80',
    name: 'NEST 80',
    price: 89000,
    description: '80m² NEST House'
  },
  material: {
    category: 'material',
    value: 'trapezblech',
    name: 'Trapezblech',
    price: 0,
    description: 'Standard material'
  },
  pvanlage: null,
  fenster: null,
  innenverkleidung: null,
  planungspaket: null
})

export const createMockSelection = (overrides: Partial<Selection> = {}): Selection => ({
  category: 'nest',
  value: 'nest80',
  name: 'NEST 80',
  price: 89000,
  description: '80m² NEST House',
  ...overrides
})
```

### Error Handling Tests
- Test error boundaries and graceful degradation
- Verify non-blocking behavior
- Test API failure scenarios

```typescript
it('should handle API errors gracefully', async () => {
  // Mock API failure
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))
  
  render(<ConfiguratorShell />)
  
  const nest80Option = screen.getByTestId('nest-80-option')
  fireEvent.click(nest80Option)

  // Should not crash and show error state
  await waitFor(() => {
    expect(screen.getByTestId('error-message')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /erneut versuchen/i })).toBeInTheDocument()
  })

  consoleSpy.mockRestore()
})
```

## Automated Testing Pipeline

### Test Scripts in package.json
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:types": "tsc --noEmit",
    "test:lint": "eslint src --ext .ts,.tsx",
    "test:a11y": "jest --testNamePattern='accessibility'",
    "test:performance": "jest --testNamePattern='performance'",
    "test:all": "npm run test:types && npm run test:lint && npm run test:coverage && npm run test:e2e",
    "test:ci": "npm run test:all && npm run test:a11y"
  }
}
```

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: TypeScript Check
        run: npx tsc --noEmit
      
      - name: ESLint Check
        run: npm run lint
      
      - name: Unit Tests with Coverage
        run: npm run test:coverage
      
      - name: Upload Coverage Reports
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: E2E Tests
        run: npm run test:e2e
        env:
          CI: true
      
      - name: Accessibility Tests
        run: npm run test:a11y
      
      - name: Performance Tests
        run: npm run test:performance
      
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: test-results
          path: |
            test-results/
            playwright-report/
            coverage/
      
      - name: Cleanup Test Artifacts
        if: always()
        run: |
          rm -rf test-results/
          rm -rf coverage/
          rm -rf playwright-report/
          rm -rf .nyc_output/

  build-test:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Application
        run: npm run build
      
      - name: Test Build Output
        run: |
          # Check bundle sizes
          du -sh .next/static/chunks/*.js | head -10
          # Verify critical files exist
          test -f .next/BUILD_ID
          test -d .next/static
```

## Performance Testing

### Core Web Vitals Testing
```typescript
// src/test/performance/webVitals.test.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

interface WebVitalsMetrics {
  CLS?: number
  FID?: number
  FCP?: number
  LCP?: number
  TTFB?: number
}

describe('Web Vitals Performance', () => {
  it('should meet Core Web Vitals thresholds', async () => {
    const vitals = await new Promise<WebVitalsMetrics>((resolve) => {
      const metrics: WebVitalsMetrics = {}
      
      getCLS((metric) => {
        metrics.CLS = metric.value
      })
      getFID((metric) => {
        metrics.FID = metric.value
      })
      getFCP((metric) => {
        metrics.FCP = metric.value
      })
      getLCP((metric) => {
        metrics.LCP = metric.value
      })
      getTTFB((metric) => {
        metrics.TTFB = metric.value
      })
      
      setTimeout(() => resolve(metrics), 5000)
    })

    // Core Web Vitals thresholds
    if (vitals.LCP !== undefined) {
      expect(vitals.LCP).toBeLessThan(2500) // Good LCP: < 2.5s
    }
    if (vitals.FID !== undefined) {
      expect(vitals.FID).toBeLessThan(100)  // Good FID: < 100ms
    }
    if (vitals.CLS !== undefined) {
      expect(vitals.CLS).toBeLessThan(0.1)  // Good CLS: < 0.1
    }
  })
})
```

### Bundle Size Testing
```typescript
// src/test/performance/bundleSize.test.ts
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

describe('Bundle Size Limits', () => {
  it('should not exceed bundle size limits', () => {
    // Build the project
    execSync('npm run build', { stdio: 'pipe' })
    
    // Check main bundle size
    const nextDir = path.join(process.cwd(), '.next')
    const staticDir = path.join(nextDir, 'static', 'chunks')
    
    if (fs.existsSync(staticDir)) {
      const files = fs.readdirSync(staticDir)
      const jsFiles = files.filter(file => file.endsWith('.js'))
      
      jsFiles.forEach(file => {
        const filePath = path.join(staticDir, file)
        const stats = fs.statSync(filePath)
        const sizeInKB = stats.size / 1024
        
        // Main bundle should be under 250KB (as per cursor rules)
        if (file.includes('main') || file.includes('pages')) {
          expect(sizeInKB).toBeLessThan(250)
        }
      })
    }
  })

  it('should track bundle size changes', () => {
    // This test could compare against previous build sizes
    // and alert if there's a significant increase
    const currentSizes = getBundleSizes()
    const previousSizes = getPreviousBundleSizes()
    
    Object.keys(currentSizes).forEach(bundle => {
      const current = currentSizes[bundle]
      const previous = previousSizes[bundle]
      
      if (previous) {
        const increase = ((current - previous) / previous) * 100
        // Alert if bundle size increased by more than 10%
        expect(increase).toBeLessThan(10)
      }
    })
  })
})

function getBundleSizes(): Record<string, number> {
  // Implementation to get current bundle sizes
  return {}
}

function getPreviousBundleSizes(): Record<string, number> {
  // Implementation to get previous bundle sizes from storage
  return {}
}
```

## Accessibility Testing

### A11y Component Testing
```typescript
// src/test/a11y/configurator.a11y.test.tsx
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import userEvent from '@testing-library/user-event'
import { ConfiguratorShell } from '@/app/konfigurator/components/ConfiguratorShell'

expect.extend(toHaveNoViolations)

describe('Configurator Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<ConfiguratorShell />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have proper ARIA labels', () => {
    render(<ConfiguratorShell />)
    
    // Check for required ARIA attributes
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByLabelText(/konfigurator/i)).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength.greaterThan(0)
    
    // Check for proper heading hierarchy
    const headings = screen.getAllByRole('heading')
    expect(headings[0]).toHaveAttribute('aria-level', '1')
  })

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<ConfiguratorShell />)
    
    // Test tab navigation
    const firstButton = screen.getAllByRole('button')[0]
    await user.tab()
    
    expect(document.activeElement).toBe(firstButton)
    
    // Test that all interactive elements are reachable
    const interactiveElements = screen.getAllByRole('button')
    for (let i = 0; i < interactiveElements.length - 1; i++) {
      await user.tab()
    }
    
    // Verify focus is on last interactive element
    expect(document.activeElement).toBe(interactiveElements[interactiveElements.length - 1])
  })

  it('should have sufficient color contrast', async () => {
    const { container } = render(<ConfiguratorShell />)
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true }
      }
    })
    expect(results).toHaveNoViolations()
  })

  it('should have minimum touch target sizes', () => {
    render(<ConfiguratorShell />)
    
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      const styles = window.getComputedStyle(button)
      const width = parseInt(styles.width)
      const height = parseInt(styles.height)
      
      // Minimum 44x44px touch targets
      expect(width).toBeGreaterThanOrEqual(44)
      expect(height).toBeGreaterThanOrEqual(44)
    })
  })
})
```

## Image System Testing

### Image Component Testing
```typescript
// src/components/images/__tests__/HybridBlobImage.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import { HybridBlobImage } from '../HybridBlobImage'

// Mock API responses
vi.mock('next/image', () => ({
  default: vi.fn(({ src, alt, onLoad, onError, ...props }) => {
    const img = <img src={src} alt={alt} {...props} />
    
    // Simulate successful load
    setTimeout(() => {
      if (onLoad) onLoad({} as any)
    }, 100)
    
    return img
  })
}))

describe('HybridBlobImage', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render with proper alt text', () => {
    render(
      <HybridBlobImage
        path="test-image"
        alt="Test Image"
        strategy="auto"
      />
    )
    
    expect(screen.getByAltText('Test Image')).toBeInTheDocument()
  })

  it('should handle missing images gracefully', async () => {
    // Mock API to return 404
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404
    })

    render(
      <HybridBlobImage
        path="non-existent-image"
        alt="Missing Image"
        strategy="auto"
      />
    )
    
    await waitFor(() => {
      // Should show placeholder or fallback
      expect(screen.getByAltText(/placeholder/i)).toBeInTheDocument()
    })
  })

  it('should respect loading strategy', () => {
    render(
      <HybridBlobImage
        path="test-image"
        alt="Test Image"
        strategy="ssr"
        priority={true}
      />
    )
    
    const img = screen.getByAltText('Test Image')
    expect(img).toHaveAttribute('loading', 'eager')
  })

  it('should handle different image formats', async () => {
    const formats = ['jpg', 'png', 'webp', 'avif']
    
    for (const format of formats) {
      render(
        <HybridBlobImage
          path={`test-image.${format}`}
          alt={`Test ${format.toUpperCase()} Image`}
          strategy="auto"
        />
      )
      
      expect(screen.getByAltText(`Test ${format.toUpperCase()} Image`)).toBeInTheDocument()
    }
  })

  it('should preload critical images', async () => {
    render(
      <HybridBlobImage
        path="hero-image"
        alt="Hero Image"
        strategy="ssr"
        isCritical={true}
        priority={true}
      />
    )
    
    // Should have proper loading attributes
    const img = screen.getByAltText('Hero Image')
    expect(img).toHaveAttribute('loading', 'eager')
  })
})
```

## CI/CD Integration

### Pre-commit Hooks
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test:types && npm run test"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

### Test Reporting Dashboard
```typescript
// src/test/utils/testReporter.ts
interface TestResult {
  suite: string
  test: string
  status: 'passed' | 'failed' | 'skipped'
  duration: number
  error?: string
}

export class TestReporter {
  private results: TestResult[] = []

  addResult(result: TestResult) {
    this.results.push(result)
  }

  generateReport() {
    const summary = {
      total: this.results.length,
      passed: this.results.filter(r => r.status === 'passed').length,
      failed: this.results.filter(r => r.status === 'failed').length,
      skipped: this.results.filter(r => r.status === 'skipped').length,
      duration: this.results.reduce((sum, r) => sum + r.duration, 0)
    }

    return {
      summary,
      results: this.results
    }
  }

  uploadToDashboard(report: ReturnType<typeof this.generateReport>) {
    // Implementation to upload to monitoring dashboard
    console.log('📊 Test Report:', report.summary)
  }
}
```

## Test Cleanup & Maintenance

### Automatic Cleanup Rules
```typescript
// src/test/utils/cleanup.ts
export class TestCleanup {
  private static cleanupTasks: Array<() => void> = []

  static addCleanupTask(task: () => void) {
    this.cleanupTasks.push(task)
  }

  static runCleanup() {
    this.cleanupTasks.forEach(task => {
      try {
        task()
      } catch (error) {
        console.warn('Cleanup task failed:', error)
      }
    })
    this.cleanupTasks = []
  }
}

// Global cleanup after each test
afterEach(() => {
  TestCleanup.runCleanup()
})
```

### Test Metrics Collection
```typescript
// src/test/utils/metrics.ts
interface TestMetrics {
  testCount: number
  duration: number
  coverage: number
  failures: number
  flakiness: number
}

export class TestMetricsCollector {
  private metrics: TestMetrics = {
    testCount: 0,
    duration: 0,
    coverage: 0,
    failures: 0,
    flakiness: 0
  }

  updateMetrics(newMetrics: Partial<TestMetrics>) {
    Object.assign(this.metrics, newMetrics)
  }

  getMetrics(): TestMetrics {
    return { ...this.metrics }
  }

  shouldAlert(): boolean {
    return (
      this.metrics.coverage < 80 ||
      this.metrics.failures > 0 ||
      this.metrics.flakiness > 0.02 // 2% flakiness threshold
    )
  }
}
```

## Quality Gates

### Coverage Requirements
- **Statements:** >80%
- **Branches:** >80%
- **Functions:** >80%
- **Lines:** >80%

### Performance Thresholds
- **LCP:** <2.5s
- **FID:** <100ms
- **CLS:** <0.1
- **Bundle Size:** <250KB for main bundle

### Accessibility Requirements
- **Zero axe violations**
- **44x44px minimum touch targets**
- **Proper heading hierarchy**
- **Keyboard navigation support**

## Conclusion

This comprehensive testing guide ensures high-quality code delivery while maintaining performance and accessibility standards. All tests must follow the established TypeScript rules, include proper cleanup, and integrate seamlessly with our CI/CD pipeline.

**Remember:** Tests are not just about finding bugs—they're about ensuring a reliable, performant, and accessible user experience that meets our cursor rules and industry best practices. 