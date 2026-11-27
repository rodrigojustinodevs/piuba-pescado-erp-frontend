import type { BillingBlock } from '@/shared/lib/http/apiError';

/**
 * Store mínimo (useSyncExternalStore) entre o tratamento central de erros, que roda
 * fora do React (QueryCache/MutationCache), e a interface que reage a ele.
 */

export type PlanDialog =
  | { kind: 'featureRequired'; block: BillingBlock }
  | { kind: 'limitReached'; block: BillingBlock }
  | { kind: 'quotaExhausted'; block: BillingBlock };

/** Avisos pontuais que a ponte transforma em toast ou navegação. */
export type AccessNotice =
  | { type: 'sessionEnded' }
  | { type: 'forbidden'; message: string }
  | { type: 'readOnly'; message: string }
  | { type: 'conflict'; message: string }
  | { type: 'noCompany' };

type State = {
  planDialog: PlanDialog | null;
  /** 403 COMPANY_ACCESS_DENIED: o usuário está inativo na empresa ativa. */
  companyDenied: boolean;
  companySelectorOpen: boolean;
};

let state: State = { planDialog: null, companyDenied: false, companySelectorOpen: false };
const listeners = new Set<() => void>();
const noticeListeners = new Set<(notice: AccessNotice) => void>();

function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

const SERVER_STATE: State = { planDialog: null, companyDenied: false, companySelectorOpen: false };

export const accessEvents = {
  getState: () => state,
  getServerState: () => SERVER_STATE,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  showPlanDialog: (planDialog: PlanDialog) => set({ planDialog }),
  dismissPlanDialog: () => set({ planDialog: null }),
  setCompanyDenied: (companyDenied: boolean) => set({ companyDenied }),
  openCompanySelector: () => set({ companySelectorOpen: true }),
  closeCompanySelector: () => set({ companySelectorOpen: false }),

  notify(notice: AccessNotice) {
    noticeListeners.forEach((l) => l(notice));
  },
  onNotice(listener: (notice: AccessNotice) => void) {
    noticeListeners.add(listener);
    return () => {
      noticeListeners.delete(listener);
    };
  },

  /** Troca de empresa ou logout: nada do contexto anterior sobrevive. */
  reset: () => set({ planDialog: null, companyDenied: false, companySelectorOpen: false }),
};
