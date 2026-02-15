import { NextRequest, NextResponse } from 'next/server';
import type { CompanyListResponse, CreateCompanyData } from '@/features/company';
import type { ApiCompanyListResponse, Company } from '@/features/company/types';
import { backendRequest, HttpResponses } from '../_utils/backendProxy';
import { mapCompanyPayload } from '../_utils/companyPayload';

interface ApiCompanyResponse {
  status: boolean;
  response: Company;
  message: string;
}

function toErrorResponse(error: string, status: number) {
  if (status === 500 && error === 'Falha na comunicação com o servidor.') {
    return HttpResponses.serverError();
  }
  return HttpResponses.fromApiError(error, status);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';
  const search = searchParams.get('search') || '';

  const params = new URLSearchParams({
    page,
    limit,
    ...(search && { search }),
  });

  const result = await backendRequest<ApiCompanyListResponse>(`/api/admin/companies?${params}`, {
    method: 'GET',
    withAuth: true,
    errorFallback: 'Erro ao listar empresas',
  });

  if (!result.ok) {
    return toErrorResponse(result.error, result.status);
  }

  const apiData = result.data;

  const response: CompanyListResponse = {
    companies: apiData.response || [],
    total: apiData.pagination?.total || 0,
    page: apiData.pagination?.current_page || 1,
    limit: apiData.pagination?.per_page || 10,
  };

  return NextResponse.json(response);
}

export async function POST(req: NextRequest) {
  const data: CreateCompanyData = await req.json();
  const payload = mapCompanyPayload(data);

  const result = await backendRequest<ApiCompanyResponse>('/api/admin/company', {
    method: 'POST',
    withAuth: true,
    errorFallback: 'Erro ao criar empresa',
    body: JSON.stringify(payload),
  });

  if (!result.ok) {
    return toErrorResponse(result.error, result.status);
  }

  return NextResponse.json(result.data.response, { status: result.status });
}
