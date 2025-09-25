import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { testId, comments, stepId } = await request.json();

        if (!testId || !comments) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Find or create the usability test record
        const test = await prisma.usabilityTest.upsert({
            where: { testId },
            update: {
                comments: comments,
                updatedAt: new Date(),
            },
            create: {
                testId,
                comments: comments,
                participantName: "Anonymous", // Will be updated if available
                deviceInfo: "{}",
                startUrl: "",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        console.log("💬 Comments saved for test:", testId, "Step:", stepId);

        return NextResponse.json({
            success: true,
            testId: test.testId,
            message: "Comments saved successfully",
        });
    } catch (error) {
        console.error("❌ Error saving comments:", error);
        return NextResponse.json(
            { error: "Failed to save comments" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const testId = searchParams.get("testId");

        if (testId) {
            // Get comments for specific test
            const test = await prisma.usabilityTest.findUnique({
                where: { testId },
                select: {
                    testId: true,
                    participantName: true,
                    comments: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            if (!test) {
                return NextResponse.json({ error: "Test not found" }, { status: 404 });
            }

            return NextResponse.json({
                success: true,
                data: test,
            });
        } else {
            // Get all tests with comments
            const testsWithComments = await prisma.usabilityTest.findMany({
                where: {
                    comments: {
                        not: null,
                    },
                },
                select: {
                    testId: true,
                    participantName: true,
                    comments: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: {
                    updatedAt: "desc",
                },
            });

            return NextResponse.json({
                success: true,
                data: testsWithComments,
            });
        }
    } catch (error) {
        console.error("❌ Error fetching comments:", error);
        return NextResponse.json(
            { error: "Failed to fetch comments" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
