import { createFinancialCategoryStatusPatchHandler } from '../createFinancialCategoryStatusPatchHandler';

const CONTEXT = 'Financial Category active API Proxy';

export const PATCH = createFinancialCategoryStatusPatchHandler('active', CONTEXT);

