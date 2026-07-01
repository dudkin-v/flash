import type { DynamicRow } from './types';

const ROWS_KEY = 'flash_rows';
const COLUMNS_KEY = 'flash_columns';

export function saveData(rows: DynamicRow[], columns: string[]): void {
    try {
        localStorage.setItem(ROWS_KEY, JSON.stringify(rows));
        localStorage.setItem(COLUMNS_KEY, JSON.stringify(columns));
    } catch {
        // localStorage quota exceeded — silently ignore
    }
}

export function loadData(): { rows: DynamicRow[]; columns: string[] } | null {
    try {
        const rawRows = localStorage.getItem(ROWS_KEY);
        const rawCols = localStorage.getItem(COLUMNS_KEY);
        if (!rawRows || !rawCols) return null;
        return {
            rows: JSON.parse(rawRows) as DynamicRow[],
            columns: JSON.parse(rawCols) as string[],
        };
    } catch {
        return null;
    }
}

export function clearData(): void {
    localStorage.removeItem(ROWS_KEY);
    localStorage.removeItem(COLUMNS_KEY);
}
