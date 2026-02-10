"use client";

interface StatCardProps {
  label: string;
  value: string;
  accent?: "blue" | "teal" | "indigo" | "gray";
}

const accentClasses = {
  blue: "border-blue-500 text-blue-600",
  teal: "border-teal-500 text-teal-600",
  indigo: "border-indigo-500 text-indigo-600",
  gray: "border-gray-300 text-gray-500",
};

const ArrowUpRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 17L17 7M7 7h10v10"
    />
  </svg>
);

export function StatCard({ label, value, accent = "blue" }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${accentClasses[accent]}`}
      >
        <ArrowUpRightIcon />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}




