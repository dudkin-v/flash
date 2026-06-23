import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConsumerContextProvider } from './stores/consumerStore';
import { ProfilesContextProvider } from './stores/profilesStore';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ConsumerContextProvider>
            <ProfilesContextProvider>
                <App />
            </ProfilesContextProvider>
        </ConsumerContextProvider>
    </StrictMode>
);
