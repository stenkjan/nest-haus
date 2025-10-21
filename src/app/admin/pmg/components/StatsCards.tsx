"use client";

import { ProjectTask } from "@prisma/client";
import Link from "next/link";

interface StatsCardsProps {
  tasks: ProjectTask[];
}

export default function StatsCards({ tasks }: StatsCardsProps) {
  const deadline = new Date("2025-11-15T23:59:59");
  const today = new Date();
  const daysRemaining = Math.ceil(
    (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const totalTasks = tasks.filter(
    (t) => t.taskId.match(/^\d/) || t.taskId === "ZIEL"
  ).length;
  const milestones = tasks.filter((t) => t.milestone).length;
  const teamMembers = [
    ...new Set(tasks.flatMap((p) => p.responsible.split(", "))),
  ].filter((r) => r !== "ALLE").length;

  const stats = [
    {
      label: "Tage bis zum Launch",
      value: daysRemaining > 0 ? daysRemaining : "LAUNCH",
      icon: "📅",
      color:
        daysRemaining <= 7
          ? "text-red-600"
          : daysRemaining <= 14
            ? "text-yellow-600"
            : "text-green-600",
    },
    {
      label: "Gesamt-Aufgaben",
      value: totalTasks,
      icon: "📋",
      color: "text-blue-600",
    },
    {
      label: "Wichtige Meilensteine",
      value: milestones,
      icon: "⭐",
      color: "text-purple-600",
    },
    {
      label: "Aktive Teammitglieder",
      value: teamMembers,
      icon: "👥",
      color: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const isMilestones = stat.label === "Wichtige Meilensteine";
        const CardContent = (
          <>
            <div className="text-3xl mr-4">{stat.icon}</div>
            <div>
              <div className="text-2xl font-bold text-black">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          </>
        );

        if (isMilestones) {
          return (
            <Link
              key={index}
              href="/admin/pmg/milestones"
              className="bg-white p-4 rounded-lg shadow-sm flex items-center hover:shadow-md hover:bg-blue-50 transition-all cursor-pointer border-2 border-transparent hover:border-blue-200"
            >
              {CardContent}
            </Link>
          );
        }

        return (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-sm flex items-center"
          >
            {CardContent}
          </div>
        );
      })}
    </div>
  );
}
