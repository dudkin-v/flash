import * as XLSX from 'xlsx';
import type {
    Consumer,
    SourceRow,
    ProxyConfig,
    AdsPowerCreatePayload,
} from '../lib/types';

export type SplashStatus = '' | 'Успіх' | 'Помилка';

export interface SplashProfile {
    id: number;
    fullName: string;
    firstName: string;
    lastName: string;
    bd: string;
    bdYear: string;
    bdMonth: string;
    bdDay: string;
    address: string;
    state: string;
    ssn: string;
    phone: string;
    email: string;
    password: string;
    adsPower: string;
    promoCode: string;
    status: SplashStatus;
}

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

function buildAddress(row: SourceRow): string {
    return [row.Address, row['Address 2'], row['Address 3'], row['Address 4']]
        .map((s) => s?.trim())
        .filter(Boolean)
        .join(' ');
}

function generatePassword(n: number): string {
    const p = String(n).padStart(2, '0');
    return `Mosoren${p}@${p}`;
}

export const splashConsumer: Consumer<SplashProfile> = {
    key: 'splash',
    label: 'Splash Sports',

    columns: [
        { key: 'id', label: '№', width: '40px' },
        { key: 'fullName', label: 'Full Name', editable: true },
        { key: 'firstName', label: 'First Name', editable: true },
        { key: 'lastName', label: 'Last Name', editable: true },
        { key: 'bd', label: 'BD', editable: true },
        { key: 'bdYear', label: 'BD Year', editable: true },
        { key: 'bdMonth', label: 'BD Month', editable: true },
        { key: 'bdDay', label: 'BD Day', editable: true },
        { key: 'address', label: 'Address', width: '200px', editable: true },
        { key: 'state', label: 'State', width: '50px', editable: true },
        { key: 'ssn', label: 'SSN', editable: true },
        { key: 'phone', label: 'Phone', editable: true },
        { key: 'email', label: 'Email', width: '160px', editable: true },
        { key: 'password', label: 'Password', mono: true, editable: true },
        { key: 'adsPower', label: 'AdsPower', editable: true },
        { key: 'promoCode', label: 'Promo', editable: true },
        {
            key: 'status',
            label: 'Status',
            editable: true,
            type: 'select',
            options: ['', 'Успіх', 'Помилка'],
        },
    ],

    statusColors: {
        '': 'text-purple-600',
        Успіх: 'text-green-400',
        Помилка: 'text-red-400',
    },

    promoModal(profiles: SplashProfile[], promoCodes: string[]): SplashProfile[] {
        return profiles.map((p, i) => ({
            ...p,
            promoCode: promoCodes[i % promoCodes.length] ?? '',
        }));
    },

    exportToExcel(profiles: SplashProfile[]): void {
        const headers = [
            '№',
            'Full Name',
            'First Name',
            'Last Name',
            'BD',
            'BD Year',
            'BD Month',
            'BD Day',
            'Address',
            'SSN',
            'Phone',
            'Email',
            'Password',
            'State',
            'AdsPower',
            'Promo code',
            'Status',
        ];

        const rows = profiles.map((p) => [
            p.id,
            p.fullName,
            p.firstName,
            p.lastName,
            p.bd,
            p.bdYear,
            p.bdMonth,
            p.bdDay,
            p.address,
            p.ssn,
            p.phone,
            p.email,
            p.password,
            p.state,
            p.adsPower,
            p.promoCode,
            p.status,
        ]);

        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'splash');
        XLSX.writeFile(wb, 'splash_profiles.xlsx');
    },

    toAdsPowerPayload(
        profile: SplashProfile,
        proxy: ProxyConfig,
        ua: string
    ): AdsPowerCreatePayload {
        return {
            name: `Profile_${profile.id}`,
            group_id: '0',
            domain_name: 'splashsports.com',
            user_proxy_config: {
                proxy_soft: 'other',
                proxy_type: proxy.type,
                proxy_host: proxy.host,
                proxy_port: proxy.port,
                proxy_user: proxy.user,
                proxy_password: proxy.password,
            },
            fingerprint_config: {
                automatic_timezone: '1',
                language: ['en-US', 'en'],
                ua,
            },
        };
    },

    transform(rows: SourceRow[]): SplashProfile[] {
        return rows
            .filter((row) => row.Name?.trim())
            .map((row, index) => {
                const n = index + 1;
                const { firstName, lastName } = parseName(row.Name);
                const bd = row.BD?.trim() ?? '';
                const { year, month, day } = splitBD(bd);

                return {
                    id: n,
                    fullName: [firstName, lastName].filter(Boolean).join(' '),
                    firstName,
                    lastName,
                    bd,
                    bdYear: year,
                    bdMonth: month,
                    bdDay: day,
                    address: buildAddress(row),
                    state: row['Address 3']?.trim() ?? '',
                    ssn: row.SSN?.trim() ?? '',
                    phone: [row.Phone, row['Phone 2'], row['Phone 3']].map((p) => p?.trim()).find(Boolean) ?? '',
                    email: [row.Email, row['Email 2'], row['Email 3']].map((e) => e?.trim()).find(Boolean) ?? '',
                    password: generatePassword(n),
                    adsPower: '',
                    promoCode: '',
                    status: '',
                };
            });
    },
};
