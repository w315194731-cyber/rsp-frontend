import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'default' | 'wide';  // 480px / 640px
}

/**
 * Modal — backdrop blur + animated entrance/exit.
 * Closes on backdrop click or Escape key.
 */
export function Modal({ open, onClose, title, children, size = 'default' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Focus trap
  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-bg-base/80 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`
          relative w-full rounded-radius-xl bg-bg-overlay shadow-lg
          animate-[scaleIn_250ms_cubic-bezier(0.16,1,0.3,1)]
          focus:outline-none
          ${size === 'wide' ? 'max-w-[640px]' : 'max-w-[480px]'}
        `}
      >
        {/* Header */}
        {(title) && (
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border-subtle">
            <h2 className="text-text-primary text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-radius-md text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors duration-fast"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}