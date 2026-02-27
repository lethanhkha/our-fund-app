"use client";
import React from 'react';

interface MainButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode;
    children: React.ReactNode;
}

export const MainButton: React.FC<MainButtonProps> = ({ icon, children, className = '', ...props }) => {
    return (
        <button
            className={`w-full bg-primary text-white py-5 rounded-full flex items-center justify-center gap-2 text-lg font-bold shadow-lg shadow-pink-200 transition-all active:scale-95 active:opacity-90 ${className}`}
            {...props}
        >
            {icon && icon}
            {children}
        </button>
    );
};
