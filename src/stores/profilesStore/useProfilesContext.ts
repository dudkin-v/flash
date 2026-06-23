import { useContext } from 'react';
import { ProfilesContext } from './profilesContext';

export function useProfilesContext() {
    return useContext(ProfilesContext);
}
