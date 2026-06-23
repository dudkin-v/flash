interface Props {
    total: number;
    current: number;
    currentName: string;
}

export function CreateProgress({ total, current, currentName }: Props) {
    const percent = total === 0 ? 0 : Math.round((current / total) * 100);

    return (
        <div className="rounded-2xl border border-purple-900/40 bg-[#150e2a]/60 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-purple-200">
                    Створення профілів...
                </span>
                <span className="text-sm text-purple-400">
                    {current} / {total}
                </span>
            </div>

            <div className="w-full h-2 bg-purple-950/60 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-violet-600 to-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                />
            </div>

            {currentName && (
                <p className="text-xs text-purple-600 truncate">
                    Обробляється:{' '}
                    <span className="text-purple-400">{currentName}</span>
                </p>
            )}
        </div>
    );
}
