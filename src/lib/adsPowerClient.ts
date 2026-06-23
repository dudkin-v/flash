import axios from 'axios';
import { config } from './config';
import type { AdsPowerCreatePayload } from './types';

const client = axios.create({ baseURL: config.adsPowerApiUrl, timeout: 10000 });

export async function checkApiStatus(): Promise<boolean> {
    try {
        const res = await client.get('/api/v1/status');
        return res.data?.code === 0;
    } catch {
        return false;
    }
}

export async function createAdsPowerProfile(
    payload: AdsPowerCreatePayload
): Promise<string> {
    const res = await client.post('/api/v1/user/create', payload);
    if (res.data?.code !== 0) {
        throw new Error(res.data?.msg ?? 'AdsPower API error');
    }
    return res.data.data.id as string;
}
