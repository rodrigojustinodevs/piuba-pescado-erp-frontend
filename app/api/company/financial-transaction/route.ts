import type {
  ApiFinancialTransaction,
  CreateFinancialTransactionData,
  FinancialTransaction,
} from '@/features/financialTransaction/types';
import { mapApiFinancialTransaction } from '@/features/financialTransaction/utils/apiMapper';
import { createUpsertHandler } from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Financial Transaction Create API Proxy';

type Envelope = { response?: ApiFinancialTransaction } | ApiFinancialTransaction;

export const POST = createUpsertHandler<Envelope, CreateFinancialTransactionData>({
  backendPath: '/api/company/financial-transaction',
  method: 'POST',
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
  mapResponse: (data) => {
    const api = 'response' in data && data.response != null ? data.response : data;
    return mapApiFinancialTransaction(api as ApiFinancialTransaction) as FinancialTransaction;
  },
});
