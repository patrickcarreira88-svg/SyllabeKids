import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import { Analytics } from '@vercel/analytics/react'
import * as Sentry from "@sentry/react"

// Initialiser Sentry avec les variables d'environnement
Sentry.init({
  dsn: (import.meta.env as any).VITE_SENTRY_DSN,
  environment: (import.meta.env as any).MODE,
  tracesSampleRate: 1.0,
})

/**
 * Service Worker Registration
 * ✅ PRODUCTION (npm run build) : SW activé
 * ℹ️ DÉVELOPPEMENT (npm run dev) : SW désactivé
 */

// Déterminer l'environnement
const isDev = !globalThis.window || (process.env.NODE_ENV === 'development')

if ('serviceWorker' in navigator && !isDev) {
  // 🎯 PRODUCTION MODE : Enregistrer le Service Worker
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered successfully')
        console.log('   Scope:', registration.scope)
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error)
      })
  })
} else if (isDev) {
  // ℹ️ DEVELOPMENT MODE : SW désactivé
  console.log('ℹ️ Service Worker disabled in development mode (npm run dev)')
  console.log('   To test SW, run: npm run build && npm run preview')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>,
)
