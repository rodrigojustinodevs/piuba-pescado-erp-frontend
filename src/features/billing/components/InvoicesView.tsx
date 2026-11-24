'use client';

import { ExternalLink } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button, buttonVariants } from '@/shared/components/ui/Button';
import { cn } from '@/shared/lib/utils';
import { useInvoices } from '../hooks/queries';
import type { Invoice, InvoiceStatus } from '../types';
import { formatBRL, formatDate } from '../utils/format';
import {
  INVOICE_KIND_LABELS,
  INVOICE_STATUS_LABELS,
  INVOICE_STATUSES,
  PAYMENT_METHOD_LABELS,
} from '../utils/labels';
import { InvoiceStatusBadge } from './StatusBadge';
import { BillingEmpty, BillingError, BillingLoading } from './states';

const PER_PAGE = 25;

function isInvoiceStatus(value: string | null): value is InvoiceStatus {
  return value !== null && (INVOICE_STATUSES as readonly string[]).includes(value);
}

function InvoiceAction({ invoice }: Readonly<{ invoice: Invoice }>) {
  if (!invoice.invoiceUrl) return <span className="text-muted-foreground">—</span>;
  const payable = invoice.status === 'pending' || invoice.status === 'overdue';
  return (
    <a
      href={invoice.invoiceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ size: 'sm', variant: payable ? 'default' : 'outline' }))}
    >
      {payable ? 'Pagar' : 'Ver fatura'}
      <ExternalLink aria-hidden="true" />
      <span className="sr-only">(abre em nova aba)</span>
    </a>
  );
}

export function InvoicesView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rawStatus = searchParams.get('status');
  const status = isInvoiceStatus(rawStatus) ? rawStatus : '';
  const page = Math.max(1, Number(searchParams.get('pagina')) || 1);

  const query = useInvoices({ status, page, perPage: PER_PAGE });

  // Filtro e página ficam na URL (link compartilhável, voltar funciona).
  function setParams(next: { status?: string; pagina?: number }) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.status !== undefined) {
      if (next.status) params.set('status', next.status);
      else params.delete('status');
      params.delete('pagina');
    }
    if (next.pagina !== undefined) {
      if (next.pagina > 1) params.set('pagina', String(next.pagina));
      else params.delete('pagina');
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const data = query.data;
  const lastPage = Math.max(1, data?.lastPage ?? 1);

  return (
    <section
      aria-labelledby="invoices-title"
      className="rounded-2xl border border-border bg-card shadow-sm"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
        <h2 id="invoices-title" className="text-base font-semibold">
          Faturas
        </h2>
        <div className="flex items-center gap-2">
          <label htmlFor="invoice-status" className="text-sm text-muted-foreground">
            Status
          </label>
          <select
            id="invoice-status"
            value={status}
            onChange={(e) => setParams({ status: e.target.value })}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Todos</option>
            {INVOICE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {INVOICE_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </header>

      {query.isPending ? <BillingLoading label="Carregando faturas…" /> : null}
      {query.isError ? (
        <div className="p-5">
          <BillingError error={query.error} onRetry={() => void query.refetch()} />
        </div>
      ) : null}
      {data && data.items.length === 0 ? (
        <BillingEmpty title={status ? 'Nenhuma fatura com esse status.' : 'Nenhuma fatura ainda.'}>
          {status ? 'Tente outro filtro.' : 'As faturas aparecem aqui depois da contratação.'}
        </BillingEmpty>
      ) : null}

      {data && data.items.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table
              className={cn(
                'w-full min-w-[720px] text-sm',
                query.isPlaceholderData && 'opacity-60',
              )}
            >
              <caption className="sr-only">Faturas da assinatura</caption>
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th scope="col" className="px-5 py-3 font-medium">
                    Vencimento
                  </th>
                  <th scope="col" className="px-3 py-3 font-medium">
                    Tipo
                  </th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">
                    Valor
                  </th>
                  <th scope="col" className="px-3 py-3 font-medium">
                    Forma
                  </th>
                  <th scope="col" className="px-3 py-3 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3 font-medium">
                    Pago em
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((inv) => (
                  <tr key={inv.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 tabular-nums">{formatDate(inv.dueDate)}</td>
                    <td className="px-3 py-3">{INVOICE_KIND_LABELS[inv.kind] ?? inv.kind}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{formatBRL(inv.amount)}</td>
                    <td className="px-3 py-3">
                      {inv.paymentMethod ? PAYMENT_METHOD_LABELS[inv.paymentMethod] : '—'}
                    </td>
                    <td className="px-3 py-3">
                      <InvoiceStatusBadge status={inv.status} />
                    </td>
                    <td className="px-3 py-3 tabular-nums">{formatDate(inv.paidAt)}</td>
                    <td className="px-5 py-3 text-right">
                      <InvoiceAction invoice={inv} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav
            aria-label="Paginação das faturas"
            className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm"
          >
            <p className="text-muted-foreground">
              {data.total} {data.total === 1 ? 'fatura' : 'faturas'} · página {page} de {lastPage}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setParams({ pagina: page - 1 })}
              >
                Anterior
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= lastPage}
                onClick={() => setParams({ pagina: page + 1 })}
              >
                Próxima
              </Button>
            </div>
          </nav>
        </>
      ) : null}
    </section>
  );
}
