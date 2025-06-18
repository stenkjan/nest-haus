'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice, calculateMonthlyPayment } from '../../../utils/configurator';

export const CartSummary: React.FC = () => {
    const { cartItems, removeFromCart } = useCart();
    const isMounted = useRef(false);

    // Set mounted ref on first render
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    // Handle cart updates only after component is mounted
    const handleRemoveFromCart = (id: string) => {
        if (!isMounted.current) return;
        removeFromCart(id);
    };

    if (!isMounted.current) {
        return (
            <div className="border border-gray-300 rounded-[19px] px-6 py-8 text-center">
                <p className="text-gray-600">Lade Warenkorb...</p>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="border border-gray-300 rounded-[19px] px-6 py-8 text-center">
                <p className="text-gray-600 mb-4">Dein Warenkorb ist leer</p>
                <Link 
                    href="/konfigurator"
                    className="inline-block bg-[#3D6DE1] text-white px-6 py-2 rounded-full hover:bg-[#2D5CD1] transition-colors"
                >
                    Jetzt konfigurieren
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {cartItems.map((item) => (
                <div key={item.id} className="border border-gray-300 rounded-[19px] px-6 py-4">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-medium">Dein Nest-Haus</h3>
                        <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-4">
                        {Object.entries(item).map(([key, value]) => {
                            if (key === 'id' || key === 'totalPrice' || key === 'timestamp') return null;
                            if (!value) return null;

                            const selection = value as any;
                            return (
                                <div key={key} className="flex justify-between items-start border-b border-gray-100 pb-3 gap-8">
                                    <div>
                                        <div className="font-medium text-[16px] tracking-[0.02em] leading-[20px]">
                                            {selection.name}
                                            {key === 'pvanlage' && selection.quantity && selection.quantity > 1 && ` (${selection.quantity}x)`}
                                        </div>
                                        {selection.description && (
                                            <div className="font-normal text-[12px] tracking-[0.03em] leading-[14px] text-gray-600 mt-1 max-w-[66%]">
                                                {selection.description}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right font-normal text-[12px] tracking-[0.03em] leading-[14px] min-w-[130px]">
                                        {key === 'nest' && (
                                            <div className="mb-1 text-black">Startpreis</div>
                                        )}
                                        {key !== 'nest' && selection.price > 0 && (
                                            <div className="mb-1 text-black">Aufpreis</div>
                                        )}
                                        {key === 'pvanlage' 
                                            ? formatPrice((selection.quantity || 1) * selection.price)
                                            : key === 'fenster'
                                                ? formatPrice((selection.squareMeters || 1) * selection.price)
                                                : formatPrice(selection.price || 0)
                                        }
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-medium">Gesamtpreis:</h3>
                            <span className="text-xl font-medium">{formatPrice(item.totalPrice)}</span>
                        </div>
                        <div className="text-right text-[12px] text-gray-600">
                            oder {calculateMonthlyPayment(item.totalPrice)} für 120 Monate
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                        <Link 
                            href="/konfigurator"
                            className="text-black no-underline font-medium text-[12px] tracking-[0.03em] leading-[14px] hover:text-[#3D6DE1] transition-colors"
                        >
                            Neu konfigurieren
                        </Link>
                        <Link
                            href="/checkout"
                            className="bg-[#3D6DE1] text-white px-6 py-2 rounded-full hover:bg-[#2D5CD1] transition-colors"
                        >
                            Zur Kasse
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}; 