"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateTank } from "@/features/tank";
import { DashboardLayout } from "@/shared/components/Layout";
import type { CreateTankFormData } from "@/features/tank";
import { createTankSchema } from "@/features/tank/schemas";
import { useCompanies } from "@/features/company";
import { useTankTypes } from "@/features/tank/hooks/useTankTypes";
import { useAuthContext } from "@/shared/contexts/AuthContext";
import { Input, PageHeader, Select } from "@/shared/components/ui";

export default function NewTankPage() {
  const createTank = useCreateTank();
  const { isMaster, user } = useAuthContext();
  const { data: companiesData } = useCompanies({ limit: 1000 });
  const companies = companiesData?.companies || [];
  const { data: tankTypes = [], isLoading: isLoadingTypes } = useTankTypes();

  const [photos, setPhotos] = useState<Array<File | null>>([null, null, null, null]);
  const previews = useMemo(() => photos.map((f) => (f ? URL.createObjectURL(f) : null)), [photos]);

  useEffect(() => {
    return () => {
      previews.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<CreateTankFormData>({
    resolver: zodResolver(createTankSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      companyId: "",
      tankTypeId: "",
      name: "",
      capacityLiters: 0,
      location: "",
      status: "active" as const,
    },
  });

  useEffect(() => {
    if (!isMaster() && user?.companyId) {
      setValue("companyId", user.companyId, { shouldValidate: false });
    }
  }, [isMaster, setValue, user?.companyId]);

  const onSubmit = (data: CreateTankFormData) => {
    // UI de fotos (não enviado no payload por enquanto)
    createTank.mutate(data);
  };

  return (
    <DashboardLayout
      user={{
        name: "Usuário Demo",
        email: "demo@dev.com",
      }}
    >
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <PageHeader
          breadcrumb="Dashboard / Tanques / Novo"
          title="Tanque"
          subtitle="Cadastro de tanque para monitoramento aquícola"
          icon={
            <svg className="h-6 w-6 text-[#0EA5A4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7h18M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2M6 7v14a2 2 0 002 2h8a2 2 0 002-2V7"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 11h6M9 15h6"
              />
            </svg>
          }
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
            {/* Form */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-base font-semibold text-[#0F172A]">Informações do Tanque</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Informe os dados estruturais do tanque para monitoramento IoT.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isMaster() ? (
                  <Controller
                    name="companyId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Empresa"
                        requiredIndicator
                        placeholder="Selecione uma empresa"
                        options={companies.map((company) => ({
                          value: String(company.id),
                          label: company.name,
                        }))}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        disabled={createTank.isPending}
                        error={errors.companyId?.message}
                      />
                    )}
                  />
                ) : (
                  <input type="hidden" {...register("companyId")} />
                )}

                <Input
                  label="Nome do tanque"
                  requiredIndicator
                  placeholder="Nome do Tanque"
                  disabled={createTank.isPending}
                  {...register("name")}
                  error={errors.name?.message}
                />

                <Controller
                  name="tankTypeId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Tipo de tanque"
                      requiredIndicator
                      placeholder={isLoadingTypes ? "Carregando tipos..." : "Selecione um tipo"}
                      options={tankTypes.map((type) => ({
                        value: String(type.id),
                        label: type.name,
                      }))}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      disabled={createTank.isPending || isLoadingTypes}
                      error={errors.tankTypeId?.message}
                    />
                  )}
                />

                <Input
                  label="Capacidade (litros)"
                  requiredIndicator
                  type="number"
                  step={0.01}
                  min={0.01}
                  disabled={createTank.isPending}
                  {...register("capacityLiters", { valueAsNumber: true })}
                  error={errors.capacityLiters?.message}
                />

                <div className="md:col-span-2">
                  <Input
                    label="Localização"
                    placeholder="Ex: Setor A - Bloco 3"
                    disabled={createTank.isPending}
                    {...register("location")}
                    error={errors.location?.message}
                  />
                </div>

                <div className="md:col-span-2">
                  <Select
                    label="Status"
                    requiredIndicator
                    placeholder="Selecione um status"
                    disabled={createTank.isPending}
                    options={[
                      { value: "active", label: "Ativo" },
                      { value: "inactive", label: "Inativo" },
                    ]}
                    {...register("status")}
                    error={errors.status?.message}
                  />
                </div>
              </div>
            </div>

            {/* Imagens + CTA */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-base font-semibold text-[#0F172A]">Imagens Tanque</h3>
                <p className="mt-1 text-xs text-slate-500">
                  <span className="text-[#0EA5A4]">Note:</span> upload photos using JPEG, PNG, or JPG (Max size 2mb)
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => {
                    const file = photos[i];
                    const preview = previews[i];

                    return (
                      <label
                        key={i}
                        className="group relative flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#0EA5A4]/40 bg-[#F8FAFC] px-3 py-4 cursor-pointer hover:bg-white transition"
                      >
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          className="hidden"
                          onChange={(e) => {
                            const next = e.target.files?.[0] ?? null;
                            setPhotos((prev) => {
                              const copy = [...prev];
                              copy[i] = next;
                              return copy;
                            });
                          }}
                          disabled={createTank.isPending}
                        />

                        {preview ? (
                          <div className="h-16 w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={preview}
                              alt={`Foto ${i + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0EA5A4]/10 text-[#0EA5A4]">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 7h18M5 7l2-3h10l2 3M5 7v13a1 1 0 001 1h12a1 1 0 001-1V7"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 11a3 3 0 100 6 3 3 0 000-6z"
                              />
                            </svg>
                          </div>
                        )}

                        <div className="text-[11px] text-slate-500 truncate w-full text-center">
                          {file ? file.name : `Photo ${i + 1}`}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={createTank.isPending}
                  className="flex items-center gap-2 rounded-lg bg-[#0EA5A4] px-4 py-2 text-sm font-medium text-white hover:bg-[#0F766E] shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {createTank.isPending && (
                    <svg
                      className="h-4 w-4 animate-spin"
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
                  {createTank.isPending ? "Criando..." : "Criar Tanque"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

