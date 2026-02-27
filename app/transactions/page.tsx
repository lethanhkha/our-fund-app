'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BottomNav } from '../../components/ui/BottomNav';
import { TransactionItem } from '../../components/ui/TransactionItem';

export default function TransactionHistoryPage() {
    const router = useRouter();
    const [filter, setFilter] = useState('all');

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

                    <p className="text-white/80 text-sm font-medium mb-1 relative z-10">Tổng giao dịch tháng này</p>
                    <div className="flex items-baseline relative z-10">
                        <span className="text-4xl font-extrabold tracking-tight">12.450.000</span>
                        <span className="text-xl font-bold ml-1 opacity-80">đ</span>
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
                    <button
                        onClick={() => setFilter('food')}
                        className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${filter === 'food' ? 'bg-[#1E293B] text-white shadow-md' : 'bg-white text-[#94A3B8] border border-pink-50'}`}
                    >
                        Đồ ăn 🍔
                    </button>
                    <button
                        onClick={() => setFilter('beauty')}
                        className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${filter === 'beauty' ? 'bg-[#1E293B] text-white shadow-md' : 'bg-white text-[#94A3B8] border border-pink-50'}`}
                    >
                        Làm đẹp 💅
                    </button>
                    <button
                        onClick={() => setFilter('shop')}
                        className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${filter === 'shop' ? 'bg-[#1E293B] text-white shadow-md' : 'bg-white text-[#94A3B8] border border-pink-50'}`}
                    >
                        Mua sắm 🛍️
                    </button>
                </div>

                {/* DAILY LIST: HÔM NAY */}
                <section className="mb-6">
                    <h3 className="text-sm font-bold text-[#94A3B8] mb-3 uppercase tracking-wider">Hôm nay</h3>
                    <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-pink-50 flex flex-col gap-1">
                        <TransactionItem
                            icon={<span className="text-xl">💰</span>}
                            iconBgColor="bg-emerald-50"
                            title="Lương tháng"
                            subtitle="15:00"
                            amount="15.000.000 đ"
                            type="income"
                        />
                        <div className="w-full h-px bg-gray-50 my-1"></div>
                        <TransactionItem
                            icon={<span className="text-xl">🍔</span>}
                            iconBgColor="bg-yellow-50"
                            title="Highlands Coffee"
                            subtitle="10:30"
                            amount="-85.000 đ"
                        />
                        <div className="w-full h-px bg-gray-50 my-1"></div>
                        <TransactionItem
                            icon={<span className="text-xl">🚕</span>}
                            iconBgColor="bg-blue-50"
                            title="Tiền Grab"
                            subtitle="08:15"
                            amount="-45.000 đ"
                        />
                    </div>
                </section>

                {/* DAILY LIST: HÔM QUA */}
                <section className="mb-6">
                    <h3 className="text-sm font-bold text-[#94A3B8] mb-3 uppercase tracking-wider">Hôm qua</h3>
                    <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-pink-50 flex flex-col gap-1">
                        <TransactionItem
                            icon={<span className="text-xl">💅</span>}
                            iconBgColor="bg-pink-50"
                            title="Gội đầu Dưỡng sinh"
                            subtitle="19:00"
                            amount="-250.000 đ"
                        />
                        <div className="w-full h-px bg-gray-50 my-1"></div>
                        <TransactionItem
                            icon={<span className="text-xl">🛍️</span>}
                            iconBgColor="bg-purple-50"
                            title="Shopee"
                            subtitle="15:20"
                            amount="-1.200.000 đ"
                        />
                        <div className="w-full h-px bg-gray-50 my-1"></div>
                        <TransactionItem
                            icon={<span className="text-xl">🛒</span>}
                            iconBgColor="bg-green-50"
                            title="Winmart"
                            subtitle="11:10"
                            amount="-340.000 đ"
                        />
                    </div>
                </section>

            </main>

            {/* FLOATING ACTION BUTTON */}
            <div className="fixed bottom-24 right-6 z-50">
                <button className="w-14 h-14 bg-[linear-gradient(to_bottom_right,#FF9A9E,#F43F5E)] rounded-full text-white shadow-lg shadow-pink-300 flex items-center justify-center active:scale-90 transition-transform">
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                </button>
            </div>

            {/* BOTTOM NAV */}
            <BottomNav />
        </div>
    );
}
