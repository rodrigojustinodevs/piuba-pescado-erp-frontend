export const metricCards = [
    { title: "Total de Tanques", value: "24", change: "+2 este mês", icon: "Container" as const },
    { title: "Lotes Ativos", value: "18", change: "+3 esta semana", icon: "Fish" as const },
    { title: "Temperatura Média", value: "27.4°C", change: "+0.3°C hoje", icon: "Thermometer" as const },
    { title: "Nível de Oxigênio", value: "6.8 mg/L", change: "Estável", icon: "Waves" as const },
  ];
  
  export const temperatureData = [
    { day: "Seg", temp: 26.8 },
    { day: "Ter", temp: 27.1 },
    { day: "Qua", temp: 27.5 },
    { day: "Qui", temp: 26.9 },
    { day: "Sex", temp: 27.4 },
    { day: "Sáb", temp: 27.8 },
    { day: "Dom", temp: 27.2 },
  ];
  
  export const feedConsumptionData = [
    { tanque: "T-01", consumo: 45 },
    { tanque: "T-02", consumo: 38 },
    { tanque: "T-03", consumo: 52 },
    { tanque: "T-04", consumo: 41 },
    { tanque: "T-05", consumo: 35 },
    { tanque: "T-06", consumo: 48 },
  ];
  
  export const batchStatusData = [
    { status: "Ativo", count: 12, fill: "var(--color-chart-1)" },
    { status: "Finalizado", count: 5, fill: "var(--color-chart-2)" },
    { status: "Planejado", count: 3, fill: "var(--color-chart-3)" },
  ];
  
  export const alertsData = [
    { id: 1, tanque: "T-03", tipo: "Temperatura Alta", status: "Crítico", data: "14/04/2026 08:32" },
    { id: 2, tanque: "T-07", tipo: "Oxigênio Baixo", status: "Alerta", data: "14/04/2026 07:15" },
    { id: 3, tanque: "T-01", tipo: "pH Instável", status: "Aviso", data: "13/04/2026 22:48" },
    { id: 4, tanque: "T-12", tipo: "Sensor Offline", status: "Info", data: "13/04/2026 18:00" },
    { id: 5, tanque: "T-05", tipo: "Alimentação Atrasada", status: "Aviso", data: "13/04/2026 14:30" },
  ];
  