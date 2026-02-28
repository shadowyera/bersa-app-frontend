import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { APP_CONFIG } from '@/config/app.config'
import App from './App'
import './index.css'

import { AuthProvider } from './modules/auth/useAuth'
import { queryClient } from './shared/query/queryClient'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { CajaProvider } from './modules/pos/caja/context/CajaProvider'

const rootElement = document.getElementById('root')
document.title = APP_CONFIG.appName

if (!rootElement) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <CajaProvider>
            <App />
            {import.meta.env.DEV && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </CajaProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)