'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFinanceStore } from '../../store/useFinanceStore';

export default function WalletsPage() {
    const router = useRouter();
    const { wallets } = useFinanceStore();

    return (
        <div className="font-sans antialiased max-w-md mx-auto min-h-screen bg-[#FDF2F8] flex flex-col relative overflow-x-hidden">

            {/* HEADER SECTION */}
            <header className="px-6 pt-10 pb-4 flex items-center justify-between sticky top-0 bg-[#FDF2F8]/90 backdrop-blur-md z-40">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="w-10 h-10 rounded-full border border-pink-100 bg-white flex items-center justify-center text-[#1E293B] shadow-sm">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div>
                        <h1 className="text-xl font-extrabold text-[#1E293B]">Quản lý ví 💳</h1>
                        <p className="text-xs text-[#EC4899] font-bold mt-0.5">Tài khoản & Tiền mặt</p>
                    </div>
                </div>
            </header>

            <main className="px-6 mt-4 flex-grow flex flex-col">
                <section className="mb-6">
                    {wallets.map(w => (
                        <div key={w.id} className="bg-white rounded-[1.5rem] shadow-sm border border-pink-50 p-4 mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full ${w.color || 'bg-teal-50 text-teal-500'} flex items-center justify-center text-xl font-bold uppercase`}>
                                    {w.icon || w.name.substring(0, 3)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#1E293B] text-base">{w.name}</h3>
                                    <p className="text-[#94A3B8] text-xs font-medium mt-0.5">Ví phụ</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-[#1E293B] text-base">{w.balance.toLocaleString('vi-VN')} đ</p>
                            </div>
                        </div>
                    ))}

                    <Link href="/add-wallet" className="w-full bg-white border-2 border-dashed border-pink-200 text-[#EC4899] hover:bg-pink-50/50 font-bold py-4 rounded-[1.5rem] mt-2 transition-colors flex items-center justify-center gap-2">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                        Thêm ví mới
                    </Link>
                </section>
            </main>

        </div>
    );
}
