import { useState, useRef } from 'react';
import { Trash2, Copy, Check } from 'lucide-react';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from './ui/Select';
import type { Consumer, BaseProfile } from '../lib/types';

interface Props<T extends BaseProfile> {
    consumer: Consumer<T>;
    profiles: T[];
    onChange: (profiles: T[]) => void;
}

interface EditingCell {
    profileId: number;
    key: string;
}

export function ProfilesTable<T extends BaseProfile>({
    consumer,
    profiles,
    onChange,
}: Props<T>) {
    const [editing, setEditing] = useState<EditingCell | null>(null);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    if (profiles.length === 0) return null;

    function startEdit(profileId: number, key: string) {
        setEditing({ profileId, key });
        setTimeout(() => inputRef.current?.focus(), 0);
    }

    function commitEdit() {
        if (!editing) return;
        const value = inputRef.current?.value ?? '';
        const updated = profiles.map((p) =>
            p.id === editing.profileId ? { ...p, [editing.key]: value } : p
        );
        onChange(updated);
        setEditing(null);
    }

    function commitSelect(profileId: number, key: string, value: string) {
        const updated = profiles.map((p) =>
            p.id === profileId ? { ...p, [key]: value } : p
        );
        onChange(updated);
    }

    function cancelEdit() {
        setEditing(null);
    }

    function copyProfile(profile: T) {
        navigator.clipboard.writeText(JSON.stringify(profile, null, 2)).then(() => {
            setCopiedId(profile.id);
            if (toastTimer.current) clearTimeout(toastTimer.current);
            toastTimer.current = setTimeout(() => setCopiedId(null), 1500);
        });
    }

    function deleteProfile(profileId: number) {
        onChange(profiles.filter((p) => p.id !== profileId));
    }

    return (
        <div className="overflow-hidden">
            <table className="text-xs text-left border-collapse w-full table-fixed">
                <thead>
                    <tr className="border-b border-white/8 bg-[#0a0a0a]">
                        {consumer.columns.map((col) => (
                            <th
                                key={col.key}
                                className="px-3 py-2 text-zinc-500 font-medium truncate"
                            >
                                {col.label}
                            </th>
                        ))}
                        <th className="px-3 py-2 w-20" />
                    </tr>
                </thead>
                <tbody>
                    {profiles.map((profile) => (
                        <tr
                            key={profile.id}
                            className="border-b border-white/5 hover:bg-white/3 transition-colors group"
                        >
                            {consumer.columns.map((col) => {
                                const rawValue = profile[col.key as keyof T];
                                const strVal =
                                    rawValue === null || rawValue === undefined
                                        ? ''
                                        : String(rawValue);
                                const isEditing =
                                    editing?.profileId === profile.id &&
                                    editing?.key === col.key;

                                const isEmpty = strVal === '';
                                const statusColor =
                                    col.key === 'status' && consumer.statusColors
                                        ? (consumer.statusColors[strVal] ?? 'text-zinc-600')
                                        : null;

                                const textClass = statusColor
                                    ? statusColor
                                    : isEmpty
                                      ? 'text-zinc-700'
                                      : col.key === 'id'
                                        ? 'text-zinc-500'
                                        : 'text-white';

                                if (col.editable && col.type === 'select') {
                                    return (
                                        <td key={col.key} className="px-1 py-1">
                                            <Select
                                                value={strVal}
                                                onValueChange={(val) =>
                                                    commitSelect(profile.id, col.key, val)
                                                }
                                            >
                                                <SelectTrigger
                                                    className={[
                                                        'w-full border-transparent bg-transparent',
                                                        textClass,
                                                    ].join(' ')}
                                                >
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {col.options?.map((opt) => (
                                                        <SelectItem key={opt} value={opt}>
                                                            {opt === '' ? '—' : opt}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </td>
                                    );
                                }

                                if (col.editable && isEditing) {
                                    return (
                                        <td key={col.key} className="px-1 py-1">
                                            <input
                                                ref={inputRef}
                                                defaultValue={strVal}
                                                onBlur={commitEdit}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') commitEdit();
                                                    if (e.key === 'Escape') cancelEdit();
                                                }}
                                                className={[
                                                    'w-full bg-zinc-800 border border-white/20 rounded px-2 py-0.5',
                                                    'text-white focus:outline-none focus:border-white/40',
                                                    col.mono ? 'font-mono' : '',
                                                ].join(' ')}
                                            />
                                        </td>
                                    );
                                }

                                return (
                                    <td
                                        key={col.key}
                                        className={[
                                            'px-3 py-2 truncate',
                                            col.mono ? 'font-mono' : '',
                                            textClass,
                                            col.editable
                                                ? 'cursor-pointer hover:bg-white/5 rounded'
                                                : '',
                                        ]
                                            .filter(Boolean)
                                            .join(' ')}
                                        onClick={() => {
                                            if (col.editable) startEdit(profile.id, col.key);
                                        }}
                                    >
                                        {strVal || '—'}
                                    </td>
                                );
                            })}
                            <td className="px-2 py-1 whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => copyProfile(profile)}
                                        className="p-1.5 rounded text-zinc-600 hover:text-zinc-300 hover:bg-white/5 transition-colors"
                                    >
                                        {copiedId === profile.id ? (
                                            <Check size={14} className="text-green-400" />
                                        ) : (
                                            <Copy size={14} />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => deleteProfile(profile.id)}
                                        className="p-1.5 rounded text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
