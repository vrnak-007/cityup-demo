import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { AppProvider } from './lib/store'
import { TenantProvider } from './spravce/tenant'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <TenantProvider>
        <App />
      </TenantProvider>
    </AppProvider>
  </StrictMode>,
)
