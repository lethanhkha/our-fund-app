'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFinanceStore } from '../../store/useFinanceStore';
import { toast } from 'react-hot-toast';
import { PageWrapper } from '../../components/ui/PageWrapper';
import { motion } from 'framer-motion';

export default function WalletsPage() {
    const router = useRouter();
    const { wallets, setPrimaryWallet, deleteWallet } = useFinanceStore();
    const [actionMenuId, setActionMenuId] = useState<string | null>(null);

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
            case 'pink': return 'bg-[var(--color-brand-secondary)] text-pink-500';
            default: return 'bg-slate-50 text-slate-500';
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#FDF2F8]">
            <PageWrapper>
                <div className="font-sans antialiased w-full max-w-md mx-auto min-h-screen flex flex-col relative overflow-x-hidden">

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

                    <main className="flex-grow px-6 pb-6 pt-4">
                        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 gap-4">
                            {wallets.map(wallet => (
                                <motion.div whileTap={{ scale: 0.98 }} key={wallet.id} className={`bg-white rounded-[1.5rem] shadow-sm border border-pink-50 p-4 flex items-center justify-between relative ${actionMenuId === wallet.id ? 'z-50' : 'z-10'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full ${getWalletColor(wallet.color)} flex items-center justify-center text-xl font-bold uppercase`}>
                                            {getWalletIcon(wallet.icon, wallet.name)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#1E293B] text-base">
                                                {wallet.name} {wallet.is_default && '👑'}
                                            </h3>
                                            <p className={`text-xs font-bold mt-0.5 ${wallet.is_default ? 'text-[#EC4899]' : 'text-[#94A3B8]'}`}>
                                                {wallet.is_default ? 'Ví chính' : 'Ví phụ'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-3">
                                        <p className="font-bold text-[#1E293B] text-base">{wallet.balance.toLocaleString('vi-VN')} đ</p>
                                        <button
                                            onClick={() => setActionMenuId(actionMenuId === wallet.id ? null : wallet.id)}
                                            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors">
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                                        </button>
                                    </div>

                                    {/* DROPDOWN MENU */}
                                    {actionMenuId === wallet.id && (
                                        <div className="absolute top-16 right-4 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 py-2 overflow-hidden animate-fade-in">
                                            {!wallet.is_default && (
                                                <button
                                                    onClick={async () => {
                                                        setActionMenuId(null);
                                                        await setPrimaryWallet(wallet.id);
                                                    }}
                                                    className="w-full px-4 py-3 text-left text-sm font-bold text-[#1E293B] hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                                >
                                                    <span className="text-xl">⭐</span> Đặt làm ví chính
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setActionMenuId(null);
                                                    router.push(`/edit-wallet?id=${wallet.id}`);
                                                }}
                                                className="w-full px-4 py-3 text-left text-sm font-bold text-[#1E293B] hover:bg-gray-50 flex items-center gap-3 transition-colors border-t border-gray-50"
                                            >
                                                <span className="text-xl">✏️</span> Sửa thông tin ví
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setActionMenuId(null);
                                                    toast.custom((t) => (
                                                        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-white shadow-2xl rounded-[2rem] p-6 border border-pink-100 pointer-events-auto flex flex-col items-center text-center`}>
                                                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                                                <span className="text-3xl">🗑️</span>
                                                            </div>
                                                            <h3 className="text-xl font-extrabold text-[#1E293B] mb-2">Xóa ví này?</h3>
                                                            <p className="text-[#64748B] text-sm font-medium mb-6">
                                                                Em chắc chắn muốn xóa ví <strong>{wallet.name}</strong> chứ?
                                                            </p>
                                                            <div className="flex gap-3 w-full">
                                                                <button
                                                                    onClick={() => toast.dismiss(t.id)}
                                                                    className="flex-1 px-4 py-3 bg-gray-50 hover:bg-gray-100 text-[#64748B] font-bold rounded-2xl transition-colors"
                                                                >
                                                                    Hủy bỏ
                                                                </button>
                                                                <button
                                                                    onClick={async () => {
                                                                        toast.dismiss(t.id);
                                                                        await deleteWallet(wallet.id);
                                                                    }}
                                                                    className="flex-1 px-4 py-3 bg-[#F43F5E] hover:bg-rose-600 text-white font-bold rounded-2xl shadow-md shadow-pink-200 transition-all active:scale-95"
                                                                >
                                                                    Xác nhận Xóa
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ), { duration: Infinity });
                                                }}
                                                className="w-full px-4 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors border-t border-gray-50"
                                            >
                                                <span className="text-xl">🗑️</span> Xóa ví
                                            </button>
                                        </div>
                                    )}

                                </motion.div>
                            ))}

                            <Link href="/add-wallet">
                                <motion.div whileTap={{ scale: 0.95 }} className="w-full bg-white border-2 border-dashed border-pink-200 text-[#EC4899] hover:bg-[var(--color-brand-secondary)]/ font-bold py-4 rounded-[1.5rem] mt-2 transition-colors flex items-center justify-center gap-2">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                    Thêm ví mới
                                </motion.div>
                            </Link>
                        </div>
                    </main>

                </div>
            </PageWrapper>
        </div>
    );
}
