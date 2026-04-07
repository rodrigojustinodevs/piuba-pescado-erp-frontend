'use client';

import {
  FinancialCategoryForm,
  useCreateFinancialCategory,
} from '@/features/financialCategory';
import type { CreateFinancialCategoryData } from '@/features/financialCategory/types';
import { DashboardLayout } from '@/shared/components/Layout';

export default function FinancialCategoryCreatePage() {
  const createCategory = useCreateFinancialCategory();

  const onSubmit = (data: CreateFinancialCategoryData) => {
    createCategory.mutate(data);
  };

  return (
    <DashboardLayout>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <div className="mb-6">
          <p className="text-sm text-slate-600">Dashboard / Categorias financeiras / Nova</p>
          <div className="mt-3">
            <h1 className="text-3xl font-bold text-[#0F172A]">Nova categoria financeira</h1>
            <p className="text-sm text-slate-600">
              Cadastre uma categoria de receita, despesa ou investimento
            </p>
          </div>
        </div>

        <FinancialCategoryForm
          onSubmit={onSubmit}
          isSubmitting={createCategory.isPending}
          submitLabel="Cadastrar categoria"
          submittingLabel="Cadastrando..."
        />
      </div>
    </DashboardLayout>
  );
}
