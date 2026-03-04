"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useFinanceStore } from '@/store/useFinanceStore';
import { toast } from 'react-hot-toast';

export const ProfileSwitcher: React.FC = () => {
    const { activeUserId, setActiveUserId } = useFinanceStore();

    const handleSwitch = (id: 'nga' | 'kha') => {
        if (id === activeUserId) return;
        toast(`Đang chuyển sang sổ sách của ${id === 'nga' ? 'embee' : 'anhbee'}...`, {
            icon: '🔄',
        });
        setActiveUserId(id);
    };

    return (
        <div className="flex bg-slate-100 p-1 rounded-full shadow-inner relative justify-between overflow-hidden">
            <button
                onClick={() => handleSwitch('nga')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-full text-sm font-bold z-10 transition-colors ${activeUserId === 'nga' ? 'text-pink-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <span className="text-lg">💆🏻‍♀️</span> embee
            </button>
            <button
                onClick={() => handleSwitch('kha')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-full text-sm font-bold z-10 transition-colors ${activeUserId === 'kha' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <span className="text-lg">👨🏻‍💻</span> anhbee
            </button>

            {/* Sliding Background */}
            <motion.div
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm"
                initial={false}
                animate={{
                    left: activeUserId === 'nga' ? '4px' : 'calc(50%)'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
        </div>
    );
};
