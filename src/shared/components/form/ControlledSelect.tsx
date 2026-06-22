'use client';

import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Select } from './Select';
import type { SelectProps } from './types';

type ControlledSelectProps<T extends FieldValues> = Omit<
  SelectProps,
  'value' | 'onChange' | 'onBlur' | 'name'
> & {
  control: Control<T>;
  name: Path<T>;
};

export function ControlledSelect<T extends FieldValues>({
  control,
  name,
  ...selectProps
}: ControlledSelectProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select
          {...selectProps}
          value={field.value ?? ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          name={field.name}
        />
      )}
    />
  );
}
