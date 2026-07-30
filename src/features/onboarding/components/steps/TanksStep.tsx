'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { useTanks } from '@/features/tank';
import { Button } from '@/shared/components/ui/Button';

const TANKS_CREATE_ROUTE = '/company/tanks/create';

export function TanksStep() {
  const router = useRouter();
  const { data: tanksData } = useTanks({ limit: 1 });
  const total = tanksData?.total ?? 0;

  return (
    <div className="space-y-4">
      <Button onClick={() => router.push(TANKS_CREATE_ROUTE)}>Cadastrar Tanques</Button>

      {total > 0 && (
        <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>
            {total} {total === 1 ? 'tanque cadastrado' : 'tanques cadastrados'}.
          </span>
        </div>
      )}
    </div>
  );
}
