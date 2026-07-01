import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ProfilesContextProvider } from './stores/profilesStore';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ProfilesContextProvider>
            <App />
        </ProfilesContextProvider>
    </StrictMode>
);
