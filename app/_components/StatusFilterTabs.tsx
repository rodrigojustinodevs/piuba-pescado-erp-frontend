"use client";

type FilterType = "all" | "active" | "inactive";

export function StatusFilterTabs({
  filter,
  onChange,
  inactiveCount = 0,
  labels = { all: "Todas", active: "Ativos", inactive: "Inativos" },
}: {
  filter: FilterType;
  onChange: (next: FilterType) => void;
  inactiveCount?: number;
  labels?: { all: string; active: string; inactive: string };
}) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <button
        onClick={() => onChange("all")}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
          filter === "all"
            ? "bg-[#0EA5A4] text-white"
            : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
        }`}
      >
        {labels.all}
      </button>
      <button
        onClick={() => onChange("active")}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
          filter === "active"
            ? "bg-[#0EA5A4] text-white"
            : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
        }`}
      >
        {labels.active}
      </button>
      <button
        onClick={() => onChange("inactive")}
        className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
          filter === "inactive"
            ? "bg-[#0EA5A4] text-white"
            : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
        }`}
      >
        {labels.inactive}
        {inactiveCount > 0 && (
          <span
            className={`ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium ${
              filter === "inactive" ? "bg-white/20 text-white" : "bg-[#0EA5A4] text-white"
            }`}
          >
            {inactiveCount}
          </span>
        )}
      </button>
    </div>
  );
}

