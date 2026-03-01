import React, { useEffect } from 'react';

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

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl'
    };

    const dialogClass = sizeClasses[size] || sizeClasses.md;

    return (
        <div
            className="fixed inset-0 z-[1050] flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none"
            onClick={onHide}
        >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" aria-hidden="true"></div>

            {/* Modal Dialog */}
            <div
                className={`relative w-full ${dialogClass} mx-auto my-6 z-[1060] ${centered ? 'flex items-center min-h-[calc(100%-3rem)]' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Content */}
                <div className="relative flex w-full flex-col bg-surface border border-border shadow-lg rounded-lg outline-none focus:outline-none">

                    {/* Header */}
                    {title && (
                        <div className="flex items-center justify-between p-4 border-b border-border rounded-t-lg">
                            <h5 className="text-lg font-semibold text-text-primary m-0">
                                {title}
                            </h5>
                            <button
                                type="button"
                                className="box-content w-4 h-4 p-1 text-text-secondary hover:text-text-primary border-none rounded-none opacity-50 hover:opacity-100 focus:opacity-100 focus:outline-none transparent"
                                onClick={onHide}
                                aria-label="Close"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Body */}
                    <div className="relative flex-auto p-4 text-text-secondary">
                        {children}
                    </div>

                    {/* Footer */}
                    {footer && (
                        <div className="flex items-center justify-end p-4 border-t border-border rounded-b-lg gap-2">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
