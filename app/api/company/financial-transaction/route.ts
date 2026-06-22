import type {
  ApiFinancialTransaction,
  CreateFinancialTransactionData,
  FinancialTransaction,
} from '@/features/financialTransaction/types';
import {
  buildFinancialTransactionBody,
  mapApiFinancialTransaction,
} from '@/features/financialTransaction/utils/apiMapper';
import { createUpsertHandler } from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Financial Transaction Create API Proxy';

type Envelope = { response?: ApiFinancialTransaction } | ApiFinancialTransaction;

export const POST = createUpsertHandler<Envelope, CreateFinancialTransactionData>({
  backendPath: '/api/company/financial-transaction',
  method: 'POST',
  context: CONTEXT,
  mapBody: buildFinancialTransactionBody,
  mapResponse: (data) => {
    const api = 'response' in data && data.response != null ? data.response : data;
    return mapApiFinancialTransaction(api as ApiFinancialTransaction);
  },
});
