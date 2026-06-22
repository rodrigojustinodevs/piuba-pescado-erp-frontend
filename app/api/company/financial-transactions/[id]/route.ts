import type { ApiFinancialTransaction, FinancialTransaction, UpdateFinancialTransactionData } from '@/features/financialTransaction/types';
import {
  buildFinancialTransactionBody,
  mapApiFinancialTransaction,
} from '@/features/financialTransaction/utils/apiMapper';
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
  mapBody: buildFinancialTransactionBody,
  mapResponse: mapDetail,
});

export const DELETE = createDeleteHandler<{ id: string }>({
  backendPathBuilder: (params) => `/api/company/financial-transactions/${params.id}`,
  context: CONTEXT,
});
