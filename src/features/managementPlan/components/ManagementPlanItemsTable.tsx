import type { ManagementPlanItem } from '../types';
import { groupItemsByCategory } from '../utils/itemGrouping';

export function ManagementPlanItemsTable({ items }: Readonly<{ items: ManagementPlanItem[] }>) {
  const groups = groupItemsByCategory(items);

  if (groups.length === 0) {
    return <p className="text-sm text-slate-500">Nenhum item cadastrado neste plano.</p>;
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.category}>
          <h3 className="text-sm font-semibold text-[#0F172A] mb-2">{group.label}</h3>
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">Dia</th>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">Descrição</th>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">Valor alvo</th>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">Unidade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {group.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 text-slate-700">{item.dayOffset}</td>
                    <td className="px-4 py-2 text-slate-700">{item.description}</td>
                    <td className="px-4 py-2 text-slate-700">{item.targetValue ?? '—'}</td>
                    <td className="px-4 py-2 text-slate-700">{item.unit ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
