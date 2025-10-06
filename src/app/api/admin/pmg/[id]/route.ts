import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Authenticate admin requests using Basic Auth
 */
async function authenticateRequest(authHeader: string | null): Promise<boolean> {
    if (!authHeader) return false;

    try {
        const base64Credentials = authHeader.replace('Basic ', '');
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');

        return username === process.env.ADMIN_USERNAME &&
            password === process.env.ADMIN_PASSWORD;
    } catch (error) {
        console.error('❌ Authentication error:', error);
        return false;
    }
}

/**
 * PUT /api/admin/pmg/[id] - Update a specific project task
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!await authenticateRequest(authHeader)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const data = await request.json();
        const { taskId, task, responsible, startDate, endDate, duration, milestone, priority, notes, status } = data;

        if (!id) {
            return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
        }

        const updateData: {
            taskId?: string;
            task?: string;
            responsible?: string;
            startDate?: Date;
            endDate?: Date;
            duration?: number;
            milestone?: boolean;
            priority?: string;
            notes?: string;
            status?: string;
        } = {};
        if (taskId !== undefined) updateData.taskId = taskId;
        if (task !== undefined) updateData.task = task;
        if (responsible !== undefined) updateData.responsible = responsible;
        if (startDate !== undefined) updateData.startDate = new Date(startDate);
        if (endDate !== undefined) updateData.endDate = new Date(endDate);
        if (duration !== undefined) updateData.duration = duration;
        if (milestone !== undefined) updateData.milestone = milestone;
        if (priority !== undefined) updateData.priority = priority;
        if (notes !== undefined) updateData.notes = notes;
        if (status !== undefined) updateData.status = status;

        const updatedTask = await prisma.projectTask.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({ task: updatedTask });
    } catch (error) {
        console.error('Error updating project task:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/pmg/[id] - Delete a specific project task
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!await authenticateRequest(authHeader)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
        }

        await prisma.projectTask.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting project task:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
