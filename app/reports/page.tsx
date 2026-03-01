'use client';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinanceStore } from '../../store/useFinanceStore';
import { BottomNav } from '../../components/ui/BottomNav';
import { getDisplayDate } from '@/lib/utils';

// Feminine tone colors (Pink, Purple, Rose tones)
const COLORS = ['#F43F5E', '#D946EF', '#FBCFE8', '#E879F9', '#F9A8D4', '#FDA4AF', '#C084FC'];

export default function ReportsPage() {
    const router = useRouter();
    const { transactions, categories } = useFinanceStore();

    // Lấy danh sách các tháng đã có giao dịch (YYYY-MM)
    const availableMonths = useMemo(() => {
        const months = new Set<string>();
        transactions.forEach(t => {
            const baseDate = t.created_at || t.date;
            if (baseDate) {
                const adjustedDate = getDisplayDate(baseDate);
                months.add(adjustedDate.toISOString().substring(0, 7));
            }
        });
        const monthArray = Array.from(months).sort((a, b) => b.localeCompare(a));
        // Nếu chưa có giao dịch nào, hiển thị tháng hiện tại
        if (monthArray.length === 0) {
            monthArray.push(getDisplayDate(new Date()).toISOString().substring(0, 7));
        }
        return monthArray;
    }, [transactions]);

    const [selectedMonth, setSelectedMonth] = useState<string>(availableMonths[0]);

    // Lọc giao dịch theo tháng đã chọn
    const monthTransactions = useMemo(() => {
        return transactions.filter(t => {
            const baseDate = t.created_at || t.date;
            const adjustedDate = getDisplayDate(baseDate);
            return adjustedDate.toISOString().startsWith(selectedMonth);
        });
    }, [transactions, selectedMonth]);

    // Tổng thu & chi
    const totalIncome = monthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    // Gom nhóm chi tiêu theo danh mục để vẽ biểu đồ và xếp hạng
    const expenseData = useMemo(() => {
        const expenseTxs = monthTransactions.filter(t => t.type === 'expense');
        const grouped: Record<string, number> = {};

        expenseTxs.forEach(t => {
            grouped[t.categoryId] = (grouped[t.categoryId] || 0) + t.amount;
        });

        return Object.entries(grouped)
            .map(([categoryId, amount]) => {
                const cat = categories.find(c => c.id === categoryId);
                return {
                    name: cat ? cat.name : 'Khác',
                    icon: cat ? cat.icon : '✨',
                    value: amount
                };
            })
            .sort((a, b) => b.value - a.value); // Xếp hạng từ cao xuống thấp
    }, [monthTransactions, categories]);

    return (
        <div className="font-sans antialiased max-w-md mx-auto min-h-screen bg-[#FDF2F8] flex flex-col pb-28 relative overflow-x-hidden">
            {/* HEADER */}
            <header className="px-6 pt-10 pb-4 sticky top-0 bg-[#FDF2F8]/90 backdrop-blur-md z-40 flex items-center gap-3">
                <button onClick={() => router.back()} className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-[#1E293B]">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-2xl font-black text-[#1E293B]">Báo cáo 📊</h1>
            </header>

            <main className="flex-grow flex flex-col pt-2">
                {/* THANH CHỌN THÁNG (Horizontal Scroll) */}
                <div className="w-full overflow-x-auto hide-scrollbar px-6 pb-4">
                    <div className="flex items-center gap-2" style={{ width: 'max-content' }}>
                        {availableMonths.map((month) => {
                            const [yyyy, mm] = month.split('-');
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
                                    Tháng {mm}/{yyyy.substring(2)}
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
                            <div className="w-full h-64 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
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
                                                    <h3 className="font-bold text-[#1E293B] text-sm">{item.name}</h3>
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
    );
}
