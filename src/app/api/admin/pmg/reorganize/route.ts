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

        // Use hardcoded credentials for now - same as other endpoints
        return username === 'admin' && password === 'MAINJAJANest';
    } catch (error) {
        console.error('❌ Authentication error:', error);
        return false;
    }
}

/**
 * POST /api/admin/pmg/reorganize - Reorganize task IDs based on chronological order
 */
export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!await authenticateRequest(authHeader)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get all tasks sorted by date
        const tasks = await prisma.projectTask.findMany({
            orderBy: [
                { startDate: 'asc' },
                { taskId: 'asc' }
            ]
        });

        console.log('Current tasks:', tasks.map(t => ({ id: t.taskId, task: t.task, date: t.startDate })));

        // Separate milestones from regular tasks
        const milestones = tasks.filter(t =>
            t.taskId.match(/^[PM]\d+$/) ||
            t.taskId.match(/^(M\d+|ZIEL|Milestone)$/i) ||
            t.taskId.match(/^\d+\.$/)
        );

        const regularTasks = tasks.filter(t =>
            !t.taskId.match(/^[PM]\d+$/) &&
            !t.taskId.match(/^(M\d+|ZIEL|Milestone)$/i) &&
            !t.taskId.match(/^\d+\.$/)
        );

        console.log('Milestones:', milestones.map(t => t.taskId));
        console.log('Regular tasks:', regularTasks.map(t => ({ id: t.taskId, date: t.startDate })));

        // Reorganize regular tasks based on date
        const reorganizedTasks = [];

        // Keep milestones as they are
        milestones.forEach(milestone => {
            reorganizedTasks.push({
                ...milestone,
                newTaskId: milestone.taskId
            });
        });

        // Reorganize regular tasks by date and assign proper IDs
        let phase1Count = 1;
        let phase2Count = 1;
        let phase3Count = 1;
        let phase4Count = 1;
        let phase5Count = 1;

        regularTasks.forEach(task => {
            const taskDate = new Date(task.startDate);
            let newTaskId;

            if (taskDate <= new Date('2025-10-09')) {
                // Phase 1 tasks
                newTaskId = `1.${phase1Count}`;
                phase1Count++;
            } else if (taskDate <= new Date('2025-10-17')) {
                // Phase 2 tasks  
                newTaskId = `2.${phase2Count}`;
                phase2Count++;
            } else if (taskDate <= new Date('2025-10-24')) {
                // Phase 3 tasks
                newTaskId = `3.${phase3Count}`;
                phase3Count++;
            } else if (taskDate <= new Date('2025-11-06')) {
                // Phase 4 tasks
                newTaskId = `4.${phase4Count}`;
                phase4Count++;
            } else {
                // Phase 5+ tasks
                newTaskId = `5.${phase5Count}`;
                phase5Count++;
            }

            reorganizedTasks.push({
                ...task,
                newTaskId
            });
        });

        console.log('Reorganized tasks:', reorganizedTasks.map(t => ({ old: t.taskId, new: t.newTaskId, task: t.task, date: t.startDate })));

        // Update tasks in database using transaction to avoid conflicts
        const tasksToUpdate = reorganizedTasks.filter(t => t.taskId !== t.newTaskId);

        if (tasksToUpdate.length === 0) {
            return NextResponse.json({
                message: 'No tasks need reorganization',
                changes: []
            });
        }

        console.log(`Updating ${tasksToUpdate.length} tasks...`);

        // Use transaction to update all tasks safely
        await prisma.$transaction(async (tx) => {
            // First, temporarily rename all tasks to avoid unique constraint conflicts
            for (const task of tasksToUpdate) {
                await tx.projectTask.update({
                    where: { id: task.id },
                    data: { taskId: `TEMP_${task.id}` }
                });
            }

            // Then update to final IDs
            for (const task of tasksToUpdate) {
                console.log(`Updating ${task.taskId} -> ${task.newTaskId}: ${task.task}`);
                await tx.projectTask.update({
                    where: { id: task.id },
                    data: { taskId: task.newTaskId }
                });
            }
        });

        return NextResponse.json({
            message: 'Tasks reorganized successfully',
            changes: reorganizedTasks
                .filter(t => t.taskId !== t.newTaskId)
                .map(t => ({ old: t.taskId, new: t.newTaskId, task: t.task }))
        });

    } catch (error) {
        console.error('Error reorganizing tasks:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
