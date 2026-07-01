import { FileDown } from 'lucide-react';
import { Button } from '../ui/Button';

export function Header() {
    function downloadExtension() {
        const a = document.createElement('a');
        a.href = '/downloads/flash-autofill.zip';
        a.download = 'Flash Autofill';
        a.click();
    }

    return (
        <header className="border-b border-white/8 bg-[#111111] px-8 py-4">
            <div className="max-w-363 mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <img src="/favicon.svg" className="w-6 h-6" alt="Flash logo" />
                    <h1 className="text-base font-semibold text-white">Flash</h1>
                </div>
                <Button size="sm" variant="primary" onClick={downloadExtension}>
                    <FileDown className="size-4" />
                    Розширення
                </Button>
            </div>
        </header>
    );
}
