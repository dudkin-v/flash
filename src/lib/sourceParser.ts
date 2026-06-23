import * as XLSX from 'xlsx';
import type { SourceRow } from './types';

export function parseSourceSheet(file: File): Promise<SourceRow[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target!.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });

                const sheetName = workbook.SheetNames.find(
                    (n) => n.toLowerCase() === 'source'
                );
                if (!sheetName) {
                    return reject(new Error('Лист "source" не найден в файле'));
                }

                const sheet = workbook.Sheets[sheetName];
                const rows = XLSX.utils.sheet_to_json<SourceRow>(sheet, {
                    defval: '',
                });

                if (rows.length === 0) {
                    return reject(new Error('Лист "source" пустой'));
                }

                resolve(rows);
            } catch (err) {
                reject(err);
            }
        };

        reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
        reader.readAsArrayBuffer(file);
    });
}
