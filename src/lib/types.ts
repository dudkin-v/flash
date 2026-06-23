export interface SourceRow {
    BD: string;
    SSN: string;
    NAME: string;
    Address: string;
    'Address 2': string;
    'Address 3': string;
    'Address 4': string;
    Phone: string;
    Email: string;
    'Email 2': string;
    'Email 3': string;
}

// Базовый профиль консьюмера — extends этим в каждом consumers/*.ts
export interface BaseProfile {
    id: number;
}

export interface ColumnDef<T> {
    key: keyof T & string;
    label: string;
    width?: string;
    mono?: boolean;
    editable?: boolean;
    type?: 'text' | 'select';
    options?: string[];
}

export interface ProxyConfig {
    type: 'socks5' | 'http' | 'https';
    host: string;
    port: string;
    user: string;
    password: string;
}

export interface AdsPowerCreatePayload {
    name: string;
    group_id: string;
    domain_name?: string;
    user_proxy_config: {
        proxy_soft: string;
        proxy_type: string;
        proxy_host: string;
        proxy_port: string;
        proxy_user: string;
        proxy_password: string;
    };
    fingerprint_config: {
        automatic_timezone: string;
        language: string[];
        ua: string;
    };
}

export interface Consumer<T extends BaseProfile> {
    key: string;
    label: string;
    columns: ColumnDef<T>[];
    transform: (rows: SourceRow[]) => T[];
    exportToExcel: (profiles: T[]) => void;
    statusColors?: Record<string, string>;
    promoModal?: (profiles: T[], promoCodes: string[]) => T[];
    toAdsPowerPayload?: (
        profile: T,
        proxy: ProxyConfig,
        ua: string
    ) => AdsPowerCreatePayload;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnknownConsumer = Consumer<any>;
