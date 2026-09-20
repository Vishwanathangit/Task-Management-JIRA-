import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';

import { Input, type InputProps } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface FormInputProps extends InputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, containerClassName, id, className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const isPasswordType = type === 'password';

    const currentType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={cn('flex flex-col gap-1.5 w-full', containerClassName)}>
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <div className="relative w-full">
          <Input
            id={inputId}
            ref={ref}
            type={currentType}
            className={cn(
              isPasswordType && 'pr-10',
              error && 'border-destructive focus-visible:ring-destructive',
              className
            )}
            {...props}
          />
          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        {error && <span className="text-xs text-destructive font-medium">{error}</span>}
      </div>
    );
  }
);
FormInput.displayName = 'FormInput';
