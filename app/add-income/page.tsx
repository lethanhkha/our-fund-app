'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Keypad } from '../../components/ui/Keypad';
import { useFinanceStore } from '../../store/useFinanceStore';

export default function AddIncomePage() {
    const router = useRouter();
    const [amount, setAmount] = useState('0');
    const [selectedCategory, setSelectedCategory] = useState<string | null>('salary');
    const [note, setNote] = useState('');
    const [selectedWalletId, setSelectedWalletId] = useState('cash');
    const { wallets, addTransaction } = useFinanceStore();

    const handleKeyPress = (key: string) => {
        if (key === 'clear') {
            setAmount('0');
        } else if (key === 'delete') {
            setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
        } else if (key !== '.') {
            setAmount(prev => {
                if (prev.length >= 10) return prev;
                return prev === '0' ? key : prev + key;
            });
        }
    };

    const handleConfirm = () => {
        if (amount === '0') {
            alert('Vui lòng nhập số tiền');
            return;
        }
        if (!selectedCategory) {
            alert('Vui lòng chọn nguồn thu nhập');
            return;
        }

        addTransaction({
            type: 'income',
            categoryId: selectedCategory,
            amount: parseInt(amount) * 1000,
            note: note,
            walletId: selectedWalletId // Use selected wallet
        });

        router.back();
    };

    const categories = [
        { id: 'salary', icon: '💰', label: 'Lương' },
        { id: 'bonus', icon: '🎁', label: 'Thưởng' },
        { id: 'sales', icon: '📈', label: 'Bán hàng' },
        { id: 'other', icon: '✨', label: 'Khác' },
    ];

    return (
        <div className="font-sans antialiased max-w-md mx-auto min-h-screen bg-white flex flex-col relative overflow-x-hidden">

            {/* HEADER SECTION */}
            <header className="px-6 pt-10 pb-4 flex items-center justify-between sticky top-0 bg-white z-40">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="w-10 h-10 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center text-[#1E293B]">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h1 className="text-xl font-extrabold text-[#1E293B]">Thêm Thu Nhập 💰</h1>
                </div>
            </header>

            <main className="px-6 py-6 flex-grow flex flex-col">
                {/* WALLET SELECTOR */}
                <div className="mb-6">
                    <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Nhận vào ví</p>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        {wallets.map(w => (
                            <button
                                key={w.id}
                                onClick={() => setSelectedWalletId(w.id)}
                                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${selectedWalletId === w.id
                                    ? 'bg-emerald-500 text-white shadow-md'
                                    : 'bg-white text-[#64748B] border border-gray-100 hover:bg-gray-50'
                                    }`}
                            >
                                {w.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* AMOUNT INPUT SECTION */}
                <div className="flex flex-col items-center justify-center py-6 mb-6 relative">
                    <div className="absolute top-0 right-0 bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs">
                        Thu nhập
                    </div>
                    <div className="flex items-baseline mt-4">
                        <span className="text-5xl font-black text-emerald-500 tracking-tight">
                            {amount === '0' || amount === '' ? '0' : (parseInt(amount)).toLocaleString('vi-VN')}
                        </span>
                        <span className="text-xl font-bold text-emerald-500 ml-1">.000 đ</span>
                    </div>
                </div>

                {/* CATEGORIES HORIZONTAL LIST */}
                <div className="mb-8 -mx-6 px-6 overflow-x-auto no-scrollbar">
                    <div className="flex gap-4 pb-2">
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className="flex flex-col items-center gap-2 cursor-pointer"
                            >
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${selectedCategory === cat.id
                                        ? 'bg-emerald-500 shadow-md transform scale-105'
                                        : 'bg-gray-50 border border-gray-100 grayscale-[0.3]'
                                    }`}>
                                    {cat.icon}
                                </div>
                                <span className={`text-xs font-bold ${selectedCategory === cat.id ? 'text-emerald-500' : 'text-[#94A3B8]'
                                    }`}>
                                    {cat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* NOTE INPUT */}
                <div className="mb-auto">
                    <div className="flex items-center bg-gray-50 rounded-[1.5rem] p-4 border border-gray-100 focus-within:border-emerald-200 focus-within:bg-emerald-50/50 transition-colors">
                        <svg className="h-5 w-5 text-[#94A3B8] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        <input
                            type="text"
                            placeholder="Thu từ nguồn nào..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="bg-transparent border-none outline-none w-full text-[#1E293B] font-medium placeholder-[#94A3B8]"
                        />
                    </div>
                </div>
            </main>

            {/* FIXED BOTTOM SECTION (KEYPAD + BUTTON) */}
            <div className="px-6 pb-8 bg-white pt-4 border-t border-gray-50">
                <Keypad onKeyPress={handleKeyPress} />
                <button
                    onClick={handleConfirm}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-full mt-6 shadow-lg shadow-emerald-200 text-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                    Xác nhận
                </button>
            </div>
        </div>
    );
}
