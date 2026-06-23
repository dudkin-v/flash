import type { BaseProfile } from './types';

const PREFIX = 'adspower_profiles_';

export function saveProfiles(
    consumerKey: string,
    profiles: BaseProfile[]
): void {
    try {
        localStorage.setItem(PREFIX + consumerKey, JSON.stringify(profiles));
    } catch {
        // localStorage quota exceeded — silently ignore
    }
}

export function loadProfiles<T extends BaseProfile>(
    consumerKey: string
): T[] | null {
    try {
        const raw = localStorage.getItem(PREFIX + consumerKey);
        if (!raw) return null;
        return JSON.parse(raw) as T[];
    } catch {
        return null;
    }
}

export function clearProfiles(consumerKey: string): void {
    localStorage.removeItem(PREFIX + consumerKey);
}
