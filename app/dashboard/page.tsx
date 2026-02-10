"use client";

import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardLayout } from "@/shared/components/Layout";
import {
  CommerceCard,
  MembershipCard,
  AudiencesCard,
  DashboardBanner,
  RevenueCard,
  StatCard,
} from "@/features/dashboard/components";

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const stats = [
    { label: "Total Sales", value: "$560K", accent: "indigo" as const },
    { label: "Total Profit", value: "$185K", accent: "teal" as const },
    { label: "Total Cost", value: "$375K", accent: "blue" as const },
    { label: "Revenue", value: "$742K", accent: "teal" as const },
    { label: "Today", value: "$4600", accent: "teal" as const },
  ];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout
      user={{
        name: "Usuário Demo",
        email: "demo@dev.com",
      }}
    >
      <div className="space-y-6">
        <div className="relative">
          <DashboardBanner />

          {/* Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 -mt-8 relative z-10 px-2">
            {stats.map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                accent={stat.accent}
              />
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <CommerceCard showMetrics={false} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MembershipCard />
              <AudiencesCard />
            </div>
          </div>

          <div className="space-y-6">
            <RevenueCard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}




