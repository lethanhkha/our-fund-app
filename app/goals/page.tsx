'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFinanceStore } from '../../store/useFinanceStore';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function GoalsPage() {
    const router = useRouter();
    const { goals, wallets, deleteGoal, depositGoal, withdrawGoal } = useFinanceStore();

    const [actionMenuId, setActionMenuId] = useState<string | null>(null);
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
    const [selectedWalletId, setSelectedWalletId] = useState<string>('');
    const [amount, setAmount] = useState<string>('');

    useEffect(() => {
        if ((isDepositModalOpen || isWithdrawModalOpen) && wallets.length > 0) {
            setAmount('');
            const defaultWallet = wallets.find(w => w.is_default) || wallets[0];
            setSelectedWalletId(defaultWallet.id);
        }
    }, [isDepositModalOpen, isWithdrawModalOpen, wallets]);

    const handleDeposit = async () => {
        if (!selectedGoalId || !selectedWalletId || !amount) {
            toast.error('Vui lòng điền đủ thông tin!');
            return;
        }
        const parsedAmount = parseInt(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            toast.error('Số tiền không hợp lệ!');
            return;
        }

        await depositGoal(selectedGoalId, selectedWalletId, parsedAmount);
        setIsDepositModalOpen(false);
        setAmount('');
    };

    const handleWithdraw = async () => {
        if (!selectedGoalId || !selectedWalletId || !amount) {
            toast.error('Vui lòng điền đủ thông tin!');
            return;
        }
        const parsedAmount = parseInt(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            toast.error('Số tiền không hợp lệ!');
            return;
        }

        await withdrawGoal(selectedGoalId, selectedWalletId, parsedAmount);
        setIsWithdrawModalOpen(false);
        setAmount('');
    };

    const handleDelete = async () => {
        if (!selectedGoalId) return;
        await deleteGoal(selectedGoalId);
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="w-full min-h-screen bg-[#FDF2F8]">
            <div className="font-sans antialiased w-full max-w-md mx-auto min-h-screen flex flex-col relative overflow-x-hidden pb-20 md:pb-0">
                {/* Click Outside Overlay */}
                {actionMenuId && (
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setActionMenuId(null)}
                    />
                )}

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

                <main className="flex-grow px-6 pt-4 pb-28 text-[#1E293B]">
                    <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 gap-4">
                        {goals.map(g => {
                            const percent = g.targetAmount > 0 ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)) : 0;
                            const isMenuOpen = actionMenuId === g.id;

                            return (
                                <div key={g.id} className={`bg-white rounded-[1.5rem] shadow-sm border border-pink-50 p-5 relative ${isMenuOpen ? 'z-50' : 'z-10'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 text-lg">
                                                🎯
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[#1E293B] text-base">{g.name}</h3>
                                                <p className="text-[#94A3B8] text-xs font-medium mt-0.5">Mục tiêu: {g.targetAmount.toLocaleString('vi-VN')} đ</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#EC4899] font-bold text-sm tracking-wide">{percent}%</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActionMenuId(isMenuOpen ? null : g.id);
                                                }}
                                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors relative z-10"
                                            >
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                                            </button>

                                            {/* Dropdown Menu */}
                                            <AnimatePresence>
                                                {isMenuOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        transition={{ duration: 0.15 }}
                                                        className="absolute top-14 right-4 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 py-2 overflow-hidden"
                                                    >
                                                        <button
                                                            onClick={() => {
                                                                setSelectedGoalId(g.id);
                                                                setActionMenuId(null);
                                                                setIsDepositModalOpen(true);
                                                            }}
                                                            className="w-full text-left px-4 py-3 text-sm font-semibold text-[#10B981] hover:bg-emerald-50 active:bg-emerald-100 transition-colors flex items-center gap-2"
                                                        >
                                                            <span>📥</span> Góp thêm tiền
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedGoalId(g.id);
                                                                setActionMenuId(null);
                                                                setIsWithdrawModalOpen(true);
                                                            }}
                                                            className="w-full text-left px-4 py-3 text-sm font-semibold text-[#F59E0B] hover:bg-orange-50 active:bg-orange-100 transition-colors flex items-center gap-2"
                                                        >
                                                            <span>📤</span> Rút tiền
                                                        </button>
                                                        <div className="h-[1px] bg-gray-100 my-1 mx-4"></div>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedGoalId(g.id);
                                                                setActionMenuId(null);
                                                                if (g.currentAmount > 0) {
                                                                    toast.error('Vui lòng rút hết tiền trong quỹ trước khi xóa!');
                                                                    return;
                                                                }
                                                                setIsDeleteModalOpen(true);
                                                            }}
                                                            className="w-full text-left px-4 py-3 text-sm font-semibold text-rose-500 hover:bg-rose-50 active:bg-rose-100 transition-colors flex items-center gap-2"
                                                        >
                                                            <span>🗑️</span> Xóa mục tiêu
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2.5 overflow-hidden">
                                        <div className="bg-[linear-gradient(to_right,#FF9A9E,#F43F5E)] h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                                    </div>
                                    <p className="text-xs font-bold text-right text-[#94A3B8]">Đã gom: <span className="text-[#1E293B] text-sm">{g.currentAmount.toLocaleString('vi-VN')}</span> đ</p>
                                </div>
                            );
                        })}
                    </div>
                </main>

                {/* ADD BUTTON OUTSIDE GRID */}
                <div className="px-6">
                    <Link href="/add-goal" className="w-full bg-[linear-gradient(to_bottom_right,#FF9A9E,#F43F5E)] hover:opacity-90 text-white font-bold py-4 rounded-[1.5rem] mt-2 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-pink-200">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                        Thêm mục tiêu
                    </Link>
                </div>

                {/* Deposit Modal */}
                <AnimatePresence>
                    {isDepositModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-pink-100"
                            >
                                <h2 className="text-xl font-extrabold text-[#1E293B] mb-4 text-center">📥 Góp thêm tiền</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-[#64748B] mb-2">Chọn Ví nguồn</label>
                                        <select
                                            value={selectedWalletId}
                                            onChange={e => setSelectedWalletId(e.target.value)}
                                            className="w-full bg-[#F8FAFC] p-4 rounded-2xl border-none text-[#1E293B] font-semibold text-sm focus:ring-2 focus:ring-[#F43F5E] outline-none appearance-none"
                                        >
                                            <option value="" disabled>-- Chọn ví --</option>
                                            {wallets.map(w => (
                                                <option key={w.id} value={w.id}>{w.icon} {w.name} ({w.balance.toLocaleString('vi-VN')} đ)</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#64748B] mb-2">Số tiền góp</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={e => setAmount(e.target.value)}
                                                placeholder="0"
                                                className="w-full bg-[#F8FAFC] p-4 pr-12 rounded-2xl border-none text-xl font-bold text-[#1E293B] focus:ring-2 focus:ring-[#F43F5E] outline-none"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] font-bold">VNĐ</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-8">
                                    <button
                                        onClick={() => setIsDepositModalOpen(false)}
                                        className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold text-sm hover:bg-gray-200 active:scale-95 transition-all"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleDeposit}
                                        className="flex-1 py-4 bg-[linear-gradient(to_right,#10B981,#059669)] text-white rounded-2xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-emerald-200"
                                    >
                                        Xác nhận
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Withdraw Modal */}
                <AnimatePresence>
                    {isWithdrawModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-pink-100"
                            >
                                <h2 className="text-xl font-extrabold text-[#1E293B] mb-4 text-center">📤 Rút tiền</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-[#64748B] mb-2">Chọn Ví nhận</label>
                                        <select
                                            value={selectedWalletId}
                                            onChange={e => setSelectedWalletId(e.target.value)}
                                            className="w-full bg-[#F8FAFC] p-4 rounded-2xl border-none text-[#1E293B] font-semibold text-sm focus:ring-2 focus:ring-[#F43F5E] outline-none appearance-none"
                                        >
                                            <option value="" disabled>-- Chọn ví --</option>
                                            {wallets.map(w => (
                                                <option key={w.id} value={w.id}>{w.icon} {w.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#64748B] mb-2">Số tiền rút</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={e => setAmount(e.target.value)}
                                                placeholder="0"
                                                className="w-full bg-[#F8FAFC] p-4 pr-12 rounded-2xl border-none text-xl font-bold text-[#1E293B] focus:ring-2 focus:ring-[#F43F5E] outline-none"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] font-bold">VNĐ</span>
                                        </div>
                                        <p className="text-xs text-orange-500 mt-3 font-medium bg-orange-50 p-3 rounded-xl border border-orange-100 flex items-start gap-2">
                                            <span className="text-lg leading-none">⚠️</span> Cảnh báo: Rút tiền sẽ làm giảm tiến độ mục tiêu của bạn!
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-8">
                                    <button
                                        onClick={() => setIsWithdrawModalOpen(false)}
                                        className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold text-sm hover:bg-gray-200 active:scale-95 transition-all"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleWithdraw}
                                        className="flex-1 py-4 bg-[linear-gradient(to_right,#F59E0B,#D97706)] text-white rounded-2xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-orange-200"
                                    >
                                        Xác nhận
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {isDeleteModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-rose-100 text-center"
                            >
                                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100 text-3xl">
                                    🗑️
                                </div>
                                <h2 className="text-xl font-extrabold text-[#1E293B] mb-2">Xóa mục tiêu?</h2>
                                <p className="text-[#64748B] text-sm mb-8">Bạn có chắc chắn muốn xóa mục tiêu này không? Hành động này không thể hoàn tác.</p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold text-sm hover:bg-gray-200 active:scale-95 transition-all"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-bold text-sm hover:bg-rose-600 active:scale-95 transition-all shadow-lg shadow-rose-200"
                                    >
                                        Xóa ngay
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
