/**
 * Barrel export para componentes de formulário
 *
 * @example
 * ```tsx
 * import { TextInput, Select, Checkbox } from "@/shared/components/form";
 * ```
 */

// Componentes base
export { BaseInput } from './BaseInput';

// Componentes de input
export { TextInput } from './TextInput';
export { PasswordInput } from './PasswordInput';
export { EmailInput } from './EmailInput';
export { NumberInput } from './NumberInput';

// Componentes de seleção e texto longo
export { Select } from './Select';
export { TextArea } from './TextArea';

// Componentes de escolha
export { Checkbox } from './Checkbox';
export { Radio } from './Radio';
export { RadioGroup } from './RadioGroup';
export { Switch } from './Switch';

// Tipos
export type {
  FormFieldSize,
  FormFieldVariant,
  BaseFormFieldProps,
  TextInputProps,
  NumberInputProps,
  TextAreaProps,
  SelectOption,
  SelectProps,
  CheckboxProps,
  RadioProps,
  RadioGroupProps,
  SwitchProps,
} from './types';

// Utilitários (exportados para casos avançados)
export { useFieldId, getInputBaseClasses, getLabelClasses, getHelperTextClasses } from './utils';
