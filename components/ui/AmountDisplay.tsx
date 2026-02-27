import React from 'react';

interface AmountDisplayProps {
    amount: string;
    currency?: string;
    typeLabel?: string;
}

export const AmountDisplay: React.FC<AmountDisplayProps> = ({ amount, currency = 'P', typeLabel = 'Chi tiêu' }) => {
    return (
        <div className="bg-primary-light rounded-[40px] py-10 relative mb-8 border border-pink-50 text-center">
            <div className="flex items-baseline justify-center">
                <span className="text-5xl font-extrabold text-primary tracking-tight">{amount}</span>
                <span className="text-2xl font-semibold text-gray-400 ml-2">{currency}</span>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-100 text-yellow-700 text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-sm">
                {typeLabel}
            </div>
        </div>
    );
};
