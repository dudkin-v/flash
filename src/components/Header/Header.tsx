import { useConsumerContext } from '../../stores/consumerStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { DropdownMenu } from '../ui/DropdownMenu';
import { consumers } from '../../consumers';

const extensions = [
    { label: 'Flash Autofill (Chrome)', file: '/downloads/flash-autofill.zip' },
];

export function Header() {
    const { selectedConsumer, selectConsumer } = useConsumerContext();

    function downloadExtension(file: string, label: string) {
        const a = document.createElement('a');
        a.href = file;
        a.download = label;
        a.click();
    }

    return (
        <header className="border-b border-white/8 bg-[#111111] px-8 py-4">
            <div className="max-w-363 mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <img src="/favicon.svg" className="w-6 h-6" alt="Flash logo" />
                    <h1 className="text-base font-semibold text-white">Flash</h1>
                </div>
                <div className="flex items-center gap-3">
                    <DropdownMenu
                        label="Завантажити розширення"
                        items={extensions.map((ext) => ({
                            label: ext.label,
                            onClick: () => downloadExtension(ext.file, ext.label),
                        }))}
                    />
                    <Select
                        value={selectedConsumer?.key}
                        onValueChange={selectConsumer}
                    >
                        <SelectTrigger className="w-56">
                            Сайт: <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {consumers.map((consumer) => (
                                <SelectItem key={consumer.key} value={consumer.key}>
                                    {consumer.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </header>
    );
}
