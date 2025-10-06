"use client";

import { useEffect, useRef } from "react";
import { ProjectTask } from "@prisma/client";
import type { Chart } from "chart.js";

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

export default function GanttChart({ tasks, onTaskClick }: GanttChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const loadChartJS = async () => {
      // Dynamically import Chart.js to avoid SSR issues
      const { Chart, registerables } = await import("chart.js");
      await import("chartjs-adapter-date-fns");

      Chart.register(...registerables);

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
                    const label = this.getLabelForValue(value);
                    return label.length > 35
                      ? label.substring(0, 32) + "..."
                      : label;
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
                  title: function (context: Array<{ label: string }>) {
                    return context[0].label;
                  },
                  label: function (context: { raw: [Date, Date] }) {
                    const dataPoint = context.raw;
                    const start = new Date(dataPoint[0]).toLocaleDateString(
                      "de-DE"
                    );
                    const end = new Date(
                      dataPoint[1] - 24 * 60 * 60 * 1000
                    ).toLocaleDateString("de-DE");
                    return `Zeitraum: ${start} - ${end}`;
                  },
                },
              },
            },
            onClick: (_event: Event, elements: Array<{ index: number }>) => {
              if (elements.length > 0) {
                const elementIndex = elements[0].index;
                const task = tasks[elementIndex];
                if (task) {
                  onTaskClick(task);
                }
              }
            },
          },
        });
      }
    };

    loadChartJS();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [tasks, onTaskClick]);

  return (
    <div className="chart-container relative w-full h-96 lg:h-[60vh] max-h-[800px]">
      <canvas ref={canvasRef} />
    </div>
  );
}
