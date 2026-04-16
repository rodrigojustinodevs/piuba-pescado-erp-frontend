'use client';

import { useAuth } from '@/features/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/shared/components/Layout';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/shared/components/ui/Card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/components/ui/Chart";
import { 
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
 } from "recharts";


import {
  metricCards,
  temperatureData,
  feedConsumptionData,
  batchStatusData,
  alertsData,
} from "@/shared/lib/mock-data";



import { Container, Fish, Thermometer, Waves } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/shared/components/ui/Table";
import { Badge } from "@/shared/components/ui/Badge";
export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const stats = [
    { label: 'Total Sales', value: '$560K', accent: 'indigo' as const },
    { label: 'Total Profit', value: '$185K', accent: 'teal' as const },
    { label: 'Total Cost', value: '$375K', accent: 'blue' as const },
    { label: 'Revenue', value: '$742K', accent: 'teal' as const },
    { label: 'Today', value: '$4600', accent: 'teal' as const },
  ];
  const iconMap = { Container, Fish, Thermometer, Waves } as const;

  const statusColors: Record<string, string> = {
    Crítico: "bg-destructive text-destructive-foreground",
    Alerta: "bg-chart-5 text-primary-foreground",
    Aviso: "bg-chart-4 text-foreground",
    Info: "bg-secondary text-secondary-foreground",
  };
  

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
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
        name: 'Usuário Demo',
        email: 'demo@dev.com',
      }}
    >
       <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do sistema de aquicultura</p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card) => {
          const Icon = iconMap[card.icon];
          return (
            <Card key={card.title} className="rounded-2xl shadow-md transition-shadow hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <Icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{card.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Temperature Line Chart */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Variação de Temperatura</CardTitle>
            <CardDescription>Últimos 7 dias (°C)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ temp: { label: "Temperatura", color: "var(--color-chart-1)" } }} className="h-[250px] w-full">
              <LineChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis domain={[26, 28.5]} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent active={true} payload={[]} coordinate={undefined} accessibilityLayer={true} activeIndex={undefined} />} />
                <Line type="monotone" dataKey="temp" stroke="var(--color-chart-1)" strokeWidth={2} dot={{ fill: "var(--color-chart-1)", r: 4 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Feed Consumption Bar Chart */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Consumo de Ração</CardTitle>
            <CardDescription>kg por tanque</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ consumo: { label: "Consumo (kg)", color: "var(--color-chart-2)" } }} className="h-[250px] w-full">
              <BarChart data={feedConsumptionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="tanque" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent active={true} payload={[]} coordinate={undefined} accessibilityLayer={true} activeIndex={undefined} />} />
                <Bar dataKey="consumo" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Pie Chart */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Status dos Lotes</CardTitle>
            <CardDescription>Distribuição atual</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              Ativo: { label: "Ativo", color: "var(--color-chart-1)" },
              Finalizado: { label: "Finalizado", color: "var(--color-chart-2)" },
              Planejado: { label: "Planejado", color: "var(--color-chart-3)" },
            }} className="h-[250px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent active={true} payload={[]} coordinate={undefined} accessibilityLayer={true} activeIndex={undefined} />} />
                <Pie data={batchStatusData} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>
                  {batchStatusData.map((entry) => (
                    <Cell key={entry.status} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Alerts Table */}
        <Card className="rounded-2xl shadow-md lg:col-span-2">
          <CardHeader>
            <CardTitle>Últimos Alertas</CardTitle>
            <CardDescription>Monitoramento em tempo real</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanque</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertsData.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium">{alert.tanque}</TableCell>
                    <TableCell>{alert.tipo}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[alert.status]}>
                        {alert.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{alert.data}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
    </DashboardLayout>
  );
}
