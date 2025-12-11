"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCompanySchema, type CreateCompanyFormData } from "../schemas";
import type { Company } from "../types";

interface CompanyFormProps {
  initialData?: Company;
  onSubmit: (data: CreateCompanyFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function CompanyForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = "Salvar",
}: CompanyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createCompanySchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          cnpj: initialData.cnpj,
          email: initialData.email,
          phone: initialData.phone,
          address: {
            street: initialData.address.street,
            number: initialData.address.number,
            complement: initialData.address.complement,
            neighborhood: initialData.address.neighborhood,
            city: initialData.address.city,
            state: initialData.address.state,
            zipCode: initialData.address.zipCode,
          },
          active: initialData.active,
        }
      : {
          active: true,
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Informações Básicas */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Informações Básicas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Empresa *
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
            <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">
              CNPJ *
            </label>
            <input
              id="cnpj"
              type="text"
              placeholder="00.000.000/0000-00"
              {...register("cnpj")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.cnpj && (
              <p className="mt-1 text-sm text-red-600">{errors.cnpj.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail *
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefone *
            </label>
            <input
              id="phone"
              type="text"
              placeholder="(00) 00000-0000"
              {...register("phone")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Endereço</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
              Rua *
            </label>
            <input
              id="street"
              type="text"
              {...register("address.street")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.address?.street && (
              <p className="mt-1 text-sm text-red-600">{errors.address.street.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
              Número *
            </label>
            <input
              id="number"
              type="text"
              {...register("address.number")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.address?.number && (
              <p className="mt-1 text-sm text-red-600">{errors.address.number.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="complement" className="block text-sm font-medium text-gray-700 mb-1">
              Complemento
            </label>
            <input
              id="complement"
              type="text"
              {...register("address.complement")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
              Bairro *
            </label>
            <input
              id="neighborhood"
              type="text"
              {...register("address.neighborhood")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.address?.neighborhood && (
              <p className="mt-1 text-sm text-red-600">{errors.address.neighborhood.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              Cidade *
            </label>
            <input
              id="city"
              type="text"
              {...register("address.city")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.address?.city && (
              <p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              Estado (UF) *
            </label>
            <input
              id="state"
              type="text"
              maxLength={2}
              placeholder="SP"
              {...register("address.state")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
            />
            {errors.address?.state && (
              <p className="mt-1 text-sm text-red-600">{errors.address.state.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
              CEP *
            </label>
            <input
              id="zipCode"
              type="text"
              placeholder="00000-000"
              {...register("address.zipCode")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.address?.zipCode && (
              <p className="mt-1 text-sm text-red-600">{errors.address.zipCode.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <input
          id="active"
          type="checkbox"
          {...register("active")}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="active" className="text-sm font-medium text-gray-700">
          Empresa ativa
        </label>
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

