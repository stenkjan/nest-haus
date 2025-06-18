'use client';

import React from 'react';
import { useCart, CartItem } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/konfigurator">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold pt-2">Warenkorb</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Ihr Warenkorb ist leer</h2>
            <p className="text-muted-foreground mb-8">
              Fügen Sie eine Konfiguration hinzu, um Ihren Warenkorb zu füllen.
            </p>
            <Link href="/konfigurator">
              <Button>Zurück zum Konfigurator</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-6 bg-card"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">Nest Konfiguration</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.nest?.name} - {item.gebaeudehuelle?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {new Intl.NumberFormat('de-DE', {
                            style: 'currency',
                            currency: 'EUR'
                          }).format(item.totalPrice)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Innenverkleidung</p>
                        <p className="text-muted-foreground">{item.innenverkleidung?.name}</p>
                      </div>
                      <div>
                        <p className="font-medium">Fußboden</p>
                        <p className="text-muted-foreground">{item.fussboden?.name}</p>
                      </div>
                      {item.fenster && (
                        <div>
                          <p className="font-medium">Fenster</p>
                          <p className="text-muted-foreground">
                            {item.fenster.name} ({item.fenster.squareMeters}m²)
                          </p>
                        </div>
                      )}
                      {item.pvanlage && (
                        <div>
                          <p className="font-medium">Photovoltaik</p>
                          <p className="text-muted-foreground">
                            {item.pvanlage.name} ({item.pvanlage.quantity} Module)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Gesamtsumme</h2>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('de-DE', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(getCartTotal())}
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="flex-1"
                >
                  Warenkorb leeren
                </Button>
                <Button className="flex-1">
                  Zur Kasse
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 