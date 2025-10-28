"use client";

import { useState, useEffect } from "react";

interface DetailedItem {
  value: string;
  name: string;
  price: number;
  description?: string;
  squareMeters?: number;
}

interface ConfigurationWithDetails {
  sessionId: string;
  sessionName: string;
  startTime: string;
  endTime: string | null;
  status: string;
  totalPrice: number;
  isOhneNestMode: boolean;

  configuration: {
    nestType: string;
    gebaeudehuelle: string;
    innenverkleidung: string;
    fussboden: string;
    pvanlage: string;
    fenster: string;
    planungspaket: string;
    geschossdecke: string;
    belichtungspaket: string;
    stirnseite: string;
    kamindurchzug: string;
    fussbodenheizung: string;
    bodenaufbau: string;
    fundament: string;
  };

  detailedConfiguration: {
    nest: DetailedItem | null;
    gebaeudehuelle: DetailedItem | null;
    innenverkleidung: DetailedItem | null;
    fussboden: DetailedItem | null;
    pvanlage: DetailedItem | null;
    fenster: DetailedItem | null;
    planungspaket: DetailedItem | null;
    geschossdecke: DetailedItem | null;
    belichtungspaket: DetailedItem | null;
    stirnseite: DetailedItem | null;
    kamindurchzug: DetailedItem | null;
    fussbodenheizung: DetailedItem | null;
    bodenaufbau: DetailedItem | null;
    fundament: DetailedItem | null;
  };

  contactInfo: {
    name: string | null;
    email: string | null;
    phone: string | null;
    preferredContact: string | null;
    bestTimeToCall: string | null;
    message: string | null;
  } | null;

  metadata: {
    ipAddress: string | null;
    userAgent: string | null;
    referrer: string | null;
    utmSource: string | null;
    duration: number;
  };

  tracking: {
    selectionEventsCount: number;
    interactionEventsCount: number;
    lastActivity: string;
    interactionEvents: Array<{
      id: string;
      eventType: string;
      category: string;
      elementId: string | null;
      selectionValue: string | null;
      timestamp: string;
    }>;
    pageVisitsCount: number;
    clickEventsCount: number;
  };

  payment: {
    paymentIntentId: string | null;
    paymentStatus: string | null;
    paymentMethod: string | null;
    paymentAmount: number | null;
    paidAt: string | null;
    inquiryStatus: string | null;
  } | null;
}

interface AllConfigurationsResponse {
  success: boolean;
  data: ConfigurationWithDetails[];
  metadata: {
    total: number;
    lastUpdated: string;
  };
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    IN_CART: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    CONVERTED: "bg-purple-100 text-purple-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}

function PaymentStatusBadge({ status }: { status: string | null }) {
  if (!status) return null;

  const styles = {
    PAID: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    FAILED: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
    REFUNDED: "bg-orange-100 text-orange-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}

function ConfigurationCard({
  config,
  onClick,
}: {
  config: ConfigurationWithDetails;
  onClick: () => void;
}) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-blue-400"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {config.sessionName}
          </h3>
          <p className="text-sm text-gray-700 font-medium mt-0.5">
            {config.configuration.nestType}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(config.startTime).toLocaleDateString("de-DE")} •{" "}
            {new Date(config.startTime).toLocaleTimeString("de-DE")}
          </p>
        </div>
        <StatusBadge status={config.status} />
      </div>

      {/* Configuration Summary */}
      <div className="space-y-1 text-sm mb-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Gebäudehülle:</span>
          <span className="font-medium text-gray-900">
            {config.configuration.gebaeudehuelle}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Innenverkleidung:</span>
          <span className="font-medium text-gray-900">
            {config.configuration.innenverkleidung}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Fußboden:</span>
          <span className="font-medium text-gray-900">
            {config.configuration.fussboden}
          </span>
        </div>
      </div>

      {/* Price & Stats */}
      <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
        <div className="text-xl font-bold text-green-600">
          €{(config.totalPrice / 1000).toFixed(0)}k
        </div>
        <div className="flex gap-3 text-xs text-gray-600">
          <span>⏱️ {formatDuration(config.metadata.duration)}</span>
          <span>🔄 {config.tracking.selectionEventsCount} selections</span>
        </div>
      </div>
    </div>
  );
}

