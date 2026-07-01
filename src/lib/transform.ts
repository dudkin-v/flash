import type { DynamicRow } from './types';

const KNOWN_SOURCE_KEYS = new Set([
    'Name', 'BD', 'SSN',
    'Address', 'Address 2', 'Address 3', 'Address 4',
    'Phone', 'Phone 2', 'Phone 3',
    'Email', 'Email 2', 'Email 3',
]);

export const FIXED_COLUMNS = [
    'ID', 'Full Name', 'First Name', 'Last Name',
    'BD', 'BD Year', 'BD Month', 'BD Day',
    'Address', 'State', 'SSN', 'Phone', 'Email',
    'Password', 'AdsPower', 'Promo Code', 'Status',
];

function parseName(name: string): { firstName: string; lastName: string } {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return { firstName: '', lastName: '' };
    if (parts.length === 1) return { firstName: parts[0], lastName: '' };
    return { firstName: parts[0], lastName: parts[parts.length - 1] };
}

function splitBD(bd: string): { year: string; month: string; day: string } {
    const [year = '', month = '', day = ''] = bd.split('-');
    return { year, month, day };
}

export function transformRows(sourceRows: DynamicRow[]): { rows: DynamicRow[]; columns: string[] } {
    const extraKeys =
        sourceRows.length > 0
            ? Object.keys(sourceRows[0]).filter(
                  (k) => !KNOWN_SOURCE_KEYS.has(k) && !k.startsWith('__EMPTY')
              )
            : [];

    const columns = [...FIXED_COLUMNS, ...extraKeys];

    const rows = sourceRows
        .filter((row) => row.Name?.trim())
        .map((row, index) => {
            const n = index + 1;
            const { firstName, lastName } = parseName(row.Name ?? '');
            const bd = row.BD?.trim() ?? '';
            const { year, month, day } = splitBD(bd);
            const address = [row.Address, row['Address 2'], row['Address 3'], row['Address 4']]
                .map((s) => s?.trim())
                .filter(Boolean)
                .join(' ');

            const transformed: DynamicRow = {
                'ID': String(n),
                'Full Name': [firstName, lastName].filter(Boolean).join(' '),
                'First Name': firstName,
                'Last Name': lastName,
                'BD': bd,
                'BD Year': year,
                'BD Month': month,
                'BD Day': day,
                'Address': address,
                'State': row['Address 3']?.trim() ?? '',
                'SSN': row.SSN?.trim() ?? '',
                'Phone':
                    [row.Phone, row['Phone 2'], row['Phone 3']]
                        .map((p) => p?.trim())
                        .find(Boolean) ?? '',
                'Email':
                    [row.Email, row['Email 2'], row['Email 3']]
                        .map((e) => e?.trim())
                        .find(Boolean) ?? '',
                'Password': '',
                'AdsPower': '',
                'Promo Code': '',
                'Status': '',
            };

            for (const key of extraKeys) {
                transformed[key] = row[key] ?? '';
            }

            return transformed;
        });

    return { rows, columns };
}
