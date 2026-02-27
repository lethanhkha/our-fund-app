"use client";
import React from 'react';

interface CategoryIconProps {
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ icon, label, isActive = false, onClick }) => {
    return (
        <div className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer" onClick={onClick}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-primary text-white shadow-lg shadow-pink-200' : 'border border-gray-100 shadow-sm text-gray-400 bg-white active:scale-95'}`}>
                {icon}
            </div>
            <span className={`text-xs font-medium text-center leading-tight ${isActive ? 'font-bold text-primary' : 'text-gray-500'}`}>
                {label}
            </span>
        </div>
    );
};
