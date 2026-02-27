'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BottomNav } from '../../components/ui/BottomNav';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { WalletSelector } from '../../components/ui/WalletSelector';
import { useFinanceStore } from '../../store/useFinanceStore';

export default function TipsManagerPage() {
    const router = useRouter();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedTipId, setSelectedTipId] = useState<string | null>(null);
    const { tips } = useFinanceStore();

    const pendingTips = tips.filter(tip => tip.status === 'pending');
    const receivedTips = tips.filter(tip => tip.status === 'received');

    const handleOpenSheet = (id: string) => {
        setSelectedTipId(id);
        setIsSheetOpen(true);
    };

    const groupedTips = receivedTips.reduce((acc, tip) => {
        const group = tip.dateGroup || 'KHÁC';
        if (!acc[group]) acc[group] = [];
        acc[group].push(tip);
        return acc;
    }, {} as Record<string, typeof receivedTips>);

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
                        <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            Tuần này
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-pink-50">
                            <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-[#EC4899] mb-3">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <p className="text-[#94A3B8] text-xs font-medium mb-1">Đã nhận</p>
                            <p className="text-xl font-black text-[#1E293B]">1.250k</p>
                        </div>
                        <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-pink-50">
                            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-[#F43F5E] mb-3">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <p className="text-[#94A3B8] text-xs font-medium mb-1">Đang chờ</p>
                            <p className="text-xl font-black text-[#1E293B]">450k</p>
                        </div>
                    </div>
                </section>

                {/* CẦN THU GẤP SECTION */}
                <section className="mb-8 relative z-10">
                    <h2 className="text-lg font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                        Cần thu gấp
                        <span className="bg-[#fee2e2] text-[#F43F5E] px-2 py-0.5 rounded-full text-xs font-bold">{pendingTips.length}</span>
                    </h2>

                    <div className="flex flex-col gap-4">
                        {pendingTips.map(tip => (
                            <div key={tip.id} className="bg-white rounded-[2rem] p-5 shadow-sm border-2 border-[#fee2e2]">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${tip.type === 'nail' ? 'bg-pink-100 text-[#EC4899]' : 'bg-blue-100 text-blue-500'}`}>
                                            {tip.customerName.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#1E293B] text-base">{tip.customerName}</h3>
                                            <p className="text-xs text-[#94A3B8] font-medium">{tip.time} {tip.description && `• ${tip.description}`}</p>
                                        </div>
                                    </div>
                                    <span className="text-xl font-black text-[#F43F5E]">{tip.amount.toLocaleString('vi-VN')}đ</span>
                                </div>
                                <button
                                    onClick={() => handleOpenSheet(tip.id)}
                                    className="w-full bg-[#F43F5E]/10 hover:bg-[#F43F5E]/20 text-[#F43F5E] flex items-center justify-center gap-2 py-3.5 rounded-full font-bold transition-colors">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                    Đã nhận
                                </button>
                            </div>
                        ))}
                    </div>
                </section>



                {/* GẦN ĐÂY SECTION */}
                <section className="mb-4">
                    <h2 className="text-lg font-bold text-[#1E293B] mb-4">Gần đây</h2>
                    <div className="flex flex-col gap-6">
                        {Object.entries(groupedTips).map(([dateGroup, tipsList]) => (
                            <div key={dateGroup}>
                                <h3 className="text-sm font-bold text-[#94A3B8] mb-3 uppercase tracking-wider">{dateGroup}</h3>
                                <div className="flex flex-col gap-3">
                                    {tipsList.map(tip => (
                                        <div key={tip.id} className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-pink-50 flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-[#1E293B] text-sm">{tip.customerName}</h3>
                                                    <p className="text-xs text-[#94A3B8] font-medium">{tip.time}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="text-lg font-black text-[#1E293B]">+ {tip.amount.toLocaleString('vi-VN')}đ</span>
                                                <span className="bg-pink-50 text-[#F43F5E] px-2 py-0.5 rounded-full text-[10px] font-bold">Đã nhận</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
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
                <WalletSelector tipId={selectedTipId} onConfirm={() => setIsSheetOpen(false)} />
            </BottomSheet>
        </div>
    );
}
