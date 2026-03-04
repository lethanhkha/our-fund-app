"use client";
import React from 'react';
import Link from 'next/link';

interface FABProps {
    onClick?: () => void;
    icon?: React.ReactNode;
    className?: string; // Tweak position if needed
    href?: string; // Added href prop based on the provided edit
}

export const FloatingActionButton: React.FC<FABProps> = ({ onClick, icon, className, href }) => {
    const defaultClassName = "fixed bottom-24 md:bottom-8 left-1/2 md:left-auto md:right-8 transform -translate-x-1/2 md:translate-x-0 bg-[linear-gradient(to_bottom_right,#FF9A9E,#F43F5E)] hover:opacity-90 active:scale-95 text-white p-4 rounded-full shadow-[0_8px_30px_rgb(244,63,94,0.3)] transition-all z-40 group flex items-center justify-center";

    const buttonContent = (
        <button
            onClick={onClick}
            aria-label="Add New"
            className={className || defaultClassName}
        >
            {icon || (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
            )}
        </button>
    );

    if (href) {
        return (
            <Link href={href}>
                {buttonContent}
            </Link>
        );
    }

    return buttonContent;
};
