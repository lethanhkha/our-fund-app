"use client";
import React from 'react';

interface FilterChipProps {
    label: string;
    isActive?: boolean;
    onClick?: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, isActive = false, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all active:scale-95 whitespace-nowrap ${isActive
                ? 'bg-primary text-white shadow-md shadow-pink-200'
                : 'bg-white text-gray-500 border border-gray-100 shadow-sm hover:bg-gray-50'
                }`}
        >
            {label}
        </button>
    );
};
