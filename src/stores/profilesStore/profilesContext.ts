import { createContext } from 'react';
import type { BaseProfile } from '../../lib/types';

export interface ProfilesContextValue {
    profiles: BaseProfile[];
    updateProfiles: (profiles: BaseProfile[]) => void;
    clearProfiles: () => void;
}

export const ProfilesContext = createContext<ProfilesContextValue>({
    profiles: [],
    updateProfiles: () => {},
    clearProfiles: () => {},
});
