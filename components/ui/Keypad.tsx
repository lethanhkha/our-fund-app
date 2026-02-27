"use client";
import React from 'react';

interface KeypadProps {
    onKeyPress: (key: string) => void;
}

export const Keypad: React.FC<KeypadProps> = ({ onKeyPress }) => {
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    return (
        <div className="grid grid-cols-3 gap-4 mb-8 mt-auto w-full">
            {numbers.map((num) => (
                <button
                    key={num}
                    onClick={() => onKeyPress(num)}
                    className="h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-gray-700 shadow-sm transition-all active:bg-gray-100 active:scale-95"
                >
                    {num}
                </button>
            ))}
            <button
                onClick={() => onKeyPress('clear')}
                className="h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-[#F43F5E] shadow-sm transition-all active:bg-gray-100 active:scale-95"
            >
                C
            </button>
            <button
                onClick={() => onKeyPress('0')}
                className="h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-gray-700 shadow-sm transition-all active:bg-gray-100 active:scale-95"
            >
                0
            </button>
            <button
                onClick={() => onKeyPress('delete')}
                className="h-16 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm transition-all active:bg-gray-100 active:scale-95"
            >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                </svg>
            </button>
        </div>
    );
};
