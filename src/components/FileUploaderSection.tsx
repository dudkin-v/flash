import { useState } from 'react';
import { ExcelUploader } from './ExcelUploader';
import { PromoModal } from './PromoModal';
import { parseSourceSheet } from '../lib/sourceParser';
import { useConsumerContext } from '../stores/consumerStore';
import { useProfilesContext } from '../stores/profilesStore';
import type { BaseProfile } from '../lib/types';

export function FileUploaderSection() {
    const { selectedConsumer } = useConsumerContext();
    const { updateProfiles } = useProfilesContext();
    const [fileError, setFileError] = useState<string | null>(null);
    const [pendingProfiles, setPendingProfiles] = useState<BaseProfile[] | null>(null);

    function handleFile(file: File) {
        if (!selectedConsumer) return;
        setFileError(null);

        parseSourceSheet(file)
            .then((rows) => {
                const profiles = selectedConsumer.transform(rows);
                if (selectedConsumer.promoModal) {
                    setPendingProfiles(profiles);
                } else {
                    updateProfiles(profiles);
                }
            })
            .catch((err: Error) => setFileError(err.message));
    }

    function handlePromoConfirm(promoCodes: string[]) {
        if (!selectedConsumer?.promoModal || !pendingProfiles) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        updateProfiles(selectedConsumer.promoModal(pendingProfiles as any[], promoCodes));
        setPendingProfiles(null);
    }

    function handlePromoCancel() {
        if (!pendingProfiles) return;
        updateProfiles(pendingProfiles);
        setPendingProfiles(null);
    }

    return (
        <>
            <section className="rounded-2xl border border-white/8 bg-[#111111] p-6">
                <h2 className="text-sm font-medium text-zinc-400 mb-4">
                    Завантажте Excel-файл
                </h2>
                <ExcelUploader onFile={handleFile} disabled={false} />
                {fileError && (
                    <p className="mt-3 text-sm text-red-400 bg-red-950/40 border border-red-800/40 rounded-lg px-4 py-2">
                        {fileError}
                    </p>
                )}
            </section>

            {pendingProfiles && (
                <PromoModal
                    onConfirm={handlePromoConfirm}
                    onCancel={handlePromoCancel}
                />
            )}
        </>
    );
}
