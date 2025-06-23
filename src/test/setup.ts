import '@testing-library/jest-dom'
import { vi, afterEach, beforeAll, afterAll } from 'vitest'
import * as React from 'react'

// Global type extensions for test environment
declare global {
  interface Window {
    matchMedia: (query: string) => MediaQueryList;
  }
}

// Set up React act environment for proper testing  
(global as any).IS_REACT_ACT_ENVIRONMENT = true

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

// Enhanced Next.js Image component mock
interface MockImageProps {
  _src?: string;
  _alt?: string;
  _onLoad?: (event: Event) => void;
  _onError?: (event: Event) => void;
  [key: string]: unknown;
}

vi.mock('next/image', () => ({
  default: ({ _src, _alt, _onLoad, _onError, ..._props }: MockImageProps) => {
    // Simulate successful load after short delay
    setTimeout(() => {
      if (_onLoad) {
        try {
          _onLoad({} as Event)
        } catch (error) {
          // Silently handle onLoad errors in tests
          console.debug('Image onLoad error in test:', error)
        }
      }
    }, 10)
    
    return null // Return null to avoid rendering issues in tests
  }
}))

// Enhanced Link mock to prevent IntersectionObserver issues
interface MockLinkProps {
  children: React.ReactNode;
  href: string;
  [key: string]: unknown;
}

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: MockLinkProps) => {
    return React.createElement('a', { href, ...props }, children)
  }
}))

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
});

// Enhanced IntersectionObserver mock with proper callback handling
(global as any).IntersectionObserver = vi.fn().mockImplementation((_callback: IntersectionObserverCallback) => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}))

// Mock ResizeObserver
(global as any).ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock environment variables
Object.assign(process.env, {
  NODE_ENV: 'test',
  NEXT_PUBLIC_SITE_URL: 'http://localhost:3000'
});

// Enhanced fetch mock with better error handling
(global as any).fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
    url: '',
    redirected: false,
    type: 'basic' as ResponseType,
    clone: vi.fn(),
    body: null,
    bodyUsed: false,
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    formData: () => Promise.resolve(new FormData()),
    bytes: () => Promise.resolve(new Uint8Array()),
  } as Response)
)

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),  
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}
vi.stubGlobal('localStorage', localStorageMock)

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}
vi.stubGlobal('sessionStorage', sessionStorageMock)

// Enhanced window properties for better test coverage
Object.defineProperty(window, 'scrollY', {
  writable: true,
  configurable: true,
  value: 0,
});

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
  sessionStorage.clear()
  vi.clearAllTimers()
  
  // Reset window properties using defineProperty to avoid getter-only errors
  Object.defineProperty(window, 'scrollY', {
    writable: true,
    configurable: true,
    value: 0,
  })
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 768,
  })
})

// Enhanced console error suppression for expected errors in tests
const originalError = console.error
const originalWarn = console.warn

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const message = args[0]
    if (
      typeof message === 'string' && (
        message.includes('Warning: ReactDOM.render is no longer supported') ||
        message.includes('Warning: An invalid form control') ||
        message.includes('Test error') || // Suppress intentional test errors
        message.includes('Selection error') || // Suppress intentional test errors
        message.includes('observer.observe is not a function')
      )
    ) {
      return
    }
    originalError.call(console, ...args)
  }
  
  console.warn = (...args: unknown[]) => {
    const message = args[0]
    if (
      typeof message === 'string' && (
        message.includes('componentWillReceiveProps') ||
        message.includes('componentWillMount')
      )
    ) {
      return
    }
    originalWarn.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
  console.warn = originalWarn
}) 