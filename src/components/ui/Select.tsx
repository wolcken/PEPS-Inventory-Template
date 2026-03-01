import React, { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string | number; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
    label,
    error,
    options,
    className = '',
    id,
    ...props
}) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`form-group ${className}`}>
            {label && <label htmlFor={selectId} className="form-label">{label}</label>}
            <select
                id={selectId}
                className={`form-select ${error ? 'is-invalid' : ''}`}
                {...props}
            >
                <option value="">Selecciona una opción</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
                {props.children}
            </select>
            {error && <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>{error}</div>}
        </div>
    );
};
