"use client";

import { useState, useEffect } from "react";
import { ProjectTask } from "@prisma/client";
import GanttChart from "./GanttChart";
import TaskFilters from "./TaskFilters";
import TaskDetails from "./TaskDetails";
import TaskList from "./TaskList";
import StatsCards from "./StatsCards";

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
      const credentials = btoa("admin:MAINJAJANest");

      const response = await fetch("/api/admin/pmg", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify({ id: taskId, ...updates }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      await loadTasks();
      showSaveMessage("Task updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  const addTask = async (
    taskData: Omit<ProjectTask, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
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

      await loadTasks();
      showSaveMessage("Task added successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add task");
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

  const showSaveMessage = (message: string) => {
    setSaveMessage(message);
    setTimeout(() => setSaveMessage(""), 3000);
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
      .filter((r) => r);
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
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
          Projektplan: Launch-Vorbereitung NEST-Haus
        </h1>
        <p className="text-slate-600 mt-2">
          Ziel: Website-Launch bis zum 15.11.2025, um Kunden erfolgreich zum
          Beratungsgespräch zu führen.
          <span className="font-bold text-green-500 ml-2">
            (DATABASE CONNECTED!)
          </span>
        </p>
      </header>

      {saveMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {saveMessage}
        </div>
      )}

      <StatsCards tasks={tasks} />

      <main className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <h2 className="text-xl font-bold mb-4">
              Projekt-Zeitstrahl (Gantt-Diagramm)
            </h2>
            <GanttChart tasks={filteredTasks} onTaskClick={setSelectedTask} />
          </div>

          <aside className="lg:col-span-4 mt-8 lg:mt-0">
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
          />
        </div>
      </main>
    </div>
  );
}
