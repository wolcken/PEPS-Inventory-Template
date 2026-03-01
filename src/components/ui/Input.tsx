import React, { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    fullWidth = true,
    className = '',
    id,
    icon,
    iconPosition = 'right',
    style,
    ...props
}) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`flex flex-col mb-4 ${className}`} style={style}>
            {label && (
                <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-text-primary">
                    {label}
                </label>
            )}
            <div className={`relative ${fullWidth ? 'w-full' : 'w-auto'}`}>
                <input
                    id={inputId}
                    className={`
                        block w-full rounded-md shadow-sm sm:text-sm
                        focus:outline-none focus:ring-1 transition-colors
                        ${error
                            ? 'border-danger text-danger focus:ring-danger focus:border-danger bg-red-50'
                            : 'border-border text-text-primary focus:ring-primary focus:border-primary bg-surface'}
                        ${icon && iconPosition === 'left' ? 'pl-10' : 'pl-3'}
                        ${icon && iconPosition === 'right' ? 'pr-10' : 'pr-3'}
                        py-2 border
                    `}
                    {...props}
                />
                {icon && (
                    <div className={`
                        absolute inset-y-0 flex items-center justify-center pointer-events-none text-text-muted
                        ${iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'}
                    `}>
                        {icon}
                    </div>
                )}
            </div>
            {error && <div className="mt-1 text-sm text-danger">{error}</div>}
        </div>
    );
};
