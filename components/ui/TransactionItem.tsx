import React from 'react';

export type TransactionType = 'income' | 'expense';

interface TransactionItemProps {
    icon: React.ReactNode;
    iconBgColor?: string;
    title: string;
    subtitle: string;
    amount: string;
    type?: TransactionType;
    onClick?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
    icon,
    iconBgColor = 'bg-pink-50',
    title,
    subtitle,
    amount,
    type = 'expense',
    onClick
}) => {
    // Remove any existing minus/plus signs to prevent double signs
    const cleanAmount = amount.replace(/^[+-]\s*/, '');
    const isIncome = type === 'income';

    return (
        <div
            onClick={onClick}
            className={`flex items-center justify-between py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 rounded-2xl px-2 transition-colors ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}`}
        >
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${iconBgColor} rounded-2xl flex items-center justify-center text-primary`}>
                    {icon}
                </div>
                <div>
                    <h4 className="font-bold text-[#1E293B] text-base">{title}</h4>
                    <p className="text-[#94A3B8] text-xs mt-0.5">{subtitle}</p>
                </div>
            </div>
            <div className={`font-bold text-lg ${isIncome ? 'text-emerald-500' : 'text-[#F43F5E]'}`}>
                {isIncome ? '+' : '-'}{cleanAmount}
            </div>
        </div>
    );
};
