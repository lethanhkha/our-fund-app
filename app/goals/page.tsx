'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function GoalsPage() {
    const router = useRouter();

    return (
        <div className="font-sans antialiased max-w-md mx-auto min-h-screen bg-[#FDF2F8] flex flex-col relative overflow-x-hidden">

            {/* HEADER SECTION */}
            <header className="px-6 pt-10 pb-4 flex items-center justify-between sticky top-0 bg-[#FDF2F8]/90 backdrop-blur-md z-40">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="w-10 h-10 rounded-full border border-pink-100 bg-white flex items-center justify-center text-[#1E293B] shadow-sm">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div>
                        <h1 className="text-xl font-extrabold text-[#1E293B]">Mục tiêu 🎯</h1>
                        <p className="text-xs text-[#EC4899] font-bold mt-0.5">Tiết kiệm & Ước mơ</p>
                    </div>
                </div>
            </header>

            <main className="px-6 mt-4 flex-grow flex flex-col">
                <section className="mb-6">
                    <div className="bg-white rounded-[1.5rem] shadow-sm border border-pink-50 p-5 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 text-lg">
                                    👜
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#1E293B] text-base">Mua túi xách</h3>
                                    <p className="text-[#94A3B8] text-xs font-medium mt-0.5">Mục tiêu: 15.000.000 đ</p>
                                </div>
                            </div>
                            <span className="text-[#EC4899] font-bold text-sm">33%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                            <div className="bg-[linear-gradient(to_right,#FF9A9E,#F43F5E)] h-2 rounded-full" style={{ width: '33%' }}></div>
                        </div>
                        <p className="text-xs font-bold text-right text-[#94A3B8]">Đã gom: 5.000.000 đ</p>
                    </div>

                    <div className="bg-white rounded-[1.5rem] shadow-sm border border-pink-50 p-5 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-lg">
                                    ✈️
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#1E293B] text-base">Đi du lịch</h3>
                                    <p className="text-[#94A3B8] text-xs font-medium mt-0.5">Mục tiêu: 20.000.000 đ</p>
                                </div>
                            </div>
                            <span className="text-[#EC4899] font-bold text-sm">75%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                            <div className="bg-[linear-gradient(to_right,#FF9A9E,#F43F5E)] h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <p className="text-xs font-bold text-right text-[#94A3B8]">Đã gom: 15.000.000 đ</p>
                    </div>

                    <button className="w-full bg-[linear-gradient(to_bottom_right,#FF9A9E,#F43F5E)] hover:opacity-90 text-white font-bold py-4 rounded-[1.5rem] mt-2 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-pink-200">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                        Thêm mục tiêu
                    </button>
                </section>
            </main>

        </div>
    );
}
