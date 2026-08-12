'use client'
import { useEffect, ReactNode, startTransition } from 'react'
import { SessionProvider } from 'next-auth/react'
import { useProductStore, useSiteSettingsStore } from '@/lib/stores'

interface StoreProviderProps {
  children: ReactNode
}

// ─── StoreProvider ────────────────────────────────────────────────────────────
// Suppression de Redux (RTK + immer + react-redux = ~47 KiB) → Zustand (~2 KiB)
// Le Provider Redux est remplacé par SessionProvider uniquement.
// Les stores Zustand sont globaux et n'ont pas besoin de Provider.
// ─────────────────────────────────────────────────────────────────────────────
export default function StoreProvider({ children }: StoreProviderProps) {
  const setProduct = useProductStore(s => s.setProduct)
  const updateSiteSettings = useSiteSettingsStore(s => s.updateSiteSettings)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const executeBackgroundTasks = () => {
      const runTask = () => {
        // 1. Fetch live products depuis l'API PostgreSQL en tâche d'arrière-plan (requestIdleCallback)
        fetch('/api/products')
          .then((res) => res.json())
          .then((data) => {
            if (data.success && Array.isArray(data.products) && data.products.length > 0) {
              startTransition(() => {
                setProduct(data.products)
              })
            }
          })
          .catch(() => {})

        // 2. Charger les settings depuis localStorage hors du critical path
        try {
          const savedSettings = localStorage.getItem('sentech_settings')
          if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings)
            startTransition(() => {
              updateSiteSettings(parsedSettings)
            })
          }
        } catch {
          // ignore error
        }
      }

      if ('requestIdleCallback' in window) {
        ;(window as any).requestIdleCallback(runTask, { timeout: 4000 })
      } else {
        setTimeout(runTask, 1200)
      }
    }

    if (document.readyState === 'complete') {
      executeBackgroundTasks()
    } else {
      window.addEventListener('load', executeBackgroundTasks, { once: true })
    }

    // 3. Sauvegarder les settings avec debounce 500ms
    let debounceTimer: ReturnType<typeof setTimeout> | null = null
    const unsubscribe = useSiteSettingsStore.subscribe((state) => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        try {
          const { updateSiteSettings: _, updateBannerSettings: __, updateHeroSettings: ___, ...settings } = state
          localStorage.setItem('sentech_settings', JSON.stringify(settings))
        } catch (e) {
          if (process.env.NODE_ENV !== 'production') {
            console.error('Error saving state to localStorage', e)
          }
        }
      }, 500)
    })

    return () => {
      unsubscribe()
      if (debounceTimer) clearTimeout(debounceTimer)
    }
  }, [setProduct, updateSiteSettings])

  return (
    <SessionProvider refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  )
}
