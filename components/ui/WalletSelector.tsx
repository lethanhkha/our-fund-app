"use client";
import React, { useState } from 'react';

import { useFinanceStore } from '@/store/useFinanceStore';

interface WalletSelectorProps {
    tipIds: string[];
    onConfirm: () => void;
}

export const WalletSelector: React.FC<WalletSelectorProps> = ({ tipIds, onConfirm }) => {
    const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
    const { receiveTips, wallets } = useFinanceStore();

    // Helper to map icons based on name (if empty in DB)
    const getWalletIcon = (name: string) => {
        if (name.includes('Tiền mặt')) return <span className="text-2xl">💵</span>;
        if (name.includes('Techcombank')) return <span className="text-sm font-black text-red-600">TCB</span>;
        if (name.includes('MoMo')) return <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center text-white text-[10px] font-black">MoMo</div>;
        return <span className="text-2xl">💳</span>;
    };

    const getWalletColor = (name: string) => {
        if (name.includes('Tiền mặt')) return 'bg-green-50 text-green-500';
        if (name.includes('Techcombank')) return 'bg-red-50 text-red-500';
        if (name.includes('MoMo')) return 'bg-pink-50 text-pink-500';
        return 'bg-blue-50 text-blue-500';
    };

    return (
        <div className="flex flex-col gap-5 w-full">
            <h3 className="text-sm font-bold text-[#94A3B8] text-center mb-2">Tiền ting ting vào ví nào thế em? 💸</h3>

            <div className="flex flex-col gap-3">
                {wallets.map((wallet) => (
                    <div
                        key={wallet.id}
                        onClick={() => setSelectedWallet(wallet.id)}
                        className={`flex items-center p-4 rounded-[1.5rem] border-2 cursor-pointer transition-all ${selectedWallet === wallet.id
                            ? 'border-[#F43F5E] bg-pink-50/50'
                            : 'border-transparent bg-gray-50 hover:bg-gray-100'
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${getWalletColor(wallet.name)} mr-4`}>
                            {getWalletIcon(wallet.name)}
                        </div>
                        <span className={`text-base font-bold ${selectedWallet === wallet.id ? 'text-[#F43F5E]' : 'text-[#1E293B]'}`}>
                            {wallet.name}
                        </span>

                        {selectedWallet === wallet.id && (
                            <div className="ml-auto w-6 h-6 rounded-full bg-[#F43F5E] flex items-center justify-center text-white">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button
                onClick={() => {
                    if (selectedWallet && tipIds.length > 0) {
                        receiveTips(tipIds, selectedWallet);
                    }
                    onConfirm();
                }}
                disabled={!selectedWallet}
                className={`w-full font-bold py-4 rounded-full mt-4 shadow-lg text-lg active:scale-95 transition-transform flex items-center justify-center gap-2 ${selectedWallet
                    ? 'bg-[#F43F5E] hover:bg-[#E11D48] text-white shadow-red-200'
                    : 'bg-gray-100 text-gray-400 shadow-none cursor-not-allowed'
                    }`}
            >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Xác nhận cất quỹ
            </button>
        </div>
    );
};
