"use client";

import { Card } from "@/shared/components/Cards";
import { DonutChart } from "@/shared/components/Charts";

const audiencesData = [
  {
    label: "New",
    value: 8,
    change: "8%",
    isPositive: true,
    color: "#6366f1",
  },
  {
    label: "Subscribed",
    value: 60,
    change: "2%",
    isPositive: true,
    color: "#93c5fd",
  },
];

export function AudiencesCard() {
  return (
    <Card title="Audiences">
      <DonutChart percentage={68} data={audiencesData} />
    </Card>
  );
}

