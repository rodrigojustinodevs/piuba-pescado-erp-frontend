"use client";

import { Card, MetricCard } from "@/shared/components/Cards";
import { LineChart } from "@/shared/components/Charts";

const commerceData = [
  { date: "18 Jul", value1: 400, value2: 300 },
  { date: "25 Jul", value1: 500, value2: 450 },
  { date: "3 Aug", value1: 600, value2: 550 },
  { date: "10 Aug", value1: 700, value2: 650 },
  { date: "17 Aug", value1: 800, value2: 750 },
  { date: "24 Aug", value1: 750, value2: 700 },
  { date: "1 Sep", value1: 600, value2: 550 },
];

export function CommerceCard() {
  return (
    <Card title="Commerce">
      <div className="space-y-6">
        <LineChart data={commerceData} height={200} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            label="Active user"
            value="16k"
            change={{ value: "32%", isPositive: true }}
            color="blue"
          />
          <MetricCard
            label="New"
            value="256"
            change={{ value: "48%", isPositive: true }}
            color="light-blue"
          />
          <MetricCard
            label="Cancelled"
            value="80"
            change={{ value: "12%", isPositive: false }}
            color="red"
          />
        </div>
      </div>
    </Card>
  );
}

