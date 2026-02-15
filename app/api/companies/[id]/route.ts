import { NextRequest, NextResponse } from 'next/server';
import type { UpdateCompanyData } from '@/features/company';
import type { Company } from '@/features/company/types';
import { backendRequest, HttpResponses } from '../../_utils/backendProxy';
import { mapCompanyPayload } from '../../_utils/companyPayload';

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

/**
 * GET /api/companies/[id] - Busca uma empresa por ID (proxy para backend)
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const result = await backendRequest<ApiCompanyResponse>(`/api/admin/company/${id}`, {
    method: 'GET',
    withAuth: true,
    errorFallback: 'Empresa não encontrada',
  });

  if (!result.ok) {
    return toErrorResponse(result.error, result.status);
  }

  return NextResponse.json(result.data.response);
}

/**
 * PUT /api/companies/[id] - Atualiza uma empresa (proxy para backend)
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data: Omit<UpdateCompanyData, 'id'> = await req.json();
  const payload = mapCompanyPayload(data);

  const result = await backendRequest<ApiCompanyResponse>(`/api/admin/company/${id}`, {
    method: 'PUT',
    withAuth: true,
    errorFallback: 'Erro ao atualizar empresa',
    body: JSON.stringify(payload),
  });

  if (!result.ok) {
    return toErrorResponse(result.error, result.status);
  }

  return NextResponse.json(result.data.response);
}

/**
 * DELETE /api/companies/[id] - Remove uma empresa (proxy para backend)
 */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const result = await backendRequest(`/api/admin/company/${id}`, {
    method: 'DELETE',
    withAuth: true,
    expectJson: false,
    errorFallback: 'Erro ao deletar empresa',
  });

  if (!result.ok) {
    return toErrorResponse(result.error, result.status);
  }

  return NextResponse.json({ success: true });
}
