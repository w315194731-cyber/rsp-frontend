import { useEffect, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastData {
  id: string;
  variant: ToastVariant;
  title: string;
  message?: string;
  duration?: number; // ms, default 4000
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

function Toast({ toast, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Mount animation
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 250); // wait for exit animation
    }, toast.duration ?? 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const icons = {
    success: <CheckCircle size={18} className="text-semantic-success shrink-0" />,
    error: <AlertCircle size={18} className="text-semantic-error shrink-0" />,
    warning: <AlertCircle size={18} className="text-semantic-warning shrink-0" />,
    info: <Info size={18} className="text-semantic-info shrink-0" />,
  };

  return (
    <div
      className={`
        flex items-start gap-3 min-w-[280px] max-w-[400px]
        px-4 py-3 rounded-radius-lg bg-bg-elevated border border-border-subtle
        shadow-md
        transition-all duration-250 ease-out
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}
      `}
      role="alert"
    >
      {icons[toast.variant]}
      <div className="flex-1 min-w-0">
        <p className="text-text-primary text-sm font-medium">{toast.title}</p>
        {toast.message && (
          <p className="text-text-secondary text-xs mt-0.5">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => { setVisible(false); setTimeout(() => onDismiss(toast.id), 250); }}
        className="shrink-0 p-0.5 text-text-muted hover:text-text-primary transition-colors"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

/**
 * Toast container — fixed bottom-right, stacks up to 3.
 */
export function ToastContainer({ toasts, onDismiss }: {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.slice(-3).map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

/**
 * useToast — add/remove toast notifications.
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((opts: Omit<ToastData, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { ...opts, id }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, dismissToast };
}