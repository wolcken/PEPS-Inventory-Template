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
        <div className={`form-group ${className}`} style={style}>
            {label && <label htmlFor={inputId} className="form-label">{label}</label>}
            <div style={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }}>
                <input
                    id={inputId}
                    className={`form-control ${error ? 'is-invalid' : ''}`}
                    style={{
                        width: '100%',
                        paddingRight: icon && iconPosition === 'right' ? '2.5rem' : undefined,
                        paddingLeft: icon && iconPosition === 'left' ? '2.5rem' : undefined,
                    }}
                    {...props}
                />
                {icon && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        [iconPosition]: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-muted)'
                    }}>
                        {icon}
                    </div>
                )}
            </div>
            {error && <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>{error}</div>}
        </div>
    );
};
