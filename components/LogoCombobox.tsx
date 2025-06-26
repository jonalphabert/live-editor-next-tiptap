'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronsUpDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LogoOption } from '@/types/LogoType';

export function LogoCombobox({
  value,
  onChange,
}: {
  value: LogoOption | null;
  onChange: (value: LogoOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<LogoOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const fetchLogos = useCallback(async (query: string) => {
    if (query.length < 3) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/logos?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setOptions(data);
    } catch (error) {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timer) clearTimeout(timer);
    
    if (inputValue.trim().length >= 3) {
      setTimer(setTimeout(() => fetchLogos(inputValue.trim()), 300));
    } else {
      setOptions([]);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [inputValue, fetchLogos]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="w-full">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between" // Full width button
          >
            <span className="truncate">
              {value ? value.logo_name : 'Select a logo...'}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      </div>
      
      {/* Full-width popover content */}
      <PopoverContent 
        className="w-full p-0" // Key change: use full width
        align="start"
        sideOffset={4}
      >
        <Command shouldFilter={false} className="w-full">
          <CommandInput
            placeholder="Search logos..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          
          <CommandList className="max-h-[300px] overflow-y-auto">
            {loading ? (
              <div className="py-4 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            ) : (
              <>
                {options.length === 0 && inputValue.length > 0 && (
                  <CommandEmpty>
                    {inputValue.length < 3
                      ? 'Type at least 3 characters'
                      : 'No logos found'}
                  </CommandEmpty>
                )}
                
                <CommandGroup className="w-full">
                  {options.map((option) => (
                    <CommandItem
                      key={option.logo_slug}
                      value={option.logo_slug}
                      onSelect={() => {
                        onChange(option);
                        setOpen(false);
                        setInputValue('');
                      }}
                      className="w-full"
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4 min-w-[16px]',
                          value === option
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      <div className="flex justify-between w-full items-center">
                        <span className="truncate flex-1">{option.logo_name}</span>
                        {option.match_score && (
                          <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                            {Math.round(option.match_score * 100)}%
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}