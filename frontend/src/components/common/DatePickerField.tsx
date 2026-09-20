import { Calendar as CalendarIcon, X } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface DatePickerFieldProps {
  label: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  maxDate?: Date;
  className?: string;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onChange,
  maxDate,
  className,
}) => {
  const [open, setOpen] = React.useState(false);

  const selectedDate = React.useMemo(() => {
    if (!value) return undefined;
    const d = new Date(`${value}T00:00:00`);
    return isNaN(d.getTime()) ? undefined : d;
  }, [value]);

  const handleSelect = (date: Date | undefined): void => {
    if (!date) {
      onChange(undefined);
      setOpen(false);
      return;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const isoString = `${year}-${month}-${day}`;
    onChange(isoString);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onChange(undefined);
  };

  const displayDateText = selectedDate
    ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Pick date';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-xs font-medium text-muted-foreground">{label}:</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-41.25 justify-between text-left font-normal h-9 px-3',
              !value && 'text-muted-foreground'
            )}
          >
            <div className="flex items-center gap-1.5 truncate">
              <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{displayDateText}</span>
            </div>
            {value && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                className="hover:text-destructive p-0.5 rounded-sm focus:outline-none"
              >
                <X className="h-3.5 w-3.5 shrink-0" />
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            disabled={(date) => (maxDate ? date > maxDate : false)}
          />
          {value && (
            <div className="p-2 border-t border-border flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs px-2"
                onClick={() => handleSelect(undefined)}
              >
                Clear
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};
