'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock } from 'lucide-react';
import { z } from 'zod';
import { resetPasswordSchema, useResetPassword, type ResetPasswordFormData } from '@/features/auth';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { PasswordInput } from '@/shared/components/form';
import { Button } from '@/shared/components/ui/Button';

const formSchema = z
  .object({
    password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
    password_confirmation: z.string().min(1, 'Confirme a senha'),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: 'As senhas não conferem',
    path: ['password_confirmation'],
  });

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const email = params.get('email') ?? '';
  const linkValid = resetPasswordSchema.safeParse({
    token,
    email,
    password: 'x'.repeat(8),
    password_confirmation: 'x'.repeat(8),
  }).success;

  const { mutate, isPending, isSuccess, isError, error } = useResetPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({ resolver: zodResolver(formSchema) });

  if (!linkValid) {
    return (
      <>
        <p
          role="alert"
          className="rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-600"
        >
          Link de redefinição inválido ou incompleto. Solicite um novo.
        </p>
        <p className="mt-6 text-center text-sm">
          <Link
            href="/forgot-password"
            className="font-medium text-primary hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Solicitar novo link
          </Link>
        </p>
      </>
    );
  }

  if (isSuccess) {
    return (
      <>
        <output className="block rounded-md border border-green-100 bg-green-50 p-3 text-sm text-green-700">
          Senha redefinida com sucesso.
        </output>
        <Button className="mt-6 w-full" onClick={() => router.push('/login')}>
          Ir para o login
        </Button>
      </>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((d) => mutate({ token, email, ...d }))}
      className="space-y-5"
      noValidate
    >
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
          Nova senha
        </label>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <PasswordInput
            id="password"
            autoComplete="new-password"
            inputClassName="pl-10"
            {...register('password')}
            error={errors.password?.message}
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="password_confirmation"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Confirmar nova senha
        </label>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <PasswordInput
            id="password_confirmation"
            autoComplete="new-password"
            inputClassName="pl-10"
            {...register('password_confirmation')}
            error={errors.password_confirmation?.message}
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
        {isPending ? 'Salvando…' : 'Redefinir senha'}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Definir nova senha"
      description="Escolha uma nova senha para acessar sua conta."
    >
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  );
}
