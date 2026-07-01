import { createContext } from 'react';
import type { DynamicRow } from '../../lib/types';

export interface ProfilesContextValue {
    rows: DynamicRow[];
    columns: string[];
    loadData: (rows: DynamicRow[], columns: string[]) => void;
    updateRows: (rows: DynamicRow[]) => void;
    clearData: () => void;
}

export const ProfilesContext = createContext<ProfilesContextValue>({
    rows: [],
    columns: [],
    loadData: () => {},
    updateRows: () => {},
    clearData: () => {},
});
