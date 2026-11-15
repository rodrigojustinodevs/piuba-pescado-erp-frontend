'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import {
  forgotPasswordSchema,
  useForgotPassword,
  type ForgotPasswordFormData,
} from '@/features/auth';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { EmailInput } from '@/shared/components/form';
import { Button } from '@/shared/components/ui/Button';

export default function ForgotPasswordPage() {
  const { mutate, isPending, isSuccess, isError, error } = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({ resolver: zodResolver(forgotPasswordSchema) });

  return (
    <AuthCard
      title="Recuperar senha"
      description="Informe seu e-mail e enviaremos as instruções para redefinir a senha."
    >
      {isSuccess ? (
        <output className="block rounded-md border border-green-100 bg-green-50 p-3 text-sm text-green-700">
          Se o e-mail estiver cadastrado, enviaremos as instruções para redefinir a senha.
        </output>
      ) : (
        <form onSubmit={handleSubmit((d) => mutate(d.email))} className="space-y-5" noValidate>
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
                autoComplete="email"
                spellCheck={false}
                inputClassName="pl-10"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>
          </div>
          {isError && (
            <div
              role="alert"
              className="rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-600"
            >
              {error.message}
            </div>
          )}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Enviando…' : 'Enviar instruções'}
          </Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm">
        <Link
          href="/login"
          className="font-medium text-primary hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Voltar para o login
        </Link>
      </p>
    </AuthCard>
  );
}
