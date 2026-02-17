import axios from 'axios';
import type {
  SettlementListResponse,
  Settlement,
  CreateSettlementData,
  UpdateSettlementData,
} from '../types';

const settlementListApi = axios.create({
  baseURL: '/api/company/settlements',
  headers: { 'Content-Type': 'application/json' },
});

export const settlementService = {
  async list(params?: { page?: number; per_page?: number }): Promise<SettlementListResponse> {
    const response = await settlementListApi.get<SettlementListResponse>('/', { params });
    return response.data;
  },

  async getById(id: string): Promise<Settlement> {
    const response = await settlementListApi.get<Settlement>(`/${id}`);
    return response.data;
  },

  async create(data: CreateSettlementData): Promise<Settlement> {
    const response = await settlementListApi.post<Settlement>('/', data);
    return response.data;
  },

  async update(data: UpdateSettlementData): Promise<Settlement> {
    const { id, ...body } = data;
    const response = await settlementListApi.put<Settlement>(`/${id}`, body);
    return response.data;
  },
};
