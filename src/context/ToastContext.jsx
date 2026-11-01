import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import ToastStack from '../components/ToastStack.jsx';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const dismiss = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);
    const notify = useCallback(
        (message, type = 'success') => setToasts((prev) => [...prev, { id: crypto.randomUUID(), message, type }]),
        []
    );

    const value = useMemo(() => ({ notify }), [notify]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastStack toasts={toasts} onDismiss={dismiss} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast deve ser usado dentro de <ToastProvider>.');
    return ctx;
};
