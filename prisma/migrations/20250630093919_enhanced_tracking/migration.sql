-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'ABANDONED', 'COMPLETED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'IN_PROGRESS', 'QUOTED', 'CONVERTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('EMAIL', 'PHONE', 'WHATSAPP');

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "utmSource" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "configurationData" JSONB,
    "totalPrice" INTEGER,
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "selection_events" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT NOT NULL,
    "selection" TEXT NOT NULL,
    "previousSelection" TEXT,
    "timeSpentMs" INTEGER,
    "priceChange" INTEGER,
    "totalPrice" INTEGER,

    CONSTRAINT "selection_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_analytics" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "uniqueVisitors" INTEGER NOT NULL DEFAULT 0,
    "completedConfigurations" INTEGER NOT NULL DEFAULT 0,
    "abandonedSessions" INTEGER NOT NULL DEFAULT 0,
    "averageSessionDuration" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bounceRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "conversionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "topSelections" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "popular_configurations" (
    "id" TEXT NOT NULL,
    "configurationHash" TEXT NOT NULL,
    "nestType" TEXT NOT NULL,
    "gebaeudehuelle" TEXT NOT NULL,
    "innenverkleidung" TEXT NOT NULL,
    "fussboden" TEXT NOT NULL,
    "pvanlage" TEXT,
    "fenster" TEXT,
    "planungspaket" TEXT,
    "totalPrice" INTEGER NOT NULL,
    "selectionCount" INTEGER NOT NULL DEFAULT 1,
    "conversionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastSelected" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "popular_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "house_options" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "basePrice" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "properties" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "house_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing_rules" (
    "id" TEXT NOT NULL,
    "nestType" TEXT NOT NULL,
    "gebaeudehuelle" TEXT NOT NULL,
    "innenverkleidung" TEXT NOT NULL,
    "fussboden" TEXT NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_inquiries" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "message" TEXT,
    "configurationData" JSONB,
    "totalPrice" INTEGER,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "preferredContact" "ContactMethod" NOT NULL DEFAULT 'EMAIL',
    "bestTimeToCall" TEXT,
    "adminNotes" TEXT,
    "followUpDate" TIMESTAMP(3),
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interaction_events" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "elementId" TEXT,
    "selectionValue" TEXT,
    "previousValue" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeSpent" INTEGER,
    "deviceType" TEXT,
    "viewportWidth" INTEGER,
    "viewportHeight" INTEGER,
    "additionalData" JSONB,

    CONSTRAINT "interaction_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuration_snapshots" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "configurationData" JSONB NOT NULL,
    "totalPrice" INTEGER,
    "completionPercentage" DOUBLE PRECISION,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "triggerEvent" TEXT NOT NULL,
    "additionalData" JSONB,

    CONSTRAINT "configuration_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_metrics" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT,
    "metricName" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "additionalData" JSONB,
    "endpoint" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "performance_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_sessionId_key" ON "user_sessions"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "daily_analytics_date_key" ON "daily_analytics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "popular_configurations_configurationHash_key" ON "popular_configurations"("configurationHash");

-- CreateIndex
CREATE UNIQUE INDEX "house_options_category_value_key" ON "house_options"("category", "value");

-- CreateIndex
CREATE UNIQUE INDEX "pricing_rules_nestType_gebaeudehuelle_innenverkleidung_fuss_key" ON "pricing_rules"("nestType", "gebaeudehuelle", "innenverkleidung", "fussboden");

-- AddForeignKey
ALTER TABLE "selection_events" ADD CONSTRAINT "selection_events_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "user_sessions"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interaction_events" ADD CONSTRAINT "interaction_events_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "user_sessions"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration_snapshots" ADD CONSTRAINT "configuration_snapshots_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "user_sessions"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;
