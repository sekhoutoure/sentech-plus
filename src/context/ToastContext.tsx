'use client';

import { createContext, useContext, useCallback, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  leaving?: boolean;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev.slice(-4), { id, message, type }]);
    setTimeout(() => dismiss(id), 3500);
  }, [dismiss]);

  const icons = {
    success: <CheckCircle size={18} color="#10b981" />,
    error: <XCircle size={18} color="#ef4444" />,
    info: <Info size={18} color="#1b75bc" />,
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}${toast.leaving ? ' leaving' : ''}`}>
            {icons[toast.type]}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => dismiss(toast.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: '2px', display: 'flex' }}
              aria-label="Fermer"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