function ConfigurationModal({
  config,
  onClose,
}: {
  config: ConfigurationWithDetails;
  onClose: () => void;
}) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
  };

  const parseUserAgent = (ua: string | null) => {
    if (!ua) return { browser: "Unknown", os: "Unknown", device: "Unknown" };

    const browser = ua.includes("Chrome")
      ? "Chrome"
      : ua.includes("Firefox")
        ? "Firefox"
        : ua.includes("Safari")
          ? "Safari"
          : "Other";
    const os = ua.includes("Windows")
      ? "Windows"
      : ua.includes("Mac")
        ? "macOS"
        : ua.includes("Linux")
          ? "Linux"
          : ua.includes("Android")
            ? "Android"
            : ua.includes("iOS")
              ? "iOS"
              : "Unknown";
    const device = ua.includes("Mobile") ? "Mobile" : "Desktop";

    return { browser, os, device };
  };

  const deviceInfo = parseUserAgent(config.metadata.userAgent);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Session Details
            </h2>
            <p className="text-sm text-gray-600">
              Session ID: {config.sessionId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Session Overview */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              📊 Session Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-gray-600">Status</div>
                <div className="mt-1">
                  <StatusBadge status={config.status} />
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600">Total Price</div>
                <div className="text-lg font-bold text-green-600">
                  €{config.totalPrice.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600">Duration</div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatDuration(config.metadata.duration)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600">Started</div>
                <div className="text-sm font-medium text-gray-900">
                  {new Date(config.startTime).toLocaleString("de-DE")}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Configuration - Like "Dein Nest Überblick" */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🏠 Dein Nest Überblick
            </h3>
            <div className="space-y-3">
              {/* Nest Type */}
              {config.detailedConfiguration.nest && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">
                        {config.detailedConfiguration.nest.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {config.detailedConfiguration.nest.value}
                        {config.detailedConfiguration.nest.squareMeters &&
                          ` • ${config.detailedConfiguration.nest.squareMeters}m² Nutzfläche`}
                      </p>
                      {config.detailedConfiguration.nest.description && (
                        <p className="text-xs text-gray-500 mt-1">
                          {config.detailedConfiguration.nest.description}
                        </p>
                      )}
                    </div>
                    <span className="text-lg font-bold text-blue-600">
                      €
                      {config.detailedConfiguration.nest.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Gebäudehülle */}
              {config.detailedConfiguration.gebaeudehuelle && (
                <div className="p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900">
                        {config.detailedConfiguration.gebaeudehuelle.name}
                      </h5>
                      {config.detailedConfiguration.gebaeudehuelle
                        .description && (
                        <p className="text-xs text-gray-600 mt-1">
                          {
                            config.detailedConfiguration.gebaeudehuelle
                              .description
                          }
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-gray-900 ml-4 whitespace-nowrap">
                      €
                      {config.detailedConfiguration.gebaeudehuelle.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Innenverkleidung */}
              {config.detailedConfiguration.innenverkleidung && (
                <div className="p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900">
                        {config.detailedConfiguration.innenverkleidung.name}
                      </h5>
                      {config.detailedConfiguration.innenverkleidung
                        .description && (
                        <p className="text-xs text-gray-600 mt-1">
                          {
                            config.detailedConfiguration.innenverkleidung
                              .description
                          }
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-gray-900 ml-4 whitespace-nowrap">
                      €
                      {config.detailedConfiguration.innenverkleidung.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Fußboden */}
              {config.detailedConfiguration.fussboden && (
                <div className="p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900">
                        {config.detailedConfiguration.fussboden.name}
                      </h5>
                      {config.detailedConfiguration.fussboden.description && (
                        <p className="text-xs text-gray-600 mt-1">
                          {config.detailedConfiguration.fussboden.description}
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-gray-900 ml-4 whitespace-nowrap">
                      {config.detailedConfiguration.fussboden.price === 0
                        ? "inkludiert"
                        : `€${config.detailedConfiguration.fussboden.price.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              )}

              {/* Geschossdecke */}
              {config.detailedConfiguration.geschossdecke &&
                config.detailedConfiguration.geschossdecke.price > 0 && (
                  <div className="p-3 bg-gray-50 rounded border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900">
                          {config.detailedConfiguration.geschossdecke.name}
                        </h5>
                        {config.detailedConfiguration.geschossdecke
                          .description && (
                          <p className="text-xs text-gray-600 mt-1">
                            {
                              config.detailedConfiguration.geschossdecke
                                .description
                            }
                          </p>
                        )}
                      </div>
                      <span className="font-bold text-gray-900 ml-4 whitespace-nowrap">
                        €
                        {config.detailedConfiguration.geschossdecke.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

              {/* Belichtungspaket */}
              {config.detailedConfiguration.belichtungspaket && (
                <div className="p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900">
                        {config.detailedConfiguration.belichtungspaket.name}
                      </h5>
                      {config.detailedConfiguration.belichtungspaket
                        .description && (
                        <p className="text-xs text-gray-600 mt-1">
                          {
                            config.detailedConfiguration.belichtungspaket
                              .description
                          }
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-gray-900 ml-4 whitespace-nowrap">
                      {config.detailedConfiguration.belichtungspaket.price === 0
                        ? "inkludiert"
                        : `€${config.detailedConfiguration.belichtungspaket.price.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              )}

              {/* Fenster (only show if price > 0, as it's included in belichtungspaket) */}
              {config.detailedConfiguration.fenster &&
                config.detailedConfiguration.fenster.price > 0 && (
                  <div className="p-3 bg-gray-50 rounded border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900">
                          {config.detailedConfiguration.fenster.name}
                        </h5>
                        {config.detailedConfiguration.fenster.description && (
                          <p className="text-xs text-gray-600 mt-1">
                            {config.detailedConfiguration.fenster.description}
                          </p>
                        )}
                        {config.detailedConfiguration.fenster.squareMeters && (
                          <p className="text-xs text-gray-600 font-semibold mt-1">
                            {config.detailedConfiguration.fenster.squareMeters}
                            m²
                          </p>
                        )}
                      </div>
                      <span className="font-bold text-gray-900 ml-4 whitespace-nowrap">
                        €
                        {config.detailedConfiguration.fenster.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

              {/* PV-Anlage with module count */}
              {config.detailedConfiguration.pvanlage &&
                config.detailedConfiguration.pvanlage.price > 0 && (
                  <div className="p-3 bg-green-50 rounded border border-green-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900">
                          {config.detailedConfiguration.pvanlage.name}
                        </h5>
                        {config.detailedConfiguration.pvanlage.description && (
                          <p className="text-xs text-gray-600 mt-1">
                            {config.detailedConfiguration.pvanlage.description}
                          </p>
                        )}
                        {/* Extract module count from value (e.g., "pv_3" -> "3 Module") */}
                        {(() => {
                          const match =
                            config.detailedConfiguration.pvanlage.value.match(
                              /pv_(\d+)/
                            );
                          return match ? (
                            <p className="text-xs text-green-700 font-semibold mt-1">
                              {match[1]} PV-Module • 0,4 kWpeak pro Panel
                            </p>
                          ) : null;
                        })()}
                      </div>
                      <span className="font-bold text-green-700 ml-4 whitespace-nowrap">
                        €
                        {config.detailedConfiguration.pvanlage.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

              {/* Planungspaket */}
              {config.detailedConfiguration.planungspaket && (
                <div className="p-3 bg-purple-50 rounded border border-purple-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900">
                        {config.detailedConfiguration.planungspaket.name}
                      </h5>
                      {config.detailedConfiguration.planungspaket
                        .description && (
                        <p className="text-xs text-gray-600 mt-1">
                          {
                            config.detailedConfiguration.planungspaket
                              .description
                          }
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-purple-700 ml-4 whitespace-nowrap">
                      €
                      {config.detailedConfiguration.planungspaket.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Total Price Summary */}
              <div className="p-4 bg-gradient-to-r from-green-100 to-green-200 rounded-lg border-2 border-green-300 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    Gesamtpreis
                  </span>
                  <span className="text-2xl font-bold text-green-700">
                    €{config.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          {config.contactInfo && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                📞 Kontaktinformationen
              </h3>
              <div className="space-y-3">
                {config.contactInfo.name && (
                  <div className="flex justify-between p-3 bg-blue-50 rounded">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-semibold text-gray-900">
                      {config.contactInfo.name}
                    </span>
                  </div>
                )}
                {config.contactInfo.email && (
                  <div className="flex justify-between p-3 bg-blue-50 rounded">
                    <span className="text-gray-600">E-Mail:</span>
                    <span className="font-medium text-blue-600">
                      <a href={`mailto:${config.contactInfo.email}`}>
                        {config.contactInfo.email}
                      </a>
                    </span>
                  </div>
                )}
                {config.contactInfo.phone && (
                  <div className="flex justify-between p-3 bg-blue-50 rounded">
                    <span className="text-gray-600">Telefon:</span>
                    <span className="font-medium text-gray-900">
                      <a href={`tel:${config.contactInfo.phone}`}>
                        {config.contactInfo.phone}
                      </a>
                    </span>
                  </div>
                )}
                {config.contactInfo.preferredContact && (
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Bevorzugter Kontakt:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {config.contactInfo.preferredContact}
                    </span>
                  </div>
                )}
                {config.contactInfo.bestTimeToCall && (
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Beste Anrufzeit:</span>
                    <span className="font-medium text-gray-900">
                      {config.contactInfo.bestTimeToCall}
                    </span>
                  </div>
                )}
                {config.contactInfo.message && (
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-gray-600 mb-2">Nachricht:</div>
                    <p className="text-sm text-gray-900 italic">
                      &ldquo;{config.contactInfo.message}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User Activity Tracking */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🔄 Activity Tracking
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {config.tracking.selectionEventsCount}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Selection Events
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {config.tracking.interactionEventsCount}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Interaction Events
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Last Activity:{" "}
              {new Date(config.tracking.lastActivity).toLocaleString("de-DE")}
            </div>
          </div>

          {/* Session Metadata */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              💻 Session Metadata
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="text-gray-600">Device:</span>
                <span className="font-medium text-gray-900">
                  {deviceInfo.device}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="text-gray-600">Browser:</span>
                <span className="font-medium text-gray-900">
                  {deviceInfo.browser}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="text-gray-600">OS:</span>
                <span className="font-medium text-gray-900">
                  {deviceInfo.os}
                </span>
              </div>
              {config.metadata.ipAddress &&
                config.metadata.ipAddress !== "unknown" && (
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">IP Address:</span>
                    <span className="font-mono text-sm text-gray-900">
                      {config.metadata.ipAddress}
                    </span>
                  </div>
                )}
              {config.metadata.referrer && (
                <div className="flex justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Referrer:</span>
                  <span className="font-mono text-xs text-gray-900 truncate max-w-xs">
                    {config.metadata.referrer}
                  </span>
                </div>
              )}
              {config.metadata.utmSource && (
                <div className="flex justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">UTM Source:</span>
                  <span className="font-medium text-gray-900">
                    {config.metadata.utmSource}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          {config.payment && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                💳 Payment Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-green-50 rounded">
                  <span className="text-gray-600">Payment Status:</span>
                  <PaymentStatusBadge status={config.payment.paymentStatus} />
                </div>
                {config.payment.paymentAmount && (
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-bold text-green-600 text-lg">
                      €
                      {(config.payment.paymentAmount / 100).toLocaleString(
                        "de-DE",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </span>
                  </div>
                )}
                {config.payment.paymentMethod && (
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {config.payment.paymentMethod.replace("_", " ")}
                    </span>
                  </div>
                )}
                {config.payment.paidAt && (
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Payment Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(config.payment.paidAt).toLocaleString("de-DE")}
                    </span>
                  </div>
                )}
                {config.payment.paymentIntentId && (
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-mono text-xs text-gray-900">
                      {config.payment.paymentIntentId}
                    </span>
                  </div>
                )}
                {config.payment.inquiryStatus && (
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Inquiry Status:</span>
                    <span className="font-medium text-gray-900">
                      {config.payment.inquiryStatus}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AllConfigurations() {
  const [configurations, setConfigurations] = useState<
    ConfigurationWithDetails[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConfig, setSelectedConfig] =
    useState<ConfigurationWithDetails | null>(null);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "/api/admin/user-tracking/all-configurations"
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const result: AllConfigurationsResponse = await response.json();

      if (result.success) {
        setConfigurations(result.data);
        setError(null);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      console.error("Error fetching configurations:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredConfigurations =
    filter === "ALL"
      ? configurations
      : filter === "WITH_CONFIG"
        ? configurations.filter(
            (c) => !c.isOhneNestMode && c.configuration.nestType !== "Unknown"
          )
        : configurations.filter(
            (c) => c.isOhneNestMode || c.configuration.nestType === "Unknown"
          );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          All Configurations
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading configurations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          All Configurations
        </h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              All Configurations
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {configurations.length} total configurations • Click any card for
              details
            </p>
          </div>
          <button
            onClick={fetchConfigurations}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {[
            { key: "ALL", label: "Alle Sitzungen" },
            { key: "WITH_CONFIG", label: "Mit Konfiguration" },
            {
              key: "WITHOUT_CONFIG",
              label: "Ohne Konfiguration (Direkt zum Vorentwurf)",
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                filter === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
              <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded">
                {tab.key === "ALL"
                  ? configurations.length
                  : tab.key === "WITH_CONFIG"
                    ? configurations.filter(
                        (c) =>
                          !c.isOhneNestMode &&
                          c.configuration.nestType !== "Unknown"
                      ).length
                    : configurations.filter(
                        (c) =>
                          c.isOhneNestMode ||
                          c.configuration.nestType === "Unknown"
                      ).length}
              </span>
            </button>
          ))}
        </div>

        {/* Configurations Grid */}
        {filteredConfigurations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConfigurations.map((config) => (
              <ConfigurationCard
                key={config.sessionId}
                config={config}
                onClick={() => setSelectedConfig(config)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              No configurations found for filter: {filter}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedConfig && (
        <ConfigurationModal
          config={selectedConfig}
          onClose={() => setSelectedConfig(null)}
        />
      )}
    </>
  );
}
