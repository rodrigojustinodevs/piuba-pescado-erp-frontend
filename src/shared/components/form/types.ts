import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

/**
 * Tamanhos disponíveis para componentes de formulário
 */
export type FormFieldSize = "sm" | "md" | "lg";

/**
 * Variantes visuais disponíveis
 */
export type FormFieldVariant = "default" | "error" | "success";

/**
 * Props base compartilhadas por todos os campos de formulário
 */
export interface BaseFormFieldProps {
  /**
   * Label do campo
   */
  label?: string;
  /**
   * Texto de ajuda/descrição abaixo do campo
   */
  helperText?: string;
  /**
   * Mensagem de erro (quando presente, o campo fica em estado de erro)
   */
  error?: string;
  /**
   * Se o campo é obrigatório
   */
  required?: boolean;
  /**
   * Se o campo está desabilitado
   */
  disabled?: boolean;
  /**
   * Tamanho do campo
   */
  size?: FormFieldSize;
  /**
   * Variante visual
   */
  variant?: FormFieldVariant;
  /**
   * ID do campo (gerado automaticamente se não fornecido)
   */
  id?: string;
  /**
   * Nome do campo (usado para acessibilidade e React Hook Form)
   */
  name?: string;
  /**
   * Classes CSS adicionais para o container
   */
  className?: string;
  /**
   * Classes CSS adicionais para o input
   */
  inputClassName?: string;
}

/**
 * Props para componentes de input de texto
 */
export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "id">,
    BaseFormFieldProps {
  /**
   * Tipo do input (text, email, password, etc.)
   */
  type?: "text" | "email" | "password" | "tel" | "url" | "search";
}

/**
 * Props para componentes de input numérico
 */
export interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "id" | "type">,
    BaseFormFieldProps {
  /**
   * Valor mínimo permitido
   */
  min?: number | string;
  /**
   * Valor máximo permitido
   */
  max?: number | string;
  /**
   * Incremento/decremento (step)
   */
  step?: number | string | "any";
}

/**
 * Props para componentes de textarea
 */
export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size" | "id">,
    BaseFormFieldProps {
  /**
   * Número de linhas visíveis
   */
  rows?: number;
}

/**
 * Opção para componentes Select
 */
export interface SelectOption {
  /**
   * Valor da opção
   */
  value: string | number;
  /**
   * Label exibido
   */
  label: string;
  /**
   * Se a opção está desabilitada
   */
  disabled?: boolean;
}

/**
 * Props para componentes Select
 */
export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size" | "id">,
    BaseFormFieldProps {
  /**
   * Opções do select
   */
  options: SelectOption[];
  /**
   * Placeholder quando nenhuma opção está selecionada
   */
  placeholder?: string;
}

/**
 * Props para componentes Checkbox
 */
export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "id" | "type" | "value">,
    Omit<BaseFormFieldProps, "size"> {
  /**
   * Se o checkbox está marcado
   */
  checked?: boolean;
  /**
   * Valor quando marcado (padrão: true)
   */
  value?: string | number | boolean;
}

/**
 * Props para componentes Radio
 */
export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "id" | "type">,
    Omit<BaseFormFieldProps, "size"> {
  /**
   * Se o radio está selecionado
   */
  checked?: boolean;
  /**
   * Valor do radio
   */
  value: string | number;
}

/**
 * Props para grupos de Radio
 */
export interface RadioGroupProps extends Omit<BaseFormFieldProps, "id" | "name"> {
  /**
   * Nome do grupo (obrigatório para grupos)
   */
  name: string;
  /**
   * Opções do grupo
   */
  options: SelectOption[];
  /**
   * Valor selecionado
   */
  value?: string | number;
  /**
   * Callback quando o valor muda
   */
  onChange?: (value: string | number) => void;
  /**
   * Orientação do grupo
   */
  orientation?: "horizontal" | "vertical";
}

/**
 * Props para componentes Switch
 */
export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "id" | "type">,
    Omit<BaseFormFieldProps, "size"> {
  /**
   * Se o switch está ativado
   */
  checked?: boolean;
}

