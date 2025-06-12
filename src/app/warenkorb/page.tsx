'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '../../store/cartStore'
import { useConfiguratorStore } from '../../store/configuratorStore'

export default function WarenkorbPage() {
  const {
    items,
    orderDetails,
    isProcessingOrder,
    addConfigurationToCart,
    removeFromCart,
    clearCart,
    setOrderDetails,
    processOrder,
    getCartTotal,
    getCartCount,
    canProceedToCheckout
  } = useCartStore()

  const {
    configuration,
    isConfigurationComplete,
    getConfigurationForCart
  } = useConfiguratorStore()

  const [customerForm, setCustomerForm] = useState({
    email: '',
    name: '',
    phone: '',
    notes: ''
  })

  // Auto-add current configuration to cart if complete
  useEffect(() => {
    const cartConfig = getConfigurationForCart()
    if (cartConfig && !items.find(item => item.sessionId === cartConfig.sessionId)) {
      addConfigurationToCart(cartConfig)
    }
  }, [configuration, getConfigurationForCart, addConfigurationToCart, items])

  // Format price helper
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  // Calculate monthly payment
  const calculateMonthlyPayment = (price: number) => {
    const months = 240
    const interestRate = 0.035 / 12
    const monthlyPayment = price * (interestRate * Math.pow(1 + interestRate, months)) / 
                          (Math.pow(1 + interestRate, months) - 1)
    return formatPrice(monthlyPayment)
  }

  // Handle form submission
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!customerForm.email) return

    setOrderDetails({
      customerInfo: {
        email: customerForm.email,
        name: customerForm.name || undefined,
        phone: customerForm.phone || undefined
      },
      notes: customerForm.notes || undefined
    })

    const success = await processOrder()
    if (success) {
      // Redirect to success page or show success message
      console.log('Order processed successfully')
    }
  }

  // Render configuration item details
  const renderConfigurationDetails = (item: any) => {
    const details = []
    
    if (item.nest) details.push({ label: 'Nest', value: item.nest.name })
    if (item.gebaeudehuelle) details.push({ label: 'Gebäudehülle', value: item.gebaeudehuelle.name })
    if (item.innenverkleidung) details.push({ label: 'Innenverkleidung', value: item.innenverkleidung.name })
    if (item.fussboden) details.push({ label: 'Fußboden', value: item.fussboden.name })
    if (item.pvanlage) details.push({ 
      label: 'PV-Anlage', 
      value: `${item.pvanlage.name}${item.pvanlage.quantity ? ` (${item.pvanlage.quantity}x)` : ''}` 
    })
    if (item.fenster) details.push({ 
      label: 'Fenster', 
      value: `${item.fenster.name}${item.fenster.squareMeters ? ` (${item.fenster.squareMeters}m²)` : ''}` 
    })
    if (item.planungspaket) details.push({ label: 'Planungspaket', value: item.planungspaket.name })
    if (item.grundstueckscheck) details.push({ label: 'Grundstückscheck', value: item.grundstueckscheck.name })

    return details
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/konfigurator"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Zurück zum Konfigurator
            </Link>
            <h1 className="text-3xl font-bold">Warenkorb</h1>
          </div>

          {items.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Ihr Warenkorb ist leer</h2>
              <p className="text-gray-600 mb-8">
                Konfigurieren Sie Ihr Nest-Haus, um es zum Warenkorb hinzuzufügen.
              </p>
              <Link
                href="/konfigurator"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Zum Konfigurator
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-xl font-semibold">Ihre Konfigurationen</h2>
                
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-sm p-6 border"
                  >
                    {/* Item Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {item.nest?.name || 'Nest Konfiguration'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Hinzugefügt am {new Date(item.addedAt).toLocaleDateString('de-DE')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">
                          {formatPrice(item.totalPrice)}
                        </div>
                        <div className="text-sm text-gray-500">
                          oder {calculateMonthlyPayment(item.totalPrice)} monatlich
                        </div>
                      </div>
                    </div>

                    {/* Configuration Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {renderConfigurationDetails(item).map((detail, idx) => (
                        <div key={idx}>
                          <div className="text-sm font-medium text-gray-700">
                            {detail.label}
                          </div>
                          <div className="text-sm text-gray-900">
                            {detail.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Item Actions */}
                    <div className="flex justify-end pt-4 border-t">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Entfernen
                      </button>
                    </div>
                  </div>
                ))}

                {/* Clear Cart Button */}
                <div className="flex justify-center">
                  <button
                    onClick={clearCart}
                    className="text-gray-600 hover:text-gray-800 underline"
                  >
                    Warenkorb leeren
                  </button>
                </div>
              </div>

              {/* Order Summary & Checkout */}
              <div className="space-y-6">
                {/* Price Summary */}
                <div className="bg-white rounded-lg shadow-sm p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Zusammenfassung</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Anzahl Konfigurationen:</span>
                      <span>{getCartCount()}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Gesamtsumme:</span>
                      <span>{formatPrice(getCartTotal())}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      oder {calculateMonthlyPayment(getCartTotal())} monatlich
                    </div>
                  </div>
                </div>

                {/* Customer Form */}
                <div className="bg-white rounded-lg shadow-sm p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Kontaktdaten</h3>
                  
                  <form onSubmit={handleOrderSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        E-Mail *
                      </label>
                      <input
                        type="email"
                        required
                        value={customerForm.email}
                        onChange={(e) =>
                          setCustomerForm(prev => ({ ...prev, email: e.target.value }))
                        }
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="ihre@email.de"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={customerForm.name}
                        onChange={(e) =>
                          setCustomerForm(prev => ({ ...prev, name: e.target.value }))
                        }
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ihr Name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={customerForm.phone}
                        onChange={(e) =>
                          setCustomerForm(prev => ({ ...prev, phone: e.target.value }))
                        }
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="+49 123 456789"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Nachricht (optional)
                      </label>
                      <textarea
                        value={customerForm.notes}
                        onChange={(e) =>
                          setCustomerForm(prev => ({ ...prev, notes: e.target.value }))
                        }
                        rows={3}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Zusätzliche Informationen..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!canProceedToCheckout() || isProcessingOrder}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isProcessingOrder ? 'Wird verarbeitet...' : 'Anfrage senden'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 