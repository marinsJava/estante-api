import { useEffect } from 'react';

const Toast = ({ id, message, type, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => onDismiss(id), 4000);
        return () => clearTimeout(timer);
    }, [id, onDismiss]);

    return (
        <div className={`toast toast--${type}`} role={type === 'error' ? 'alert' : 'status'}>
            <span>{message}</span>
            <button type="button" aria-label="Fechar aviso" onClick={() => onDismiss(id)}>×</button>
        </div>
    );
};

const ToastStack = ({ toasts, onDismiss }) => (
    <div className="toasts">
        {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
        ))}
    </div>
);

export default ToastStack;
