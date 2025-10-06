"use client";

interface TaskFiltersProps {
  responsibles: string[];
  priorities: string[];
  activeResponsibleFilter: string;
  activePriorityFilter: string;
  onResponsibleFilterChange: (filter: string) => void;
  onPriorityFilterChange: (filter: string) => void;
}

export default function TaskFilters({
  responsibles,
  priorities,
  activeResponsibleFilter,
  activePriorityFilter,
  onResponsibleFilterChange,
  onPriorityFilterChange,
}: TaskFiltersProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">
        Filter nach Verantwortlichkeit
      </h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {responsibles.map((responsible) => (
          <button
            key={responsible}
            onClick={() => onResponsibleFilterChange(responsible)}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
              responsible === activeResponsibleFilter
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {responsible}
          </button>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-3">Filter nach Priorität</h3>
      <div className="flex flex-wrap gap-2">
        {priorities.map((priority) => (
          <button
            key={priority}
            onClick={() => onPriorityFilterChange(priority)}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
              priority === activePriorityFilter
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {priority}
          </button>
        ))}
      </div>
    </div>
  );
}
