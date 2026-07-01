import * as XLSX from 'xlsx';
import type { DynamicRow } from './types';

export function parseSourceSheet(file: File): Promise<DynamicRow[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target!.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });

                const sheetName = workbook.SheetNames[0];

                if (!sheetName) {
                    return reject(new Error('Лист не знайдений у файлі'));
                }

                const sheet = workbook.Sheets[sheetName];
                const rows = XLSX.utils.sheet_to_json<DynamicRow>(sheet, {
                    defval: '',
                    raw: false,
                });

                if (rows.length === 0) {
                    return reject(new Error('Лист порожній'));
                }

                resolve(rows);
            } catch (err) {
                reject(err);
            }
        };

        reader.onerror = () => reject(new Error('Не вдалося прочитати файл'));
        reader.readAsArrayBuffer(file);
    });
}
