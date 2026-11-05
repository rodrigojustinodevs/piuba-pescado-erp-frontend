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
  CardDescription,
} from "@/shared/components/ui/Card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/components/ui/Chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceArea,
} from "recharts";
import {
  metricCards,
  temperatureData,
  feedConsumptionData,
  batchStatusData,
  alertsData,
} from "@/shared/lib/mock-data";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/shared/components/ui/Table";

const severityDot: Record<string, string> = {
  Crítico: "bg-destructive",
  Alerta: "bg-chart-5",
  Aviso: "bg-chart-4",
  Info: "bg-muted-foreground/40",
};

const batchTone: Record<string, string> = {
  Ativo: "bg-primary",
  Finalizado: "bg-foreground/35",
  Planejado: "bg-foreground/15",
};

type TemperatureDotProps = { cx?: number; cy?: number; payload?: { day: string }; index?: number };

function renderTemperatureDot(props: TemperatureDotProps, lastDay: string | undefined) {
  if (props.payload?.day !== lastDay) return <g key={props.index} />;
  return (
    <circle key={props.index} cx={props.cx} cy={props.cy} r={5} fill="var(--color-chart-1)" stroke="var(--card)" strokeWidth={2} />
  );
}

const cardClass = "rounded-xl border border-border bg-card shadow-none";

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-muted-foreground">Carregando</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const lastDay = temperatureData.at(-1)?.day;
  const feedSorted = [...feedConsumptionData].sort((a, b) => b.consumo - a.consumo);
  const feedMax = feedSorted[0].consumo;
  const batchTotal = batchStatusData.reduce((sum, b) => sum + b.count, 0);

  return (
    <DashboardLayout
      user={{
        name: 'Usuário Demo',
        email: 'demo@dev.com',
      }}
    >
      <div className="mx-auto w-full max-w-[1600px] space-y-6 p-6 lg:p-8">
        <div>
          <h1 className="text-2xl font-medium">Visão geral</h1>
          <p className="mt-1 text-sm text-muted-foreground">Tanques, lotes e qualidade da água nos últimos 7 dias</p>
        </div>

        {/* Métricas */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metricCards.map((card) => (
            <Card key={card.title} className={cardClass}>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="mt-2 text-3xl font-medium tabular-nums">{card.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{card.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gráfico principal + ranking de ração */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className={`${cardClass} lg:col-span-2`}>
            <CardHeader className="p-5 pb-2">
              <CardTitle className="font-medium tracking-normal">Temperatura da água</CardTitle>
              <CardDescription>Média diária em °C, faixa segura de 26 a 28 °C</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-2">
              <ChartContainer config={{ temp: { label: "Temperatura", color: "var(--color-chart-1)" } }} className="h-[320px] w-full">
                <LineChart data={temperatureData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <ReferenceArea y1={26} y2={28} fill="var(--muted-foreground)" fillOpacity={0.08} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                  <YAxis domain={[25.5, 28.5]} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent active={true} payload={[]} coordinate={undefined} accessibilityLayer={true} activeIndex={undefined} />} />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    dot={(props: TemperatureDotProps) => renderTemperatureDot(props, lastDay)}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className={cardClass}>
            <CardHeader className="p-5 pb-2">
              <CardTitle className="font-medium tracking-normal">Consumo de ração</CardTitle>
              <CardDescription>kg por tanque</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-3">
              <ul className="space-y-4">
                {feedSorted.map((item, i) => (
                  <li key={item.tanque}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-mono text-muted-foreground">{item.tanque}</span>
                      <span className="tabular-nums">{item.consumo} kg</span>
                    </div>
                    <div className="mt-2 h-1 rounded-full bg-muted">
                      <div
                        className={`h-1 rounded-full ${i === 0 ? "bg-primary" : "bg-foreground/25"}`}
                        style={{ width: `${(item.consumo / feedMax) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Lotes + alertas */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className={cardClass}>
            <CardHeader className="p-5 pb-2">
              <CardTitle className="font-medium tracking-normal">Status dos lotes</CardTitle>
              <CardDescription>{batchTotal} lotes no total</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-3">
              <div className="flex h-2 gap-0.5 overflow-hidden rounded-full">
                {batchStatusData.map((b) => (
                  <div key={b.status} className={batchTone[b.status]} style={{ width: `${(b.count / batchTotal) * 100}%` }} />
                ))}
              </div>
              <ul className="mt-5 space-y-3">
                {batchStatusData.map((b) => (
                  <li key={b.status} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${batchTone[b.status]}`} />
                      {b.status}
                    </span>
                    <span className="tabular-nums text-muted-foreground">{b.count}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className={`${cardClass} lg:col-span-2`}>
            <CardHeader className="p-5 pb-2">
              <CardTitle className="font-medium tracking-normal">Últimos alertas</CardTitle>
              <CardDescription>Atualizados em tempo real</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-2">
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
                      <TableCell className="font-mono">{alert.tanque}</TableCell>
                      <TableCell>{alert.tipo}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${severityDot[alert.status]}`} />
                          {alert.status}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono tabular-nums text-muted-foreground">{alert.data}</TableCell>
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
