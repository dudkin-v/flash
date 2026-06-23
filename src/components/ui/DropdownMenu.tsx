import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownItem {
    label: string;
    onClick: () => void;
}

interface Props {
    label: string;
    items: DropdownItem[];
}

export function DropdownMenu({ label, items }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        if (open) document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, [open]);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-white/20 text-zinc-300 hover:bg-white/5 hover:text-white transition-all cursor-pointer"
            >
                {label}
                <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute right-0 mt-1.5 w-52 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                    {items.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => {
                                item.onClick();
                                setOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
