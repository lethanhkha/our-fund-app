"use client";
import React, { useEffect, useState } from 'react';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Sheet */}
            <div className={`fixed bottom-0 left-0 right-0 z-[70] mx-auto max-w-md w-full bg-white rounded-t-[2rem] shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                {/* Drag handle pill */}
                <div className="flex justify-center pt-4 pb-2" onClick={onClose}>
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full cursor-pointer"></div>
                </div>

                {title && (
                    <div className="px-6 pb-2">
                        <h2 className="text-xl font-extrabold text-[#1E293B] text-center">{title}</h2>
                    </div>
                )}

                <div className="px-6 pb-8 pt-2 max-h-[80vh] overflow-y-auto w-full">
                    {children}
                </div>
            </div>
        </>
    );
};
