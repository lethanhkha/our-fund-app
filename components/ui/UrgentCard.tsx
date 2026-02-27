"use client";
import React from 'react';

interface UrgentCardProps {
    name: string;
    subtitle: string;
    timeAgo: string;
    amount: string;
    onActionClick?: () => void;
}

export const UrgentCard: React.FC<UrgentCardProps> = ({ name, subtitle, timeAgo, amount, onActionClick }) => {
    return (
        <div className="relative bg-white rounded-[2rem] p-5 shadow-[0_10px_30px_-10px_rgba(238,43,91,0.1)] overflow-hidden border-l-4 border-primary mt-4">
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                    <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center">
                        {/* Avatar block */}
                    </div>
                    <div>
                        <h3 className="font-bold text-brandDark text-lg">{name}</h3>
                        <p className="text-muted text-sm">{subtitle} • <span className="text-primary font-medium">{timeAgo}</span></p>
                    </div>
                </div>
                <div className="text-xl font-bold text-primary">{amount}</div>
            </div>
            <button
                onClick={onActionClick}
                className="w-full py-3 bg-primary text-white font-bold rounded-full flex items-center justify-center gap-2 transition active:scale-95 shadow-lg shadow-pink-200"
            >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Đã nhận
            </button>
        </div>
    );
};
