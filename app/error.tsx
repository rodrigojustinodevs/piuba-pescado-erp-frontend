'use client';

import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';

export default function ErrorPage({
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Algo deu errado</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Ocorreu um erro inesperado ao carregar esta tela. Tente novamente; se o problema persistir,
        contate o suporte.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Tentar novamente</Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard">Ir para o dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
