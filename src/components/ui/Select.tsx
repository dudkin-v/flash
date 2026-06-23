import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';

const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
        ref={ref}
        className={cn(
            'flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900 px-3 py-1.5',
            'text-xs text-white outline-none cursor-pointer select-none',
            'hover:border-white/25 focus:border-white/30',
            'data-placeholder:text-zinc-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors',
            className
        )}
        {...props}
    >
        {children}
        <div className="ms-auto">
            <SelectPrimitive.Icon asChild>
                <ChevronDown className="w-3 h-3 text-zinc-500 shrink-0" />
            </SelectPrimitive.Icon>
        </div>
    </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = 'SelectTrigger';

const SelectContent = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
    <SelectPrimitive.Portal>
        <SelectPrimitive.Content
            ref={ref}
            position={position}
            sideOffset={4}
            className={cn(
                'z-50 min-w-32 overflow-hidden rounded-lg border border-white/10 bg-zinc-900 shadow-xl shadow-black/60',
                'data-[state=open]:animate-in data-[state=closed]:animate-out',
                'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
                className
            )}
            {...props}
        >
            <SelectPrimitive.Viewport className="p-1">
                {children}
            </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
));
SelectContent.displayName = 'SelectContent';

const SelectItem = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
        ref={ref}
        className={cn(
            'relative flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-zinc-300 outline-none cursor-pointer select-none',
            'focus:bg-white/10 focus:text-white',
            'data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
            className
        )}
        {...props}
    >
        <span className="absolute right-2 flex h-3 w-3 items-center justify-center">
            <SelectPrimitive.ItemIndicator>
                <Check className="w-3 h-3 text-white" />
            </SelectPrimitive.ItemIndicator>
        </span>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
));
SelectItem.displayName = 'SelectItem';

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
