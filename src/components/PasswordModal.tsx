import { useState } from 'react';
import { Button } from './ui/Button';
import {
    generatePassword,
    DEFAULT_PASSWORD_CONFIG,
    type PasswordConfig,
} from '../lib/generatePassword';

interface Props {
    count: number;
    onConfirm: (passwords: string[]) => void;
    onCancel: () => void;
}

interface CheckboxRowProps {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}

function CheckboxRow({ label, checked, onChange }: CheckboxRowProps) {
    return (
        <label className="flex items-center gap-3 cursor-pointer select-none group">
            <div
                className={[
                    'w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors',
                    checked
                        ? 'bg-white border-white'
                        : 'border-white/20 bg-transparent group-hover:border-white/40',
                ].join(' ')}
                onClick={() => onChange(!checked)}
            >
                {checked && (
                    <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                    >
                        <path
                            d="M2 5L4 7L8 3"
                            stroke="#000"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
            </div>
            <span className="text-xs text-zinc-300">{label}</span>
        </label>
    );
}

export function PasswordModal({ count, onConfirm, onCancel }: Props) {
    const [config, setConfig] = useState<PasswordConfig>(DEFAULT_PASSWORD_CONFIG);

    const noneSelected =
        !config.uppercase && !config.lowercase && !config.digits && !config.symbols;

    function set<K extends keyof PasswordConfig>(key: K, value: PasswordConfig[K]) {
        setConfig((prev) => ({ ...prev, [key]: value }));
    }

    function handleConfirm() {
        const passwords = Array.from({ length: count }, () => generatePassword(config));
        onConfirm(passwords);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 w-[360px] flex flex-col gap-5 shadow-2xl">
                <div>
                    <h2 className="text-sm font-semibold text-white mb-1">Налаштування паролів</h2>
                    <p className="text-xs text-zinc-500">
                        Буде згенеровано {count} унікальних паролів
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400 whitespace-nowrap">Довжина</span>
                    <input
                        type="number"
                        min={4}
                        max={64}
                        value={config.length}
                        onChange={(e) => set('length', Math.max(4, Math.min(64, Number(e.target.value))))}
                        className="w-20 bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white text-center outline-none focus:border-white/25 transition-colors"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <CheckboxRow
                        label="Великі літери (A–Z)"
                        checked={config.uppercase}
                        onChange={(v) => set('uppercase', v)}
                    />
                    <CheckboxRow
                        label="Малі літери (a–z)"
                        checked={config.lowercase}
                        onChange={(v) => set('lowercase', v)}
                    />
                    <CheckboxRow
                        label="Цифри (0–9)"
                        checked={config.digits}
                        onChange={(v) => set('digits', v)}
                    />
                    <CheckboxRow
                        label="Символи (!@#$&)"
                        checked={config.symbols}
                        onChange={(v) => set('symbols', v)}
                    />
                </div>

                <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={onCancel}>
                        Скасувати
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleConfirm}
                        disabled={noneSelected}
                    >
                        Згенерувати
                    </Button>
                </div>
            </div>
        </div>
    );
}
