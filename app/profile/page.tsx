'use client';
import React from 'react';
import { BottomNav } from '../../components/ui/BottomNav';

export default function ProfilePage() {
    return (
        <div className="font-sans antialiased max-w-md mx-auto min-h-screen bg-[#FDF2F8] flex flex-col pb-28 relative overflow-x-hidden">

            {/* HEADER SECTION */}
            <header className="px-6 pt-10 pb-4 flex items-center justify-between sticky top-0 bg-[#FDF2F8]/90 backdrop-blur-md z-40">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[linear-gradient(to_bottom_right,#FF9A9E,#F43F5E)] flex items-center justify-center text-white shadow-sm font-bold shadow-pink-200">
                        HM
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-[#1E293B]">Hồ sơ của em</h1>
                        <p className="text-xs text-[#94A3B8] font-medium mt-0.5">Cài đặt cá nhân</p>
                    </div>
                </div>
            </header>

            <main className="px-6 flex-grow flex flex-col pt-8">

                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-3xl">🌸</div>
                    <div>
                        <h2 className="text-lg font-bold text-[#1E293B] mb-1">Công chúa nhỏ</h2>
                        <p className="text-sm text-[#94A3B8] font-medium">+84 123 456 789</p>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-pink-50 flex flex-col mb-6">
                    <div className="flex items-center justify-between py-3 px-2 border-b border-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-500">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                            <span className="text-sm font-bold text-[#1E293B]">Cài đặt bảo mật</span>
                        </div>
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                    </div>

                    <div className="flex items-center justify-between py-3 px-2 border-b border-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                            </div>
                            <span className="text-sm font-bold text-[#1E293B]">Quản lý thẻ</span>
                        </div>
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                    </div>

                    <div className="flex items-center justify-between py-3 px-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#F43F5E]">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            </div>
                            <span className="text-sm font-bold text-[#F43F5E]">Đăng xuất</span>
                        </div>
                    </div>
                </div>

            </main>

            {/* BOTTOM NAV */}
            <BottomNav />
        </div>
    );
}
