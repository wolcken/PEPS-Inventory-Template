import React, { useEffect } from 'react';
import './Toast.css';

interface ToastProps {
    message: string;
    variant?: 'success' | 'danger' | 'warning' | 'info';
    duration?: number;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    variant = 'info',
    duration = 3000,
    onClose
}) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    return (
        <div className={`toast show align-items-center text-white bg-${variant} border-0 mt-2`} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex">
                <div className="toast-body">
                    {message}
                </div>
                <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={onClose} aria-label="Close">
                    &times;
                </button>
            </div>
        </div>
    );
};
