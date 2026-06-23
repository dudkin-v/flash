import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
}

const variants: Record<Variant, string> = {
    primary: 'bg-white text-black hover:bg-zinc-100',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10',
    outline: 'border border-white/20 text-zinc-300 hover:bg-white/5 hover:text-white',
    ghost: 'text-zinc-400 hover:text-white hover:bg-white/5',
    danger: 'bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-800/40',
};

const sizes: Record<Size, string> = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-2.5 text-sm rounded-xl',
};

export function Button({
    variant = 'primary',
    size = 'md',
    className = '',
    disabled,
    children,
    ...props
}: Props) {
    return (
        <button
            disabled={disabled}
            className={[
                'font-medium transition-all inline-flex items-center gap-2 cursor-pointer',
                variants[variant],
                sizes[size],
                disabled ? 'opacity-40 cursor-not-allowed' : '',
                className,
            ].join(' ')}
            {...props}
        >
            {children}
        </button>
    );
}
