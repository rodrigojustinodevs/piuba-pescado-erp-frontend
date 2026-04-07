'use client';

import type { ReactNode } from 'react';
import type { FinancialCategory } from '../types';
import { displayFinancialCategoryStatus, displayFinancialCategoryType } from '../utils/labels';
import { BanIcon, SpinnerIcon } from '@/shared/components/Table';
import {
  DetailPageHero,
  EntityDetailMetricsBody,
  EntityDetailShell,
} from '@/shared/components/entityDetail';
import { OrdersIcon } from '@/shared/components/Sidebar/menuIcons';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';

type FinancialCategoryDetailViewProps = {
  category: FinancialCategory;
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
  onActivate?: (id: string, label: string) => void;
  isActivating?: boolean;
  onDeactivate?: (id: string, label: string) => void;
  isDeactivating?: boolean;
};

export function FinancialCategoryDetailView({
  category,
  onDelete,
  isDeleting = false,
  onActivate,
  isActivating = false,
  onDeactivate,
  isDeactivating = false,
}: Readonly<FinancialCategoryDetailViewProps>) {
  const titleLabel = category.name || 'Categoria financeira';

  const metricCards = [
    { label: 'Nome', value: category.name || '—' },
    { label: 'Empresa', value: category.companyName || '—' },
    { label: 'Tipo', value: displayFinancialCategoryType(category) },
    { label: 'Status', value: displayFinancialCategoryStatus(category) },
  ];

  const infoItems = [
    {
      label: 'CRIADO EM',
      value: formatNullableDatePtBR(category.createdAt, true),
    },
    {
      label: 'ATUALIZADO EM',
      value: formatNullableDatePtBR(category.updatedAt, true),
    },
  ];

  const isActive = category.status?.toLowerCase?.() === 'active';

  /**
   * 🔥 Refatoração: extraído do ternário aninhado
   */
  function renderExtraActions(): ReactNode {
    if (isActive) {
      if (!onDeactivate) return null;

      return (
        <button
          type="button"
          onClick={() => onDeactivate(category.id, titleLabel)}
          disabled={isDeactivating}
          className="flex items-center gap-2 rounded-lg border border-amber-200 bg-white px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeactivating ? (
            <SpinnerIcon className="h-4 w-4 animate-spin" />
          ) : (
            <BanIcon className="h-4 w-4" />
          )}
          Inativar
        </button>
      );
    }

    if (!onActivate) return null;

    return (
      <button
        type="button"
        onClick={() => onActivate(category.id, titleLabel)}
        disabled={isActivating}
        className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isActivating ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : null}
        Ativar
      </button>
    );
  }

  const extraActions = renderExtraActions();

  return (
    <EntityDetailShell breadcrumb={<>Dashboard / Categorias financeiras / {titleLabel}</>}>
      <DetailPageHero
        icon={<OrdersIcon />}
        title={titleLabel}
        subtitle={
          <>
            {displayFinancialCategoryType(category)} · {displayFinancialCategoryStatus(category)}
            {category.companyName ? ` · ${category.companyName}` : null}
          </>
        }
        editHref={`/company/financial-categories/${category.id}/edit`}
        onDeleteClick={onDelete ? () => onDelete(category.id, titleLabel) : undefined}
        isDeleting={isDeleting}
        extraActions={extraActions}
      />

      <EntityDetailMetricsBody
        metricCards={metricCards}
        infoSectionTitle="Detalhes"
        infoItems={infoItems}
      />
    </EntityDetailShell>
  );
}
