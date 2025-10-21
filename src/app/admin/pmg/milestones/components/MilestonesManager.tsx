"use client";

import { useState, useEffect } from "react";
import { ProjectTask } from "@prisma/client";
import Link from "next/link";

export default function MilestonesManager() {
  const [milestones, setMilestones] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState<string>("");
  const [saveMessage, setSaveMessage] = useState<string>("");

  useEffect(() => {
    loadMilestones();
  }, []);

  const loadMilestones = async () => {
    try {
      setLoading(true);
      const credentials = btoa("admin:MAINJAJANest");

      const response = await fetch("/api/admin/pmg", {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load milestones");
      }

      const data = await response.json();
      // Filter only milestone tasks
      const milestoneTasks = (data.tasks || []).filter(
        (task: ProjectTask) => task.milestone
      );
      setMilestones(milestoneTasks);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load milestones"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditNote = (milestone: ProjectTask) => {
    setEditingNote(milestone.id);
    setNoteContent(milestone.notes || "");
  };

  const handleSaveNote = async (milestoneId: string) => {
    try {
      const credentials = btoa("admin:MAINJAJANest");

      const response = await fetch(`/api/admin/pmg/${milestoneId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify({
          notes: noteContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save note");
      }

      // Update local state
      setMilestones((prev) =>
        prev.map((m) =>
          m.id === milestoneId ? { ...m, notes: noteContent } : m
        )
      );

      setEditingNote(null);
      showSaveMessage("✓ Notiz gespeichert");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save note");
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setNoteContent("");
  };

  const showSaveMessage = (message: string) => {
    setSaveMessage(message);
    setTimeout(() => setSaveMessage(""), 2000);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      HÖCHST: "bg-red-100 text-red-800 border-red-300",
      HOCH: "bg-orange-100 text-orange-800 border-orange-300",
      MITTEL: "bg-yellow-100 text-yellow-800 border-yellow-300",
      NIEDRIG: "bg-green-100 text-green-800 border-green-300",
    };
    return colors[priority] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      COMPLETED: "bg-green-100 text-green-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      PENDING: "bg-gray-100 text-gray-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    const labels: Record<string, string> = {
      COMPLETED: "Abgeschlossen",
      IN_PROGRESS: "In Bearbeitung",
      PENDING: "Ausstehend",
      CANCELLED: "Abgebrochen",
    };
    return { color: colors[status], label: labels[status] || status };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Lade Meilensteine...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 mt-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
        <button
          onClick={loadMilestones}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Erneut versuchen
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
              Wichtige Meilensteine
            </h1>
            <p className="text-slate-600 mt-2">
              Verwalten Sie Notizen und Details zu Projekt-Meilensteinen
            </p>
          </div>
          <Link
            href="/admin/pmg"
            className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            ← Zurück zum Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
            <div className="text-2xl font-bold text-slate-800">
              {milestones.length}
            </div>
            <div className="text-sm text-slate-600">Gesamt Meilensteine</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
            <div className="text-2xl font-bold text-green-600">
              {milestones.filter((m) => m.status === "COMPLETED").length}
            </div>
            <div className="text-sm text-slate-600">Abgeschlossen</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
            <div className="text-2xl font-bold text-blue-600">
              {milestones.filter((m) => m.status === "IN_PROGRESS").length}
            </div>
            <div className="text-sm text-slate-600">In Bearbeitung</div>
          </div>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className="fixed top-8 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300">
          <span className="text-sm">{saveMessage}</span>
        </div>
      )}

      {/* Milestones List */}
      {milestones.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-slate-600 text-lg">Keine Meilensteine gefunden.</p>
          <p className="text-slate-500 text-sm mt-2">
            Meilensteine werden automatisch aus den Aufgaben mit
            Meilenstein-Markierung geladen.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {milestones.map((milestone) => {
            const status = getStatusBadge(milestone.status);
            const isEditing = editingNote === milestone.id;

            return (
              <div
                key={milestone.id}
                className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Milestone Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono font-semibold text-slate-600 bg-white px-2 py-1 rounded border border-slate-300">
                          {milestone.taskId}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(milestone.priority)}`}
                        >
                          {milestone.priority}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-1">
                        {milestone.task}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          {milestone.responsible}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {formatDate(milestone.startDate)} -{" "}
                          {formatDate(milestone.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Notizen & Details
                    </h4>
                    {!isEditing && (
                      <button
                        onClick={() => handleEditNote(milestone)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                        Bearbeiten
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="Fügen Sie Notizen, Details oder wichtige Informationen zu diesem Meilenstein hinzu..."
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        rows={6}
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                        >
                          Abbrechen
                        </button>
                        <button
                          onClick={() => handleSaveNote(milestone.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                          Speichern
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-lg p-4 min-h-[80px]">
                      {milestone.notes ? (
                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {milestone.notes}
                        </p>
                      ) : (
                        <p className="text-slate-400 italic">
                          Noch keine Notizen vorhanden. Klicken Sie auf
                          &quot;Bearbeiten&quot; um Notizen hinzuzufügen.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
