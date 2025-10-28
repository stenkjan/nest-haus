import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, TaskPriority, TaskStatus } from '@prisma/client';
import { requireAdminAuth } from '@/lib/admin-auth';

const prisma = new PrismaClient();

/**
 * PUT /api/admin/pmg/[id] - Update a specific project task
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Validate admin authentication via cookie
        const authError = await requireAdminAuth(request);
        if (authError) return authError;

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
            priority?: TaskPriority;
            notes?: string;
            status?: TaskStatus;
        } = {};
        if (taskId !== undefined) updateData.taskId = taskId;
        if (task !== undefined) updateData.task = task;
        if (responsible !== undefined) updateData.responsible = responsible;
        if (startDate !== undefined) updateData.startDate = new Date(startDate);
        if (endDate !== undefined) updateData.endDate = new Date(endDate);
        if (duration !== undefined) updateData.duration = duration;
        if (milestone !== undefined) updateData.milestone = milestone;
        if (priority !== undefined) updateData.priority = priority as TaskPriority;
        if (notes !== undefined) updateData.notes = notes;
        if (status !== undefined) updateData.status = status as TaskStatus;

        const updatedTask = await prisma.projectTask.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({ task: updatedTask });
    } catch (error) {
        console.error('Error updating project task:', error);

        // Check for unique constraint violation
        if (error instanceof Error && error.message.includes('Unique constraint')) {
            return NextResponse.json({ error: 'Task ID already exists. Please choose a different ID.' }, { status: 400 });
        }

        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
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
        // Validate admin authentication via cookie
        const authError = await requireAdminAuth(request);
        if (authError) return authError;

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
