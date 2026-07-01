import { useState } from 'react';
import { FileDown } from 'lucide-react';
import { Button } from './ui/Button.tsx';
import { ExcelUploader } from './ExcelUploader';
import { PasswordModal } from './PasswordModal';
import { PromoModal } from './PromoModal';
import { parseSourceSheet } from '../lib/sourceParser';
import { transformRows } from '../lib/transform';
import { downloadSourceTemplate } from '../lib/generateTemplate';
import { useProfilesContext } from '../stores/profilesStore';
import type { DynamicRow } from '../lib/types';

type PendingData = { rows: DynamicRow[]; columns: string[] };

export function FileUploaderSection() {
    const { loadData } = useProfilesContext();
    const [fileError, setFileError] = useState<string | null>(null);
    const [stage, setStage] = useState<'idle' | 'password' | 'promo'>('idle');
    const [pendingData, setPendingData] = useState<PendingData | null>(null);

    function handleFile(file: File) {
        setFileError(null);
        parseSourceSheet(file)
            .then((sourceRows) => {
                const { rows, columns } = transformRows(sourceRows);
                if (rows.length === 0) {
                    throw new Error(
                        'Не вдалося розпізнати дані. Перевірте заголовки колонок у файлі'
                    );
                }
                if (rows.length > 100) {
                    throw new Error(
                        `Файл містить ${rows.length} профілів. Максимально допустимо 100`
                    );
                }
                setPendingData({ rows, columns });
                setStage('password');
            })
            .catch((err: Error) => setFileError(err.message));
    }

    function handlePasswordConfirm(passwords: string[]) {
        if (!pendingData) return;
        const rows = pendingData.rows.map((row, i) => ({
            ...row,
            'Password': passwords[i] ?? row['Password'],
        }));
        setPendingData({ ...pendingData, rows });
        setStage('promo');
    }

    function handlePasswordCancel() {
        setPendingData(null);
        setStage('idle');
    }

    function handlePromoConfirm(promoCodes: string[]) {
        if (!pendingData) return;
        const rows = pendingData.rows.map((row, i) => ({
            ...row,
            'Promo Code': promoCodes[i % promoCodes.length] ?? '',
        }));
        loadData(rows, pendingData.columns);
        setPendingData(null);
        setStage('idle');
    }

    function handlePromoCancel() {
        if (!pendingData) return;
        loadData(pendingData.rows, pendingData.columns);
        setPendingData(null);
        setStage('idle');
    }

    return (
        <>
            <section className="rounded-2xl border border-white/8 bg-[#111111] p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-medium text-zinc-400">Завантажте Excel-файл</h2>
                    <Button size="sm" variant="ghost" onClick={downloadSourceTemplate}>
                        <FileDown className="size-4" />
                        Шаблон
                    </Button>
                </div>
                <ExcelUploader onFile={handleFile} disabled={false} />
                {fileError && (
                    <p className="mt-3 text-sm text-red-400 bg-red-950/40 border border-red-800/40 rounded-lg px-4 py-2">
                        {fileError}
                    </p>
                )}
            </section>

            {stage === 'password' && pendingData && (
                <PasswordModal
                    count={pendingData.rows.length}
                    onConfirm={handlePasswordConfirm}
                    onCancel={handlePasswordCancel}
                />
            )}

            {stage === 'promo' && pendingData && (
                <PromoModal onConfirm={handlePromoConfirm} onCancel={handlePromoCancel} />
            )}
        </>
    );
}
