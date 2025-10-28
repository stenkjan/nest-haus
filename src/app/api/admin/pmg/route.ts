import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdminAuth } from '@/lib/admin-auth';

const prisma = new PrismaClient();

/**
 * GET /api/admin/pmg - Get all project tasks
 */
export async function GET(request: NextRequest) {
    try {
        // Validate admin authentication via cookie
        const authError = await requireAdminAuth(request);
        if (authError) return authError;

        const tasks = await prisma.projectTask.findMany({
            orderBy: [
                { startDate: 'asc' },
                { taskId: 'asc' }
            ]
        });

        return NextResponse.json({ tasks });
    } catch (error) {
        console.error('Error fetching project tasks:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * POST /api/admin/pmg - Create a new project task
 */
export async function POST(request: NextRequest) {
    try {
        // Validate admin authentication via cookie
        const authError = await requireAdminAuth(request);
        if (authError) return authError;

        const data = await request.json();
        console.log('Received task data:', data);

        const { taskId, task, responsible, startDate, endDate, duration, milestone, priority, notes, status } = data;

        // Validate required fields
        if (!taskId || !task || !responsible || !startDate || !endDate) {
            const missingFields = [];
            if (!taskId) missingFields.push('taskId');
            if (!task) missingFields.push('task');
            if (!responsible) missingFields.push('responsible');
            if (!startDate) missingFields.push('startDate');
            if (!endDate) missingFields.push('endDate');

            console.error('Missing required fields:', missingFields);
            return NextResponse.json({
                error: `Missing required fields: ${missingFields.join(', ')}`
            }, { status: 400 });
        }

        console.log('Creating task in database...');
        const newTask = await prisma.projectTask.create({
            data: {
                taskId,
                task,
                responsible,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                duration: duration || 1,
                milestone: milestone || false,
                priority: priority || 'MITTEL',
                notes,
                status: status || 'PENDING'
            }
        });

        console.log('Task created successfully:', newTask.id);
        return NextResponse.json({ task: newTask });
    } catch (error) {
        console.error('Error creating project task:', error);
        console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

        // Check for unique constraint violation (Prisma error code P2002)
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            return NextResponse.json({
                error: 'Task ID already exists',
                details: 'A task with this ID already exists in the database. Please use a different task ID.'
            }, { status: 409 });
        }

        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

/**
 * PUT /api/admin/pmg - Update a project task
 */
export async function PUT(request: NextRequest) {
    try {
        // Validate admin authentication via cookie
        const authError = await requireAdminAuth(request);
        if (authError) return authError;

        const data = await request.json();
        const { id, taskId, task, responsible, startDate, endDate, duration, milestone, priority, notes, status } = data;

        if (!id) {
            return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
        }

        const updatedTask = await prisma.projectTask.update({
            where: { id },
            data: {
                ...(taskId && { taskId }),
                ...(task && { task }),
                ...(responsible && { responsible }),
                ...(startDate && { startDate: new Date(startDate) }),
                ...(endDate && { endDate: new Date(endDate) }),
                ...(duration !== undefined && { duration }),
                ...(milestone !== undefined && { milestone }),
                ...(priority && { priority }),
                ...(notes !== undefined && { notes }),
                ...(status && { status })
            }
        });

        return NextResponse.json({ task: updatedTask });
    } catch (error) {
        console.error('Error updating project task:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/pmg - Delete a project task
 */
export async function DELETE(request: NextRequest) {
    try {
        // Validate admin authentication via cookie
        const authError = await requireAdminAuth(request);
        if (authError) return authError;

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

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
