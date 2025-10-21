"use client";

import { useEffect, useRef } from "react";
import { ProjectTask } from "@prisma/client";
import type { Chart } from "chart.js";
import { useRouter } from "next/navigation";

interface GanttChartProps {
  tasks: ProjectTask[];
  onTaskClick: (task: ProjectTask) => void;
}

// Color constants moved outside component to avoid dependency issues
const responsibleColors: Record<string, string> = {
  JST: "rgba(59, 130, 246, 0.7)",
  JWS: "rgba(16, 185, 129, 0.7)",
  iNEST: "rgba(239, 68, 68, 0.7)",
  "JWS, JST": "rgba(249, 115, 22, 0.7)",
  "iNEST, JWS": "rgba(139, 92, 246, 0.7)",
  ALLE: "rgba(107, 114, 128, 0.7)",
};

const responsibleBorderColors: Record<string, string> = {
  JST: "rgba(59, 130, 246, 1)",
  JWS: "rgba(16, 185, 129, 1)",
  iNEST: "rgba(239, 68, 68, 1)",
  "JWS, JST": "rgba(249, 115, 22, 1)",
  "iNEST, JWS": "rgba(139, 92, 246, 1)",
  ALLE: "rgba(107, 114, 128, 1)",
};

// Helper function to detect true milestones (M, P, ZIEL, #.)
const isMilestone = (taskId: string): boolean => {
  return /^([Mm]\d+|[Pp]\d+|[Mm]x|[Pp]x|\d+\.|ZIEL)$/.test(taskId);
};

export default function GanttChart({ tasks, onTaskClick }: GanttChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadChartJS = async () => {
      try {
        // Dynamically import Chart.js to avoid SSR issues
        const ChartModule = await import("chart.js");
        const { Chart, registerables } = ChartModule;

        await import("chartjs-adapter-date-fns");

        if (registerables) {
          Chart.register(...registerables);
        }

        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          if (!ctx) return;

          // Destroy existing chart
          if (chartRef.current) {
            chartRef.current.destroy();
          }

          const chartData = tasks.map((task) => ({
            x: [
              new Date(task.startDate),
              new Date(new Date(task.endDate).getTime() + 24 * 60 * 60 * 1000),
            ],
            y: `${task.taskId}: ${task.task}`,
            responsible: task.responsible,
            taskId: task.taskId,
            task: task,
          }));

          chartRef.current = new Chart(ctx, {
            type: "bar",
            data: {
              labels: chartData.map((d) => d.y),
              datasets: [
                {
                  label: "Aufgaben-Dauer",
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  data: chartData.map((d) => d.x) as any,
                  backgroundColor: chartData.map((d) => {
                    const mainResponsible = d.responsible.split(", ")[0];
                    return (
                      responsibleColors[mainResponsible] ||
                      responsibleColors["ALLE"]
                    );
                  }),
                  borderColor: chartData.map((d) => {
                    const mainResponsible = d.responsible.split(", ")[0];
                    return (
                      responsibleBorderColors[mainResponsible] ||
                      responsibleBorderColors["ALLE"]
                    );
                  }),
                  borderWidth: 1,
                  barPercentage: 0.6,
                  categoryPercentage: 0.8,
                  borderSkipped: false,
                },
              ],
            },
            options: {
              indexAxis: "y",
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  type: "time",
                  time: {
                    unit: "week",
                    tooltipFormat: "dd.MM.yyyy",
                  },
                  min: "2025-10-06",
                  max: "2025-11-16",
                  position: "top",
                  grid: {
                    color: "rgba(0,0,0,0.05)",
                  },
                },
                y: {
                  ticks: {
                    autoSkip: false,
                    callback: function (value: string | number) {
                      const label = this.getLabelForValue(value as number);

                      // Truncate long labels
                      const truncatedLabel =
                        label.length > 70
                          ? label.substring(0, 67) + "..."
                          : label;

                      return truncatedLabel;
                    },
                    font: function (context) {
                      const taskIndex = context.index;
                      const task = tasks[taskIndex];
                      // Only make milestone IDs bold (M, P, ZIEL, #.)
                      const shouldBeBold = task && isMilestone(task.taskId);
                      return {
                        weight: shouldBeBold ? "bold" : "normal",
                        size: 12,
                      };
                    },
                    color: function (context) {
                      const taskIndex = context.index;
                      const task = tasks[taskIndex];
                      // Make milestone labels more prominent
                      const shouldBeBold = task && isMilestone(task.taskId);
                      return shouldBeBold ? "#1e40af" : "#1f2937";
                    },
                  },
                  grid: {
                    display: false,
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    title: function (context: any) {
                      return context[0].label;
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    label: function (context: any) {
                      const dataPoint = context.raw;
                      const start = new Date(dataPoint[0]).toLocaleDateString(
                        "de-DE"
                      );
                      const end = new Date(
                        dataPoint[1] - 24 * 60 * 60 * 1000
                      ).toLocaleDateString("de-DE");
                      return `Zeitraum: ${start} - ${end}`;
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    afterLabel: function (context: any) {
                      const taskIndex = context.dataIndex;
                      const task = tasks[taskIndex];

                      if (task?.milestone && task.notes) {
                        return [
                          "",
                          "📝 Notizen:",
                          ...task.notes.split("\n").slice(0, 3), // Show first 3 lines
                          task.notes.split("\n").length > 3 ? "..." : "",
                        ];
                      }

                      if (task?.milestone) {
                        return ["", "⭐ Meilenstein - Klicken für Details"];
                      }

                      return [];
                    },
                  },
                  boxPadding: 8,
                  padding: 12,
                },
              },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick: (_event: any, elements: any[]) => {
                if (elements.length > 0) {
                  const elementIndex = elements[0].index;
                  const task = tasks[elementIndex];
                  if (task) {
                    // If it's a milestone, navigate to milestones page
                    if (task.milestone) {
                      router.push("/admin/pmg/milestones");
                    } else {
                      // For regular tasks, use the existing click handler
                      onTaskClick(task);
                    }
                  }
                }
              },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onHover: (event: any, elements: any[]) => {
                if (elements.length > 0) {
                  const elementIndex = elements[0].index;
                  const task = tasks[elementIndex];

                  // Change cursor for milestones
                  if (event.native && task?.milestone) {
                    event.native.target.style.cursor = "pointer";
                  } else if (event.native) {
                    event.native.target.style.cursor = "default";
                  }
                }
              },
            },
          });
        }
      } catch (error) {
        console.error("Error loading Chart.js:", error);
      }
    };

    loadChartJS();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [tasks, onTaskClick, router]);

  return (
    <div className="chart-container relative w-full h-[70vh] lg:h-[75vh] min-h-[600px] max-h-[1000px] overflow-x-auto">
      <canvas ref={canvasRef} />
    </div>
  );
}
