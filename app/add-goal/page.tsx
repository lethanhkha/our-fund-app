'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function AddGoalPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [targetDate, setTargetDate] = useState('');

    const handleSave = () => {
        const amount = parseInt(targetAmount.replace(/\D/g, '') || '0', 10);

        if (!name.trim()) {
            toast.error("Vui lòng nhập tên mục tiêu!");
            return;
        }

        if (amount <= 0) {
            toast.error("Sao lại không có số tiền cần đạt được nè? 🥺");
            return;
        }

        const data = {
            name,
            targetAmount: amount,
            targetDate
        };
        console.log('Saved Goal:', data);
        toast.success("Tạo mục tiêu thành công! 🎯");
        router.back();
    };

    // Simple formatting for currency input
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (value === '') {
            setTargetAmount('');
        } else {
            setTargetAmount(parseInt(value, 10).toLocaleString('vi-VN'));
        }
    };

    return (
        <div className="font-sans antialiased max-w-md mx-auto min-h-screen bg-[#FDF2F8] flex flex-col relative overflow-x-hidden">
            {/* HEADER */}
            <header className="px-6 pt-10 pb-4 flex items-center gap-4 sticky top-0 bg-[#FDF2F8]/90 backdrop-blur-md z-40">
                <button onClick={() => router.back()} className="w-10 h-10 rounded-full border border-pink-100 bg-white flex items-center justify-center text-[#1E293B] shadow-sm">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-xl font-extrabold text-[#1E293B]">Mục tiêu mới 🎯</h1>
            </header>

            <main className="flex-grow flex flex-col px-6">

                {/* IMAGE PLACEHOLDER */}
                <div className="flex flex-col items-center justify-center py-6">
                    <button className="w-32 h-32 rounded-[2rem] border-2 border-dashed border-pink-200 bg-pink-50 flex flex-col items-center justify-center text-[#EC4899] gap-2 hover:bg-pink-100 transition-colors">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span className="text-xs font-bold">Thêm ảnh</span>
                    </button>
                    <p className="text-[#94A3B8] text-xs font-medium mt-3">Chọn một tấm ảnh truyền cảm hứng</p>
                </div>

                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 flex flex-col gap-6">

                    {/* NAME INPUT */}
                    <div>
                        <label className="block text-sm font-bold text-[#1E293B] mb-2">Tên mục tiêu</label>
                        <input
                            type="text"
                            placeholder="VD: Mua túi xách, Đi du lịch..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#FDF2F8] border border-pink-100 rounded-[1rem] py-4 px-4 text-[#1E293B] font-medium placeholder-pink-300 focus:ring-2 focus:ring-pink-300 outline-none"
                        />
                    </div>

                    {/* TARGET AMOUNT INPUT */}
                    <div>
                        <label className="block text-sm font-bold text-[#1E293B] mb-2">Số tiền cần tiết kiệm (đ)</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            placeholder="0 đ"
                            value={targetAmount}
                            onChange={handleAmountChange}
                            className="w-full bg-[#FDF2F8] border border-pink-100 rounded-[1rem] py-4 px-4 text-[#F43F5E] text-2xl font-extrabold placeholder-pink-300 focus:ring-2 focus:ring-pink-300 outline-none"
                        />
                    </div>

                    {/* TARGET DATE INPUT */}
                    <div>
                        <label className="block text-sm font-bold text-[#1E293B] mb-2">Ngày hoàn thành dự kiến</label>
                        <input
                            type="date"
                            value={targetDate}
                            onChange={(e) => setTargetDate(e.target.value)}
                            className="w-full bg-[#FDF2F8] border border-pink-100 rounded-[1rem] py-4 px-4 text-[#1E293B] font-medium focus:ring-2 focus:ring-pink-300 outline-none"
                        />
                    </div>

                </div>
            </main>

            {/* ACTION BUTTON */}
            <div className="px-6 pb-8 pt-4">
                <button
                    onClick={handleSave}
                    disabled={!name.trim() || !targetAmount.trim()}
                    className="w-full bg-[linear-gradient(to_bottom_right,#FF9A9E,#F43F5E)] text-white font-bold py-4 rounded-[1.5rem] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-200 disabled:opacity-50 disabled:scale-100"
                >
                    Bắt đầu tiết kiệm 🚀
                </button>
            </div>

        </div>
    );
}
