import { useState, useEffect, useCallback, useRef } from 'react'

// Type definitions for configurator integration
export interface Configuration {
  sessionId: string
  nest: string
  gebaeudehuelle: string
  innenverkleidung: string
  fussboden: string
  pvanlage?: string
  fenster?: string
  planungspaket?: string
  totalPrice: number
  timestamp: number
}

export interface SelectionEvent {
  category: string
  selection: string
  previousSelection?: string
  priceChange?: number
  totalPrice?: number
}

/**
 * Main integration hook for configurator
 * Your teammate MUST use this hook to ensure backend compatibility
 */
export const useConfiguratorIntegration = () => {
  const [sessionId, setSessionId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentConfig, setCurrentConfig] = useState<Partial<Configuration>>({})
  const finalizeTimeoutRef = useRef<NodeJS.Timeout>()

  // Initialize session on component mount
  useEffect(() => {
    const initSession = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/sessions', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        const data = await response.json()
        
        if (data.success) {
          setSessionId(data.sessionId)
          setCurrentConfig(prev => ({ ...prev, sessionId: data.sessionId }))
        } else {
          console.error('Failed to create session:', data.error)
        }
      } catch (error) {
        console.error('Session initialization error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initSession()
  }, [])

  // Track selection changes
  const trackSelection = useCallback(async (selection: SelectionEvent) => {
    if (!sessionId) return

    try {
      await fetch('/api/sessions/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId, 
          ...selection 
        })
      })

      // Update current config
      setCurrentConfig(prev => ({
        ...prev,
        [selection.category]: selection.selection,
        totalPrice: selection.totalPrice || prev.totalPrice || 0,
        timestamp: Date.now()
      }))

    } catch (error) {
      console.error('Selection tracking error:', error)
    }
  }, [sessionId])

  // Calculate price for current configuration
  const calculatePrice = useCallback(async (config: Partial<Configuration>) => {
    try {
      const response = await fetch('/api/pricing/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      const data = await response.json()
      
      if (data.success) {
        return {
          totalPrice: data.totalPrice,
          priceBreakdown: data.priceBreakdown
        }
      }
      throw new Error(data.error)
    } catch (error) {
      console.error('Price calculation error:', error)
      return { totalPrice: 0, priceBreakdown: null }
    }
  }, [])

  // Save configuration
  const saveConfiguration = useCallback(async (config: Configuration, userDetails?: any) => {
    try {
      const configToSave = {
        ...config,
        sessionId,
        ...userDetails
      }

      const response = await fetch('/api/configurations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configToSave)
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Configuration save error:', error)
      return { success: false, error: 'Failed to save configuration' }
    }
  }, [sessionId])

  // Finalize session (call on unmount/page leave)
  const finalizeSession = useCallback(async (config?: Partial<Configuration>) => {
    if (!sessionId) return

    try {
      await fetch('/api/sessions/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId, 
          config: config || currentConfig 
        })
      })
    } catch (error) {
      console.error('Session finalization error:', error)
    }
  }, [sessionId, currentConfig])

  // Auto-finalize on unmount or page leave
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sessionId) {
        // Use sendBeacon for reliability on page unload
        navigator.sendBeacon('/api/sessions/finalize', JSON.stringify({ 
          sessionId, 
          config: currentConfig 
        }))
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && sessionId) {
        // Clear existing timeout
        if (finalizeTimeoutRef.current) {
          clearTimeout(finalizeTimeoutRef.current)
        }
        
        // Set timeout to finalize if user doesn't return
        finalizeTimeoutRef.current = setTimeout(() => {
          finalizeSession()
        }, 5000) // 5 seconds delay
      } else if (document.visibilityState === 'visible') {
        // Cancel finalization if user returns
        if (finalizeTimeoutRef.current) {
          clearTimeout(finalizeTimeoutRef.current)
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup on unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      
      if (finalizeTimeoutRef.current) {
        clearTimeout(finalizeTimeoutRef.current)
      }
      
      // Final session cleanup
      if (sessionId) {
        finalizeSession()
      }
    }
  }, [sessionId, currentConfig, finalizeSession])

  return {
    // Session management
    sessionId,
    isLoading,
    
    // Configuration state
    currentConfig,
    setCurrentConfig,
    
    // Core functions
    trackSelection,
    calculatePrice,
    saveConfiguration,
    finalizeSession,
    
    // Helper functions
    updateConfig: (updates: Partial<Configuration>) => {
      setCurrentConfig(prev => ({ ...prev, ...updates }))
    }
  }
}

/**
 * Hook for price calculations only
 * Use this if you only need pricing functionality
 */
export const useConfiguratorPricing = () => {
  const calculatePrice = useCallback(async (config: Partial<Configuration>) => {
    try {
      const response = await fetch('/api/pricing/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      const data = await response.json()
      
      if (data.success) {
        return {
          totalPrice: data.totalPrice,
          priceBreakdown: data.priceBreakdown
        }
      }
      throw new Error(data.error)
    } catch (error) {
      console.error('Price calculation error:', error)
      return { totalPrice: 0, priceBreakdown: null }
    }
  }, [])

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }, [])

  return { calculatePrice, formatPrice }
}

/**
 * Hook for session tracking only
 * Use this if you want to separate tracking from other functionality
 */
export const useConfiguratorTracking = () => {
  const [sessionId, setSessionId] = useState<string>('')

  useEffect(() => {
    const initSession = async () => {
      try {
        const response = await fetch('/api/sessions', { method: 'POST' })
        const data = await response.json()
        if (data.success) {
          setSessionId(data.sessionId)
        }
      } catch (error) {
        console.error('Session initialization error:', error)
      }
    }

    initSession()
  }, [])

  const trackSelection = useCallback(async (selection: SelectionEvent) => {
    if (!sessionId) return

    try {
      await fetch('/api/sessions/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, ...selection })
      })
    } catch (error) {
      console.error('Selection tracking error:', error)
    }
  }, [sessionId])

  return { sessionId, trackSelection }
} 