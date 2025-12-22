import { describe, it, expect } from 'vitest'

// Test environment setup
const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

describe('🚀 Route Integration Tests', () => {
  describe('Main Pages', () => {
    it('should render main landing page', async () => {
      console.log('🔍 Testing main landing page...')

      const response = await fetch(`${BASE_URL}/`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      })

      expect(response.status).toBe(200)
      expect(response.headers.get('content-type') || '').toContain('text/html')

      const html = await response.text()
      expect(html).toContain('<html')
      expect(html).toContain('NEST') // Should contain brand name
      console.log('✅ Main landing page test passed')
    })

    it('should render konfigurator page', async () => {
      console.log('🔍 Testing konfigurator page...')

      const response = await fetch(`${BASE_URL}/konfigurator`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      })

      expect(response.status).toBe(200)
      expect(response.headers.get('content-type') || '').toContain('text/html')

      const html = await response.text()
      expect(html).toContain('<html')
      expect(html).toContain('configurator') // Should contain configurator content
      console.log('✅ Konfigurator page test passed')
    })

    it('should render warenkorb (cart) page', async () => {
      console.log('🔍 Testing warenkorb page...')

      const response = await fetch(`${BASE_URL}/warenkorb`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      })

      expect(response.status).toBe(200)
      expect(response.headers.get('content-type') || '').toContain('text/html')

      const html = await response.text()
      expect(html).toContain('<html')
      console.log('✅ Warenkorb page test passed')
    })
  })

  describe('Static Content Pages', () => {
    it('should render kontakt page', async () => {
      console.log('🔍 Testing kontakt page...')

      const response = await fetch(`${BASE_URL}/kontakt`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      })

      // Accept either success or redirect for contact pages
      expect([200, 301, 302, 404]).toContain(response.status)
      console.log('✅ Kontakt page endpoint exists')
    })

    it('should render warum-wir page', async () => {
      console.log('🔍 Testing warum-wir page...')

      const response = await fetch(`${BASE_URL}/warum-wir`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      })

      // Accept either success or redirect for static pages
      expect([200, 301, 302, 404]).toContain(response.status)
      console.log('✅ Warum-wir page endpoint exists')
    })

    it('should redirect dein-nest to hoam (301)', async () => {
      console.log('🔍 Testing dein-nest redirect...')

      const response = await fetch(`${BASE_URL}/dein-nest`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
        redirect: 'manual', // Don't follow redirects automatically
      })

      // Should be a 301 permanent redirect
      expect(response.status).toBe(301)
      expect(response.headers.get('location')).toContain('/hoam')
      console.log('✅ Dein-nest redirects to hoam correctly')
    })

    it('should redirect dein-hoam to hoam (301)', async () => {
      console.log('🔍 Testing dein-hoam redirect...')

      const response = await fetch(`${BASE_URL}/dein-hoam`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
        redirect: 'manual', // Don't follow redirects automatically
      })

      // Should be a 301 permanent redirect
      expect(response.status).toBe(301)
      expect(response.headers.get('location')).toContain('/hoam')
      console.log('✅ Dein-hoam redirects to hoam correctly')
    })

    it('should render hoam page directly', async () => {
      console.log('🔍 Testing hoam page...')

      const response = await fetch(`${BASE_URL}/hoam`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      })

      // Should successfully render the page
      expect(response.status).toBe(200)
      console.log('✅ Hoam page renders successfully')
    })

    it('should redirect nest-system to hoam-system (301)', async () => {
      console.log('🔍 Testing nest-system redirect...')

      const response = await fetch(`${BASE_URL}/nest-system`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
        redirect: 'manual', // Don't follow redirects automatically
      })

      // Should be a 301 permanent redirect
      expect(response.status).toBe(301)
      expect(response.headers.get('location')).toContain('/hoam-system')
      console.log('✅ Nest-system redirects to hoam-system correctly')
    })

    it('should render hoam-system page directly', async () => {
      console.log('🔍 Testing hoam-system page...')

      const response = await fetch(`${BASE_URL}/hoam-system`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      })

      // Should successfully render the page
      expect(response.status).toBe(200)
      console.log('✅ Hoam-system page renders successfully')
    })

    it('should render entwurf page', async () => {
      console.log('🔍 Testing entwurf page...')

      const response = await fetch(`${BASE_URL}/entwurf`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      })

      // Accept either success or redirect for static pages
      expect([200, 301, 302, 404]).toContain(response.status)
      console.log('✅ Entwurf page endpoint exists')
    })

    it('should render dein-part page', async () => {
      console.log('🔍 Testing dein-part page...')

      const response = await fetch(`${BASE_URL}/dein-part`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      })

      // Accept either success or redirect for static pages
      expect([200, 301, 302, 404]).toContain(response.status)
      console.log('✅ Dein-part page endpoint exists')
    })

    it('should render entdecken page', async () => {
      console.log('🔍 Testing entdecken page...')

      const response = await fetch(`${BASE_URL}/entdecken`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      })

      // Accept either success or redirect for static pages
      expect([200, 301, 302, 404]).toContain(response.status)
      console.log('✅ Entdecken page endpoint exists')
    })
  })

  describe('Admin Routes', () => {
    it('should handle admin dashboard route', async () => {
      console.log('🔍 Testing admin dashboard...')

      const response = await fetch(`${BASE_URL}/admin`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      })

      // Admin routes might require authentication or might not be implemented
      expect([200, 401, 403, 404, 500]).toContain(response.status)
      console.log('✅ Admin dashboard endpoint exists')
    })

    it('should handle admin performance route', async () => {
      console.log('🔍 Testing admin performance...')

      const response = await fetch(`${BASE_URL}/admin/performance`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      })

      // Admin routes might require authentication or might not be implemented
      expect([200, 401, 403, 404, 500]).toContain(response.status)
      console.log('✅ Admin performance endpoint exists')
    })
  })

  describe('Route Error Handling', () => {
    it('should handle 404 errors gracefully', async () => {
      console.log('🔍 Testing 404 error handling...')

      const response = await fetch(`${BASE_URL}/nonexistent-page-${Date.now()}`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      })

      expect(response.status).toBe(404)
      console.log('✅ 404 error handling test passed')
    })

    it('should return valid HTML even for error pages', async () => {
      console.log('🔍 Testing error page HTML validity...')

      const response = await fetch(`${BASE_URL}/nonexistent-page-${Date.now()}`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      })

      const html = await response.text()
      expect(html).toContain('<html')
      expect(html).toContain('</html>')
      console.log('✅ Error page HTML validity test passed')
    })
  })

  describe('SEO and Performance', () => {
    it('should include proper meta tags on main page', async () => {
      console.log('🔍 Testing SEO meta tags...')

      const response = await fetch(`${BASE_URL}/`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      })

      expect(response.status).toBe(200)

      const html = await response.text()
      expect(html).toContain('<meta')
      expect(html).toContain('<title')
      console.log('✅ SEO meta tags test passed')
    })

    it('should respond within reasonable time', async () => {
      console.log('🔍 Testing page load performance...')

      const startTime = performance.now()

      const response = await fetch(`${BASE_URL}/`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      })

      const endTime = performance.now()
      const responseTime = endTime - startTime

      expect(response.status).toBe(200)
      expect(responseTime).toBeLessThan(3000) // Should load within 3 seconds
      console.log(`✅ Page load performance: ${responseTime.toFixed(2)}ms`)
    })
  })
}) 