"use client";

import { useState } from "react";
import { ProjectTask, TaskPriority, TaskStatus } from "@prisma/client";

// Color constants matching GanttChart
const responsibleColors: Record<string, string> = {
  JST: "rgba(59, 130, 246, 0.7)",
  JWS: "rgba(16, 185, 129, 0.7)",
  iNEST: "rgba(239, 68, 68, 0.7)",
};

interface TaskListProps {
  tasks: ProjectTask[];
  onTaskUpdate: (taskId: string, updates: Partial<ProjectTask>) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskAdd: (
    taskData: Omit<ProjectTask, "id" | "createdAt" | "updatedAt">
  ) => void;
  onTaskSelect: (task: ProjectTask) => void;
}

export default function TaskList({
  tasks,
  onTaskUpdate,
  onTaskDelete,
  onTaskAdd,
  onTaskSelect,
}: TaskListProps) {
  const [editingCell, setEditingCell] = useState<{
    taskId: string;
    field: string;
  } | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const formatDate = (date: Date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const formatDateGerman = (date: Date) => {
    return new Date(date).toLocaleDateString("de-DE");
  };

  const getResponsibleColor = (responsible: string) => {
    const mainResponsible = responsible.split(", ")[0];
    return responsibleColors[mainResponsible] || "rgba(107, 114, 128, 0.7)";
  };

  const getPriorityClass = (priority: TaskPriority) => {
    switch (priority) {
      case "HÖCHST":
      case "HOCH":
        return "bg-red-100 text-red-800";
      case "MITTEL":
        return "bg-yellow-100 text-yellow-800";
      case "NIEDRIG":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusClass = (status: TaskStatus) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCellClick = (task: ProjectTask, field: string) => {
    setEditingCell({ taskId: task.id, field });

    let value = "";
    switch (field) {
      case "task":
        value = task.task;
        break;
      case "responsible":
        value = task.responsible;
        break;
      case "startDate":
        value = formatDate(task.startDate);
        break;
      case "endDate":
        value = formatDate(task.endDate);
        break;
      case "priority":
        value = task.priority;
        break;
      case "status":
        value = task.status;
        break;
      case "notes":
        value = task.notes || "";
        break;
    }
    setEditValue(value);
  };

  const handleCellSave = () => {
    if (!editingCell) return;

    const updates: Partial<ProjectTask> = {};

    switch (editingCell.field) {
      case "task":
        updates.task = editValue;
        break;
      case "responsible":
        updates.responsible = editValue;
        break;
      case "startDate":
        if (/^\d{4}-\d{2}-\d{2}$/.test(editValue)) {
          updates.startDate = new Date(editValue);
        }
        break;
      case "endDate":
        if (/^\d{4}-\d{2}-\d{2}$/.test(editValue)) {
          updates.endDate = new Date(editValue);
        }
        break;
      case "priority":
        if (
          ["HÖCHST", "HOCH", "MITTEL", "NIEDRIG"].includes(
            editValue.toUpperCase()
          )
        ) {
          updates.priority = editValue.toUpperCase() as TaskPriority;
        }
        break;
      case "status":
        if (
          ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"].includes(
            editValue.toUpperCase()
          )
        ) {
          updates.status = editValue.toUpperCase() as TaskStatus;
        }
        break;
      case "notes":
        updates.notes = editValue;
        break;
    }

    if (Object.keys(updates).length > 0) {
      onTaskUpdate(editingCell.taskId, updates);
    }

    setEditingCell(null);
    setEditValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCellSave();
    } else if (e.key === "Escape") {
      setEditingCell(null);
      setEditValue("");
    }
  };

  const handleAddTask = () => {
    const newTaskData = {
      taskId: `A${tasks.length + 1}`,
      task: "Neue Aufgabe",
      responsible: "iNEST",
      startDate: new Date("2025-10-10"),
      endDate: new Date("2025-10-11"),
      duration: 2,
      milestone: false,
      priority: "MITTEL" as TaskPriority,
      notes: "Beschreibung der neuen Aufgabe.",
      status: "PENDING" as TaskStatus,
    };

    onTaskAdd(newTaskData);
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">
          Keine Aufgaben für die aktuellen Filter gefunden.
        </p>
        <button
          onClick={handleAddTask}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors"
        >
          + Erste Aufgabe hinzufügen
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Detaillierte Aufgabenliste</h2>
        <button
          onClick={handleAddTask}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors text-sm flex items-center"
        >
          + Aufgabe hinzufügen
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[30%]">
                Aufgabe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                Verantwortlich
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                Start
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                Ende
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                Prio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                Aktion
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span
                    className={task.milestone ? "font-bold" : "font-medium"}
                  >
                    {task.taskId}
                  </span>
                </td>
                <td
                  className="px-6 py-4 text-sm text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => onTaskSelect(task)}
                >
                  {editingCell?.taskId === task.id &&
                  editingCell?.field === "task" ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellSave}
                      onKeyDown={handleKeyPress}
                      className="w-full p-1 border rounded"
                      autoFocus
                    />
                  ) : (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCellClick(task, "task");
                      }}
                    >
                      {task.task}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {editingCell?.taskId === task.id &&
                  editingCell?.field === "responsible" ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellSave}
                      onKeyDown={handleKeyPress}
                      className="w-full p-1 border rounded"
                      autoFocus
                    />
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-gray-100 p-1 rounded text-white font-medium"
                      style={{
                        backgroundColor: getResponsibleColor(task.responsible),
                      }}
                      onClick={() => handleCellClick(task, "responsible")}
                    >
                      {task.responsible}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {editingCell?.taskId === task.id &&
                  editingCell?.field === "startDate" ? (
                    <input
                      type="date"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellSave}
                      onKeyDown={handleKeyPress}
                      className="w-full p-1 border rounded"
                      autoFocus
                    />
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                      onClick={() => handleCellClick(task, "startDate")}
                    >
                      {formatDateGerman(task.startDate)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {editingCell?.taskId === task.id &&
                  editingCell?.field === "endDate" ? (
                    <input
                      type="date"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellSave}
                      onKeyDown={handleKeyPress}
                      className="w-full p-1 border rounded"
                      autoFocus
                    />
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                      onClick={() => handleCellClick(task, "endDate")}
                    >
                      {formatDateGerman(task.endDate)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {editingCell?.taskId === task.id &&
                  editingCell?.field === "priority" ? (
                    <select
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellSave}
                      onKeyDown={handleKeyPress}
                      className="w-full p-1 border rounded"
                      autoFocus
                    >
                      <option value="HÖCHST">HÖCHST</option>
                      <option value="HOCH">HOCH</option>
                      <option value="MITTEL">MITTEL</option>
                      <option value="NIEDRIG">NIEDRIG</option>
                    </select>
                  ) : (
                    <div
                      className="cursor-pointer"
                      onClick={() => handleCellClick(task, "priority")}
                    >
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityClass(task.priority)}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {editingCell?.taskId === task.id &&
                  editingCell?.field === "status" ? (
                    <select
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellSave}
                      onKeyDown={handleKeyPress}
                      className="w-full p-1 border rounded"
                      autoFocus
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  ) : (
                    <div
                      className="cursor-pointer"
                      onClick={() => handleCellClick(task, "status")}
                    >
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(task.status)}`}
                      >
                        {task.status}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onTaskDelete(task.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Löschen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
