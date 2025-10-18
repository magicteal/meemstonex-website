"use client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback(
    (id) => setToasts((ts) => ts.filter((t) => t.id !== id)),
    []
  );

  const push = useCallback(
    (toast) => {
      const id = Math.random().toString(36).slice(2);
      const t = { id, ...toast };
      setToasts((ts) => [...ts, t]);
      if (t.duration !== 0) {
        setTimeout(() => remove(id), t.duration ?? 3000);
      }
      return id;
    },
    [remove]
  );

  const value = useMemo(() => ({ push, remove }), [push, remove]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center gap-2 p-4">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className={`pointer-events-auto w-full max-w-md rounded-lg border p-3 shadow-md ${
                t.type === "error"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-green-200 bg-green-50 text-green-800"
              }`}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{t.title}</p>
                  {t.description && (
                    <p className="mt-0.5 text-sm opacity-90">{t.description}</p>
                  )}
                  {t.action}
                </div>
                <button
                  className="rounded-md p-1 text-sm text-gray-500 hover:bg-white/50"
                  onClick={() => remove(t.id)}
                  aria-label="Dismiss notification"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
