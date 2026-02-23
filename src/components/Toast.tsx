"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onDismiss: () => void;
  duration?: number;
  variant?: "default" | "success" | "error";
}

const variantStyles: Record<string, string> = {
  default: "",
  success: "border-success/30",
  error: "border-error/30",
};

const variantIcons: Record<string, string> = {
  default: "",
  success: "✓",
  error: "✕",
};

export function Toast({
  message,
  isVisible,
  onDismiss,
  duration = 2000,
  variant = "default",
}: ToastProps) {
  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [isVisible, duration, onDismiss]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-safe px-4"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 12, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        >
          <div
            className={`glass rounded-full px-5 py-2.5 flex items-center gap-2 shadow-lg shadow-black/20 ${variantStyles[variant]}`}
          >
            {variantIcons[variant] && (
              <span
                className="text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor:
                    variant === "success"
                      ? "var(--color-success)"
                      : variant === "error"
                        ? "var(--color-error)"
                        : "transparent",
                  color: "white",
                }}
              >
                {variantIcons[variant]}
              </span>
            )}
            <span className="text-sm font-medium text-text-primary">
              {message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for easy toast usage
export function useToast() {
  const [toast, setToast] = useState<{
    message: string;
    variant: "default" | "success" | "error";
  } | null>(null);

  const show = (
    message: string,
    variant: "default" | "success" | "error" = "default"
  ) => {
    setToast({ message, variant });
  };

  const dismiss = () => setToast(null);

  const ToastComponent = () => (
    <Toast
      message={toast?.message ?? ""}
      isVisible={!!toast}
      onDismiss={dismiss}
      variant={toast?.variant ?? "default"}
    />
  );

  return { show, dismiss, ToastComponent };
}
