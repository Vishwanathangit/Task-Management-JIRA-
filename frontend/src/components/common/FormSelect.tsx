import * as React from 'react';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface SelectOption {
  label: string;
  value: string;
}

export interface FormSelectProps {
  label?: string;
  error?: string;
  options: SelectOption[];
  containerClassName?: string;
  className?: string;
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onValueChange?: (value: string) => void;
  onBlur?: (event: { target: unknown; type?: unknown }) => void;
}

export const FormSelect = React.forwardRef<HTMLButtonElement, FormSelectProps>(
  (
    {
      label,
      error,
      options,
      containerClassName,
      className,
      id,
      name,
      value,
      defaultValue,
      placeholder = 'Select an option',
      disabled,
      onChange,
      onValueChange,
      onBlur,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || '');
    const currentValue = value !== undefined ? value : internalValue;

    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const handleValueChange = (val: string): void => {
      setInternalValue(val);
      onValueChange?.(val);
      if (onChange) {
        onChange({
          target: { name: name || '', value: val },
        } as unknown as React.ChangeEvent<HTMLSelectElement>);
      }
    };

    return (
      <div className={cn('flex flex-col gap-1.5 w-full', containerClassName)}>
        {label && <Label htmlFor={selectId}>{label}</Label>}
        <Select
          value={currentValue}
          onValueChange={handleValueChange}
          disabled={disabled}
        >
          <SelectTrigger
            id={selectId}
            ref={ref}
            onBlur={onBlur}
            className={cn(
              error && 'border-destructive focus-visible:ring-destructive',
              className
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <span className="text-xs text-destructive font-medium">{error}</span>}
      </div>
    );
  }
);
FormSelect.displayName = 'FormSelect';
