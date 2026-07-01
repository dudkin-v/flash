import { useState, useCallback, useMemo, type PropsWithChildren } from 'react';
import { ProfilesContext } from './profilesContext';
import { saveData, loadData, clearData as clearStorage } from '../../lib/storage';
import type { DynamicRow } from '../../lib/types';

function init(): { rows: DynamicRow[]; columns: string[] } {
    return loadData() ?? { rows: [], columns: [] };
}

export function ProfilesContextProvider({ children }: PropsWithChildren) {
    const [{ rows, columns }, setState] = useState(init);

    const loadDataCtx = useCallback((newRows: DynamicRow[], newColumns: string[]) => {
        setState({ rows: newRows, columns: newColumns });
        saveData(newRows, newColumns);
    }, []);

    const updateRows = useCallback((newRows: DynamicRow[]) => {
        setState((prev) => {
            saveData(newRows, prev.columns);
            return { rows: newRows, columns: prev.columns };
        });
    }, []);

    const clearDataCtx = useCallback(() => {
        clearStorage();
        setState({ rows: [], columns: [] });
    }, []);

    const value = useMemo(
        () => ({ rows, columns, loadData: loadDataCtx, updateRows, clearData: clearDataCtx }),
        [rows, columns, loadDataCtx, updateRows, clearDataCtx]
    );

    return <ProfilesContext.Provider value={value}>{children}</ProfilesContext.Provider>;
}
