import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', style }) => {
    return <div className={`card ${className}`} style={style}>{children}</div>;
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '', style }) => {
    return <div className={`card-header ${className}`} style={style}>{children}</div>;
};

export const CardBody: React.FC<CardProps> = ({ children, className = '', style }) => {
    return <div className={`card-body ${className}`} style={style}>{children}</div>;
};

export const CardFooter: React.FC<CardProps> = ({ children, className = '', style }) => {
    return <div className={`card-footer ${className}`} style={style}>{children}</div>;
};
