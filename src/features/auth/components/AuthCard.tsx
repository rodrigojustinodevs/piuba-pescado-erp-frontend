import type { ReactNode } from 'react';
import { Fish } from 'lucide-react';

type AuthCardProps = { title: string; description: string; children: ReactNode };

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Fish className="h-5 w-5" aria-hidden="true" />
          </div>
          <p translate="no" className="text-base font-bold text-gray-900">
            Piúba Pescado
          </p>
        </div>
        <header className="mb-6">
          <h1 className="text-balance text-xl font-bold text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </header>
        {children}
      </div>
    </main>
  );
}
