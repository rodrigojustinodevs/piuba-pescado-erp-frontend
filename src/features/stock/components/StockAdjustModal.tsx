'use client';

import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/ui';
import type { AdjustStockPayload } from '../types';
import { adjustStockFormSchema, type AdjustStockFormData } from '../schemas';

type StockAdjustModalProps = {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  initialPhysicalQuantity?: number;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: AdjustStockPayload) => void;
};

export function StockAdjustModal({
  isOpen,
  title,
  subtitle,
  initialPhysicalQuantity = 0,
  isSubmitting = false,
  onClose,
  onSubmit,
}: Readonly<StockAdjustModalProps>) {
  const handleClose = useCallback(() => onClose(), [onClose]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdjustStockFormData>({
    resolver: zodResolver(adjustStockFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { physicalQuantity: initialPhysicalQuantity, reason: '' },
  });

  useEffect(() => {
    if (!isOpen) return;
    reset({ physicalQuantity: initialPhysicalQuantity, reason: '' });
  }, [isOpen, initialPhysicalQuantity, reset]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (!isOpen) return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <button
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm cursor-default"
        onClick={handleClose}
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 transition-all animate-in fade-in zoom-in duration-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors focus:ring-2 focus:ring-gray-300 outline-none"
          aria-label="Fechar modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
        </div>

        <form
          onSubmit={handleSubmit((data) => {
            onSubmit({
              physicalQuantity: data.physicalQuantity,
              reason: data.reason.trim(),
            });
          })}
        >
          <div className="grid grid-cols-1 gap-6">
            <Input
              label="Quantidade física"
              requiredIndicator
              type="number"
              step={0.01}
              min={0}
              disabled={isSubmitting}
              {...register('physicalQuantity', { valueAsNumber: true })}
              error={errors.physicalQuantity?.message}
            />

            <Input
              label="Motivo"
              requiredIndicator
              type="text"
              disabled={isSubmitting}
              placeholder="Ex.: contagem física, ajuste por perda, correção de cadastro..."
              {...register('reason')}
              error={errors.reason?.message}
            />
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#0EA5A4] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0c8f8e] disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Ajustando...' : 'Confirmar ajuste'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

