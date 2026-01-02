"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTankSchema, type CreateTankFormData } from "../schemas";
import type { Tank } from "../types";
import { useCompanies } from "@/features/company";
import { useTankTypes } from "../hooks/useTankTypes";
import {
  TextInput,
  NumberInput,
  Select,
} from "@/shared/components/form";

interface TankFormProps {
  initialData?: Tank;
  onSubmit: (data: CreateTankFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function TankForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = "Salvar",
}: TankFormProps) {
  const { data: companiesData } = useCompanies({ limit: 1000 });
  const companies = companiesData?.companies || [];
  const { data: tankTypes = [], isLoading: isLoadingTypes } = useTankTypes();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createTankSchema),
    defaultValues: initialData
      ? {
          companyId: initialData.companyId,
          tankTypeId: initialData.tankTypeId,
          name: initialData.name,
          capacityLiters: initialData.capacityLiters,
          location: initialData.location || "",
          status: initialData.status,
        }
      : {
          status: "active" as const,
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Informações Básicas */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Informações Básicas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Empresa"
            required
            options={companies.map((company) => ({
              value: String(company.id),
              label: company.name,
            }))}
            placeholder="Selecione uma empresa"
            {...register("companyId")}
            error={errors.companyId?.message}
          />

          <TextInput
            label="Nome do Tanque"
            required
            {...register("name")}
            error={errors.name?.message}
          />

          <Select
            label="Tipo de Tanque"
            required
            disabled={isLoadingTypes}
            options={tankTypes.map((type) => ({
              value: String(type.id),
              label: type.name,
            }))}
            placeholder={isLoadingTypes ? "Carregando tipos..." : "Selecione um tipo"}
            {...register("tankTypeId")}
            error={errors.tankTypeId?.message}
          />

          <NumberInput
            label="Capacidade (litros)"
            required
            step={0.01}
            min={0.01}
            error={errors.capacityLiters?.message}
            {...register("capacityLiters", { valueAsNumber: true })}
          />

          <div className="md:col-span-2">
            <TextInput
              label="Localização"
              placeholder="Ex: Setor A - Bloco 3"
              {...register("location")}
              error={errors.location?.message}
            />
          </div>

          <Select
            label="Status"
            required
            options={[
              { value: "active", label: "Ativo" },
              { value: "inactive", label: "Inativo" },
            ]}
            {...register("status")}
            error={errors.status?.message}
          />
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading && (
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          )}
          {isLoading ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}


