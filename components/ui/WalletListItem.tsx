"use client";
import React from 'react';

interface WalletListItemProps {
    name: string;
    balance: string;
    icon: React.ReactNode;
    isActive?: boolean;
    onClick?: () => void;
}

export const WalletListItem: React.FC<WalletListItemProps> = ({ name, balance, icon, isActive = false, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`flex items-center justify-between p-4 rounded-[1.5rem] border-2 cursor-pointer transition-all active:scale-[0.98] ${isActive ? 'border-primary bg-primary-light' : 'border-transparent bg-white shadow-sm'
                }`}
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                    {icon}
                </div>
                <div>
                    <h4 className="font-bold text-brandDark">{name}</h4>
                    <p className="text-muted text-xs">{balance}</p>
                </div>
            </div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${isActive ? 'border-primary' : 'border-gray-200'
                }`}>
                {isActive && <div className="w-3 h-3 bg-primary rounded-full"></div>}
            </div>
        </div>
    );
};
