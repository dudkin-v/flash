import * as XLSX from 'xlsx';
import type { CreateProfileResult } from './types';

export function exportResults(results: CreateProfileResult[]) {
    const rows = results.map((r) => ({
        Строка: r.row,
        Название: r.name,
        Статус: r.success ? 'Успешно' : 'Ошибка',
        'ID профиля': r.profileId ?? '',
        Ошибка: r.error ?? '',
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [
        { wch: 8 },
        { wch: 24 },
        { wch: 12 },
        { wch: 20 },
        { wch: 40 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Results');

    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `adspower_results_${date}.xlsx`);
}
