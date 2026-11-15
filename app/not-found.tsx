import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      <p className="text-sm font-medium text-muted-foreground">Erro 404</p>
      <h1 className="text-2xl font-semibold text-foreground">Página não encontrada</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        O endereço acessado não existe ou foi movido.
      </p>
      <Button asChild>
        <Link href="/dashboard">Voltar ao dashboard</Link>
      </Button>
    </main>
  );
}
