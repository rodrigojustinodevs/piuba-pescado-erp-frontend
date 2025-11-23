"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useAuth, loginSchema, type LoginFormData } from "@/features/auth";

export default function LoginPage() {
  const { login, loginError, isLoginError, resetLoginError, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    resetLoginError();
    login(data);
  };

  return (
    <div className="flex min-h-screen">
      {/* Coluna esquerda - Login */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gradient-to-b from-blue-700 to-blue-500 p-6">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800">LOGOMARCA</h1>
            <p className="text-blue-600 font-medium">Soluções em Aquicultura</p>
            <p className="mt-2 text-sm text-gray-600">
              Acesse o <span className="font-semibold">Portal de Gestão</span>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Usuário (e-mail)"
                {...register("email")}
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="Senha"
                {...register("password")}
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring"
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {isLoginError && loginError && (
              <p className="text-sm text-red-600">
                {loginError.message || "Credenciais inválidas"}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>

            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4" />
                Manter conectado
              </label>
              <a href="#" className="text-blue-600 hover:underline">
                Recuperar Senha
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Coluna direita - Imagem ilustrativa */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-50 relative">
        <Image
          src="/frota.png" // 👉 Coloque aqui a imagem (carros, caminhão, etc.)
          alt="Frota de veículos"
          width={500}
          height={500}
          className="object-contain"
        />
      </div>

      {/* Botão do WhatsApp fixo */}
      <a
        href="https://wa.me/5599999999999" // 👉 Troque pelo número real
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 font-medium text-white shadow-lg hover:bg-green-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20.52 3.48A11.78 11.78 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.55 4.17 1.6 5.98L0 24l6.19-1.63A11.95 11.95 0 0012 24c6.63 0 12-5.37 12-12a11.78 11.78 0 00-3.48-8.52zM12 22c-1.92 0-3.77-.5-5.4-1.45l-.39-.23-3.68.97.98-3.6-.25-.37A9.94 9.94 0 012 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm5.09-7.91c-.28-.14-1.64-.81-1.9-.9-.26-.1-.45-.14-.63.14s-.72.9-.88 1.08c-.16.18-.32.2-.6.07a8.03 8.03 0 01-4.72-4.14c-.36-.62.36-.57 1.02-1.89.11-.22.05-.41-.02-.57-.07-.14-.63-1.52-.87-2.08-.23-.55-.47-.48-.63-.49-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.77.35s-1 1-1 2.43 1.02 2.82 1.16 3.01c.14.19 2.01 3.06 4.88 4.29.68.29 1.21.46 1.62.59.68.22 1.29.19 1.78.12.54-.08 1.64-.67 1.87-1.31.23-.64.23-1.19.16-1.31-.07-.12-.25-.19-.53-.33z" />
        </svg>
        Central de Atendimento
      </a>
    </div>
  );
}
