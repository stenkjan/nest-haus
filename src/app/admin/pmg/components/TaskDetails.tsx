"use client";

import { ProjectTask } from "@prisma/client";

interface TaskDetailsProps {
  task: ProjectTask;
}

export default function TaskDetails({ task }: TaskDetailsProps) {
  const formatDateGerman = (date: Date) => {
    return new Date(date).toLocaleDateString("de-DE");
  };

  return (
    <div className="bg-slate-50 p-4 rounded-lg shadow-inner">
      <h3 className="text-lg font-semibold mb-2">Aufgaben-Details</h3>
      <div>
        <p className="font-bold text-slate-800">
          {task.taskId}: {task.task}
        </p>
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          <li>
            <strong>Verantwortlich:</strong> {task.responsible}
          </li>
          <li>
            <strong>Zeitraum:</strong> {formatDateGerman(task.startDate)} -{" "}
            {formatDateGerman(task.endDate)} ({task.duration} Tage)
          </li>
          <li>
            <strong>Priorität:</strong> {task.priority}
          </li>
          <li>
            <strong>Status:</strong> {task.status}
          </li>
          {task.milestone && (
            <li>
              <strong>Meilenstein:</strong> Ja
            </li>
          )}
          {task.notes && (
            <li className="mt-2 pt-2 border-t border-slate-200">
              <strong>Notizen:</strong> {task.notes}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
