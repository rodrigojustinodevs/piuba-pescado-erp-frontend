import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { buildQueryString } from '@/shared/utils/queryString';
import type {
  ChangeSubscriptionPayload,
  InvoiceListParams,
  InvoiceListResponse,
  Plan,
  SubscribePayload,
  Subscription,
} from '../types';

export const billingService = {
  getPlans: () => browserHttpClient.get<Plan[]>('/api/billing/plans'),

  getSubscription: () => browserHttpClient.get<Subscription>('/api/billing/subscription'),

  subscribe: (payload: SubscribePayload) =>
    browserHttpClient.post<Subscription>('/api/billing/subscriptions', payload),

  changeSubscription: (payload: ChangeSubscriptionPayload) =>
    browserHttpClient.patch<Subscription>('/api/billing/subscription', payload),

  cancelSubscription: () => browserHttpClient.delete<Subscription>('/api/billing/subscription'),

  getInvoices: (params: InvoiceListParams = {}) => {
    const qs = buildQueryString(
      { status: params.status, page: params.page, per_page: params.perPage },
      { skipEmptyString: true },
    );
    return browserHttpClient.get<InvoiceListResponse>(
      qs ? `/api/billing/invoices?${qs}` : '/api/billing/invoices',
    );
  },
};
