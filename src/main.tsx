import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { StoreProvider } from './app/StoreProvider';
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <App />
      <Toaster position="bottom-right" richColors />
    </StoreProvider>
  </StrictMode>,
);
