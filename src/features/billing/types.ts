export type PlanTier = 'free' | 'starter' | 'professional' | 'enterprise';
export type PaidPlanTier = Exclude<PlanTier, 'free'>;
export type BillingCycle = 'monthly' | 'yearly';
export type PaymentMethod = 'boleto' | 'pix' | 'credit_card' | 'pix_automatic';
export type SubscriptionStatus = 'pending' | 'active' | 'overdue' | 'suspended' | 'canceled';
export type InvoiceStatus = 'pending' | 'overdue' | 'paid' | 'refunded' | 'canceled';
export type InvoiceKind = 'cycle' | 'proration';

export type PlanPrice = {
  available: boolean;
  amountCents: number | null;
  amount: number | null;
};

export type Plan = {
  tier: PlanTier;
  name: string;
  currency: string;
  paid: boolean;
  prices: Record<BillingCycle, PlanPrice>;
  features: string[];
};

export type PendingChange = {
  planTier: PlanTier;
  billingCycle: BillingCycle | null;
  effectiveAt: string;
};

export type PixQrCode = { payload: string; imageBase64: string };

export type Payment = {
  url: string | null;
  pixQrCode: PixQrCode | null;
  pixAuthorizationStatus: string | null;
};

export type ProrationCharge = {
  created: boolean;
  paymentUrl?: string | null;
  [key: string]: unknown;
};

export type Proration = {
  remainingDays: number;
  totalDays: number;
  amountCents: number;
  waived: boolean;
  charge: ProrationCharge | null;
};

export type SubscriptionChange =
  | { kind: 'upgrade_immediate'; proration: Proration | null }
  | { kind: 'scheduled_downgrade'; effectiveAt: string | null }
  | { kind: 'scheduled_cycle_change'; effectiveAt: string | null }
  | { kind: 'payment_method' }
  | { kind: 'canceled_at_period_end'; effectiveAt?: string | null }
  | { kind: 'scheduled_change_removed' }
  | { kind: 'none' };

export type SubscriptionChangeKind = SubscriptionChange['kind'];

export type Subscription = {
  id: string | number | null;
  planTier: PlanTier;
  billingCycle: BillingCycle | null;
  paymentMethod: PaymentMethod | null;
  status: SubscriptionStatus | null;
  hasAccess: boolean;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  overdueSince: string | null;
  gracePeriodEndsAt: string | null;
  nfseEnabled: boolean;
  pendingChange: PendingChange | null;
  payment: Payment | null;
  change: SubscriptionChange | null;
};

export type Invoice = {
  id: string | number;
  kind: InvoiceKind;
  amount: number;
  dueDate: string | null;
  status: InvoiceStatus;
  paymentMethod: PaymentMethod | null;
  paidAt: string | null;
  invoiceUrl: string | null;
  createdAt: string | null;
};

export type InvoiceListResponse = {
  items: Invoice[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
};

export type InvoiceListParams = {
  status?: InvoiceStatus | '';
  page?: number;
  perPage?: number;
};

export type SubscribePayload = {
  plan_tier: PaidPlanTier;
  billing_cycle: BillingCycle;
  payment_method: PaymentMethod;
  document?: string;
};

export type ChangeSubscriptionPayload = {
  plan_tier?: PlanTier;
  billing_cycle?: BillingCycle;
  payment_method?: PaymentMethod;
};

/** Envelope cru do Laravel. */
export type ApiEnvelope<T> = { status: boolean; message?: string; response: T };
export type ApiListEnvelope<T> = ApiEnvelope<T[]> & {
  pagination?: {
    total?: number;
    current_page?: number;
    last_page?: number;
    first_page?: number;
    per_page?: number;
  };
};
