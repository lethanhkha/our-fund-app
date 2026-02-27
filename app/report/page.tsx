'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BottomNav } from '../../components/ui/BottomNav';
import { TransactionItem } from '../../components/ui/TransactionItem';

export default function ReportPage() {
    const router = useRouter();
    const [selectedMonth, setSelectedMonth] = useState('12');

    return (
        <div className="font-sans antialiased max-w-md mx-auto min-h-screen bg-[#FDF2F8] flex flex-col pb-28 relative overflow-x-hidden">

            {/* HEADER SECTION */}
            <header className="px-6 pt-10 pb-4 flex items-center justify-between sticky top-0 bg-[#FDF2F8]/90 backdrop-blur-md z-40">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="w-10 h-10 rounded-full border border-pink-100 bg-white flex items-center justify-center text-[#1E293B] shadow-sm">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h1 className="text-xl font-extrabold text-[#1E293B]">Báo cáo 📊</h1>
                </div>
            </header>

            <main className="px-6 flex-grow">

                {/* MONTH SELECTOR BAR */}
                <div className="flex gap-3 overflow-x-auto no-scrollbar mb-6 -mx-6 px-6">
                    <button
                        onClick={() => setSelectedMonth('11')}
                        className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all ${selectedMonth === '11' ? 'bg-[#1E293B] text-white shadow-md' : 'bg-white text-[#94A3B8]'}`}
                    >
                        Tháng 11
                    </button>
                    <button
                        onClick={() => setSelectedMonth('12')}
                        className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all ${selectedMonth === '12' ? 'bg-[#1E293B] text-white shadow-md' : 'bg-white text-[#94A3B8]'}`}
                    >
                        Tháng 12
                    </button>
                    <button
                        onClick={() => setSelectedMonth('01')}
                        className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all ${selectedMonth === '01' ? 'bg-[#1E293B] text-white shadow-md' : 'bg-white text-[#94A3B8]'}`}
                    >
                        Tháng 01
                    </button>
                </div>

                {/* TWO BIG SQUARES: INCOME & EXPENSE */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-pink-50 flex flex-col justify-between aspect-square">
                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-2">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                        </div>
                        <div>
                            <p className="text-[#94A3B8] text-sm font-medium mb-1">Tổng thu</p>
                            <p className="text-xl font-black text-green-500">25.5M</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-pink-50 flex flex-col justify-between aspect-square">
                        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-[#F43F5E] mb-2">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                        </div>
                        <div>
                            <p className="text-[#94A3B8] text-sm font-medium mb-1">Tổng chi</p>
                            <p className="text-xl font-black text-[#F43F5E]">12.4M</p>
                        </div>
                    </div>
                </div>

                {/* DONUT CHART */}
                <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 mb-8 flex flex-col items-center">
                    <h2 className="text-lg font-bold text-[#1E293B] w-full mb-6">Phân bổ chi tiêu</h2>

                    <div className="relative w-48 h-48 flex items-center justify-center">
                        {/* Simulating Donut Chart with conic gradient */}
                        <div className="w-full h-full rounded-full" style={{
                            background: 'conic-gradient(#EC4899 0% 45%, #a855f7 45% 70%, #fbcfe8 70% 100%)'
                        }}></div>

                        {/* Inner white circle for donut hole */}
                        <div className="absolute w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                            <span className="text-[#94A3B8] text-xs font-medium">Chi tiêu lớn</span>
                            <span className="text-2xl font-black text-[#1E293B]">45%</span>
                        </div>
                    </div>

                    {/* Chart Legend */}
                    <div className="w-full mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#EC4899]"></div>
                            <span className="text-sm text-[#1E293B] font-medium">Làm đẹp</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <span className="text-sm text-[#1E293B] font-medium">Mua sắm</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-pink-200"></div>
                            <span className="text-sm text-[#1E293B] font-medium">Ăn uống</span>
                        </div>
                    </div>
                </section>

                {/* TOP EXPENSES LIST */}
                <section className="mb-4">
                    <h2 className="text-lg font-bold text-[#1E293B] mb-4">Chi tiêu nhiều nhất</h2>
                    <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-pink-50 flex flex-col gap-1">
                        <TransactionItem
                            icon={<span className="text-xl">💅</span>}
                            iconBgColor="bg-pink-100"
                            title="Thẩm mỹ viện"
                            subtitle="Làm đẹp"
                            amount="-5.500.000 đ"
                        />
                        <div className="w-full h-px bg-gray-50 my-1"></div>
                        <TransactionItem
                            icon={<span className="text-xl">🛍️</span>}
                            iconBgColor="bg-purple-100"
                            title="Mua túi xách"
                            subtitle="Mua sắm"
                            amount="-3.200.000 đ"
                        />
                        <div className="w-full h-px bg-gray-50 my-1"></div>
                        <TransactionItem
                            icon={<span className="text-xl">🍣</span>}
                            iconBgColor="bg-orange-100"
                            title="Sushi Hokkaido"
                            subtitle="Ăn uống"
                            amount="-1.850.000 đ"
                        />
                    </div>
                </section>

            </main>

            {/* BOTTOM NAV */}
            <BottomNav />
        </div>
    );
}
