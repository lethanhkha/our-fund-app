'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Keypad } from '../../components/ui/Keypad';
import { toast } from 'react-hot-toast';

const ICONS = [
    { id: 'cash', label: 'Tiền mặt', emoji: '💵' },
    { id: 'bank', label: 'Bank', emoji: '🏦' },
    { id: 'momo', label: 'Momo', emoji: '📱' },
];

const COLORS = [
    { id: 'teal', value: 'bg-teal-400' },
    { id: 'red', value: 'bg-red-500' },
    { id: 'pink', value: 'bg-pink-400' },
    { id: 'blue', value: 'bg-blue-400' },
    { id: 'purple', value: 'bg-purple-400' },
    { id: 'yellow', value: 'bg-yellow-400' },
];

export default function AddWalletPage() {
    const router = useRouter();
    const [amount, setAmount] = useState('0');
    const [name, setName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('cash');
    const [selectedColor, setSelectedColor] = useState('teal');

    const handleKeyPress = (key: string) => {
        if (key === 'clear') {
            setAmount('0');
        } else if (key === 'backspace') {
            setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
        } else {
            setAmount(prev => prev === '0' ? key : prev + key);
        }
    };

    const handleSave = () => {
        const parsedAmount = parseInt(amount, 10);
        if (!name.trim()) {
            toast.error("Vui lòng nhập tên ví!");
            return;
        }
        if (parsedAmount <= 0) {
            toast.error("Ví mới nên có chút tiền chứ ta! 🥺");
            return;
        }

        const data = {
            name: name.trim(),
            amount: parsedAmount,
            icon: selectedIcon,
            color: selectedColor
        };
        console.log('Saved Wallet:', data);
        toast.success("Thêm ví thành công! 💳");
        router.back();
    };

    return (
        <div className="font-sans antialiased max-w-md mx-auto min-h-screen bg-[#FDF2F8] flex flex-col relative overflow-x-hidden">
            {/* HEADER */}
            <header className="px-6 pt-10 pb-4 flex items-center gap-4 sticky top-0 bg-[#FDF2F8]/90 backdrop-blur-md z-40">
                <button onClick={() => router.back()} className="w-10 h-10 rounded-full border border-pink-100 bg-white flex items-center justify-center text-[#1E293B] shadow-sm">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-xl font-extrabold text-[#1E293B]">Thêm ví mới 💳</h1>
            </header>

            <main className="flex-grow flex flex-col px-6">
                {/* AMOUNT DISPLAY */}
                <div className="flex flex-col items-center justify-center py-6">
                    <p className="text-[#94A3B8] text-sm font-bold mb-2 uppercase tracking-wider">Số dư ban đầu</p>
                    <div className="text-4xl font-extrabold text-[#F43F5E] tracking-tight">
                        {parseInt(amount || '0', 10).toLocaleString('vi-VN')} đ
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 flex-grow flex flex-col mb-6">

                    {/* INPUT NAME */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-[#1E293B] mb-2">Tên ví</label>
                        <input
                            type="text"
                            placeholder="Nhập tên ví (VD: Tiền mặt, Techcombank...)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-[#1E293B] font-medium focus:ring-2 focus:ring-pink-200 outline-none"
                        />
                    </div>

                    {/* SELECT ICON */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-[#1E293B] mb-3">Loại ví</label>
                        <div className="grid grid-cols-3 gap-3">
                            {ICONS.map(icon => (
                                <button
                                    key={icon.id}
                                    onClick={() => setSelectedIcon(icon.id)}
                                    className={`py-3 px-2 rounded-2xl flex flex-col items-center gap-1 border-2 transition-colors ${selectedIcon === icon.id
                                        ? 'border-[#F43F5E] bg-pink-50'
                                        : 'border-transparent bg-gray-50 hover:bg-gray-100'
                                        }`}
                                >
                                    <span className="text-2xl">{icon.emoji}</span>
                                    <span className={`text-xs font-bold ${selectedIcon === icon.id ? 'text-[#F43F5E]' : 'text-[#64748B]'}`}>
                                        {icon.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* SELECT COLOR */}
                    <div className="mb-6 flex-grow">
                        <label className="block text-sm font-bold text-[#1E293B] mb-3">Màu nền</label>
                        <div className="flex flex-wrap gap-4">
                            {COLORS.map(color => (
                                <button
                                    key={color.id}
                                    onClick={() => setSelectedColor(color.id)}
                                    className={`w-10 h-10 rounded-full ${color.value} transition-transform ${selectedColor === color.id ? 'ring-4 ring-offset-2 ring-pink-200 scale-110' : 'hover:scale-105'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </main>

            {/* KEYPAD AND ACTION */}
            <div className="bg-white rounded-t-[2rem] p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] border-t border-pink-50 relative z-20">
                <div className="mb-4">
                    <Keypad onKeyPress={handleKeyPress} />
                </div>
                <button
                    onClick={handleSave}
                    disabled={!name.trim()}
                    className="w-full bg-[linear-gradient(to_bottom_right,#FF9A9E,#F43F5E)] text-white font-bold py-4 rounded-[1.5rem] mt-2 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-200 disabled:opacity-50 disabled:scale-100"
                >
                    Lưu ví ngay 🌸
                </button>
            </div>
        </div>
    );
}
