import { useEffect, useState } from 'react'

/**
 * Captures the browser's beforeinstallprompt event and shows a
 * friendly modal asking the user to install the PWA.
 *
 * - Only shows once (remembers dismissal in localStorage).
 * - On "Install", triggers the native browser install flow.
 * - On "Maybe later", hides and won't show again this session.
 */
export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Don't show if already installed or already dismissed
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if (localStorage.getItem('pwa-install-dismissed')) return

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      // Small delay so the app loads first
      setTimeout(() => setShow(true), 2000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      localStorage.setItem('pwa-install-dismissed', '1')
    }
    setDeferredPrompt(null)
    setShow(false)
  }

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', '1')
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      className="fixed inset-0 flex items-end justify-center p-4"
      style={{ zIndex: 10002, background: 'rgba(0,0,0,0.6)' }}
    >
      <div
        className="card w-full max-w-[430px] p-5 text-center slide-up"
        style={{ borderColor: 'var(--green)', marginBottom: 20 }}
      >
        <div className="text-4xl mb-3">📲</div>
        <h3 className="text-lg font-black mb-1">Install Life Game</h3>
        <p className="text-sm mb-4" style={{ color: 'var(--text-dim)' }}>
          Add to your home screen for the full experience — instant access, offline support, and push notifications.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleDismiss}
            className="btn btn-ghost flex-1 py-3 text-sm"
          >
            Maybe later
          </button>
          <button
            onClick={handleInstall}
            className="btn btn-green flex-1 py-3 text-sm"
          >
            INSTALL
          </button>
        </div>
      </div>
    </div>
  )
}
