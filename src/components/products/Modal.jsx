"use client";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Accessible modal with focus trap and return focus.
 */
export default function Modal({
  open,
  onClose,
  title,
  children,
  initialFocusRef,
}) {
  const overlayRef = useRef(null);
  const closeBtnRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement;
      const toFocus = initialFocusRef?.current || closeBtnRef.current;
      setTimeout(() => toFocus?.focus(), 0);
      const handler = (e) => {
        if (e.key === "Escape") onClose?.();
        if (e.key === "Tab") {
          // trap focus
          const focusable = overlayRef.current?.querySelectorAll(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
          );
          if (!focusable || focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    } else if (previouslyFocused.current) {
      previouslyFocused.current.focus();
    }
  }, [open, onClose, initialFocusRef]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === overlayRef.current) onClose?.();
          }}
        >
          <motion.div
            className="w-full max-w-2xl rounded-xl bg-white shadow-xl outline-none"
            initial={{ y: 20, scale: 0.98, opacity: 0 }}
            animate={{
              y: 0,
              scale: 1,
              opacity: 1,
              transition: { type: "spring", stiffness: 300, damping: 24 },
            }}
            exit={{ y: 20, scale: 0.98, opacity: 0 }}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <h2
                id="modal-title"
                className="text-lg font-semibold text-gray-900"
              >
                {title}
              </h2>
              <button
                ref={closeBtnRef}
                aria-label="Close"
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                onClick={onClose}
              >
                ✕
              </button>
            </div>
            <div className="p-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
