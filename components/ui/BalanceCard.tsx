"use client";
import React from 'react';

interface BalanceCardProps {
    totalBalance: string;
    currency?: string;
    label?: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ totalBalance, currency = 'đ', label = 'Tổng số dư hiện có' }) => {
    return (
        <div className="bg-[linear-gradient(to_right,#FF9A9E,#FAD0C4)] rounded-[2rem] p-6 text-white shadow-lg shadow-[rgba(250,208,196,0.5)] relative overflow-hidden my-6">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>

            <div className="flex justify-between items-start relative z-10 mb-4">
                <div>
                    <p className="text-white/80 text-sm font-medium mb-1">{label}</p>
                    <div className="flex items-baseline">
                        <span className="text-3xl font-extrabold tracking-tight">{totalBalance}</span>
                        <span className="text-lg font-bold ml-1 opacity-80">{currency}</span>
                    </div>
                </div>

                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-sm">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
            </div>

            <div className="flex items-center gap-2 relative z-10 mt-2">
                <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    <span className="text-xs font-bold">+2.5%</span>
                </div>
                <span className="text-xs text-white/80 font-medium">So với tháng trước</span>
            </div>
        </div>
    );
};
