import React from 'react';

interface TransactionItemProps {
    icon: React.ReactNode;
    iconBgColor?: string;
    title: string;
    subtitle: string;
    amount: string;
    isPositive?: boolean;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
    icon,
    iconBgColor = 'bg-pink-50',
    title,
    subtitle,
    amount,
    isPositive = false
}) => {
    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 rounded-2xl px-2 transition-colors">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${iconBgColor} rounded-2xl flex items-center justify-center text-primary`}>
                    {icon}
                </div>
                <div>
                    <h4 className="font-bold text-brandDark text-base">{title}</h4>
                    <p className="text-muted text-xs mt-0.5">{subtitle}</p>
                </div>
            </div>
            <div className={`font-bold text-lg ${isPositive ? 'text-green-500' : 'text-brandDark'}`}>
                {isPositive ? '+' : '-'}{amount}
            </div>
        </div>
    );
};
