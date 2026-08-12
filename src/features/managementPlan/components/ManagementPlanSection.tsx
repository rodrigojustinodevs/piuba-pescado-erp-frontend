'use client';

import { useManagementPlans } from '../hooks/useManagementPlans';
import { ManagementPlanList } from './ManagementPlanList';
import { ListLoadingState, ListErrorState } from '@/shared/components/states/ListStates';

type ManagementPlanSectionProps = {
  batchId: string;
};

export function ManagementPlanSection({ batchId }: Readonly<ManagementPlanSectionProps>) {
  const { data, isLoading, error } = useManagementPlans({ batchId });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-[#0F172A]">Plano de Manejo (IA)</h2>
        <p className="mt-1 text-sm text-slate-600">
          Arraçoamento, biometria, qualidade da água e alertas sanitários gerados por IA.
        </p>
      </div>

      {isLoading && <ListLoadingState />}
      {!!error && (
        <ListErrorState
          title="Erro ao carregar planos"
          message="Não foi possível carregar os planos de manejo deste lote. Tente novamente."
        />
      )}
      {!isLoading && !error && <ManagementPlanList plans={data?.managementPlans ?? []} />}
    </div>
  );
}
