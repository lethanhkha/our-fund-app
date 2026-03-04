"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ProfileSwitcher } from '@/components/ui/ProfileSwitcher';
import { useFinanceStore } from '@/store/useFinanceStore';

export const BottomNav: React.FC = () => {
    const pathname = usePathname();
    const { activeUserId } = useFinanceStore();

    const navItems = [
        {
            icon: <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
            label: 'Tổng quan',
            href: '/',
        },
        {
            icon: <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
            label: 'Giao dịch',
            href: '/transactions',
        },
        {
            icon: <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
            label: 'Ví',
            href: '/wallets'
        },
        {
            icon: <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
            label: 'Danh mục',
            href: '/categories'
        },
        {
            icon: <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
            label: 'Tiết kiệm',
            href: '/goals'
        },
        {
            icon: <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            label: 'Tips',
            href: '/tips'
        }
    ];

    const filteredNavItems = activeUserId === 'kha'
        ? navItems.filter(item => item.href !== '/tips')
        : navItems;

    return (
        <>
            {/* Mobile Top Profile Switcher */}
            <div className="md:hidden fixed top-2 left-1/2 -translate-x-1/2 z-[100] scale-90">
                <ProfileSwitcher />
            </div>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-6 left-6 right-6 max-w-md mx-auto bg-white rounded-[2.5rem] px-6 py-4 flex justify-between items-center z-50 shadow-[0_10px_40px_0_rgba(238,43,91,0.1)]">
                {filteredNavItems.map((item: { href: string; icon: React.ReactNode; label: string }, idx: number) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link href={item.href} key={idx} className={`flex flex-col items-center justify-center gap-1 w-14 h-14 relative transition-colors cursor-pointer active:scale-95 ${isActive ? 'text-[#F43F5E]' : 'text-slate-400'}`}>
                            {isActive && (
                                <motion.div
                                    layoutId="nav-indicator-mobile"
                                    className="absolute inset-0 bg-[var(--color-brand-secondary)] rounded-2xl z-0"
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                />
                            )}
                            <div className="relative z-10 flex flex-col items-center justify-center gap-1">
                                {item.icon}
                                <span className="text-[10px] font-bold">{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r bg-white p-4 z-50">
                <div className="flex items-center gap-2 mb-6 px-2 mt-4 text-[#F43F5E]">
                    <span className="text-3xl">🍯</span>
                    <h1 className="text-xl font-extrabold">Honey Money</h1>
                </div>
                <div className="mb-6 px-2">
                    <ProfileSwitcher />
                </div>
                <div className="flex flex-col gap-2">
                    {filteredNavItems.map((item: { href: string; icon: React.ReactNode; label: string }, idx: number) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link href={item.href} key={idx} className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-colors relative ${isActive ? 'text-[#F43F5E]' : 'text-slate-500 hover:bg-slate-50'}`}>
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-indicator-desktop"
                                        className="absolute inset-0 bg-[var(--color-brand-secondary)] rounded-2xl z-0"
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    />
                                )}
                                <div className="relative z-10 flex items-center gap-4">
                                    {item.icon}
                                    <span className="font-bold text-sm tracking-wide">{item.label}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </aside>
        </>
    );
};
