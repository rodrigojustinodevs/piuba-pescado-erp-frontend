interface MetricCardProps {
  label: string;
  value: string | number;
  change?: {
    value: string;
    isPositive: boolean;
  };
  color?: "blue" | "light-blue" | "red";
}

const colorClasses = {
  blue: "bg-blue-500",
  "light-blue": "bg-blue-300",
  red: "bg-red-500",
};

export function MetricCard({ label, value, change, color = "blue" }: MetricCardProps) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-3 h-3 rounded mt-1 flex-shrink-0 ${colorClasses[color]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          {change && (
            <span
              className={`text-sm font-medium flex items-center gap-1 ${
                change.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {change.isPositive ? (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {change.value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

