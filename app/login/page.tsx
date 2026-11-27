'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Fish, Mail, Lock } from 'lucide-react';
import { useAuth, loginSchema, type LoginFormData } from '@/features/auth';
import { ErrorMessages } from '@/shared/constants/errorMessages';
import { EmailInput, PasswordInput } from '@/shared/components/form';
import { Button } from '@/shared/components/ui/Button';
import { Alert, AlertDescription } from '@/shared/components/ui/Alert';

/** Chegou aqui porque a sessão acabou (senha trocada, refresh recusado ou janela vencida). */
function SessionEndedNotice() {
  const reason = useSearchParams().get('reason');
  if (reason !== 'session_ended') return null;
  return (
    <Alert className="mb-5">
      <AlertDescription>{ErrorMessages.SESSION_ENDED}</AlertDescription>
    </Alert>
  );
}

function LoginHero() {
  return (
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-[oklch(0.14_0.03_200)] via-[oklch(0.18_0.045_200)] to-[oklch(0.24_0.06_190)] p-12 md:flex">
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[oklch(0.55_0.15_190)] opacity-20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Fish className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p translate="no" className="text-base font-bold leading-tight text-white">
            Piúba Pescado
          </p>
          <p className="text-xs leading-tight text-white/60">Aquicultura Inteligente</p>
        </div>
      </div>

      <div className="relative">
        <p className="text-balance text-3xl font-bold leading-tight text-white md:text-4xl">
          Gestão completa da sua fazenda aquícola em um só lugar.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-white/70">
          Monitore viveiros, controle a produção, gerencie vendas e acompanhe indicadores em tempo
          real com a plataforma Piúba.
        </p>
      </div>
    </div>
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

  return (
    <main className="flex min-h-screen w-full bg-background">
      <LoginHero />

      <section className="flex w-full flex-col items-center justify-center p-6 md:w-1/2">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
          <header className="mb-6">
            <h1 className="text-balance text-xl font-bold text-gray-900">Acesse sua conta</h1>
            <p className="mt-1 text-sm text-gray-500">Entre com suas credenciais para continuar.</p>
          </header>

          <Suspense fallback={null}>
            <SessionEndedNotice />
          </Suspense>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <EmailInput
                  id="email"
                  placeholder="seu@email.com"
                  autoComplete="username"
                  spellCheck={false}
                  inputClassName="pl-10"
                  {...register('email')}
                  error={errors.email?.message}
                />
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  inputClassName="pl-10"
                  {...register('password')}
                  error={errors.password?.message}
                />
              </div>
            </div>

            {isLoginError && (
              <div
                className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100"
                role="alert"
              >
                {loginError?.message || ErrorMessages.LOGIN_CREDENTIALS}
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Autenticando…' : 'Entrar'}
            </Button>

            <p className="text-center text-sm text-gray-500">
              Não tem uma conta?{' '}
              <span className="font-medium text-primary">Fale com seu administrador</span>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
