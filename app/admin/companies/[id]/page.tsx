"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCompany, useDeleteCompany } from "@/features/company";
import { DashboardLayout } from "@/shared/components/Layout";
import { useAlertModal } from "@/shared/components/AlertModal";

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="space-y-1">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <div className="text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

function InfoCard({ title, action, children }: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#0F172A]">{title}</h2>
        {action}
      </div>
      <div className="grid gap-4">{children}</div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function MetricCard({ label, value, icon }: MetricCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-[#0EA5A4]">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

interface AddressItemProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function AddressItem({ label, value, icon }: AddressItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-[#0EA5A4]">{icon}</div>
      <div>
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

export default function CompanyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: company, isLoading, error } = useCompany(id);
  const deleteCompany = useDeleteCompany();
  const { showError } = useAlertModal();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDelete = () => {
    if (company) {
      showError(
        "Confirmar Exclusão",
        `Tem certeza que deseja excluir a empresa "${company.name}"? Esta ação não pode ser desfeita.`,
        "Sim, Excluir",
        () => {
          deleteCompany.mutate(company.id);
        }
      );
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout
        user={{
          name: "Usuário Demo",
          email: "demo@dev.com",
        }}
      >
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <svg
              className="w-5 h-5 animate-spin"
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
            <span>Carregando...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !company) {
    return (
      <DashboardLayout
        user={{
          name: "Usuário Demo",
          email: "demo@dev.com",
        }}
      >
        <div className="text-center py-8">
          <p className="text-red-600">Empresa não encontrada.</p>
          <Link
            href="/admin/companies"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800"
          >
            Voltar para lista
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      user={{
        name: "Usuário Demo",
        email: "demo@dev.com",
      }}
    >
      <div className="rounded-2xl bg-[#F8FAFC] p-4 lg:p-6">
      <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-[#0F172A]">
                {company.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span>Unidade aquícola</span>
                <span className="text-slate-300">•</span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    company.active
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {company.active ? "Empresa ativa" : "Empresa inativa"}
                </span>
              </div>
          </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/admin/companies/${company.id}/edit`}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editar
              </Link>
              <div className="relative">
          <button
                  type="button"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className="flex items-center gap-1 rounded-lg bg-[#0EA5A4] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0F766E]"
                  aria-haspopup="menu"
                  aria-expanded={isMenuOpen}
                >
                  <span className="sr-only">Abrir menu</span>
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
          >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 12h.01M12 12h.01M18 12h.01"
                    />
                  </svg>
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
                      d="M6 9l6 6 6-6"
                />
              </svg>
          </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
            <Link
              href={`/admin/companies/${company.id}/edit`}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Editar
            </Link>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleteCompany.isPending}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                    >
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14"
                        />
                      </svg>
                      {deleteCompany.isPending ? "Excluindo..." : "Excluir"}
                    </button>
          </div>
                )}
            </div>
            </div>
            </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <MetricCard
              label="Localização"
              value={
                company.address.city && company.address.state
                  ? `${company.address.city}`
                  : "-"
              }
              icon={
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
              }
            />
            <MetricCard
              label="Tanques ativos"
              value="—"
              icon={
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
                    d="M4 7h16M4 12h16M4 17h16"
                  />
                </svg>
              }
            />
            <MetricCard
              label="Sensores online"
              value="—"
              icon={
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
                    d="M12 8v4l3 3"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4a8 8 0 100 16 8 8 0 000-16z"
                  />
                </svg>
              }
            />
            <MetricCard
              label="Atenções"
              value="—"
              icon={
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              }
            />
            </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <InfoCard title="Informações Básicas">
              <InfoItem label="Nome" value={company.name} />
              <InfoItem label="CNPJ" value={company.cnpj} />
              <InfoItem label="Contato" value={company.email || "-"} />
              <InfoItem label="Telefone" value={company.phone || "-"} />
              <InfoItem
                label="Status"
                value={
              <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  company.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                }`}
              >
                {company.active ? "Ativa" : "Inativa"}
              </span>
                }
              />
            </InfoCard>

            <InfoCard title="Endereço">
              <AddressItem
                label="Rua"
                value={
                  company.address.street && company.address.number
                    ? `${company.address.street}, ${company.address.number}`
                    : "-"
                }
                icon={
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
                }
              />
              <AddressItem
                label="Bairro"
                value={company.address.neighborhood || "-"}
                icon={
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
                      d="M3 10l9-7 9 7v10a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V10z"
                    />
                  </svg>
                }
              />
              <AddressItem
                label="Cidade/Estado"
                value={
                  company.address.city && company.address.state
                    ? `${company.address.city} • ${company.address.state}`
                    : "-"
                }
                icon={
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
                      d="M9 20l-5.447-2.724A2 2 0 013 15.382V5a1 1 0 011.447-.894L9 6.382l6-2.276 5.553 2.776A2 2 0 0121 8.618V19a1 1 0 01-1.447.894L15 17.618l-6 2.276z"
                    />
                  </svg>
                }
              />
              <AddressItem
                label="CEP"
                value={company.address.zipCode || "-"}
                icon={
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
                      d="M7 8h10M7 12h6m-6 4h10"
                    />
                  </svg>
                }
              />
            </InfoCard>
        </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="relative z-10 max-w-md space-y-4">
              <div className="flex items-center gap-2 text-[#0EA5A4]">
                <svg
                  className="h-5 w-5"
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
                <h3 className="text-base font-semibold text-[#0F172A]">
                  Próximos Passos
                </h3>
          </div>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="text-[#22C55E]">✓</span>
                  Cadastrar tanques
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#22C55E]">✓</span>
                  Conectar sensores
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#22C55E]">✓</span>
                  Configurar alertas de qualidade da água
                </li>
              </ul>
            </div>
            <Image
              src="/aquaculture-landscape.svg"
              alt="Paisagem de aquicultura"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="absolute bottom-0 right-0 h-full w-full object-cover opacity-60"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

