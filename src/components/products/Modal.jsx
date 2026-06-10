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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
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
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] bg-neutral-950 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-white outline-none"
            initial={{ y: 20, scale: 0.98, opacity: 0 }}
            animate={{
              y: 0,
              scale: 1,
              opacity: 1,
              transition: { type: "spring", stiffness: 300, damping: 24 },
            }}
            exit={{ y: 20, scale: 0.98, opacity: 0 }}
          >
            <div className="sticky top-0 bg-neutral-950 z-10 flex items-center justify-between border-b border-white/10 px-6 py-4">
              <h2
                id="modal-title"
                className="text-sm font-black uppercase tracking-widest text-blue-50"
              >
                {title}
              </h2>
              <button
                ref={closeBtnRef}
                aria-label="Close"
                className="rounded-full p-2 text-neutral-400 hover:text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                onClick={onClose}
              >
                ✕
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
