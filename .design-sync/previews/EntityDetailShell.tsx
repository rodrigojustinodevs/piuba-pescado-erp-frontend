import { EntityDetailShell } from 'piuba-pescado-erp';

export const Detalhe = () => (
  <div style={{ width: 560 }}>
    <EntityDetailShell breadcrumb="Tanques / Tanque 03">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Tanque 03</h2>
        <p className="mt-1 text-sm text-slate-600">Capacidade 25.000 L · Tilápia · Lote L-2024-11</p>
      </div>
    </EntityDetailShell>
  </div>
);
