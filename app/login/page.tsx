'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Fish, Mail, Lock } from 'lucide-react';
import { useAuth, loginSchema, type LoginFormData } from '@/features/auth';
import { ErrorMessages } from '@/shared/constants/errorMessages';
import { EmailInput, PasswordInput, Checkbox } from '@/shared/components/form';
import { Button } from '@/shared/components/ui/Button';
import { Separator } from '@/shared/components/ui/Separator';

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.54 5.54 0 01-2.4 3.63v3.02h3.88c2.27-2.09 3.57-5.17 3.57-8.84z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3.02c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.95H1.26v3.11A12 12 0 0012 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.27 14.28A7.2 7.2 0 014.9 12c0-.79.14-1.56.37-2.28V6.61H1.26A12 12 0 000 12c0 1.94.47 3.77 1.26 5.39l4.01-3.11z"
    />
    <path
      fill="#EA4335"
      d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.26 6.61l4.01 3.11C6.22 6.88 8.87 4.77 12 4.77z"
    />
  </svg>
);

const MicrosoftIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#F25022" d="M1 1h10.5v10.5H1z" />
    <path fill="#7FBA00" d="M12.5 1H23v10.5H12.5z" />
    <path fill="#00A4EF" d="M1 12.5h10.5V23H1z" />
    <path fill="#FFB900" d="M12.5 12.5H23V23H12.5z" />
  </svg>
);

function LoginHero() {
  const stats = [
    { value: '+120', label: 'Viveiros monitorados' },
    { value: '24/7', label: 'Sensores IoT' },
    { value: '99,9%', label: 'Disponibilidade' },
  ];

  return (
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-[oklch(0.14_0.03_200)] via-[oklch(0.18_0.045_200)] to-[oklch(0.24_0.06_190)] p-12 md:flex">
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[oklch(0.55_0.15_190)] opacity-20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Fish className="h-5 w-5" />
        </div>
        <div>
          <p className="text-base font-bold leading-tight text-white">Piúba Pescado</p>
          <p className="text-xs leading-tight text-white/60">Aquicultura Inteligente</p>
        </div>
      </div>

      <div className="relative">
        <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl">
          Gestão completa da sua fazenda aquícola em um só lugar.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/70">
          Monitore viveiros, controle a produção, gerencie vendas e acompanhe indicadores em
          tempo real com a plataforma Piúba.
        </p>

        <Separator className="my-8 bg-white/10" />

        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-xs leading-tight text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>
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

  const handleRecoverPassword = () => {
    console.log('Abrir modal de recuperação');
  };

  return (
    <main className="flex min-h-screen w-full bg-background">
      <LoginHero />

      <section className="flex w-full flex-col items-center justify-center p-6 md:w-1/2">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
          <header className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Acesse sua conta</h2>
            <p className="mt-1 text-sm text-gray-500">
              Entre com suas credenciais para continuar.
            </p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <EmailInput
                  id="email"
                  placeholder="seu@email.com"
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
                <button
                  type="button"
                  onClick={handleRecoverPassword}
                  className="text-sm text-primary hover:underline focus:outline-none"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
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

            <Checkbox id="remember" label="Manter-me conectado" defaultChecked />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Autenticando...' : 'Entrar'}
            </Button>

            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-xs font-medium text-gray-400">OU CONTINUE COM</span>
              <Separator className="flex-1" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline">
                <GoogleIcon />
                Google
              </Button>
              <Button type="button" variant="outline">
                <MicrosoftIcon />
                Microsoft
              </Button>
            </div>

            <p className="text-center text-sm text-gray-500">
              Não tem uma conta?{' '}
              <span className="font-medium text-primary hover:underline">
                Fale com seu administrador
              </span>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
