import React, { useEffect } from 'react';
import './Modal.css';

interface ModalProps {
    show: boolean;
    onHide: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    centered?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
    show,
    onHide,
    title,
    children,
    footer,
    size = 'md',
    centered = true
}) => {
    // Prevent body scrolling when modal is open
    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [show]);

    if (!show) return null;

    return (
        <div className="modal-backdrop" onClick={onHide}>
            <div
                className={`modal-dialog modal-${size} ${centered ? 'modal-dialog-centered' : ''}`}
                onClick={(e) => e.stopPropagation()} // Prevent click from closing when clicking inside
            >
                <div className="modal-content">
                    {title && (
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button type="button" className="btn-close" onClick={onHide} aria-label="Close">
                                &times;
                            </button>
                        </div>
                    )}
                    <div className="modal-body">
                        {children}
                    </div>
                    {footer && (
                        <div className="modal-footer">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
