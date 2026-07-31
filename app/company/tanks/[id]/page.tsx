'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTank, useDeleteTank } from '@/features/tank';
import { useAlertModal } from '@/shared/components/AlertModal';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { formatCapacityLiters } from '@/features/tank/utils/format';
import { DashboardLayout } from '@/shared/components/Layout';
import { demoUser } from '@/shared/constants/demoUser';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';
import { PencilIcon, TankDocumentIcon, TrashIcon } from '@/shared/components/icons/AppIcons';
import { formatDatePtBR, formatRelativeDateTimePtBR } from '@/shared/utils/dateFormat';

export default function TankDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { isMaster } = useAuthContext();
  const { data: tank, isLoading, error } = useTank(id);
  const deleteTank = useDeleteTank();
  const { showError } = useAlertModal();

  const handleDeactivate = () => {
    if (tank) {
      showError(
        'Confirmar Desativação',
        `Tem certeza que deseja desativar o tanque "${tank.name}"?`,
        'Sim, Desativar',
        () => {
          deleteTank.mutate(tank.id);
        },
      );
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout user={demoUser}>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (error || !tank) {
    return (
      <DashboardLayout user={demoUser}>
        <NotFoundState message="Tanque não encontrado." backHref="/company/tanks" />
      </DashboardLayout>
    );
  }

  const capacity = formatCapacityLiters(tank.capacityLiters);

  return (
    <DashboardLayout user={demoUser}>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        {/* Breadcrumb */}
        <p className="text-sm text-slate-600 mb-4">Dashboard / Tanques / {tank.name}</p>

        {/* Main White Card */}
        <div className=" rounded-2xl border border-slate-200 shadow-sm">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 bg-white rounded-t-2xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#16A34A]/10 border-2 border-[#16A34A]/20">
                <TankDocumentIcon className="h-8 w-8 text-[#16A34A]" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">{tank.name}</h1>
                <div className="flex items-center gap-3">
                  {isMaster() && (
                    <span className="text-sm text-[#0F172A]">Empresa: {tank.company.name}</span>
                  )}
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium ${
                      tank.status === 'active'
                        ? 'bg-[#22C55E] text-white'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {tank.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/company/tanks/${tank.id}/edit`}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#0F172A] hover:bg-slate-50 transition"
              >
                <PencilIcon className="h-4 w-4" />
                Editar
              </Link>
              <button
                onClick={handleDeactivate}
                disabled={deleteTank.isPending}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#EF4444] hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TrashIcon className="h-4 w-4" />
                Desativar
              </button>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
              <p className="text-sm text-slate-600 mb-2">Capacidade (L)</p>
              <p className="text-2xl font-semibold text-[#0F172A]">{capacity}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
              <p className="text-sm text-slate-600 mb-2">Tipo de Tanque</p>
              <p className="text-2xl font-semibold text-[#0F172A]">{tank.tankType.name}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
              <p className="text-sm text-slate-600 mb-2">Localização</p>
              <p className="text-2xl font-semibold text-[#0F172A]">{tank.location || '-'}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-sm">
              <p className="text-sm text-slate-600 mb-2">Data de criação</p>
              <p className="text-2xl font-semibold text-[#0F172A]">
                {formatDatePtBR(tank.createdAt)}
              </p>
            </div>
          </div>

          {/* Informações do Tanque Section */}
          <div className="mb-8 mr-8 ml-8 p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-1 rounded-full bg-[#16A34A]" />
              <h2 className="text-base font-semibold text-[#0F172A]">Informações do Tanque</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Coluna Esquerda */}
              <div className="space-y-4">
                {/* EMPRESA - card completo */}
                {isMaster() && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <p className="text-xs font-medium text-slate-600 uppercase mb-2">EMPRESA</p>
                    <p className="text-sm font-medium text-[#0F172A]">{tank.company.name}</p>
                  </div>
                )}
                {/* TIPO e CAPACIDADE - lado a lado */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <p className="text-xs font-medium text-slate-600 uppercase mb-2">TIPO</p>
                    <p className="text-sm font-medium text-[#0F172A]">{tank.tankType.name}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <p className="text-xs font-medium text-slate-600 uppercase mb-2">CAPACIDADE</p>
                    <p className="text-sm font-medium text-[#0F172A]">{capacity}</p>
                  </div>
                </div>
              </div>

              {/* Coluna Direita */}
              <div className="space-y-4">
                {/* LOCALIZAÇÃO - card completo */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <p className="text-xs font-medium text-slate-600 uppercase mb-2">LOCALIZAÇÃO</p>
                  <p className="text-sm font-medium text-[#0F172A]">{tank.location || '-'}</p>
                </div>
                {/* STATUS e ÚLTIMA ATUALIZAÇÃO - lado a lado */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <p className="text-xs font-medium text-slate-600 uppercase mb-2">STATUS</p>
                    <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1">
                      <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
                      <p className="text-sm font-medium text-[#0F172A]">
                        {tank.status === 'active' ? 'Ativo' : 'Inativo'}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <p className="text-xs font-medium text-slate-600 uppercase mb-2">
                      ÚLTIMA ATUALIZAÇÃO
                    </p>
                    <p className="text-sm font-medium text-[#0F172A]">
                      {formatRelativeDateTimePtBR(tank.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Monitoramento Section */}
          <div className="bg-white m-8 p-8 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-1 rounded-full bg-[#16A34A]" />
              <h2 className="text-base font-semibold text-[#0F172A]">Monitoramento</h2>
            </div>

            <div className="text-center py-12 border border-slate-200 rounded-lg p-4">
              <p className="text-sm text-slate-600">Sem sensores vinculados.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
