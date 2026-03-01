'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BottomNav } from '../../components/ui/BottomNav';
import { TransactionItem } from '../../components/ui/TransactionItem';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { useFinanceStore } from '../../store/useFinanceStore';

export default function TransactionHistoryPage() {
    const router = useRouter();
    const [filter, setFilter] = useState('all');
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
    const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

    const { transactions, categories, deleteTransaction, wallets } = useFinanceStore();

    // Calculate this month's totals
    const currentMonthStr = new Date().toISOString().substring(0, 7);
    const thisMonthTransactions = transactions.filter(t => t.date.startsWith(currentMonthStr));
    const totalIncome = thisMonthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = thisMonthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netTotal = totalIncome - totalExpense;

    // Filter transactions based on active category
    const filteredTransactions = filter === 'all' ? transactions : transactions.filter(t => t.categoryId === filter);

    // Group giao dịch theo ngày từ danh sách đã lọc
    const groupedTransactions = filteredTransactions.reduce((acc, current) => {
        const dateStr = current.date;
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(current);
        return acc;
    }, {} as Record<string, typeof transactions>);



    return (
        <div className="font-sans antialiased max-w-md mx-auto min-h-screen bg-[#FDF2F8] flex flex-col pb-28 relative overflow-x-hidden">

            {/* HEADER SECTION */}
            <header className="px-6 pt-10 pb-4 flex flex-col sticky top-0 bg-[#FDF2F8]/90 backdrop-blur-md z-40">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="w-10 h-10 rounded-full border border-pink-100 bg-white flex items-center justify-center text-[#1E293B] shadow-sm">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div>
                        <h1 className="text-xl font-extrabold text-[#1E293B]">Lịch sử giao dịch 📝</h1>
                        <p className="text-xs text-[#EC4899] font-bold mt-0.5">Lịch sử giao dịch chi tiết</p>
                    </div>
                </div>
            </header>

            <main className="px-6 flex-grow">

                {/* BIG EXPENSE CARD */}
                <div className="bg-[linear-gradient(to_right,#FF9A9E,#F43F5E)] rounded-[2rem] p-6 text-white shadow-lg shadow-pink-200 relative overflow-hidden my-6">
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>

                    <div className="relative z-10 flex flex-col gap-3">
                        <div className="flex justify-between items-center text-white/90">
                            <span className="text-sm font-medium">Tổng Thu (Tháng này)</span>
                            <span className="font-bold text-green-100">+{totalIncome.toLocaleString('vi-VN')} đ</span>
                        </div>
                        <div className="flex justify-between items-center text-white/90">
                            <span className="text-sm font-medium">Tổng Chi (Tháng này)</span>
                            <span className="font-bold text-red-100">-{totalExpense.toLocaleString('vi-VN')} đ</span>
                        </div>
                        <div className="w-full h-px bg-white/30 my-1"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-white/90">Thu Chi Ròng</span>
                            <span className="text-2xl font-extrabold">{netTotal.toLocaleString('vi-VN')} đ</span>
                        </div>
                    </div>
                </div>

                {/* FILTER DROPDOWN PILLS */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 -mx-6 px-6">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${filter === 'all' ? 'bg-[#1E293B] text-white shadow-md' : 'bg-white text-[#94A3B8] border border-pink-50'}`}
                    >
                        Tất cả
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(cat.id)}
                            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${filter === cat.id ? 'bg-[#1E293B] text-white shadow-md' : 'bg-white text-[#94A3B8] border border-pink-50'}`}
                        >
                            {cat.name} {cat.icon}
                        </button>
                    ))}
                </div>

                {/* DYNAMIC LIST */}
                <div className="flex flex-col gap-6">
                    {Object.entries(groupedTransactions).map(([dateStr, items]) => (
                        <section key={dateStr}>
                            <h3 className="text-sm font-bold text-[#94A3B8] mb-3 uppercase tracking-wider">
                                {dateStr === new Date().toISOString().split('T')[0] ? 'Hôm nay' : dateStr}
                            </h3>
                            <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-pink-50 flex flex-col gap-1">
                                {items.map((item, index) => {
                                    const category = categories.find(c => c.id === item.categoryId);
                                    const wallet = wallets.find(w => w.id === item.walletId);
                                    const details = category ? { icon: category.icon, color: category.type === 'income' ? 'bg-emerald-50' : 'bg-pink-50', title: category.name } : { icon: '✨', color: 'bg-gray-50', title: 'Khác' };

                                    return (
                                        <React.Fragment key={item.id}>
                                            <TransactionItem
                                                icon={<span className="text-xl">{details.icon}</span>}
                                                iconBgColor={details.color}
                                                title={item.note || details.title}
                                                subtitle={
                                                    <span className="flex items-center gap-1">
                                                        {item.time} &bull; <span className="font-semibold text-gray-500">{wallet?.name || 'Ví không xác định'}</span>
                                                    </span>
                                                }
                                                amount={`${item.type === 'income' ? '+' : '-'}${item.amount.toLocaleString('vi-VN')} đ`}
                                                type={item.type}
                                                onClick={() => {
                                                    setSelectedTransactionId(item.id);
                                                    setIsActionSheetOpen(true);
                                                }}
                                            />
                                            {index < items.length - 1 && <div className="w-full h-px bg-gray-50 my-1"></div>}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>

            </main>

            {/* FLOATING ACTION BUTTON */}
            <div className="fixed bottom-24 right-6 z-50">
                <button
                    onClick={() => setIsSheetOpen(true)}
                    className="w-14 h-14 bg-[linear-gradient(to_bottom_right,#FF9A9E,#F43F5E)] rounded-full text-white shadow-lg shadow-pink-300 flex items-center justify-center active:scale-90 transition-transform">
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                </button>
            </div>

            {/* BOTTOM NAV */}
            <BottomNav />

            {/* ADD TRANSACTION BOTTOM SHEET */}
            <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
                <div className="flex flex-col gap-4 p-4 pb-8">
                    <h3 className="text-xl font-bold text-[#1E293B] text-center mb-2">Thêm giao dịch mới</h3>
                    <Link href="/add-income" className="w-full bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold py-4 rounded-[1.5rem] flex items-center justify-center gap-3 active:scale-95 transition-transform">
                        <span className="text-2xl">💰</span>
                        Thêm Thu Nhập
                    </Link>
                    <Link href="/add-expense" className="w-full bg-pink-50 text-[#F43F5E] border border-pink-100 font-bold py-4 rounded-[1.5rem] flex items-center justify-center gap-3 active:scale-95 transition-transform">
                        <span className="text-2xl">🛍️</span>
                        Thêm Chi Tiêu
                    </Link>
                </div>
            </BottomSheet>

            {/* ACTION BOTTOM SHEET */}
            <BottomSheet isOpen={isActionSheetOpen} onClose={() => setIsActionSheetOpen(false)}>
                <div className="flex flex-col gap-4 p-4 pb-8">
                    <h3 className="text-xl font-bold text-[#1E293B] text-center mb-2">Tùy chọn giao dịch</h3>
                    <button
                        onClick={() => {
                            setIsActionSheetOpen(false);
                            if (selectedTransactionId) {
                                router.push(`/edit-transaction?id=${selectedTransactionId}`);
                            }
                        }}
                        className="w-full bg-blue-50 text-blue-600 border border-blue-100 font-bold py-4 rounded-[1.5rem] flex items-center justify-center gap-3 active:scale-95 transition-transform"
                    >
                        <span className="text-2xl">✏️</span>
                        Chỉnh sửa
                    </button>
                    <button
                        onClick={() => {
                            setIsActionSheetOpen(false);
                            if (selectedTransactionId) {
                                toast((t) => (
                                    <div className="flex flex-col gap-2">
                                        <span className="font-bold">Xóa giao dịch này?</span>
                                        <span className="text-sm">Số dư ví sẽ được hoàn lại.</span>
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded text-sm w-full font-bold"
                                                onClick={async () => {
                                                    toast.dismiss(t.id);
                                                    await deleteTransaction(selectedTransactionId);
                                                }}
                                            >
                                                Xóa
                                            </button>
                                            <button
                                                className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm w-full font-bold"
                                                onClick={() => toast.dismiss(t.id)}
                                            >
                                                Thôi
                                            </button>
                                        </div>
                                    </div>
                                ), { duration: 5000 });
                            }
                        }}
                        className="w-full bg-red-50 text-red-600 border border-red-100 font-bold py-4 rounded-[1.5rem] flex items-center justify-center gap-3 active:scale-95 transition-transform"
                    >
                        <span className="text-2xl">🗑️</span>
                        Xóa
                    </button>
                </div>
            </BottomSheet>
        </div>
    );
}
