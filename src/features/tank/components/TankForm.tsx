"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTankSchema, type CreateTankFormData } from "../schemas";
import type { Tank } from "../types";
import { useCompanies } from "@/features/company";
import { useTankTypes } from "../hooks/useTankTypes";

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
          <div>
            <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-1">
              Empresa *
            </label>
            <select
              id="companyId"
              {...register("companyId")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione uma empresa</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            {errors.companyId && (
              <p className="mt-1 text-sm text-red-600">{errors.companyId.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Tanque *
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="tankTypeId" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Tanque *
            </label>
            <select
              id="tankTypeId"
              {...register("tankTypeId")}
              disabled={isLoadingTypes}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {isLoadingTypes ? "Carregando tipos..." : "Selecione um tipo"}
              </option>
              {tankTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.tankTypeId && (
              <p className="mt-1 text-sm text-red-600">{errors.tankTypeId.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="capacityLiters" className="block text-sm font-medium text-gray-700 mb-1">
              Capacidade (litros) *
            </label>
            <input
              id="capacityLiters"
              type="number"
              step="0.01"
              min="0.01"
              {...register("capacityLiters", { valueAsNumber: true })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.capacityLiters && (
              <p className="mt-1 text-sm text-red-600">{errors.capacityLiters.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Localização
            </label>
            <input
              id="location"
              type="text"
              placeholder="Ex: Setor A - Bloco 3"
              {...register("location")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              id="status"
              {...register("status")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>
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


