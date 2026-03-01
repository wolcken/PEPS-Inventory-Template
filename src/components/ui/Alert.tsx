import React from 'react';
import './Alert.css';

interface AlertProps {
    variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
    children: React.ReactNode;
    dismissible?: boolean;
    onClose?: () => void;
    className?: string;
}

export const Alert: React.FC<AlertProps> = ({
    variant = 'info',
    children,
    dismissible = false,
    onClose,
    className = ''
}) => {
    return (
        <div className={`alert alert-${variant} ${dismissible ? 'alert-dismissible' : ''} ${className}`} role="alert">
            {children}
            {dismissible && (
                <button type="button" className="btn-close" aria-label="Close" onClick={onClose}>
                    &times;
                </button>
            )}
        </div>
    );
};
