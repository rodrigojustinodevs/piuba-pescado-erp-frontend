'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useAuth, loginSchema, type LoginFormData } from '@/features/auth';
import { EmailInput, PasswordInput } from '@/shared/components/form';

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M20.52 3.48A11.78 11.78 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.55 4.17 1.6 5.98L0 24l6.19-1.63A11.95 11.95 0 0012 24c6.63 0 12-5.37 12-12a11.78 11.78 0 00-3.48-8.52zM12 22c-1.92 0-3.77-.5-5.4-1.45l-.39-.23-3.68.97.98-3.6-.25-.37A9.94 9.94 0 012 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm5.09-7.91c-.28-.14-1.64-.81-1.9-.9-.26-.1-.45-.14-.63.14s-.72.9-.88 1.08c-.16.18-.32.2-.6.07a8.03 8.03 0 01-4.72-4.14c-.36-.62.36-.57 1.02-1.89.11-.22.05-.41-.02-.57-.07-.14-.63-1.52-.87-2.08-.23-.55-.47-.48-.63-.49-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.77.35s-1 1-1 2.43 1.02 2.82 1.16 3.01c.14.19 2.01 3.06 4.88 4.29.68.29 1.21.46 1.62.59.68.22 1.29.19 1.78.12.54-.08 1.64-.67 1.87-1.31.23-.64.23-1.19.16-1.31-.07-.12-.25-.19-.53-.33z" />
  </svg>
);

function LoginHero() {
  return (
    <div className="hidden relative w-1/2 items-center justify-center bg-gray-50 md:flex">
      <Image
        src="/frota.png"
        alt="Ilustração da frota de veículos da empresa"
        width={500}
        height={500}
        className="object-contain p-8"
        priority
      />
    </div>
  );
}

function WhatsAppFloatingButton() {
  return (
    <a
      href="https://wa.me/5599999999999"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 font-medium text-white shadow-lg transition-transform hover:bg-green-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
      aria-label="Entrar em contato via WhatsApp"
    >
      <WhatsAppIcon />
      <span>Central de Atendimento</span>
    </a>
  );
}

export default function LoginPage() {
  const { login, loginError, isLoginError, resetLoginError, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    resetLoginError();
    login(data);
  };

  const handleRecoverPassword = () => {
    console.log('Abrir modal de recuperação');
  };

  return (
    <main className="flex min-h-screen w-full">
      <section className="flex w-full flex-col items-center justify-center bg-gradient-to-b from-blue-700 to-blue-500 p-6 md:w-1/2">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
          <header className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800">LOGOMARCA</h1>
            <p className="text-blue-600 font-medium">Soluções em Aquicultura</p>
            <p className="mt-2 text-sm text-gray-600">
              Acesse o <span className="font-semibold">Portal de Gestão</span>
            </p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <EmailInput
              id="email"
              label="E-mail"
              placeholder="Usuário (e-mail)"
              {...register('email')}
              error={errors.email?.message}
            />

            <PasswordInput
              id="password"
              label="Senha"
              placeholder="Senha"
              {...register('password')}
              error={errors.password?.message}
            />

            {isLoginError && (
              <div
                className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100"
                role="alert"
              >
                {loginError?.message || 'Credenciais inválidas. Tente novamente.'}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? 'Autenticando...' : 'Entrar'}
            </button>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex cursor-pointer items-center gap-2 select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Manter conectado</span>
              </label>

              <button
                type="button"
                onClick={handleRecoverPassword}
                className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
              >
                Recuperar Senha
              </button>
            </div>
          </form>
        </div>
      </section>

      <LoginHero />

      <WhatsAppFloatingButton />
    </main>
  );
}
