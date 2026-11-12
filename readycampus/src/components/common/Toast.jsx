import { useEffect } from 'react'
import { CheckCircle2, CircleAlert, X } from 'lucide-react'
import { useStore } from '../../context/StoreContext.jsx'

export function Toast() {
  const { toast, dismissToast } = useStore()
  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(dismissToast, 3200)
    return () => window.clearTimeout(timer)
  }, [toast, dismissToast])
  if (!toast) return null
  const Icon = toast.tone === 'error' ? CircleAlert : CheckCircle2
  return <div className={`toast toast-${toast.tone}`} role="status"><Icon size={19} /><span>{toast.message}</span><button aria-label="Dismiss notification" onClick={dismissToast}><X size={17} /></button></div>
}
