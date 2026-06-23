import { useRef } from 'react';
import { Button } from './ui/Button';

interface Props {
    onConfirm: (promoCodes: string[]) => void;
    onCancel: () => void;
}

export function PromoModal({ onConfirm, onCancel }: Props) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    function handleConfirm() {
        const raw = textareaRef.current?.value ?? '';
        const codes = raw
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean);
        onConfirm(codes);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 w-[400px] flex flex-col gap-4 shadow-2xl">
                <div>
                    <h2 className="text-sm font-semibold text-white mb-1">Промокоди</h2>
                    <p className="text-xs text-zinc-500">
                        Введіть промокоди, по одному на рядок. Вони будуть розподілені по профілях по черзі.
                    </p>
                </div>
                <textarea
                    ref={textareaRef}
                    autoFocus
                    placeholder={'PROMO1\nPROMO2\nPROMO3'}
                    className="w-full h-40 bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder:text-zinc-700 resize-none outline-none focus:border-white/25 transition-colors"
                />
                <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={onCancel}>
                        Скасувати
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleConfirm}>
                        Підтвердити
                    </Button>
                </div>
            </div>
        </div>
    );
}
