export const metricCards = [
    { title: "Tanques", value: "24", change: "+2 vs mês anterior" },
    { title: "Lotes ativos", value: "18", change: "+3 vs semana anterior" },
    { title: "Temperatura média", value: "27,4 °C", change: "+0,3 °C vs ontem" },
    { title: "Oxigênio dissolvido", value: "6,8 mg/L", change: "Sem variação vs ontem" },
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
    { id: 1, tanque: "T-03", tipo: "Temperatura alta", status: "Crítico", data: "14/04/2026 08:32" },
    { id: 2, tanque: "T-07", tipo: "Oxigênio baixo", status: "Alerta", data: "14/04/2026 07:15" },
    { id: 3, tanque: "T-01", tipo: "pH instável", status: "Aviso", data: "13/04/2026 22:48" },
    { id: 4, tanque: "T-12", tipo: "Sensor Offline", status: "Info", data: "13/04/2026 18:00" },
    { id: 5, tanque: "T-05", tipo: "Alimentação atrasada", status: "Aviso", data: "13/04/2026 14:30" },
  ];
  