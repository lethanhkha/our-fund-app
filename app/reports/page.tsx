'use client';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinanceStore } from '../../store/useFinanceStore';
import { BottomNav } from '../../components/ui/BottomNav';
import { getDisplayDate } from '@/lib/utils';
import { PageWrapper } from '../../components/ui/PageWrapper';

// Feminine tone colors (Pink, Purple, Rose tones)
const COLORS = ['#F43F5E', '#D946EF', '#FBCFE8', '#E879F9', '#F9A8D4', '#FDA4AF', '#C084FC'];

export default function ReportsPage() {
    const router = useRouter();
    const { transactions, categories, tips } = useFinanceStore();

    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

    // Lọc giao dịch theo tháng đã chọn
    const monthTransactions = useMemo(() => {
        return transactions.filter(t => {
            const baseDate = t.created_at ? new Date(t.created_at) : new Date(t.date);
            return baseDate.getMonth() + 1 === selectedMonth && baseDate.getFullYear() === selectedYear;
        });
    }, [transactions, selectedMonth, selectedYear]);

    // Lọc tips theo tháng đã chọn
    const monthTips = useMemo(() => {
        return tips.filter(t => {
            if (t.status !== 'received') return false;
            const baseDate = t.created_at ? new Date(t.created_at) : new Date(t.time);
            return baseDate.getMonth() + 1 === selectedMonth && baseDate.getFullYear() === selectedYear;
        });
    }, [tips, selectedMonth, selectedYear]);

    // Tổng thu & chi
    const totalIncome = monthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0) + monthTips.reduce((s, t) => s + t.amount, 0);
    const totalExpense = monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    // Gom nhóm chi tiêu theo danh mục để vẽ biểu đồ và xếp hạng
    const expenseData = useMemo(() => {
        const expenseTxs = monthTransactions.filter(t => t.type === 'expense');
        const grouped: Record<string, number> = {};

        expenseTxs.forEach(t => {
            grouped[t.category_id] = (grouped[t.category_id] || 0) + t.amount;
        });

        return Object.entries(grouped)
            .map(([category_id, amount]) => {
                const cat = categories.find(c => c.id === category_id);
                return {
                    name: cat ? cat.name : 'Khác',
                    icon: cat ? cat.icon : '✨',
                    value: amount
                };
            })
            .sort((a, b) => b.value - a.value); // Xếp hạng từ cao xuống thấp
    }, [monthTransactions, categories]);

    return (
        <PageWrapper>
            <div className="font-sans antialiased max-w-md mx-auto min-h-screen bg-[#FDF2F8] flex flex-col pb-28 relative overflow-x-hidden">
                {/* HEADER */}
                <header className="px-6 pt-10 pb-4 sticky top-0 bg-[#FDF2F8]/90 backdrop-blur-md z-40 flex items-center gap-3">
                    <button onClick={() => router.back()} className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-[#1E293B]">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h1 className="text-2xl font-black text-[#1E293B]">Báo cáo 📊</h1>
                </header>

                <main className="flex-grow flex flex-col pt-2">
                    {/* THANH CHỌN NĂM */}
                    <div className="px-6 pb-4 flex items-center justify-between">
                        <button
                            onClick={() => setSelectedYear(y => y - 1)}
                            className="w-10 h-10 rounded-full border border-pink-100 bg-white flex items-center justify-center text-[#1E293B] hover:bg-pink-50 transition-colors"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <h2 className="text-xl font-extrabold text-[#1E293B]">{selectedYear}</h2>
                        <button
                            onClick={() => setSelectedYear(y => y + 1)}
                            className="w-10 h-10 rounded-full border border-pink-100 bg-white flex items-center justify-center text-[#1E293B] hover:bg-pink-50 transition-colors"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>

                    {/* THANH CHỌN THÁNG (Horizontal Scroll) */}
                    <div className="w-full overflow-x-auto hide-scrollbar px-6 pb-6">
                        <div className="flex items-center gap-2" style={{ width: 'max-content' }}>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                                const isSelected = month === selectedMonth;
                                return (
                                    <button
                                        key={month}
                                        onClick={() => setSelectedMonth(month)}
                                        className={`px-5 py-2 whitespace-nowrap rounded-full font-bold text-sm transition-all duration-300 ${isSelected
                                            ? 'bg-[#1E293B] text-white shadow-md'
                                            : 'bg-white text-[#94A3B8] border border-pink-100 hover:bg-gray-50'
                                            }`}
                                    >
                                        Tháng {month}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="px-6">
                        {/* TỔNG QUAN THU CHI */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-emerald-50">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 mb-2">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                                </div>
                                <p className="text-xs text-[#94A3B8] font-bold mb-1">TỔNG THU</p>
                                <p className="text-lg font-black text-emerald-500">{totalIncome.toLocaleString('vi-VN')} đ</p>
                            </div>

                            <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-rose-50">
                                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 mb-2">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                </div>
                                <p className="text-xs text-[#94A3B8] font-bold mb-1">TỔNG CHI</p>
                                <p className="text-lg font-black text-rose-500">{totalExpense.toLocaleString('vi-VN')} đ</p>
                            </div>
                        </div>

                        {/* BIỂU ĐỒ TRÒN CHI TIÊU */}
                        {expenseData.length > 0 ? (
                            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 flex flex-col items-center mb-8">
                                <h2 className="text-sm font-bold text-[#1E293B] self-start mb-4">Cơ cấu Chi tiêu</h2>
                                <div className="w-full h-64 min-h-[250px] relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                isAnimationActive={false}
                                                data={expenseData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {expenseData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value: any) => [`${Number(value).toLocaleString('vi-VN')} đ`, 'Số tiền']}
                                                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    {/* Inner circle text */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-[#94A3B8] text-xs font-bold">Tổng chi</span>
                                        <span className="text-[#1E293B] font-black">{totalExpense >= 1000000 ? (totalExpense / 1000000).toFixed(1) + 'Tr' : (totalExpense / 1000).toLocaleString('vi-VN') + 'k'}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 flex flex-col items-center justify-center mb-8 h-48">
                                <span className="text-4xl text-gray-200 mb-2">🍩</span>
                                <p className="text-sm font-bold text-[#94A3B8]">Chưa có khoản chi nào tháng này!</p>
                            </div>
                        )}

                        {/* DANH SÁCH TOP CHI TIÊU */}
                        {expenseData.length > 0 && (
                            <div className="mb-4">
                                <h2 className="text-sm font-bold text-[#1E293B] mb-4">Top chi tiêu tháng này</h2>
                                <div className="flex flex-col gap-3">
                                    {expenseData.map((item, index) => {
                                        const percentage = ((item.value / totalExpense) * 100).toFixed(1);
                                        return (
                                            <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-pink-50 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-gray-50 border border-gray-100" style={{ borderColor: `${COLORS[index % COLORS.length]}30`, backgroundColor: `${COLORS[index % COLORS.length]}10` }}>
                                                        {item.icon}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-[#1E293B] text-sm flex items-center">
                                                            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                                            {item.name}
                                                        </h3>
                                                        <p className="text-xs text-[#94A3B8] font-medium">{percentage}%</p>
                                                    </div>
                                                </div>
                                                <div className="font-black text-[#1E293B]">
                                                    {item.value.toLocaleString('vi-VN')} đ
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {/* BOTTOM NAV */}
                <BottomNav />
                <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none; /* IE and Edge */
                    scrollbar-width: none; /* Firefox */
                }
            `}</style>
            </div>
        </PageWrapper>
    );
}
