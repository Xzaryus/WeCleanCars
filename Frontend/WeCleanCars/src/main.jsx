import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

// Create a React Query client
const queryClient = new QueryClient();

// Create a simple localStorage persister
const persister = createSyncStoragePersister({
  storage: window.sessionStorage,
});

// Link the query client with the persister
persistQueryClient({
  queryClient,
  persister,
});

// Wrap your app in the provider
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
