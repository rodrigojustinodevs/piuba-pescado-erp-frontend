"use client";

interface BarChartProps {
  data: Array<{
    date: string;
    value: number;
  }>;
  height?: number;
}

export function BarChart({ data, height = 200 }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1000);
  const barWidth = 60;
  const spacing = 20;

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <svg
        viewBox={`0 0 ${data.length * (barWidth + spacing)} ${height}`}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {data.map((d, i) => {
          const barHeight = (d.value / maxValue) * height;
          const x = i * (barWidth + spacing);
          const y = height - barHeight;
          const isEven = i % 2 === 0;

          return (
            <rect
              key={d.date}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={isEven ? "#93c5fd" : "#6366f1"}
              rx="4"
            />
          );
        })}
      </svg>
      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {data.map((d) => (
          <span key={d.date}>{d.date}</span>
        ))}
      </div>
    </div>
  );
}

