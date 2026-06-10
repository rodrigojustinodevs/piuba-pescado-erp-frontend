import { z } from 'zod';

export const sizeClassificationSchema = z.object({
  class: z.string().min(1, 'Classe é obrigatória'),
  quantity: z.number().min(1, 'Quantidade deve ser maior que zero'),
  averageWeight: z.number().min(0, 'Peso médio não pode ser negativo'),
  pricePerKg: z.number().min(0, 'Preço não pode ser negativo'),
});

export const createHarvestSchema = z.object({
  companyId: z.string().optional(),
  batchId: z.string().min(1, 'Lote é obrigatório'),
  tankId: z.string().min(1, 'Tanque é obrigatório'),
  harvestDate: z.string().min(1, 'Data é obrigatória'),
  type: z.enum(['total', 'partial', 'selective', 'emergency']).optional(),
  status: z.enum(['completed', 'scheduled', 'cancelled']).optional(),
  destination: z.enum(['wholesale', 'retail', 'processing_plant', 'other']).optional(),
  initialPopulation: z.number().min(0).optional(),
  harvestedQuantity: z.number().min(1, 'Quantidade despescada deve ser maior que zero'),
  averageWeight: z.number().min(0, 'Peso médio não pode ser negativo'),
  sizeClassifications: z.array(sizeClassificationSchema).optional(),
  clientDestination: z.string().optional(),
  responsible: z.string().optional(),
  operationalCost: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export const updateHarvestSchema = z.object({
  id: z.string().min(1, 'ID é obrigatório'),
  tankId: z.string().optional(),
  harvestDate: z.string().optional(),
  type: z.enum(['total', 'partial', 'selective', 'emergency']).optional(),
  status: z.enum(['completed', 'scheduled', 'cancelled']).optional(),
  destination: z.enum(['wholesale', 'retail', 'processing_plant', 'other']).optional(),
  initialPopulation: z.number().min(0).optional(),
  harvestedQuantity: z.number().min(1).optional(),
  averageWeight: z.number().min(0).optional(),
  sizeClassifications: z.array(sizeClassificationSchema).optional(),
  clientDestination: z.string().optional(),
  responsible: z.string().optional(),
  operationalCost: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export type SizeClassificationFormData = z.infer<typeof sizeClassificationSchema>;
export type CreateHarvestFormData = z.infer<typeof createHarvestSchema>;
export type UpdateHarvestFormData = z.infer<typeof updateHarvestSchema>;
