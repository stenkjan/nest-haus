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

        // Group tasks by milestone phases based on date ranges
        const reorganizedTasks = [];
        let currentMilestone = 1;
        let currentSubtask = 1;

        for (const task of tasks) {
            const taskDate = new Date(task.startDate);

            // Skip if it's already a properly formatted milestone or phase marker
            if (task.taskId.match(/^[PM]\d+$/) || task.taskId.match(/^(M\d+|ZIEL|Milestone)$/i)) {
                reorganizedTasks.push({
                    ...task,
                    newTaskId: task.taskId // Keep milestone IDs as they are
                });
                continue;
            }

            // Determine milestone based on date ranges (from your seed data)
            if (taskDate <= new Date('2025-10-09')) {
                // Phase 1 tasks (up to Oct 9)
                currentMilestone = 1;
            } else if (taskDate <= new Date('2025-10-17')) {
                // Phase 2 tasks (Oct 10-17)
                currentMilestone = 2;
            } else if (taskDate <= new Date('2025-10-24')) {
                // Phase 3 tasks (Oct 20-24)
                currentMilestone = 3;
            } else if (taskDate <= new Date('2025-11-06')) {
                // Phase 4 tasks (Oct 27 - Nov 6)
                currentMilestone = 4;
            } else {
                // Phase 5 and beyond
                currentMilestone = 5;
            }

            // Find the next available subtask number for this milestone
            const existingSubtasks = reorganizedTasks
                .filter(t => t.newTaskId.startsWith(`${currentMilestone}.`))
                .map(t => {
                    const match = t.newTaskId.match(/^(\d+)\.(\d+)$/);
                    return match ? parseInt(match[2]) : 0;
                });

            const nextSubtask = existingSubtasks.length > 0 ? Math.max(...existingSubtasks) + 1 : 1;

            reorganizedTasks.push({
                ...task,
                newTaskId: `${currentMilestone}.${nextSubtask}`
            });
        }

        console.log('Reorganized tasks:', reorganizedTasks.map(t => ({ old: t.taskId, new: t.newTaskId, task: t.task, date: t.startDate })));

        // Update tasks in database
        const updatePromises = reorganizedTasks.map(async (task) => {
            if (task.taskId !== task.newTaskId) {
                console.log(`Updating ${task.taskId} -> ${task.newTaskId}: ${task.task}`);
                return prisma.projectTask.update({
                    where: { id: task.id },
                    data: { taskId: task.newTaskId }
                });
            }
            return task;
        });

        await Promise.all(updatePromises);

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
