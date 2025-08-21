-- CreateEnum
CREATE TYPE "TestStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED', 'ERROR');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('RATING', 'TEXT', 'MULTIPLE_CHOICE', 'YES_NO');

-- CreateTable
CREATE TABLE "usability_tests" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "sessionId" TEXT,
    "testType" TEXT NOT NULL DEFAULT 'alpha',
    "status" "TestStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "totalDuration" INTEGER,
    "deviceInfo" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "overallRating" DOUBLE PRECISION,
    "completionRate" DOUBLE PRECISION,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "consoleErrors" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usability_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usability_responses" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "questionType" "QuestionType" NOT NULL,
    "questionText" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "responseTime" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usability_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_interactions" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "elementId" TEXT,
    "elementText" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "errorMessage" TEXT,
    "additionalData" JSONB,

    CONSTRAINT "test_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usability_tests_testId_key" ON "usability_tests"("testId");

-- AddForeignKey
ALTER TABLE "usability_responses" ADD CONSTRAINT "usability_responses_testId_fkey" FOREIGN KEY ("testId") REFERENCES "usability_tests"("testId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_interactions" ADD CONSTRAINT "test_interactions_testId_fkey" FOREIGN KEY ("testId") REFERENCES "usability_tests"("testId") ON DELETE CASCADE ON UPDATE CASCADE;
