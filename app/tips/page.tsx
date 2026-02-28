'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BottomNav } from '../../components/ui/BottomNav';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { WalletSelector } from '../../components/ui/WalletSelector';
import { useFinanceStore } from '../../store/useFinanceStore';
import confetti from 'canvas-confetti';

export default function TipsManagerPage() {
    const router = useRouter();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
    const [selectedTipIds, setSelectedTipIds] = useState<string[]>([]);
    const [selectedTipActionId, setSelectedTipActionId] = useState<string | null>(null);
    const { tips, undoReceiveTip, deleteTip } = useFinanceStore();

    const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('month');

    const handleOpenSheet = (ids: string[]) => {
        setSelectedTipIds(ids);
        setIsSheetOpen(true);
    };

    const parseTipDate = (dateGroup?: string) => {
        if (!dateGroup || dateGroup === 'KHÁC') return new Date(0);
        const localNow = new Date();
        if (dateGroup === 'HÔM NAY') return localNow;
        if (dateGroup === 'HÔM QUA') {
            const d = new Date(localNow);
            d.setDate(d.getDate() - 1);
            return d;
        }
        return new Date(dateGroup + 'T00:00:00');
    };

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const filteredTips = tips.filter(t => {
        if (timeFilter === 'all') return true;
        const tipDate = parseTipDate(t.dateGroup);
        if (timeFilter === 'week') return tipDate >= startOfWeek;
        if (timeFilter === 'month') return tipDate >= startOfMonth;
        return true;
    });

    const totalReceived = filteredTips.filter(t => t.status === 'received').reduce((sum, t) => sum + t.amount, 0);
    const totalPending = filteredTips.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);

    const groupedTips = filteredTips.reduce((acc, tip) => {
        const group = tip.dateGroup || 'KHÁC';
        if (!acc[group]) acc[group] = [];
        acc[group].push(tip);
        return acc;
    }, {} as Record<string, typeof tips>);

    return (
        <div className="font-sans antialiased max-w-md mx-auto min-h-screen bg-[#FDF2F8] flex flex-col pb-28 relative overflow-x-hidden">

            {/* HEADER SECTION */}
            <header className="px-6 pt-10 pb-4 flex items-center justify-between sticky top-0 bg-[#FDF2F8]/90 backdrop-blur-md z-40">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="w-10 h-10 rounded-full border border-pink-100 bg-white flex items-center justify-center text-[#1E293B] shadow-sm">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h1 className="text-xl font-extrabold text-[#1E293B]">Sổ ghi tips 💅</h1>
                </div>
                <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-pink-100 shadow-sm text-[#94A3B8]">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
            </header>

            <main className="px-6 mt-2 flex-grow">

                {/* HIỆU SUẤT SECTION */}
                <section className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-[#1E293B]">Hiệu suất</h2>
                        <select
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value as any)}
                            className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold outline-none cursor-pointer appearance-none text-center pr-6 relative shadow-sm"
                            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23b45309%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
                        >
                            <option value="week">Tuần này</option>
                            <option value="month">Tháng này</option>
                            <option value="all">Tất cả</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-pink-50">
                            <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-[#EC4899] mb-3">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <p className="text-[#94A3B8] text-xs font-medium mb-1">Đã nhận</p>
                            <p className="text-xl font-black text-[#1E293B]">{totalReceived.toLocaleString('vi-VN')} đ</p>
                        </div>
                        <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-pink-50">
                            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-[#F43F5E] mb-3">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <p className="text-[#94A3B8] text-xs font-medium mb-1">Đang chờ</p>
                            <p className="text-xl font-black text-[#1E293B]">{totalPending.toLocaleString('vi-VN')} đ</p>
                        </div>
                    </div>
                </section>

                {/* DANH SÁCH SECTION */}
                <section className="mb-4">
                    <div className="flex flex-col gap-6">
                        {Object.entries(groupedTips).map(([dateGroup, tipsList]) => {
                            const pendingTips = tipsList.filter(t => t.status === 'pending');
                            return (
                                <div key={dateGroup}>
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-sm font-bold text-[#94A3B8] uppercase tracking-wider">{dateGroup}</h3>
                                        {pendingTips.length > 0 && (
                                            <button
                                                onClick={() => handleOpenSheet(pendingTips.map(t => t.id))}
                                                className="text-[#F43F5E] text-xs font-bold hover:underline"
                                            >
                                                Nhận tất cả 💸
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {tipsList.map(tip => (
                                            <div
                                                key={tip.id}
                                                onClick={() => {
                                                    setSelectedTipActionId(tip.id);
                                                    setIsActionSheetOpen(true);
                                                }}
                                                className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-pink-50 flex justify-between items-start cursor-pointer active:scale-[0.98] transition-all"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${tip.type === 'nail' ? 'bg-pink-100 text-[#EC4899]' : 'bg-blue-100 text-blue-500'}`}>
                                                        {tip.customerName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-[#1E293B] text-sm">{tip.customerName}</h3>
                                                        <p className="text-xs text-[#94A3B8] font-medium">{tip.time} {tip.description && `• ${tip.description}`}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className={`text-lg font-black ${tip.status === 'received' ? 'text-[#1E293B]' : 'text-[#F43F5E]'}`}>
                                                        + {tip.amount.toLocaleString('vi-VN')} đ
                                                    </span>
                                                    {tip.status === 'received' ? (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); undoReceiveTip(tip.id); }}
                                                            title="Hoàn tác"
                                                            className="bg-pink-50 text-[#F43F5E] px-2 py-0.5 rounded-full text-[10px] font-bold hover:bg-pink-100 transition-colors"
                                                        >
                                                            Đã nhận
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleOpenSheet([tip.id]); }}
                                                            className="bg-[#F43F5E] hover:bg-[#E11D48] text-white px-3 py-1 rounded-full text-xs font-bold transition-colors shadow-sm"
                                                        >
                                                            Đã nhận
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>

            </main>

            {/* FLOATING ACTION BUTTON */}
            <div className="fixed bottom-24 right-6 z-50">
                <Link href="/add-tips" className="w-14 h-14 bg-[linear-gradient(to_bottom_right,#EC4899,#F43F5E)] rounded-full text-white shadow-lg shadow-pink-300 flex items-center justify-center active:scale-90 transition-transform">
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                </Link>
            </div>

            {/* BOTTOM NAV */}
            <BottomNav />

            {/* WALLET SELECTOR BOTTOM SHEET */}
            <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
                <WalletSelector tipIds={selectedTipIds} onConfirm={() => {
                    setIsSheetOpen(false);
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#F43F5E', '#10B981', '#FBBF24']
                    });
                }} />
            </BottomSheet>

            {/* ACTION BOTTOM SHEET */}
            <BottomSheet isOpen={isActionSheetOpen} onClose={() => setIsActionSheetOpen(false)}>
                <div className="flex flex-col gap-4 p-4 pb-8">
                    <h3 className="text-xl font-bold text-[#1E293B] text-center mb-2">Tùy chọn Tips</h3>
                    <button
                        onClick={() => {
                            setIsActionSheetOpen(false);
                            if (selectedTipActionId) {
                                toast((t) => (
                                    <div className="flex flex-col gap-2">
                                        <span className="font-bold">Xóa Tip này?</span>
                                        <span className="text-sm">Nếu đã nhận, số dư ví sẽ được trừ lại.</span>
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded text-sm w-full font-bold"
                                                onClick={async () => {
                                                    toast.dismiss(t.id);
                                                    await deleteTip(selectedTipActionId);
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
