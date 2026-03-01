import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'outline' | 'outline-primary';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

const variantStyles: Record<string, string> = {
    primary: 'bg-primary text-white hover:bg-primary-hover border border-transparent shadow-sm',
    secondary: 'bg-secondary text-white hover:opacity-90 border border-transparent shadow-sm',
    success: 'bg-success text-white hover:opacity-90 border border-transparent shadow-sm',
    danger: 'bg-danger text-white hover:opacity-90 border border-transparent shadow-sm',
    warning: 'bg-warning text-white hover:opacity-90 border border-transparent shadow-sm',
    info: 'bg-info text-white hover:opacity-90 border border-transparent shadow-sm',
    light: 'bg-surface text-text-primary hover:bg-surface-hover border border-border shadow-sm',
    dark: 'bg-text-primary text-white hover:opacity-90 border border-transparent shadow-sm',
    outline: 'bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary border border-border',
    'outline-primary': 'bg-transparent text-primary hover:bg-primary/10 border border-primary',
};

const sizeStyles: Record<string, string> = {
    sm: 'py-1.5 px-3 text-sm rounded-sm',
    md: 'py-2 px-4 text-base rounded-md',
    lg: 'py-2.5 px-6 text-lg rounded-lg',
};

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    ...props
}) => {
    const baseClass = 'inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
    const variantClass = variantStyles[variant] || variantStyles.primary;
    const sizeClass = sizeStyles[size] || sizeStyles.md;
    const widthClass = fullWidth ? 'w-full' : '';

    const combinedClasses = [baseClass, variantClass, sizeClass, widthClass, className].filter(Boolean).join(' ');

    return (
        <button className={combinedClasses} {...props}>
            {children}
        </button>
    );
};
