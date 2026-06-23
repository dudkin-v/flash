import * as XLSX from 'xlsx';
import type { ProfileConfig } from './types';

const REQUIRED_COLUMNS = ['name', 'group_id'];

const DEFAULT_FINGERPRINT = {
    automatic_timezone: '1' as const,
    language: ['en-US', 'en'],
    flash: 'block',
    fonts: ['all'],
    webrtc: 'disabled',
    ua: '',
};

export interface ParseError {
    row: number;
    message: string;
}

export interface ParseResult {
    profiles: (ProfileConfig & { _row: number })[];
    errors: ParseError[];
}

export function parseExcel(file: File): Promise<ParseResult> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target!.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const rows = XLSX.utils.sheet_to_json<Record<string, string>>(
                    sheet,
                    {
                        defval: '',
                    }
                );

                if (rows.length === 0) {
                    return reject(
                        new Error('Файл порожній або не містить даних')
                    );
                }

                const missingColumns = REQUIRED_COLUMNS.filter(
                    (col) => !(col in rows[0])
                );
                if (missingColumns.length > 0) {
                    return reject(
                        new Error(
                            `Відсутні обов'язкові колонки: ${missingColumns.join(', ')}`
                        )
                    );
                }

                const profiles: (ProfileConfig & { _row: number })[] = [];
                const errors: ParseError[] = [];

                rows.forEach((row, index) => {
                    const rowNum = index + 2;

                    if (!row.name?.trim()) {
                        errors.push({
                            row: rowNum,
                            message: 'Порожнє поле name',
                        });
                        return;
                    }
                    if (!row.group_id?.trim()) {
                        errors.push({
                            row: rowNum,
                            message: 'Порожнє поле group_id',
                        });
                        return;
                    }

                    const profile: ProfileConfig & { _row: number } = {
                        _row: rowNum,
                        name: row.name.trim(),
                        group_id: row.group_id.trim(),
                        domain_name: row.domain_name?.trim() || undefined,
                        username: row.username?.trim() || undefined,
                        password: row.password?.trim() || undefined,
                        cookie: row.cookie?.trim() || undefined,
                        remark: row.remark?.trim() || undefined,
                        fingerprint_config: { ...DEFAULT_FINGERPRINT },
                    };

                    if (row.proxy_host?.trim()) {
                        profile.user_proxy_config = {
                            proxy_soft: 'other',
                            proxy_type: row.proxy_type?.trim() || 'http',
                            proxy_host: row.proxy_host.trim(),
                            proxy_port: row.proxy_port?.trim() || '',
                            proxy_user: row.proxy_user?.trim() || '',
                            proxy_password: row.proxy_password?.trim() || '',
                        };
                    }

                    profiles.push(profile);
                });

                resolve({ profiles, errors });
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = () => reject(new Error('Не вдалося прочитати файл'));
        reader.readAsArrayBuffer(file);
    });
}
