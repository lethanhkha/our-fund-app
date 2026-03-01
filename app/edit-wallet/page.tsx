'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useFinanceStore } from '../../store/useFinanceStore';

// --- PRESETS ---
const BANKS = [
    { id: 'vcb', name: 'Vietcombank', type: 'bank', color: 'green', icon: '🏦' },
    { id: 'tcb', name: 'Techcombank', type: 'bank', color: 'red', icon: '🏦' },
    { id: 'mb', name: 'MB Bank', type: 'bank', color: 'blue', icon: '🏦' },
    { id: 'tpb', name: 'TPBank', type: 'bank', color: 'purple', icon: '🏦' },
    { id: 'bidv', name: 'BIDV', type: 'bank', color: 'teal', icon: '🏦' },
    { id: 'vietin', name: 'VietinBank', type: 'bank', color: 'blue', icon: '🏦' },
    { id: 'vpbank', name: 'VPBank', type: 'bank', color: 'green', icon: '🏦' },
    { id: 'acb', name: 'ACB', type: 'bank', color: 'blue', icon: '🏦' },
    { id: 'sacombank', name: 'Sacombank', type: 'bank', color: 'blue', icon: '🏦' },
];

const EWALLETS = [
    { id: 'momo', name: 'MoMo', type: 'ewallet', color: 'pink', icon: '📱' },
    { id: 'zalo', name: 'ZaloPay', type: 'ewallet', color: 'green', icon: '📱' },
    { id: 'vnpay', name: 'VNPay', type: 'ewallet', color: 'blue', icon: '📱' },
    { id: 'viettel', name: 'Viettel Money', type: 'ewallet', color: 'red', icon: '📱' },
    { id: 'shopee', name: 'ShopeePay', type: 'ewallet', color: 'orange', icon: '📱' },
];

const COLORS = [
    { id: 'teal', value: 'bg-teal-400' },
    { id: 'red', value: 'bg-red-500' },
    { id: 'pink', value: 'bg-pink-400' },
    { id: 'blue', value: 'bg-blue-400' },
    { id: 'purple', value: 'bg-purple-400' },
    { id: 'yellow', value: 'bg-yellow-400' },
];

function EditWalletForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const ObjectStore = useFinanceStore();
    const { wallets, updateWallet } = ObjectStore;

    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState('0');
    const [name, setName] = useState('');

    const [selectedTab, setSelectedTab] = useState<'cash' | 'bank' | 'ewallet'>('cash');
    const [selectedIcon, setSelectedIcon] = useState('cash');
    const [selectedColor, setSelectedColor] = useState('teal');

    useEffect(() => {
        if (!id) {
            router.push('/wallets');
            return;
        }

        const existingWallet = wallets.find(w => w.id === id);
        if (!existingWallet) {
            toast.error("Không tìm thấy ví!");
            router.push('/wallets');
            return;
        }

        setName(existingWallet.name);
        setAmount(existingWallet.balance.toString());
        setSelectedIcon(existingWallet.icon || 'cash');
        setSelectedColor(existingWallet.color || 'teal');

        // Try to guess tab
        if ((existingWallet.icon || '').includes('🏦') || BANKS.some(b => b.name === existingWallet.name)) {
            setSelectedTab('bank');
        } else if ((existingWallet.icon || '').includes('📱') || EWALLETS.some(e => e.name === existingWallet.name)) {
            setSelectedTab('ewallet');
        } else {
            setSelectedTab('cash');
        }

        setLoading(false);
    }, [id, wallets, router]);

    const handleSelectPreset = (preset: typeof BANKS[0]) => {
        setName(preset.name);
        setSelectedIcon(preset.icon || preset.type);
        setSelectedColor(preset.color);
    };

    const handleTabChange = (tab: 'cash' | 'bank' | 'ewallet') => {
        setSelectedTab(tab);
        if (tab === 'cash') {
            setName('Tiền mặt');
            setSelectedIcon('cash');
            setSelectedColor('teal');
        } else {
            setName('');
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error("Vui lòng nhập tên ví!");
            return;
        }

        if (!id) return;

        await updateWallet(id, {
            name: name.trim(),
            icon: selectedIcon,
            color: selectedColor
        });

        router.push('/wallets');
    };

    if (loading) return null;

    return (
        <div className="font-sans antialiased max-w-md mx-auto min-h-screen bg-[#FDF2F8] flex flex-col relative overflow-x-hidden">
            {/* HEADER */}
            <header className="px-6 pt-10 pb-4 flex items-center gap-4 sticky top-0 bg-[#FDF2F8]/90 backdrop-blur-md z-40">
                <button onClick={() => router.back()} className="w-10 h-10 rounded-full border border-pink-100 bg-white flex items-center justify-center text-[#1E293B] shadow-sm">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-xl font-extrabold text-[#1E293B]">Sửa ví ✏️</h1>
            </header>

            <main className="flex-grow flex flex-col px-6 pb-24">
                {/* AMOUNT DISPLAY - READONLY */}
                <div className="flex flex-col items-center justify-center py-6 opacity-60">
                    <p className="text-[#94A3B8] text-sm font-bold mb-2 uppercase tracking-wider">Số dư hiện tại</p>
                    <div className="text-4xl font-extrabold text-[#1E293B] tracking-tight">
                        {parseInt(amount || '0', 10).toLocaleString('vi-VN')} đ
                    </div>
                    <p className="text-xs text-[#94A3B8] mt-2 font-medium bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                        Để thay đổi số dư, vui lòng tạo giao dịch Thu/Chi.
                    </p>
                </div>

                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 flex-grow flex flex-col mb-6">
                    {/* INPUT NAME */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-[#1E293B] mb-2">Tên ví</label>
                        <input
                            type="text"
                            placeholder="Nhập tên ví (VD: Tiền mặt, Techcombank...)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-[#1E293B] font-medium focus:ring-2 focus:ring-pink-200 outline-none"
                        />
                    </div>

                    {/* TABS FOR WALLET TYPE */}
                    <div className="mb-6">
                        <div className="flex bg-gray-50 p-1.5 rounded-[1rem]">
                            <button
                                onClick={() => handleTabChange('cash')}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${selectedTab === 'cash' ? 'bg-white text-[#F43F5E] shadow-sm' : 'text-[#64748B] hover:text-[#1E293B]'}`}
                            >
                                Tiền mặt
                            </button>
                            <button
                                onClick={() => handleTabChange('bank')}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${selectedTab === 'bank' ? 'bg-white text-[#F43F5E] shadow-sm' : 'text-[#64748B] hover:text-[#1E293B]'}`}
                            >
                                Ngân hàng
                            </button>
                            <button
                                onClick={() => handleTabChange('ewallet')}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${selectedTab === 'ewallet' ? 'bg-white text-[#F43F5E] shadow-sm' : 'text-[#64748B] hover:text-[#1E293B]'}`}
                            >
                                Ví điện tử
                            </button>
                        </div>
                    </div>

                    {/* DYNAMIC LISTS FOR PRESETS */}
                    {selectedTab === 'bank' && (
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-[#1E293B] mb-3">Chọn ngân hàng phổ biến</label>
                            <div className="flex flex-wrap gap-2">
                                {BANKS.map(bank => (
                                    <button
                                        key={bank.id}
                                        onClick={() => handleSelectPreset(bank)}
                                        className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-colors ${name === bank.name ? 'border-[#F43F5E] bg-pink-50 text-[#F43F5E]' : 'border-transparent bg-gray-50 text-[#64748B] hover:bg-gray-100'}`}
                                    >
                                        {bank.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedTab === 'ewallet' && (
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-[#1E293B] mb-3">Chọn ví điện tử</label>
                            <div className="flex flex-wrap gap-2">
                                {EWALLETS.map(ewallet => (
                                    <button
                                        key={ewallet.id}
                                        onClick={() => handleSelectPreset(ewallet)}
                                        className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-colors ${name === ewallet.name ? 'border-[#F43F5E] bg-pink-50 text-[#F43F5E]' : 'border-transparent bg-gray-50 text-[#64748B] hover:bg-gray-100'}`}
                                    >
                                        {ewallet.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SELECT COLOR */}
                    <div className="mb-6 flex-grow">
                        <label className="block text-sm font-bold text-[#1E293B] mb-3">Màu nền</label>
                        <div className="flex flex-wrap gap-4">
                            {COLORS.map(color => (
                                <button
                                    key={color.id}
                                    onClick={() => setSelectedColor(color.id)}
                                    className={`w-10 h-10 rounded-full ${color.value} transition-transform ${selectedColor === color.id ? 'ring-4 ring-offset-2 ring-pink-200 scale-110' : 'hover:scale-105'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* ACTION */}
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[2rem] p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] border-t border-pink-50 z-20">
                <button
                    onClick={handleSave}
                    disabled={!name.trim()}
                    className="w-full bg-[linear-gradient(to_bottom_right,#FF9A9E,#F43F5E)] text-white font-bold py-4 rounded-[1.5rem] mt-2 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-200 disabled:opacity-50 disabled:scale-100"
                >
                    Lưu ví ngay 🌸
                </button>
            </div>
        </div>
    );
}

export default function EditWalletPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FDF2F8] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin"></div>
            </div>
        }>
            <EditWalletForm />
        </Suspense>
    );
}
