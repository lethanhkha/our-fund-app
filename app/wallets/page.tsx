'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFinanceStore } from '../../store/useFinanceStore';

export default function WalletsPage() {
    const router = useRouter();
    const { wallets } = useFinanceStore();

    const getWalletIcon = (iconStr: string | undefined, name: string) => {
        if (!iconStr) return name.substring(0, 3).toUpperCase();
        if (iconStr === 'cash') return '💵';
        if (iconStr === 'bank') return '🏦';
        if (iconStr === 'momo' || iconStr === 'ewallet') return '📱';
        // Check if the icon string is an actual emoji
        const emojiRegex = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/u;
        if (emojiRegex.test(iconStr)) return iconStr;

        return iconStr; // fallback
    };

    const getWalletColor = (colorStr: string | undefined) => {
        if (!colorStr) return 'bg-teal-50 text-teal-500';
        // Add safe fallback mappings if it's just a hex or simple string instead of full classes
        if (colorStr.includes('bg-')) return colorStr;

        switch (colorStr) {
            case 'blue': return 'bg-blue-50 text-blue-500';
            case 'green': return 'bg-emerald-50 text-emerald-500';
            case 'red': return 'bg-rose-50 text-rose-500';
            case 'purple': return 'bg-purple-50 text-purple-500';
            case 'orange': return 'bg-orange-50 text-orange-500';
            case 'pink': return 'bg-pink-50 text-pink-500';
            default: return 'bg-slate-50 text-slate-500';
        }
    };

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
                                <div className={`w-12 h-12 rounded-full ${getWalletColor(w.color)} flex items-center justify-center text-xl font-bold uppercase`}>
                                    {getWalletIcon(w.icon, w.name)}
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
