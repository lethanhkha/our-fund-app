import React from 'react';

interface SummaryCardProps {
    title: string;
    amount: string;
    type: 'income' | 'expense';
    trend?: string; // e.g., "+10%", "-5%"
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, type, trend }) => {
    const isIncome = type === 'income';
    return (
        <div className="bg-white rounded-[2rem] p-5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-pink-50/50 flex-1">
            <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isIncome ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isIncome ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        )}
                    </svg>
                </div>
                <span className="text-sm font-medium text-gray-500">{title}</span>
            </div>
            <div className="font-extrabold text-xl text-brandDark truncate">{amount}</div>
            {trend && (
                <div className={`text-xs mt-1 font-semibold ${trend.startsWith('+') ? (isIncome ? 'text-green-500' : 'text-red-500') : 'text-gray-400'}`}>
                    {trend} so với tháng trước
                </div>
            )}
        </div>
    );
};
