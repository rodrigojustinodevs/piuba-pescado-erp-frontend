'use client';

import { SpinnerIcon } from '@/shared/components/Table/ActionIcons';

export type FormActionsProps = {
  cancelLabel?: string;
  onCancel?: () => void;
  submitLabel: string;
  loadingLabel?: string;
  isLoading?: boolean;
  className?: string;
};

const defaultCancel = () => window.history.back();

export function FormActions({
  cancelLabel = 'Cancelar',
  onCancel = defaultCancel,
  submitLabel,
  loadingLabel = 'Salvando...',
  isLoading = false,
  className = '',
}: FormActionsProps) {
  return (
    <div className={`flex justify-end gap-3 pt-4 border-t border-gray-200 ${className}`.trim()}>
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        {cancelLabel}
      </button>
      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 text-sm font-medium text-white bg-[#0EA5A4] rounded-lg hover:bg-[#0F766E] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isLoading && <SpinnerIcon className="w-4 h-4 animate-spin" />}
        {isLoading ? loadingLabel : submitLabel}
      </button>
    </div>
  );
}
