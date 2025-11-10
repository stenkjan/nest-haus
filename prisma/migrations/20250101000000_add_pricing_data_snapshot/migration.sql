-- CreateTable
CREATE TABLE "pricing_data_snapshots" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "pricingData" JSONB NOT NULL,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncedBy" TEXT NOT NULL DEFAULT 'cron',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pricing_data_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pricing_data_snapshots_isActive_idx" ON "pricing_data_snapshots"("isActive");

-- CreateIndex
CREATE INDEX "pricing_data_snapshots_syncedAt_idx" ON "pricing_data_snapshots"("syncedAt");

-- CreateIndex
CREATE INDEX "pricing_data_snapshots_version_idx" ON "pricing_data_snapshots"("version");

