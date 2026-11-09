'use client';

import { useCallback, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';
import { useToast } from '@/shared/contexts/ToastContext';
import {
  FORBIDDEN_MESSAGE,
  applyServerFieldErrors,
  errorMessage,
  errorStatus,
} from '../utils/errors';
import { useRegisterForm } from './saveRegistry';

type Options<TValues extends FieldValues, TPayload, TResult> = {
  /** Identificador no registro do botão "Salvar alterações". */
  id: string;
  form: UseFormReturn<TValues>;
  /** `false` = somente leitura (não registra nem envia). */
  editable: boolean;
  toPayload: (values: TValues) => TPayload;
  mutationFn: (payload: TPayload) => Promise<TResult>;
  /** Recebe o estado devolvido pelo PUT (substitui o estado local). */
  onSaved: (result: TResult) => void;
  /** 422 de regra de negócio sem chave de campo (ex.: CNPJ duplicado). */
  businessField?: { field: FieldPath<TValues>; match: RegExp };
};

/** Envio de uma seção: PUT com a seção inteira, 422 nos campos, 403 vira somente leitura. */
export function useSectionSave<TValues extends FieldValues, TPayload, TResult>({
  id,
  form,
  editable,
  toPayload,
  mutationFn,
  onSaved,
  businessField,
}: Options<TValues, TPayload, TResult>) {
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();
  const [forbidden, setForbidden] = useState(false);
  const mutation = useMutation({ mutationFn });
  const { mutateAsync } = mutation;
  const { handleSubmit, setError } = form;

  const submit = useCallback(
    () =>
      handleSubmit(async (values) => {
        try {
          const result = await mutateAsync(toPayload(values));
          onSaved(result);
          // Toda alteração gera um registro no histórico.
          void queryClient.invalidateQueries({ queryKey: ['company-settings-audit'] });
          showSuccess('Configurações salvas');
        } catch (error) {
          if (errorStatus(error) === 403) {
            setForbidden(true);
            showError(FORBIDDEN_MESSAGE);
            return;
          }
          if (applyServerFieldErrors(error, setError, businessField)) {
            showError('Revise os campos destacados.');
            return;
          }
          showError(errorMessage(error));
        }
      })(),
    [
      handleSubmit,
      mutateAsync,
      toPayload,
      onSaved,
      queryClient,
      showSuccess,
      showError,
      setError,
      businessField,
    ],
  );

  const readOnly = !editable || forbidden;
  const isSaving = mutation.isPending;

  useRegisterForm(id, {
    isDirty: !readOnly && form.formState.isDirty,
    isSaving,
    submit,
  });

  return { submit, isSaving, readOnly, forbidden };
}
