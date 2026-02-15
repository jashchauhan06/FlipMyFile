"use client";

import { createContext, useContext, useState, useCallback, useMemo, useRef } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import styles from "./Toast.module.css";

const ToastContext = createContext(null);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within a ToastProvider");
    return ctx;
}

let toastId = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timersRef = useRef({});

    const removeToast = useCallback((id) => {
        setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
        );
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 300);
    }, []);

    const addToast = useCallback(
        (message, type = "info", duration = 4000) => {
            const id = ++toastId;
            setToasts((prev) => [...prev, { id, message, type, exiting: false }]);
            timersRef.current[id] = setTimeout(() => removeToast(id), duration);
            return id;
        },
        [removeToast]
    );

    const toast = useMemo(
        () => ({
            success: (msg) => addToast(msg, "success"),
            error: (msg) => addToast(msg, "error"),
            info: (msg) => addToast(msg, "info"),
            warning: (msg) => addToast(msg, "warning"),
        }),
        [addToast]
    );

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className={styles.container} role="alert" aria-live="polite">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`${styles.toast} ${styles[t.type]} ${t.exiting ? styles.exit : ""
                            }`}
                    >
                        <span className={styles.icon}>
                            {t.type === "success" && <CheckCircle size={20} />}
                            {t.type === "error" && <XCircle size={20} />}
                            {t.type === "info" && <Info size={20} />}
                            {t.type === "warning" && <AlertTriangle size={20} />}
                        </span>
                        <span className={styles.message}>{t.message}</span>
                        <button
                            className={styles.close}
                            onClick={() => removeToast(t.id)}
                            aria-label="Close notification"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
