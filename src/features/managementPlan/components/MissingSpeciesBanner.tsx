import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export function MissingSpeciesBanner() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
      <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
      <p>
        Nenhuma espécie cadastrada com esse nome. Os planos gerados terão menos contexto técnico.{' '}
        <Link href="/company/species" className="font-medium underline hover:text-amber-900">
          Cadastre a espécie
        </Link>{' '}
        para planos mais precisos.
      </p>
    </div>
  );
}
