import { createFinancialCategoryStatusPatchHandler } from '../createFinancialCategoryStatusPatchHandler';

const CONTEXT = 'Financial Category inactive API Proxy';

export const PATCH = createFinancialCategoryStatusPatchHandler('inactive', CONTEXT);

