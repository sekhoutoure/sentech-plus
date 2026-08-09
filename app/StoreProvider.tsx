'use client'
import { useRef, useEffect, ReactNode, startTransition } from 'react'
import { Provider } from 'react-redux'
import { SessionProvider } from 'next-auth/react'
import { makeStore, AppStore } from '../lib/store'
import { setProduct } from '../lib/features/product/productSlice'
import { updateSiteSettings } from '../lib/features/siteSettings/siteSettingsSlice'

interface StoreProviderProps {
  children: ReactNode
}

export default function StoreProvider({ children }: StoreProviderProps) {
  const storeRef = useRef<AppStore | undefined>(undefined)
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && storeRef.current) {
      const executeBackgroundTasks = () => {
        const runTask = () => {
          // 1. Fetch live products from PostgreSQL API endpoint
          fetch('/api/products')
            .then((res) => res.json())
            .then((data) => {
              if (data.success && Array.isArray(data.products) && data.products.length > 0) {
                startTransition(() => {
                  storeRef.current?.dispatch(setProduct(data.products))
                })
              }
            })
            .catch(() => {})

          // 2. Load saved site settings from localStorage
          try {
            const savedSettings = localStorage.getItem('sentech_settings')
            if (savedSettings) {
              const parsedSettings = JSON.parse(savedSettings)
              startTransition(() => {
                storeRef.current?.dispatch(updateSiteSettings(parsedSettings))
              })
            }
          } catch {
            // ignore error
          }
        }

        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(runTask, { timeout: 3000 })
        } else {
          setTimeout(runTask, 500)
        }
      }

      if (document.readyState === 'complete') {
        executeBackgroundTasks()
      } else {
        window.addEventListener('load', executeBackgroundTasks, { once: true })
      }

      // 3. Subscribe store to save changes with 500ms debounce
      let debounceTimer: ReturnType<typeof setTimeout> | null = null
      const unsubscribe = storeRef.current.subscribe(() => {
        if (debounceTimer) clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
          if (storeRef.current) {
            const state = storeRef.current.getState()
            try {
              if (state.siteSettings) {
                localStorage.setItem('sentech_settings', JSON.stringify(state.siteSettings))
              }
            } catch (e) {
              if (process.env.NODE_ENV !== 'production') {
                console.error('Error saving state to localStorage', e)
              }
            }
          }
        }, 500)
      })

      return () => {
        unsubscribe()
        if (debounceTimer) clearTimeout(debounceTimer)
      }
    }
  }, [])

  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <Provider store={storeRef.current}>{children}</Provider>
    </SessionProvider>
  )
}
