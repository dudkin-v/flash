import { useState, useRef } from 'react';
import { Trash2, Copy, Check } from 'lucide-react';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from './ui/Select';
import type { DynamicRow } from '../lib/types';

const STATUS_OPTIONS = ['', 'Успіх', 'Помилка'] as const;
const STATUS_COLORS: Record<string, string> = {
    '': 'text-purple-600',
    'Успіх': 'text-green-400',
    'Помилка': 'text-red-400',
};

const READ_ONLY_COLS = new Set(['ID', 'BD Year', 'BD Month', 'BD Day']);

interface Props {
    columns: string[];
    rows: DynamicRow[];
    onChange: (rows: DynamicRow[]) => void;
}

interface EditingCell {
    rowIndex: number;
    key: string;
}

export function ProfilesTable({ columns, rows, onChange }: Props) {
    const [editing, setEditing] = useState<EditingCell | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    if (rows.length === 0) return null;

    function startEdit(rowIndex: number, key: string) {
        setEditing({ rowIndex, key });
        setTimeout(() => inputRef.current?.focus(), 0);
    }

    function commitEdit() {
        if (!editing) return;
        const value = inputRef.current?.value ?? '';
        const updated = rows.map((row, i) =>
            i === editing.rowIndex ? { ...row, [editing.key]: value } : row
        );
        onChange(updated);
        setEditing(null);
    }

    function commitSelect(rowIndex: number, key: string, value: string) {
        const updated = rows.map((row, i) =>
            i === rowIndex ? { ...row, [key]: value } : row
        );
        onChange(updated);
    }

    function cancelEdit() {
        setEditing(null);
    }

    function copyRow(row: DynamicRow, index: number) {
        navigator.clipboard.writeText(JSON.stringify(row, null, 2)).then(() => {
            setCopiedIndex(index);
            if (toastTimer.current) clearTimeout(toastTimer.current);
            toastTimer.current = setTimeout(() => setCopiedIndex(null), 1500);
        });
    }

    function deleteRow(index: number) {
        onChange(rows.filter((_, i) => i !== index));
    }

    return (
        <div className="overflow-x-auto">
            <table className="text-xs text-left border-collapse w-full table-fixed">
                <thead>
                    <tr className="border-b border-white/8 bg-[#0a0a0a]">
                        {columns.map((col) => (
                            <th
                                key={col}
                                className="px-3 py-2 text-zinc-500 font-medium truncate"
                            >
                                {col}
                            </th>
                        ))}
                        <th className="px-3 py-2 w-20" />
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="border-b border-white/5 hover:bg-white/3 transition-colors group"
                        >
                            {columns.map((col) => {
                                const strVal = row[col] ?? '';
                                const isEditing =
                                    editing?.rowIndex === rowIndex && editing?.key === col;
                                const isReadOnly = READ_ONLY_COLS.has(col);
                                const isEmpty = strVal === '';

                                const textClass =
                                    col === 'Status'
                                        ? (STATUS_COLORS[strVal] ?? 'text-zinc-600')
                                        : col === 'ID'
                                          ? 'text-zinc-500'
                                          : isEmpty
                                            ? 'text-zinc-700'
                                            : 'text-white';

                                if (col === 'Status') {
                                    return (
                                        <td key={col} className="px-1 py-1">
                                            <Select
                                                value={strVal}
                                                onValueChange={(val) =>
                                                    commitSelect(rowIndex, col, val)
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
                                                    {STATUS_OPTIONS.map((opt) => (
                                                        <SelectItem key={opt} value={opt}>
                                                            {opt === '' ? '—' : opt}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </td>
                                    );
                                }

                                if (!isReadOnly && isEditing) {
                                    return (
                                        <td key={col} className="px-1 py-1">
                                            <input
                                                ref={inputRef}
                                                defaultValue={strVal}
                                                onBlur={commitEdit}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') commitEdit();
                                                    if (e.key === 'Escape') cancelEdit();
                                                }}
                                                className="w-full bg-zinc-800 border border-white/20 rounded px-2 py-0.5 text-white focus:outline-none focus:border-white/40"
                                            />
                                        </td>
                                    );
                                }

                                return (
                                    <td
                                        key={col}
                                        className={[
                                            'px-3 py-2 truncate',
                                            textClass,
                                            !isReadOnly
                                                ? 'cursor-pointer hover:bg-white/5 rounded'
                                                : '',
                                        ]
                                            .filter(Boolean)
                                            .join(' ')}
                                        onClick={() => {
                                            if (!isReadOnly) startEdit(rowIndex, col);
                                        }}
                                    >
                                        {strVal || '—'}
                                    </td>
                                );
                            })}
                            <td className="px-2 py-1 whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => copyRow(row, rowIndex)}
                                        className="p-1.5 rounded text-zinc-600 hover:text-zinc-300 hover:bg-white/5 transition-colors cursor-pointer"
                                    >
                                        {copiedIndex === rowIndex ? (
                                            <Check size={14} className="text-green-400" />
                                        ) : (
                                            <Copy size={14} />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => deleteRow(rowIndex)}
                                        className="p-1.5 rounded text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
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
