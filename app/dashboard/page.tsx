"use client";

import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between rounded-lg bg-white p-6 shadow">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Dashboard - Portal de Gestão
            </h1>
            <p className="text-gray-600">Bem-vindo ao sistema!</p>
          </div>
          <button
            onClick={() => logout()}
            className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
          >
            Sair
          </button>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Status da Autenticação
          </h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-gray-700">Autenticado com sucesso!</span>
            </div>
            <div className="mt-4 rounded bg-green-50 p-4">
              <p className="text-sm text-green-800">
                ✅ Você está logado e pode acessar esta área protegida.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-blue-50 p-6">
          <h3 className="mb-2 font-semibold text-blue-900">
            Informações de Teste
          </h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-blue-800">
            <li>Esta página está protegida pelo middleware</li>
            <li>O cookie de autenticação está configurado</li>
            <li>O React Query está gerenciando o estado</li>
            <li>Clique em "Sair" para testar o logout</li>
          </ul>
        </div>
      </div>
    </div>
  );
}




