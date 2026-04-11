import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Capture beforeinstallprompt ASAP — before React mounts — so it isn't missed
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  window.__pwaInstallPrompt = e
})

// Cache buster: every build gets a new timestamp baked in.
// If it differs from what's stored, nuke caches and reload.
const BUILD_VERSION = import.meta.env.VITE_BUILD_VERSION || '__dev__'
const STORED_VERSION = localStorage.getItem('app-version')

if (STORED_VERSION && STORED_VERSION !== BUILD_VERSION && BUILD_VERSION !== '__dev__') {
  // New deployment detected — bust everything
  localStorage.setItem('app-version', BUILD_VERSION)

  // Unregister all service workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((r) => r.unregister())
    })
  }

  // Clear all caches
  if ('caches' in window) {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name))
    })
  }

  // Force reload from server
  window.location.reload()
} else {
  localStorage.setItem('app-version', BUILD_VERSION)

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
