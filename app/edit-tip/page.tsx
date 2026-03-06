'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { Keypad } from '../../components/ui/Keypad';
import { useFinanceStore } from '../../store/useFinanceStore';

function EditTipForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tipId = searchParams.get('id');

    const [amount, setAmount] = useState('0');
    const [note, setNote] = useState('');
    const [selectedWalletId, setSelectedWalletId] = useState('');
    const [createdDate, setCreatedDate] = useState(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    });
    const { tips, updateTip, wallets } = useFinanceStore();

    useEffect(() => {
        if (!tipId) return;
        const currentTip = tips.find(t => t.id === tipId);
        if (currentTip) {
            setAmount((currentTip.amount / 1000).toString());
            setNote(currentTip.customerName === 'Khách hàng' ? '' : currentTip.customerName);
            if (currentTip.walletId) {
                setSelectedWalletId(currentTip.walletId);
            } else if (wallets && wallets.length > 0) {
                const defaultWallet = wallets.find(w => w.is_default);
                setSelectedWalletId(defaultWallet ? defaultWallet.id : wallets[0].id);
            }

            if (currentTip.created_at) {
                const dateObj = new Date(currentTip.created_at);
                dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset());
                setCreatedDate(dateObj.toISOString().slice(0, 16));
            }
        }
    }, [tipId, tips, wallets]);

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

    const handleConfirm = async () => {
        if (parseInt(amount) <= 0) {
            toast.error('Em chưa nhập số tiền kìa! 🥺');
            return;
        }

        if (!selectedWalletId) {
            toast.error('Nhớ chọn ví nha em! 💳');
            return;
        }

        await updateTip(tipId as string, {
            amount: parseInt(amount) * 1000,
            customerName: note || 'Khách hàng',
            walletId: selectedWalletId,
            created_at: createdDate ? new Date(createdDate).toISOString() : undefined
        });

        router.back();
    };

    return (
        <div className="font-sans antialiased max-w-md mx-auto min-h-screen bg-white flex flex-col relative overflow-x-hidden">

            {/* HEADER SECTION */}
            <header className="px-6 pt-10 pb-4 flex items-center justify-between sticky top-0 bg-white z-40">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="w-10 h-10 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center text-[#1E293B]">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h1 className="text-xl font-extrabold text-[#1E293B]">Sửa Tips</h1>
                </div>
            </header>

            <main className="px-6 flex-grow flex flex-col">

                {/* MOTIVATIONAL TEXT */}
                <p className="text-[#F43F5E] text-center font-bold mt-4 text-sm mb-4">
                    Nhập lại thông tin Tips 💸
                </p>

                {/* WALLET SELECTOR */}
                <div className="mb-2">
                    <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Nhận vào ví</p>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        {wallets.map(w => (
                            <button
                                key={w.id}
                                onClick={() => setSelectedWalletId(w.id)}
                                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors`}
                                style={{
                                    backgroundColor: selectedWalletId === w.id ? w.color : 'transparent',
                                    color: selectedWalletId === w.id ? '#fff' : '#64748B',
                                    borderColor: w.color,
                                    borderWidth: selectedWalletId === w.id ? '0px' : '1px'
                                }}
                            >
                                {w.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* AMOUNT INPUT SECTION */}
                <div className="flex flex-col items-center justify-center py-6 mb-6 relative mt-2">
                    <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-700 font-bold px-3 py-1 rounded-full text-xs">
                        Tiền tips
                    </div>
                    <div className="flex items-baseline mt-4">
                        <span className="text-5xl font-black text-[#F43F5E] tracking-tight">
                            {amount === '0' || amount === '' ? '0' : (parseInt(amount) * 1000).toLocaleString('vi-VN')}
                        </span>
                        <span className="text-xl font-bold text-[#F43F5E] ml-1">đ</span>
                    </div>
                </div>

                {/* DATE AND NOTE INPUTS */}
                <div className="mb-auto mt-4 space-y-4">
                    {/* DATE INPUT */}
                    <div className="flex items-center bg-gray-50 rounded-[1.5rem] p-4 border border-gray-100 focus-within:border-pink-200 focus-within:bg-pink-50/50 transition-colors">
                        <svg className="h-5 w-5 text-[#94A3B8] mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <input
                            type="datetime-local"
                            value={createdDate}
                            onChange={(e) => setCreatedDate(e.target.value)}
                            className="bg-transparent border-none outline-none w-full text-[#1E293B] font-medium"
                        />
                    </div>

                    {/* NOTE INPUT */}
                    <div className="flex items-center bg-gray-50 rounded-[1.5rem] p-4 border border-gray-100 focus-within:border-pink-200 focus-within:bg-pink-50/50 transition-colors">
                        <svg className="h-5 w-5 text-[#94A3B8] mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        <input
                            type="text"
                            placeholder="Ghi chú (Ví dụ: Khách Cắt Tóc)..."
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
                    className="w-full bg-[#EC4899] hover:bg-[#db2777] text-white font-bold py-4 rounded-full mt-6 shadow-lg shadow-pink-200 text-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                    Lưu thay đổi
                </button>
            </div>

        </div>
    );
}

export default function EditTipPage() {
    return (
        <Suspense fallback={<div className="font-sans antialiased max-w-md mx-auto min-h-screen bg-white flex items-center justify-center"><p className="text-gray-500 font-medium">Đang tải...</p></div>}>
            <EditTipForm />
        </Suspense>
    );
}
