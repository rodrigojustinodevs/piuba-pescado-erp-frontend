"use client";

import { useState } from "react";
import { useCreateCompany } from "@/features/company";
import { CompanyForm } from "@/features/company/components";
import { DashboardLayout } from "@/shared/components/Layout";
import type { CreateCompanyFormData } from "@/features/company";

export default function NewCompanyPage() {
  const createCompany = useCreateCompany();
  const steps = [
    { title: "Empresa", description: "Empresa", icon: "building" },
    { title: "Contato", description: "Empresa", icon: "mail" },
    { title: "Localização", description: "Localização", icon: "pin" },
    { title: "Confirmação", description: "", icon: "check" },
  ];
  const [currentStep, setCurrentStep] = useState(1);
  const formTotalSteps = 3;

  const handleSubmit = (data: CreateCompanyFormData) => {
    createCompany.mutate(data);
  };

  return (
    <DashboardLayout
      user={{
        name: "Usuário Demo",
        email: "demo@dev.com",
      }}
    >
      <div className="rounded-2xl bg-[#F8FAFC] p-4 lg:p-6">
      <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-[#0F172A]">
              Nova Unidade Aquícola
            </h1>
            <p className="text-sm text-slate-600">
              Configure a base da sua produção de peixes ou camarões
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
            <div className="space-y-4">
              <div className="space-y-3">
                {steps.map((step, index) => {
                  const stepNumber = index + 1;
                  const isActive = stepNumber === currentStep;
                  const isCompleted = stepNumber < currentStep;
                  const isLast = stepNumber === steps.length;
                  const cardClasses = isActive
                    ? "border-[#0EA5A4]/30 bg-white shadow-sm"
                    : "border-slate-200 bg-white";

                  return (
                    <div key={step.title} className="relative">
                      {!isLast && (
                        <div className="absolute left-8 top-14 h-8 w-px bg-[#0EA5A4]/40" />
                      )}
                      <div
                        className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${cardClasses}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                              isCompleted || isActive
                                ? "bg-[#0EA5A4] text-white"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {step.icon === "building" && (
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 21V5a2 2 0 012-2h6a2 2 0 012 2v16M4 21h16M10 9h2M10 13h2M10 17h2M14 21V7a2 2 0 012-2h2a2 2 0 012 2v14"
                                />
                              </svg>
                            )}
                            {step.icon === "mail" && (
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 7l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                            )}
                            {step.icon === "pin" && (
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 11a3 3 0 100-6 3 3 0 000 6z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 21s-6-5.373-6-10a6 6 0 1112 0c0 4.627-6 10-6 10z"
                                />
                              </svg>
                            )}
                            {step.icon === "check" && (
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#0F172A]">
                              {stepNumber}. {step.title}
                            </p>
                            {step.description && (
                              <p className="text-xs text-slate-400">
                                {step.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <svg
                          className="h-4 w-4 text-slate-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-transparent bg-gradient-to-br from-[#E6FFFB] via-[#D1FAF8] to-[#F0FDFE] p-4 shadow-sm">
                <div className="flex items-center justify-between">
        <div>
                    <p className="text-sm font-semibold text-[#0F172A]">
                      Próximo: Cadastrar Tanques
                    </p>
                    <p className="text-xs text-slate-500">
                      Prepare os tanques e configure os sensores
                    </p>
                  </div>
                  <svg
                    className="h-5 w-5 text-[#0EA5A4]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
        </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <CompanyForm
            onSubmit={handleSubmit}
            isLoading={createCompany.isPending}
                submitLabel="Salvar e continuar →"
                currentStep={currentStep}
                onStepChange={setCurrentStep}
                totalSteps={formTotalSteps}
          />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

