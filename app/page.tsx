'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BalanceCard } from '../components/ui/BalanceCard';
import { BottomNav } from '../components/ui/BottomNav';
import { useFinanceStore } from '../store/useFinanceStore';

const LOVE_NOTES = [
  'Hôm nay Embee làm việc vất vả rồi! 🌸',
  'Cuối tuần anh dẫn đi ăn đồ nướng nhé! 🥩',
  'Nhớ uống nhiều nước nha công chúa! 🧋',
  'Hôm nay em thu được nhiều tips không? 💅',
  'Yêu em bé nhất trên đời! ❤️',
  'Nhớ nghỉ ngơi sớm dưỡng nhan siêu cấp nha! ✨',
  'Làm ít thôi, anh nuôi cũng được! 🥰'
];

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const { wallets, tips, getTotalBalance } = useFinanceStore();
  const [greeting, setGreeting] = useState('Chào công chúa của anh! 🌸');

  useEffect(() => {
    setIsMounted(true);
    setGreeting(LOVE_NOTES[Math.floor(Math.random() * LOVE_NOTES.length)]);
  }, []);

  const getWalletIcon = (id: string) => {
    switch (id) {
      case 'cash': return { icon: '💵', color: 'bg-teal-50 text-teal-500', isText: false };
      case 'tcb': return { icon: 'TCB', color: 'bg-red-50 text-red-500 text-xs uppercase', isText: true };
      case 'momo': return { icon: 'M', color: 'bg-pink-50 text-[#EC4899] text-xs', isText: true };
      default: return { icon: '💳', color: 'bg-blue-50 text-blue-500', isText: false };
    }
  };

  const recentTips = tips.slice(0, 3); // Get 3 most recent tips

  if (!isMounted) return null; // Prevent hydration mismatch

  return (
    <div className="font-sans antialiased max-w-md mx-auto min-h-screen bg-[#FDF2F8] flex flex-col pb-28 relative overflow-x-hidden">

      {/* HEADER SECTION */}
      <header className="px-6 pt-10 pb-2 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-[#EC4899] font-bold text-sm">Honey Money 🍯</p>
          <h1 className="text-2xl font-extrabold text-[#1E293B] max-w-[280px] leading-tight">{greeting}</h1>
        </div>
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center border border-white shadow-sm text-[#94A3B8] active:scale-95 transition-transform"
        >
          {showBalance ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
          )}
        </button>
      </header>

      <main className="px-6 flex-grow">

        {/* BALANCE CARD */}
        <BalanceCard
          label="Tổng tài sản hiện có"
          totalBalance={showBalance ? getTotalBalance().toLocaleString('vi-VN') : "***"}
          currency={showBalance ? "đ" : ""}
        />

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Link href="/add-income" className="flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform group">
            <div className="w-[4.5rem] h-[4.5rem] bg-white rounded-full flex items-center justify-center border-2 border-emerald-100 shadow-sm group-hover:shadow-md transition-shadow">
              <svg className="h-7 w-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
            </div>
            <span className="text-xs font-bold text-[#1E293B] text-center w-full">Thêm<br />Thu Nhập</span>
          </Link>

          <Link href="/add-expense" className="flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform group">
            <div className="w-[4.5rem] h-[4.5rem] bg-white rounded-full flex items-center justify-center border-2 border-pink-100 shadow-sm group-hover:shadow-md transition-shadow">
              <svg className="h-7 w-7 text-[#EC4899]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" /></svg>
            </div>
            <span className="text-xs font-bold text-[#1E293B] text-center w-full">Thêm<br />Chi Tiêu</span>
          </Link>

          <Link href="/add-tips" className="flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform group">
            <div className="w-[4.5rem] h-[4.5rem] bg-white rounded-full flex items-center justify-center border-2 border-yellow-100 shadow-sm group-hover:shadow-md transition-shadow">
              <div className="w-7 h-7 bg-yellow-400 text-white rounded-full flex items-center justify-center font-bold text-lg">$</div>
            </div>
            <span className="text-xs font-bold text-[#1E293B] text-center w-full">Ghi<br />Tips</span>
          </Link>
        </div>

        {/* WALLET LIST (HORIZONTAL) */}
        <section className="mb-8 overflow-hidden -mx-6 px-6">
          <div className="flex justify-between items-end mb-4 pr-2">
            <h2 className="text-lg font-bold text-[#1E293B]">Ví của em</h2>
            <button className="text-[#F43F5E] text-sm font-bold">Xem tất cả</button>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 pr-6">
            {wallets.map(wallet => {
              const iconData = getWalletIcon(wallet.id);
              return (
                <div key={wallet.id} className="min-w-[160px] bg-white rounded-[1.5rem] p-4 shadow-sm border border-pink-50 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${iconData.color}`}>
                    {iconData.isText ? iconData.icon : <span className="text-lg">{iconData.icon}</span>}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1E293B]">{wallet.name}</h3>
                    <p className="text-xs text-[#94A3B8] font-medium mt-0.5">{showBalance ? `${wallet.balance.toLocaleString('vi-VN')} đ` : '***'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* RECENT TIPS (HORIZONTAL) */}
        <section className="mb-4 overflow-hidden -mx-6 px-6">
          <h2 className="text-lg font-bold text-[#1E293B] mb-4">Tips gần đây 💅</h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 pr-6">
            {recentTips.map(tip => (
              <div key={tip.id} className="min-w-[140px] bg-white rounded-[1.5rem] p-4 shadow-sm border border-pink-50">
                <div className="text-xs text-[#94A3B8] mb-1 font-medium">{tip.time} • {tip.dateGroup}</div>
                <div className={`text-[1.35rem] font-black mb-2 ${tip.status === 'received' ? 'text-[#1E293B]' : 'text-[#F43F5E]'}`}>
                  + {(tip.amount / 1000).toLocaleString('vi-VN')}k
                </div>
                <div className="text-sm font-bold text-[#1E293B] truncate">{tip.customerName}</div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* BOTTOM NAV */}
      <BottomNav />
    </div>
  );
}
