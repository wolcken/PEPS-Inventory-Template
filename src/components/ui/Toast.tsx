import React, { useEffect } from 'react';

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

    const variantStyles: Record<string, string> = {
        success: 'bg-success text-white',
        danger: 'bg-danger text-white',
        warning: 'bg-warning text-white',
        info: 'bg-info text-white',
    };

    const bgClass = variantStyles[variant] || variantStyles.info;

    return (
        <div
            className={`pointer-events-auto flex items-center w-full max-w-xs p-4 rounded-lg shadow-lg ${bgClass} transition-all duration-300 ease-in-out transform`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            <div className="flex w-full items-center justify-between gap-3">
                <div className="text-sm font-medium">
                    {message}
                </div>
                <button
                    type="button"
                    className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-md inline-flex items-center justify-center text-white/75 hover:text-white hover:bg-white/20 focus:outline-none transition-colors"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <span className="sr-only">Close</span>
                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
