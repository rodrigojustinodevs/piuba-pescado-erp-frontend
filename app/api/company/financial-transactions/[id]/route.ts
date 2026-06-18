import type { ApiFinancialTransaction, UpdateFinancialTransactionData } from '@/features/financialTransaction/types';
import type { FinancialTransaction } from '@/features/financialTransaction/types';
import { mapApiFinancialTransaction } from '@/features/financialTransaction/utils/apiMapper';
import {
  createDeleteHandler,
  createDetailGetHandler,
  createPutHandler,
} from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Financial Transaction detail API Proxy';

type Envelope = { response?: ApiFinancialTransaction } | ApiFinancialTransaction;

function mapDetail(data: Envelope): FinancialTransaction {
  const api = 'response' in data && data.response != null ? data.response : data;
  return mapApiFinancialTransaction(api as ApiFinancialTransaction);
}

export const GET = createDetailGetHandler<Envelope, FinancialTransaction, { id: string }>({
  backendPathBuilder: (params) => `/api/company/financial-transactions/${params.id}`,
  context: CONTEXT,
  mapResponse: mapDetail,
});

export const PUT = createPutHandler<Envelope, UpdateFinancialTransactionData, { id: string }>({
  backendPathBuilder: (params) => `/api/company/financial-transactions/${params.id}`,
  context: CONTEXT,
  mapBody: (payload) => {
    const body: Record<string, unknown> = {
      type: payload.type,
      status: payload.status,
      amount: payload.amount,
    };
    if (payload.companyId?.trim()) body.companyId = payload.companyId.trim();
    if (payload.method) body.method = payload.method;
    if (payload.dueDate) body.dueDate = payload.dueDate;
    if (payload.paymentDate) body.paymentDate = payload.paymentDate;
    if (payload.description?.trim()) body.description = payload.description.trim();
    if (payload.notes?.trim()) body.notes = payload.notes.trim();
    if (payload.categoryId?.trim()) body.categoryId = payload.categoryId.trim();
    return body;
  },
  mapResponse: mapDetail,
});

export const DELETE = createDeleteHandler<{ id: string }>({
  backendPathBuilder: (params) => `/api/company/financial-transactions/${params.id}`,
  context: CONTEXT,
});
