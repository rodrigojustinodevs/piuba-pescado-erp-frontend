"use client";

interface LineChartProps {
  data: Array<{
    date: string;
    value1: number;
    value2: number;
  }>;
  height?: number;
}

export function LineChart({ data, height = 200 }: LineChartProps) {
  // Placeholder para gráfico de linha
  // Em produção, usar uma biblioteca como recharts ou chart.js
  const maxValue = Math.max(
    ...data.flatMap((d) => [d.value1, d.value2]),
    1000
  );

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <svg
        viewBox={`0 0 ${data.length * 100} ${height}`}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {[0, 250, 500, 750, 1000].map((y) => (
          <line
            key={y}
            x1="0"
            y1={(height - (y / maxValue) * height).toFixed(2)}
            x2={data.length * 100}
            y2={(height - (y / maxValue) * height).toFixed(2)}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Line 1 */}
        <polyline
          points={data
            .map(
              (d, i) =>
                `${i * 100},${height - (d.value1 / maxValue) * height}`
            )
            .join(" ")}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
        />

        {/* Line 2 */}
        <polyline
          points={data
            .map(
              (d, i) =>
                `${i * 100},${height - (d.value2 / maxValue) * height}`
            )
            .join(" ")}
          fill="none"
          stroke="#6366f1"
          strokeWidth="2"
        />
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

