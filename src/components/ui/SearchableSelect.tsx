import React, { useState, useRef, useEffect } from 'react';
import { Input } from './Input';
import './SearchableSelect.css';

interface Option {
    value: string;
    label: string;
}

interface SearchableSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    label?: string;
    placeholder?: string;
    error?: string;
    required?: boolean;
    className?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
    value,
    onChange,
    options,
    label,
    placeholder = "Escribe para buscar...",
    error,
    required = false,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Encuentra el label actual o usa vacio
    const currentOption = options.find(opt => opt.value === value);
    const displayValue = isOpen ? searchTerm : (currentOption ? currentOption.label : '');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.addEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (selectedValue: string) => {
        onChange(selectedValue);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className={`searchable-select-container ${className}`} ref={wrapperRef}>
            <div onClick={() => setIsOpen(true)}>
                <Input
                    label={label}
                    type="text"
                    value={displayValue}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    placeholder={placeholder}
                    required={required}
                    error={error}
                    autoComplete="off"
                />
            </div>

            {isOpen && (
                <ul className="searchable-options-list shadow-sm">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <li
                                key={option.value}
                                className={`searchable-option ${option.value === value ? 'selected' : ''}`}
                                onClick={() => handleSelect(option.value)}
                            >
                                {option.label}
                            </li>
                        ))
                    ) : (
                        <li className="searchable-option-empty">No se encontraron resultados</li>
                    )}
                </ul>
            )}
        </div>
    );
};
