'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Keypad } from '../../components/ui/Keypad';
import { toast } from 'react-hot-toast';
import { useFinanceStore } from '../../store/useFinanceStore';

function EditTransactionForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id') as string;

    const { transactions, wallets, categories, updateTransaction } = useFinanceStore();

    const [amount, setAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [note, setNote] = useState('');
    const [selectedWalletId, setSelectedWalletId] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [createdDate, setCreatedDate] = useState(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    });

    useEffect(() => {
        const tx = transactions.find(t => t.id === id);
        if (tx) {
            setAmount((tx.amount / 1000).toString());
            setSelectedCategory(tx.category_id);
            setNote(tx.note || '');
            setSelectedWalletId(tx.walletId);
            setType(tx.type);

            if (tx.created_at) {
                const dateObj = new Date(tx.created_at);
                dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset());
                setCreatedDate(dateObj.toISOString().slice(0, 16));
            }
        } else {
            toast.error('Không tìm thấy giao dịch! 🚨');
            router.back();
        }
    }, [id, transactions, router]);

    const filteredCategories = categories.filter(c => c.type === type);

    const handleKeyPress = (key: string) => {
        if (key === 'clear') {
            setAmount('0');
        } else if (key === 'delete') {
            setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
        } else if (key !== '.') {
            setAmount(prev => {
                if (prev.length >= 10) return prev;
                return prev === '0' || prev === '' ? key : prev + key;
            });
        }
    };

    const handleConfirm = async () => {
        const parsedAmount = parseInt(amount || '0');

        if (parsedAmount <= 0) {
            toast.error('Em chưa nhập số tiền kìa! 🥺');
            return;
        }
        if (!selectedCategory) {
            toast.error('Chọn danh mục đã nè! 🏷️');
            return;
        }
        if (!selectedWalletId) {
            toast.error('Nhớ chọn ví nha em! 💳');
            return;
        }

        const activeWallet = wallets.find(w => w.id === selectedWalletId);

        // Cần tính toán lại nếu là chi tiêu
        if (type === 'expense' && activeWallet) {
            const oldTx = transactions.find(t => t.id === id);
            if (oldTx) {
                // Tính số dư ví SAU KHI hoàn lại giao dịch cũ
                const rollbackBalance = activeWallet.balance + oldTx.amount;
                if ((parsedAmount * 1000) > rollbackBalance) {
                    toast.error("Oops! Ví này hông đủ tiền rồi! 💸");
                    return;
                }
            }
        }

        await updateTransaction(id, {
            type,
            category_id: selectedCategory,
            amount: parsedAmount * 1000,
            note: note,
            walletId: selectedWalletId,
            created_at: createdDate ? new Date(createdDate).toISOString() : undefined
        });

        router.back();
    };

    const isExpense = type === 'expense';
    const primaryColor = isExpense ? '#F43F5E' : '#10B981';
    const primaryBgClass = isExpense ? 'bg-[#F43F5E]' : 'bg-[#10B981]';
    const primaryTextClass = isExpense ? 'text-[#F43F5E]' : 'text-[#10B981]';
    const activeIconClass = isExpense ? 'bg-[#EC4899]' : 'bg-[#10B981]';

    return (
        <div className="font-sans antialiased max-w-md mx-auto min-h-screen bg-white flex flex-col relative overflow-x-hidden">

            {/* HEADER SECTION */}
            <header className="px-6 pt-10 pb-4 flex items-center justify-between sticky top-0 bg-white z-40">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="w-10 h-10 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center text-[#1E293B]">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h1 className="text-xl font-extrabold text-[#1E293B]">Sửa {isExpense ? 'Chi Tiêu' : 'Thu Nhập'}</h1>
                </div>
            </header>

            <main className="px-6 py-6 flex-grow flex flex-col">
                {/* WALLET SELECTOR */}
                <div className="mb-6">
                    <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Chọn ví {isExpense ? 'chi tiêu' : 'nhận tiền'}</p>
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

                <div className="mb-6">
                    <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-3">Danh mục</p>
                </div>

                {/* AMOUNT INPUT SECTION */}
                <div className="flex flex-col items-center justify-center py-6 mb-6 relative">
                    <div className={`absolute top-0 right-0 ${isExpense ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700'} font-bold px-3 py-1 rounded-full text-xs`}>
                        {isExpense ? 'Chi tiêu' : 'Thu nhập'}
                    </div>
                    <div className="flex items-baseline mt-4">
                        <span className={`text-5xl font-black ${primaryTextClass} tracking-tight`}>
                            {amount === '0' || amount === '' ? '0' : (parseInt(amount) * 1000).toLocaleString('vi-VN')}
                        </span>
                        <span className={`text-xl font-bold ${primaryTextClass} ml-1`}>đ</span>
                    </div>
                </div>

                {/* CATEGORIES HORIZONTAL LIST */}
                <div className="mb-8 -mx-6 px-6 overflow-x-auto no-scrollbar">
                    <div className="flex gap-4 pb-2">
                        {filteredCategories.map((cat) => (
                            <div
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className="flex flex-col items-center gap-2 cursor-pointer"
                            >
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${selectedCategory === cat.id
                                    ? `${activeIconClass} text-white shadow-md transform scale-105`
                                    : 'bg-gray-50 border border-gray-100 grayscale-[0.3]'
                                    }`}>
                                    {cat.icon}
                                </div>
                                <span className={`text-xs font-bold ${selectedCategory === cat.id ? primaryTextClass : 'text-[#94A3B8]'
                                    }`}>   {cat.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DATE AND NOTE INPUTS */}
                <div className="mb-auto space-y-4">
                    {/* DATE INPUT */}
                    <div className={`flex items-center bg-gray-50 rounded-[1.5rem] p-4 border border-gray-100 transition-colors ${isExpense ? 'focus-within:border-pink-200 focus-within:bg-[#FDF2F8]' : 'focus-within:border-emerald-200 focus-within:bg-emerald-50/50'}`}>
                        <svg className="h-5 w-5 text-[#94A3B8] mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <input
                            type="datetime-local"
                            value={createdDate}
                            onChange={(e) => setCreatedDate(e.target.value)}
                            className="bg-transparent border-none outline-none w-full text-[#1E293B] font-medium"
                        />
                    </div>

                    {/* NOTE INPUT */}
                    <div className={`flex items-center bg-gray-50 rounded-[1.5rem] p-4 border border-gray-100 transition-colors ${isExpense ? 'focus-within:border-pink-200 focus-within:bg-[#FDF2F8]' : 'focus-within:border-emerald-200 focus-within:bg-emerald-50/50'}`}>
                        <svg className="h-5 w-5 text-[#94A3B8] mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        <input
                            type="text"
                            placeholder="Thêm ghi chú lẹ..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="bg-transparent border-none outline-none w-full text-[#1E293B] font-medium placeholder-[#94A3B8]"
                        />
                    </div>
                </div>

            </main >

            {/* FIXED BOTTOM SECTION (KEYPAD + BUTTON) */}
            < div className="px-6 pb-8 bg-white pt-4 border-t border-gray-50" >
                <Keypad onKeyPress={handleKeyPress} />
                <button
                    onClick={handleConfirm}
                    className={`w-full ${primaryBgClass} hover:opacity-90 text-white font-bold py-4 rounded-full mt-6 shadow-lg shadow-pink-200 text-lg active:scale-95 transition-transform flex items-center justify-center gap-2`}>
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                    Lưu thay đổi
                </button>
            </div>

        </div>
    );
}

export default function EditTransactionPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-[#64748B]">Đang tải...</div>}>
            <EditTransactionForm />
        </Suspense>
    );
}
