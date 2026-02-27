'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Keypad } from '@/components/ui/Keypad';

export default function AddTipsPage() {
    const router = useRouter();
    const [amount, setAmount] = useState('0');
    const [note, setNote] = useState('');

    const handleKeyPress = (key: string) => {
        if (key === 'clear') {
            setAmount('0');
        } else if (key === 'delete') {
            setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
        } else if (key !== '.') {
            setAmount(prev => {
                if (prev.length >= 10) return prev;
                return prev === '0' ? key : prev + key;
            });
        }
    };

    const handleConfirm = () => {
        if (amount === '0') {
            alert('Vui lòng nhập số tiền');
            return;
        }
        console.log({ amount, note });
        router.back();
    };

    return (
        <div className="font-sans antialiased max-w-md mx-auto min-h-screen bg-white flex flex-col relative overflow-x-hidden">

            {/* HEADER SECTION */}
            <header className="px-6 pt-10 pb-4 flex items-center justify-between sticky top-0 bg-white z-40">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="w-10 h-10 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center text-[#1E293B]">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h1 className="text-xl font-extrabold text-[#1E293B]">Ghi Tips</h1>
                </div>
            </header>

            <main className="px-6 flex-grow flex flex-col">

                {/* MOTIVATIONAL TEXT */}
                <p className="text-[#F43F5E] text-center font-bold mt-4 text-sm">
                    Hôm nay em nhận được bao nhiêu? 💸
                </p>

                {/* AMOUNT INPUT SECTION */}
                <div className="flex flex-col items-center justify-center py-6 mb-6 relative mt-2">
                    <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-700 font-bold px-3 py-1 rounded-full text-xs">
                        Tiền tips
                    </div>
                    <div className="flex items-baseline mt-4">
                        <span className="text-5xl font-black text-[#F43F5E] tracking-tight">
                            {parseInt(amount).toLocaleString('vi-VN')}
                        </span>
                        <span className="text-xl font-bold text-[#F43F5E] ml-1">đ</span>
                    </div>
                </div>

                {/* NOTE INPUT */}
                <div className="mb-auto mt-4">
                    <div className="flex items-center bg-gray-50 rounded-[1.5rem] p-4 border border-gray-100 focus-within:border-pink-200 focus-within:bg-pink-50/50 transition-colors">
                        <svg className="h-5 w-5 text-[#94A3B8] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        <input
                            type="text"
                            placeholder="Ghi chú (Ví dụ: Khách Cắt Tóc)..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="bg-transparent border-none outline-none w-full text-[#1E293B] font-medium placeholder-[#94A3B8]"
                        />
                    </div>
                </div>

            </main>

            {/* FIXED BOTTOM SECTION (KEYPAD + BUTTON) */}
            <div className="px-6 pb-8 bg-white pt-4 border-t border-gray-50">
                <Keypad onKeyPress={handleKeyPress} />
                <button
                    onClick={handleConfirm}
                    className="w-full bg-[#EC4899] hover:bg-[#db2777] text-white font-bold py-4 rounded-full mt-6 shadow-lg shadow-pink-200 text-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                    Xác nhận
                </button>
            </div>

        </div>
    );
}
