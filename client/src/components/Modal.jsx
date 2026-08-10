import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-2xl',
}) => {
  // Prevent background body scrolling & handle Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4">
      
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-950/85 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card - Viewport 50% Centered */}
      <div
        role="dialog"
        aria-modal="true"
        className={`bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden ${maxWidth} w-[92vw] sm:w-full max-h-[92vh] sm:max-h-[90vh] flex flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100000] animate-fade-up`}
      >
        {/* Header (If Title provided) */}
        {title && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
            <h3 className="text-base sm:text-lg font-bold text-[#0F172A] truncate pr-4">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content Container - Internal Scroll Only */}
        <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
          {children}
        </div>
      </div>

    </div>,
    document.body
  );
};
