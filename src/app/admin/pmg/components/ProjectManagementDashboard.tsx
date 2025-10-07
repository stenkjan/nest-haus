"use client";

import { useState, useEffect } from "react";
import { ProjectTask } from "@prisma/client";
import GanttChart from "./GanttChart";
import TaskFilters from "./TaskFilters";
import TaskDetails from "./TaskDetails";
import TaskList from "./TaskList";
import StatsCards from "./StatsCards";
import TeamOverview from "./TeamOverview";

export default function ProjectManagementDashboard() {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [activeResponsibleFilter, setActiveResponsibleFilter] =
    useState<string>("ALLE");
  const [activePriorityFilter, setActivePriorityFilter] =
    useState<string>("ALLE");
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      // Use hardcoded credentials for now - in production, these should be handled securely
      const credentials = btoa("admin:MAINJAJANest");

      const response = await fetch("/api/admin/pmg", {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load tasks");
      }

      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const seedDatabase = async () => {
    try {
      const credentials = btoa("admin:MAINJAJANest");

      const response = await fetch("/api/admin/pmg/seed", {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to seed database");
      }

      await loadTasks();
      showSaveMessage("Database seeded successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to seed database");
    }
  };

  const updateTask = async (taskId: string, updates: Partial<ProjectTask>) => {
    try {
      setIsUpdating(true);

      // Optimistically update local state first
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      );

      const credentials = btoa("admin:MAINJAJANest");

      const response = await fetch(`/api/admin/pmg/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
        // Revert optimistic update on error
        await loadTasks();
      }

      showSaveMessage("✓ Saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
      // Revert optimistic update on error
      await loadTasks();
    } finally {
      setIsUpdating(false);
    }
  };

  const addTask = async (
    taskData: Omit<ProjectTask, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      setIsUpdating(true);
      const credentials = btoa("admin:MAINJAJANest");

      const response = await fetch("/api/admin/pmg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const result = await response.json();

      // Add the new task to local state and sort by date
      setTasks((prev) => {
        const newTasks = [...prev, result.task];
        return newTasks.sort((a, b) => {
          const dateA = new Date(a.startDate).getTime();
          const dateB = new Date(b.startDate).getTime();
          if (dateA !== dateB) return dateA - dateB;
          // If same start date, sort by taskId
          return a.taskId.localeCompare(b.taskId);
        });
      });
      showSaveMessage("✓ Task added");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add task");
      throw err; // Re-throw so TaskList can handle it
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const credentials = btoa("admin:MAINJAJANest");

      const response = await fetch(`/api/admin/pmg?id=${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      await loadTasks();
      if (selectedTask?.id === taskId) {
        setSelectedTask(null);
      }
      showSaveMessage("Task deleted successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  const reorderTasks = async (reorderedTasks: ProjectTask[]) => {
    try {
      const credentials = btoa("admin:MAINJAJANest");

      // Update each task with its new position/taskId
      const updatePromises = reorderedTasks.map((task) =>
        fetch(`/api/admin/pmg/${task.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${credentials}`,
          },
          body: JSON.stringify({
            taskId: task.taskId,
          }),
        })
      );

      await Promise.all(updatePromises);

      // Update local state
      setTasks((prev) => {
        const newTasks = [...prev];
        reorderedTasks.forEach((reorderedTask) => {
          const index = newTasks.findIndex((t) => t.id === reorderedTask.id);
          if (index !== -1) {
            newTasks[index] = reorderedTask;
          }
        });
        return newTasks;
      });

      showSaveMessage("Tasks reordered successfully!");
    } catch (error) {
      console.error("Error reordering tasks:", error);
      setError("Failed to reorder tasks");
    }
  };

  const showSaveMessage = (message: string) => {
    setSaveMessage(message);
    setTimeout(() => setSaveMessage(""), 2000);
  };

  const handleSubtleUpdate = (message: string) => {
    showSaveMessage(message);
  };

  const getFilteredTasks = () => {
    return tasks.filter((task) => {
      const responsibleMatch =
        activeResponsibleFilter === "ALLE" ||
        task.responsible.includes(activeResponsibleFilter);
      const priorityMatch =
        activePriorityFilter === "ALLE" ||
        task.priority === activePriorityFilter;
      return responsibleMatch && priorityMatch;
    });
  };

  const getUniqueResponsibles = () => {
    const responsibles = tasks
      .flatMap((task) => task.responsible.split(", ").map((r) => r.trim()))
      .filter((r) => r && r !== "ALLE");
    return ["ALLE", ...new Set(responsibles)];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading project data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
        <button
          onClick={loadTasks}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Retry
        </button>
        <button
          onClick={seedDatabase}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Seed Database
        </button>
      </div>
    );
  }

  const filteredTasks = getFilteredTasks();

  return (
    <div
      className="container mx-auto p-4 sm:p-6 lg:p-8"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl mt-6 font-bold text-slate-800">
          Projektplan: Launch-Vorbereitung NEST-Haus
        </h1>
        <p className="text-slate-600 mt-2">
          Ziel: Website-Launch bis zum 15.11.2025, um Kunden erfolgreich zum
          Beratungsgespräch zu führen.
        </p>
      </header>

      {saveMessage && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 ${
            isUpdating
              ? "bg-blue-100 border border-blue-400 text-blue-700"
              : "bg-green-100 border border-green-400 text-green-700"
          }`}
        >
          <div className="flex items-center space-x-2">
            {isUpdating && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            )}
            <span className="text-sm">{saveMessage}</span>
          </div>
        </div>
      )}

      <StatsCards tasks={tasks} />

      <main className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="xl:grid xl:grid-cols-12 xl:gap-8">
          <div className="xl:col-span-9 2xl:col-span-10">
            <h2 className="text-xl font-bold mb-4">
              Projekt-Zeitstrahl (Gantt-Diagramm)
            </h2>
            <GanttChart tasks={filteredTasks} onTaskClick={setSelectedTask} />
          </div>

          <aside className="xl:col-span-3 2xl:col-span-2 mt-8 xl:mt-0">
            <div className="sticky top-8">
              <TaskFilters
                responsibles={getUniqueResponsibles()}
                priorities={["ALLE", "HÖCHST", "HOCH", "MITTEL", "NIEDRIG"]}
                activeResponsibleFilter={activeResponsibleFilter}
                activePriorityFilter={activePriorityFilter}
                onResponsibleFilterChange={setActiveResponsibleFilter}
                onPriorityFilterChange={setActivePriorityFilter}
              />

              {selectedTask && <TaskDetails task={selectedTask} />}
            </div>
          </aside>
        </div>

        <div className="mt-12">
          <TaskList
            tasks={filteredTasks}
            onTaskUpdate={updateTask}
            onTaskDelete={deleteTask}
            onTaskAdd={addTask}
            onTaskSelect={setSelectedTask}
            onTaskReorder={reorderTasks}
            onSubtleUpdate={handleSubtleUpdate}
          />
        </div>
      </main>

      <TeamOverview tasks={tasks} />
    </div>
  );
}
