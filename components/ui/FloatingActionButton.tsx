"use client";
import React from 'react';

interface FABProps {
    onClick?: () => void;
    icon?: React.ReactNode;
    className?: string; // Tweak position if needed
}

export const FloatingActionButton: React.FC<FABProps> = ({ onClick, icon, className = "right-6 bottom-24" }) => {
    return (
        <button
            onClick={onClick}
            aria-label="Add New"
            className={`fixed ${className} w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-xl shadow-pink-300 z-50 transition-transform active:scale-90`}
        >
            {icon || (
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                </svg>
            )}
        </button>
    );
};
