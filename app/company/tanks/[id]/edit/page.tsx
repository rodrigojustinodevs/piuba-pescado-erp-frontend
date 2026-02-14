"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTank, useUpdateTank } from "@/features/tank";
import type { CreateTankFormData } from "@/features/tank";
import { createTankSchema } from "@/features/tank/schemas";
import { useCompanies } from "@/features/company";
import { useTankTypes } from "@/features/tank/hooks/useTankTypes";
import { useAuthContext } from "@/shared/contexts/AuthContext";
import { Input, PageHeader, Select } from "@/shared/components/ui";

import { DemoDashboardLayout } from "@/app/_components/DemoDashboardLayout";
import { LoadingState, NotFoundState } from "@/app/_components/PageStates";
import { PhotoPlaceholderIcon, SpinnerIcon, TankDocumentIcon } from "@/app/_components/AppIcons";

export default function EditTankPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: tank, isLoading } = useTank(id);
  const updateTank = useUpdateTank();
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
    reset,
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
    if (tank) {
      reset({
        companyId: tank.companyId,
        tankTypeId: tank.tankTypeId,
        name: tank.name,
        capacityLiters: tank.capacityLiters,
        location: tank.location || "",
        status: tank.status,
      });
    }
  }, [tank, reset]);

  useEffect(() => {
    if (!isMaster() && user?.companyId && tank) {
      setValue("companyId", user.companyId, { shouldValidate: false });
    }
  }, [isMaster, setValue, user?.companyId, tank]);

  const onSubmit = (data: CreateTankFormData) => {
    // UI de fotos (não enviado no payload por enquanto)
    updateTank.mutate({ ...data, id });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!tank) {
    return <NotFoundState message="Tanque não encontrado." />;
  }

  return (
    <DemoDashboardLayout>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <PageHeader
          breadcrumb="Dashboard / Tanques / Editar"
          title="Tanque"
          subtitle="Atualize as informações do tanque para monitoramento aquícola"
          icon={<TankDocumentIcon className="h-6 w-6 text-[#0EA5A4]" />}
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
                        disabled={updateTank.isPending}
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
                  disabled={updateTank.isPending}
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
                      disabled={updateTank.isPending || isLoadingTypes}
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
                  disabled={updateTank.isPending}
                  {...register("capacityLiters", { valueAsNumber: true })}
                  error={errors.capacityLiters?.message}
                />

                <div className="md:col-span-2">
                  <Input
                    label="Localização"
                    placeholder="Ex: Setor A - Bloco 3"
                    disabled={updateTank.isPending}
                    {...register("location")}
                    error={errors.location?.message}
                  />
                </div>

                <div className="md:col-span-2">
                  <Select
                    label="Status"
                    requiredIndicator
                    placeholder="Selecione um status"
                    disabled={updateTank.isPending}
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
                          disabled={updateTank.isPending}
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
                            <PhotoPlaceholderIcon className="h-5 w-5" />
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
                  disabled={updateTank.isPending}
                  className="flex items-center gap-2 rounded-lg bg-[#0EA5A4] px-4 py-2 text-sm font-medium text-white hover:bg-[#0F766E] shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updateTank.isPending && (
                    <SpinnerIcon className="h-4 w-4 animate-spin" />
                  )}
                  {updateTank.isPending ? "Atualizando..." : "Atualizar Tanque"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DemoDashboardLayout>
  );
}

