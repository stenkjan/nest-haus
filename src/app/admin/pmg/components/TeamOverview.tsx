"use client";

import { ProjectTask } from "@prisma/client";

interface TeamOverviewProps {
  tasks: ProjectTask[];
}

// Color constants matching GanttChart
const responsibleColors: Record<string, string> = {
  JST: "rgba(59, 130, 246, 0.7)",
  JWS: "rgba(16, 185, 129, 0.7)",
  iNEST: "rgba(239, 68, 68, 0.7)",
};

export default function TeamOverview({ tasks }: TeamOverviewProps) {
  const teamMembers = ["JST", "JWS", "iNEST"];

  const getTasksForMember = (member: string) => {
    return tasks.filter((task) => task.responsible.includes(member));
  };

  const getInProgressTasks = (member: string) => {
    return getTasksForMember(member).filter(
      (task) => task.status === "IN_PROGRESS"
    );
  };

  const getCompletedTasks = (member: string) => {
    return getTasksForMember(member).filter(
      (task) => task.status === "COMPLETED"
    );
  };

  return (
    <div className="mt-12 bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-6">Team-Übersicht</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teamMembers.map((member) => {
          const inProgressTasks = getInProgressTasks(member);
          const completedTasks = getCompletedTasks(member);
          const allTasks = getTasksForMember(member);

          return (
            <div key={member} className="border rounded-lg p-4">
              <div
                className="text-center py-2 px-4 rounded-lg mb-4 font-semibold text-white"
                style={{ backgroundColor: responsibleColors[member] }}
              >
                {member}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">
                    Aktuell in Bearbeitung ({inProgressTasks.length})
                  </h4>
                  {inProgressTasks.length > 0 ? (
                    <ul className="space-y-1">
                      {inProgressTasks.map((task) => (
                        <li
                          key={task.id}
                          className="text-xs text-gray-600 bg-blue-50 p-2 rounded"
                        >
                          <span className="font-medium">{task.taskId}:</span>{" "}
                          {task.task}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500 italic">
                      Keine Aufgaben in Bearbeitung
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">
                    Abgeschlossen ({completedTasks.length})
                  </h4>
                  {completedTasks.length > 0 ? (
                    <ul className="space-y-1">
                      {completedTasks.map((task) => (
                        <li
                          key={task.id}
                          className="text-xs text-gray-600 bg-green-50 p-2 rounded"
                        >
                          <span className="font-medium">{task.taskId}:</span>{" "}
                          {task.task}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500 italic">
                      Keine abgeschlossenen Aufgaben
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">
                    Gesamt: {allTasks.length} Aufgaben zugewiesen
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
