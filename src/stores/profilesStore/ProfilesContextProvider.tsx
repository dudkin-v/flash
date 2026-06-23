import { useState, useCallback, useMemo, type PropsWithChildren } from 'react';
import {
    saveProfiles,
    loadProfiles,
    clearProfiles as clearProfilesStorage,
} from '../../lib/storage';
import { useConsumerContext } from '../consumerStore';
import { ProfilesContext } from './profilesContext';
import type { BaseProfile } from '../../lib/types';

export function ProfilesContextProvider({ children }: PropsWithChildren) {
    const { selectedConsumer } = useConsumerContext();

    const [activeKey, setActiveKey] = useState(selectedConsumer?.key);
    const [profiles, setProfiles] = useState<BaseProfile[]>(() =>
        selectedConsumer ? (loadProfiles<BaseProfile>(selectedConsumer.key) ?? []) : []
    );

    if (selectedConsumer?.key !== activeKey) {
        setActiveKey(selectedConsumer?.key);
        setProfiles(
            selectedConsumer ? (loadProfiles<BaseProfile>(selectedConsumer.key) ?? []) : []
        );
    }

    const updateProfiles = useCallback(
        (next: BaseProfile[]) => {
            if (!selectedConsumer) return;
            setProfiles(next);
            saveProfiles(selectedConsumer.key, next);
        },
        [selectedConsumer]
    );

    const clearProfiles = useCallback(() => {
        if (!selectedConsumer) return;
        clearProfilesStorage(selectedConsumer.key);
        setProfiles([]);
    }, [selectedConsumer]);

    const value = useMemo(
        () => ({ profiles, updateProfiles, clearProfiles }),
        [profiles, updateProfiles, clearProfiles]
    );

    return <ProfilesContext.Provider value={value}>{children}</ProfilesContext.Provider>;
}
