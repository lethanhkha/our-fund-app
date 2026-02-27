import React from 'react';

interface RecentCardProps {
    name: string;
    description: string;
    amount: string;
    statusText?: string;
    avatarColorClass?: string;
}

export const RecentCard: React.FC<RecentCardProps> = ({ name, description, amount, statusText = 'Đã nhận', avatarColorClass = 'bg-pink-50' }) => {
    return (
        <div className="bg-white rounded-[1.5rem] p-4 flex items-center justify-between shadow-[0_10px_30px_-10px_rgba(238,43,91,0.1)] mb-3 transition-transform active:scale-[0.98]">
            <div className="flex gap-4">
                <div className={`w-10 h-10 ${avatarColorClass} rounded-xl`}></div>
                <div>
                    <h3 className="font-bold text-brandDark">{name}</h3>
                    <p className="text-muted text-xs">{description}</p>
                </div>
            </div>
            <div className="text-right">
                <div className="font-bold text-brandDark">{amount}</div>
                <span className="text-[10px] px-2 py-0.5 bg-pink-50 text-primary rounded-full font-semibold">{statusText}</span>
            </div>
        </div>
    );
};
