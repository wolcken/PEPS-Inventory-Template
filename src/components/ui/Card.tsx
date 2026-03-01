import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', style }) => {
    return <div className={`bg-surface rounded-lg border border-border shadow-sm ${className}`} style={style}>{children}</div>;
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '', style }) => {
    return <div className={`px-6 py-4 border-b border-border ${className}`} style={style}>{children}</div>;
};

export const CardBody: React.FC<CardProps> = ({ children, className = '', style }) => {
    return <div className={`px-6 py-4 ${className}`} style={style}>{children}</div>;
};

export const CardFooter: React.FC<CardProps> = ({ children, className = '', style }) => {
    return <div className={`px-6 py-4 border-t border-border bg-surface-hover rounded-b-lg ${className}`} style={style}>{children}</div>;
};
