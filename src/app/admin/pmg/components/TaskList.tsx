"use client";

import { useState, useEffect } from "react";
import { ProjectTask, TaskPriority, TaskStatus } from "@prisma/client";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Color constants matching GanttChart
const responsibleColors: Record<string, string> = {
  JST: "rgba(59, 130, 246, 0.7)",
  JWS: "rgba(16, 185, 129, 0.7)",
  iNEST: "rgba(239, 68, 68, 0.7)",
};

// New task type for empty rows
interface NewTask {
  id: string;
  taskId: string;
  task: string;
  responsible: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  milestone: boolean;
  priority: TaskPriority;
  notes: string;
  status: TaskStatus;
  isNew: boolean;
}

type TaskOrNewTask = ProjectTask | NewTask;

interface TaskListProps {
  tasks: ProjectTask[];
  onTaskUpdate: (taskId: string, updates: Partial<ProjectTask>) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskAdd: (
    taskData: Omit<ProjectTask, "id" | "createdAt" | "updatedAt">
  ) => void;
  onTaskSelect: (task: ProjectTask) => void;
  onTaskReorder: (reorderedTasks: ProjectTask[]) => void;
  onSubtleUpdate?: (message: string) => void;
}

// Sortable Task Row Component
function SortableTaskRow({
  task,
  editingCell,
  editValue,
  setEditValue,
  handleCellClick,
  handleCellSave,
  handleKeyPress,
  onTaskSelect,
  onTaskDelete,
  onConfirmAdd,
  formatDateGerman,
  getResponsibleColor,
  getPriorityClass,
  getStatusClass,
  isMilestone,
  isEditableId,
}: {
  task: TaskOrNewTask;
  editingCell: { taskId: string; field: string } | null;
  editValue: string;
  setEditValue: (value: string) => void;
  handleCellClick: (task: TaskOrNewTask, field: string) => void;
  handleCellSave: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  onTaskSelect: (task: ProjectTask) => void;
  onTaskDelete: (taskId: string) => void;
  onConfirmAdd: (task: NewTask) => void;
  formatDateGerman: (date: Date) => string;
  getResponsibleColor: (responsible: string) => string;
  getPriorityClass: (priority: TaskPriority) => string;
  getStatusClass: (status: TaskStatus) => string;
  isMilestone: (taskId: string) => boolean;
  isEditableId: (taskId: string) => boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isNewTask = "isNew" in task && task.isNew;
  const isEmptyNewTask = isNewTask && task.taskId === "" && task.task === "";

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`hover:bg-gray-50 ${isDragging ? "bg-blue-50" : ""} ${isNewTask ? "bg-yellow-50" : ""}`}
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="flex items-center space-x-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:cursor-grabbing text-gray-400 hover:text-gray-600"
            title="Drag to reorder"
          >
            ⋮⋮
          </div>
          {editingCell?.taskId === task.id &&
          editingCell?.field === "taskId" &&
          isEditableId(task.taskId) ? (
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
            <span
              className={`p-1 rounded ${
                isMilestone(task.taskId) ? "font-bold" : "font-medium"
              } ${
                isEditableId(task.taskId)
                  ? "cursor-pointer hover:bg-gray-100"
                  : "cursor-default"
              }`}
              onClick={() =>
                isEditableId(task.taskId) && handleCellClick(task, "taskId")
              }
            >
              {task.taskId || (isEmptyNewTask ? "Auto-ID" : task.taskId)}
            </span>
          )}
        </div>
      </td>
      <td
        className="px-6 py-4 text-sm text-gray-900 cursor-pointer hover:bg-gray-100"
        onClick={() => !isNewTask && onTaskSelect(task as ProjectTask)}
      >
        {editingCell?.taskId === task.id && editingCell?.field === "task" ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleCellSave}
            onKeyDown={handleKeyPress}
            className="w-full p-1 border rounded"
            autoFocus
            placeholder={isNewTask ? "Aufgabe eingeben..." : ""}
          />
        ) : (
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleCellClick(task, "task");
            }}
            className={isEmptyNewTask ? "text-gray-400 italic" : ""}
          >
            {task.task ||
              (isEmptyNewTask ? "Klicken zum Bearbeiten..." : task.task)}
          </div>
        )}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {editingCell?.taskId === task.id &&
        editingCell?.field === "responsible" ? (
          <select
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleCellSave}
            onKeyDown={handleKeyPress}
            className="w-full p-1 border rounded"
            autoFocus
          >
            <option value="JST">JST</option>
            <option value="JWS">JWS</option>
            <option value="iNEST">iNEST</option>
            <option value="JST, JWS">JST, JWS</option>
            <option value="JST, iNEST">JST, iNEST</option>
            <option value="JWS, iNEST">JWS, iNEST</option>
            <option value="ALLE">ALLE</option>
          </select>
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
        {editingCell?.taskId === task.id && editingCell?.field === "endDate" ? (
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
        {editingCell?.taskId === task.id && editingCell?.field === "status" ? (
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
        {isNewTask ? (
          <button
            onClick={() => onConfirmAdd(task as NewTask)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium"
            disabled={!task.task}
            title={!task.task ? "Bitte Aufgabe eingeben" : "Aufgabe hinzufügen"}
          >
            +
          </button>
        ) : (
          <button
            onClick={() => onTaskDelete(task.id)}
            className="text-red-600 hover:text-red-900"
          >
            Löschen
          </button>
        )}
      </td>
    </tr>
  );
}

export default function TaskList({
  tasks,
  onTaskUpdate,
  onTaskDelete,
  onTaskAdd,
  onTaskSelect,
  onTaskReorder,
  onSubtleUpdate,
}: TaskListProps) {
  const [editingCell, setEditingCell] = useState<{
    taskId: string;
    field: string;
  } | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [localTasks, setLocalTasks] = useState<TaskOrNewTask[]>(tasks);
  const [newTaskCounter, setNewTaskCounter] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sync local tasks with props, but preserve new tasks
  useEffect(() => {
    setLocalTasks((prevLocalTasks) => {
      // Keep all new tasks - don't filter them out here
      const newTasks = prevLocalTasks.filter((t) => "isNew" in t && t.isNew);

      // Combine with tasks from props (sorted by date)
      const sortedTasks = [...tasks].sort((a, b) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        if (dateA !== dateB) return dateA - dateB;
        return a.taskId.localeCompare(b.taskId);
      });

      return [...newTasks, ...sortedTasks];
    });
  }, [tasks]);

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

  const isMilestone = (taskId: string) => {
    // Detect milestone patterns like "1.", "2.", "M1", "P1", etc.
    return /^(\d+\.|M\d+|P\d+|Milestone|MILESTONE|Phase|PHASE)/.test(taskId);
  };

  const isEditableId = (taskId: string) => {
    // Only allow editing IDs for milestones/phases or empty IDs
    return !taskId || isMilestone(taskId);
  };

  const generateTaskId = (startDate: Date, existingTasks: TaskOrNewTask[]) => {
    // Get all real tasks (not new tasks) and sort by date, then by taskId
    const realTasks = existingTasks
      .filter((t) => !("isNew" in t))
      .map((t) => t as ProjectTask)
      .sort((a, b) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        if (dateA !== dateB) return dateA - dateB;
        return a.taskId.localeCompare(b.taskId);
      });

    const newTaskTime = startDate.getTime();

    // Find where this task would be inserted in the sorted list
    let insertIndex = realTasks.findIndex((task) => {
      return new Date(task.startDate).getTime() > newTaskTime;
    });

    // If not found, insert at the end
    if (insertIndex === -1) {
      insertIndex = realTasks.length;
    }

    // Get the tasks before and after the insertion point
    const taskBefore = insertIndex > 0 ? realTasks[insertIndex - 1] : null;
    const taskAfter =
      insertIndex < realTasks.length ? realTasks[insertIndex] : null;

    // Check if this task should be part of a milestone sequence
    // Look for the most recent milestone that this task could belong to
    let relevantMilestone = null;

    // Find all milestones that come before or at the same time as this task
    for (let i = insertIndex - 1; i >= 0; i--) {
      const task = realTasks[i];
      const taskDate = new Date(task.startDate).getTime();

      // If we find a milestone pattern and the task date is close to our new task date
      if (isMilestone(task.taskId)) {
        const milestoneMatch = task.taskId.match(/^(\d+)\./);
        if (
          milestoneMatch &&
          Math.abs(taskDate - newTaskTime) <= 7 * 24 * 60 * 60 * 1000
        ) {
          // Within 7 days
          relevantMilestone = milestoneMatch[1];
          break;
        }
      }

      // Also check if we have subtasks (1.1, 1.2, etc.) that indicate a milestone sequence
      const subtaskMatch = task.taskId.match(/^(\d+)\.(\d+)$/);
      if (
        subtaskMatch &&
        Math.abs(taskDate - newTaskTime) <= 7 * 24 * 60 * 60 * 1000
      ) {
        // Within 7 days
        relevantMilestone = subtaskMatch[1];
        break;
      }
    }

    // If we found a relevant milestone, create a subtask
    if (relevantMilestone) {
      // Find existing subtasks for this milestone
      const existingSubtasks = realTasks
        .filter((t) => t.taskId.startsWith(`${relevantMilestone}.`))
        .map((t) => {
          const match = t.taskId.match(
            new RegExp(`^${relevantMilestone}\\.(\\d+)$`)
          );
          return match ? parseInt(match[1]) : 0;
        })
        .filter((num) => num > 0);

      const nextSubtask =
        existingSubtasks.length > 0 ? Math.max(...existingSubtasks) + 1 : 1;
      return `${relevantMilestone}.${nextSubtask}`;
    }

    // If we have a task before, try to follow its pattern
    if (taskBefore) {
      const beforeId = taskBefore.taskId;

      // If it's a date-based ID, increment the sequence
      const dateMatch = beforeId.match(/^(\d{8})-(\d+)$/);
      if (dateMatch) {
        const [, dateStr, seqStr] = dateMatch;
        const sequence = parseInt(seqStr);

        // Check if the task after has the same date pattern
        if (taskAfter) {
          const afterDateMatch = taskAfter.taskId.match(/^(\d{8})-(\d+)$/);
          if (afterDateMatch && afterDateMatch[1] === dateStr) {
            // We're inserting between two tasks with the same date
            const afterSequence = parseInt(afterDateMatch[2]);
            if (afterSequence > sequence + 1) {
              // There's a gap, use the next sequence
              return `${dateStr}-${(sequence + 1).toString().padStart(2, "0")}`;
            }
          }
        }

        // Use the same date pattern with incremented sequence
        return `${dateStr}-${(sequence + 1).toString().padStart(2, "0")}`;
      }
    }

    // If we have a task after, try to create an ID that comes before it
    if (taskAfter) {
      const afterId = taskAfter.taskId;
      const dateMatch = afterId.match(/^(\d{8})-(\d+)$/);
      if (dateMatch) {
        const [, dateStr, seqStr] = dateMatch;
        const sequence = parseInt(seqStr);
        if (sequence > 1) {
          return `${dateStr}-${(sequence - 1).toString().padStart(2, "0")}`;
        }
      }
    }

    // Default: create a date-based ID
    const dateStr = startDate.toISOString().split("T")[0].replace(/-/g, "");

    // Find existing tasks with same date
    const sameDateTasks = realTasks
      .filter((t) => t.taskId.startsWith(dateStr))
      .map((t) => {
        const match = t.taskId.match(new RegExp(`^${dateStr}-(\\d+)$`));
        return match ? parseInt(match[1]) : 0;
      })
      .filter((num) => num > 0);

    const nextSequence =
      sameDateTasks.length > 0 ? Math.max(...sameDateTasks) + 1 : 1;
    return `${dateStr}-${nextSequence.toString().padStart(2, "0")}`;
  };

  const handleCellClick = (task: TaskOrNewTask, field: string) => {
    setEditingCell({ taskId: task.id, field });

    let value = "";
    switch (field) {
      case "taskId":
        value = task.taskId;
        break;
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
        value = ("notes" in task ? task.notes : "") || "";
        break;
    }
    setEditValue(value);
  };

  const handleCellSave = () => {
    if (!editingCell) return;

    // Find the task being edited
    const taskIndex = localTasks.findIndex((t) => t.id === editingCell.taskId);
    if (taskIndex === -1) return;

    const task = localTasks[taskIndex];
    const isNewTask = "isNew" in task && task.isNew;

    if (isNewTask) {
      // Update local new task
      const updatedTask = { ...task } as NewTask;
      switch (editingCell.field) {
        case "taskId":
          updatedTask.taskId = editValue;
          break;
        case "task":
          updatedTask.task = editValue;
          break;
        case "responsible":
          updatedTask.responsible = editValue;
          break;
        case "startDate":
          if (/^\d{4}-\d{2}-\d{2}$/.test(editValue)) {
            updatedTask.startDate = new Date(editValue);
          }
          break;
        case "endDate":
          if (/^\d{4}-\d{2}-\d{2}$/.test(editValue)) {
            updatedTask.endDate = new Date(editValue);
          }
          break;
        case "priority":
          if (
            ["HÖCHST", "HOCH", "MITTEL", "NIEDRIG"].includes(
              editValue.toUpperCase()
            )
          ) {
            updatedTask.priority = editValue.toUpperCase() as TaskPriority;
          }
          break;
        case "status":
          if (
            ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"].includes(
              editValue.toUpperCase()
            )
          ) {
            updatedTask.status = editValue.toUpperCase() as TaskStatus;
          }
          break;
      }

      const newTasks = [...localTasks];
      newTasks[taskIndex] = updatedTask;
      setLocalTasks(newTasks);

      // No auto-save - user must click the + button to confirm
    } else {
      // Update existing task
      const updates: Partial<ProjectTask> = {};

      switch (editingCell.field) {
        case "taskId":
          updates.taskId = editValue;
          break;
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localTasks.findIndex((task) => task.id === active.id);
      const newIndex = localTasks.findIndex((task) => task.id === over.id);

      const newTasks = arrayMove(localTasks, oldIndex, newIndex);

      // Update IDs for tasks with same start date when reordered
      const updatedTasks = newTasks.map((task, index) => {
        if ("isNew" in task && task.isNew) return task;

        const projectTask = task as ProjectTask;

        // Only update IDs for date-based tasks that are being reordered with same-date tasks
        const dateMatch = projectTask.taskId.match(/^(\d{8})-(\d+)$/);
        if (dateMatch) {
          const [, dateStr] = dateMatch;
          const taskDate = new Date(projectTask.startDate)
            .toISOString()
            .split("T")[0]
            .replace(/-/g, "");

          // If the task's date matches its ID date, check for reordering
          if (dateStr === taskDate) {
            // Find other tasks with the same date in the new order
            const sameDateTasks = newTasks
              .filter((t, i) => {
                if ("isNew" in t && t.isNew) return false;
                const pt = t as ProjectTask;
                const ptDate = new Date(pt.startDate)
                  .toISOString()
                  .split("T")[0]
                  .replace(/-/g, "");
                return (
                  ptDate === taskDate && pt.taskId.match(/^(\d{8})-(\d+)$/)
                );
              })
              .map((t, i) => ({
                task: t as ProjectTask,
                newIndex: newTasks.indexOf(t),
              }))
              .sort((a, b) => a.newIndex - b.newIndex);

            // If there are multiple tasks with the same date, reassign sequence numbers
            if (sameDateTasks.length > 1) {
              const taskPosition = sameDateTasks.findIndex(
                (item) => item.task.id === projectTask.id
              );
              if (taskPosition !== -1) {
                const newSequence = taskPosition + 1;
                return {
                  ...projectTask,
                  taskId: `${dateStr}-${newSequence.toString().padStart(2, "0")}`,
                };
              }
            }
          }
        }

        return projectTask;
      });

      setLocalTasks(updatedTasks);

      // Send reordered tasks to parent (excluding new tasks)
      const reorderedProjectTasks = updatedTasks.filter(
        (t) => !("isNew" in t)
      ) as ProjectTask[];
      onTaskReorder(reorderedProjectTasks);
    }
  };

  const handleAddTask = () => {
    const newTaskId = `new-${newTaskCounter}`;
    const newTask: NewTask = {
      id: newTaskId,
      taskId: "",
      task: "",
      responsible: "iNEST",
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      duration: 1,
      milestone: false,
      priority: "MITTEL" as TaskPriority,
      notes: "",
      status: "PENDING" as TaskStatus,
      isNew: true,
    };

    // Add new task at the beginning of the list
    setLocalTasks([newTask, ...localTasks]);
    setNewTaskCounter((prev) => prev + 1);
  };

  const handleConfirmAdd = async (newTask: NewTask) => {
    if (!newTask.task) return; // Require task name

    // Generate ID based on start date for non-milestone tasks
    const finalTaskId =
      newTask.taskId && isEditableId(newTask.taskId)
        ? newTask.taskId
        : generateTaskId(newTask.startDate, localTasks);

    const taskData = {
      taskId: finalTaskId,
      task: newTask.task,
      responsible: newTask.responsible,
      startDate: newTask.startDate,
      endDate: newTask.endDate,
      duration: Math.ceil(
        (newTask.endDate.getTime() - newTask.startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      ),
      milestone: isMilestone(finalTaskId),
      priority: newTask.priority,
      notes: newTask.notes,
      status: newTask.status,
    };

    try {
      // Add to database first
      await onTaskAdd(taskData);

      // Remove the new task from local state after successful save
      setLocalTasks((prev) => prev.filter((t) => t.id !== newTask.id));

      onSubtleUpdate?.("Task added successfully");
    } catch (error) {
      console.error("Failed to save task:", error);
      onSubtleUpdate?.("Failed to add task");
    }
  };

  if (localTasks.length === 0) {
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[28%]">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[9%]">
                  Aktion
                </th>
              </tr>
            </thead>
            <SortableContext
              items={localTasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <tbody className="bg-white divide-y divide-gray-200">
                {localTasks.map((task) => (
                  <SortableTaskRow
                    key={task.id}
                    task={task}
                    editingCell={editingCell}
                    editValue={editValue}
                    setEditValue={setEditValue}
                    handleCellClick={handleCellClick}
                    handleCellSave={handleCellSave}
                    handleKeyPress={handleKeyPress}
                    onTaskSelect={onTaskSelect}
                    onTaskDelete={onTaskDelete}
                    onConfirmAdd={handleConfirmAdd}
                    formatDateGerman={formatDateGerman}
                    getResponsibleColor={getResponsibleColor}
                    getPriorityClass={getPriorityClass}
                    getStatusClass={getStatusClass}
                    isMilestone={isMilestone}
                    isEditableId={isEditableId}
                  />
                ))}
              </tbody>
            </SortableContext>
          </table>
        </DndContext>
      </div>
    </div>
  );
}
