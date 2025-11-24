"use client";

import { Card } from "@/shared/components/Cards";
import { BarChart } from "@/shared/components/Charts";

const membershipData = [
  { date: "18 Jul", value: 600 },
  { date: "25 Jul", value: 700 },
  { date: "3 Aug", value: 900 },
  { date: "10 Aug", value: 750 },
  { date: "17 Aug", value: 800 },
];

export function MembershipCard() {
  return (
    <Card title="Membership">
      <BarChart data={membershipData} height={200} />
    </Card>
  );
}

