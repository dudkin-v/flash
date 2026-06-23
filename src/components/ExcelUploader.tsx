import { useRef, useState } from 'react';

interface Props {
    onFile: (file: File) => void;
    disabled?: boolean;
}

export function ExcelUploader({ onFile, disabled }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragging(false);
        if (disabled) return;
        const file = e.dataTransfer.files[0];
        if (file && isExcel(file)) onFile(file);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) onFile(file);
        e.target.value = '';
    }

    function isExcel(f: File) {
        return f.name.endsWith('.xlsx') || f.name.endsWith('.xls');
    }

    return (
        <div
            onDragOver={(e) => {
                e.preventDefault();
                if (!disabled) setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !disabled && inputRef.current?.click()}
            className={[
                'border-2 border-dashed rounded-xl p-10 flex flex-col items-center gap-3 transition-all cursor-pointer select-none',
                dragging
                    ? 'border-white/40 bg-white/5'
                    : 'border-white/10 bg-transparent hover:border-white/20 hover:bg-white/3',
                disabled ? 'opacity-50 cursor-not-allowed' : '',
            ].join(' ')}
        >
            <div
                className={[
                    'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
                    dragging ? 'bg-white/15' : 'bg-white/5',
                ].join(' ')}
            >
                <svg
                    className={[
                        'w-6 h-6 transition-colors',
                        dragging ? 'text-white' : 'text-zinc-400',
                    ].join(' ')}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                </svg>
            </div>
            <p className="text-sm text-zinc-300 font-medium text-center">
                {dragging
                    ? 'Відпустіть файл'
                    : 'Перетягніть файл або натисніть для вибору'}
            </p>
            <p className="text-xs text-zinc-600">.xlsx / .xls</p>
            <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleChange}
                disabled={disabled}
            />
        </div>
    );
}
