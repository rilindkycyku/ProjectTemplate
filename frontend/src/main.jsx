import { Buffer } from 'buffer';
if (typeof window !== 'undefined') window.Buffer = Buffer;
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./Context/AuthContext";
import { SiteSettingsProvider } from "./Context/SiteSettingsContext";
import ErrorBoundary from "./Components/ErrorPages/ErrorBoundary";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <AuthProvider>
          <BrowserRouter>
            <SiteSettingsProvider>
              <App />
            </SiteSettingsProvider>
          </BrowserRouter>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
)
