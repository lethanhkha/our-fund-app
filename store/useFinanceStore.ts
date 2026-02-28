import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
    id: string;
    type: 'income' | 'expense';
    categoryId: string;
    amount: number;
    note: string;
    time: string;
    date: string; // ISO format or string representing date
    walletId: string;
}

export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
}

interface Tip {
    id: string;
    customerName: string;
    amount: number;
    description: string;
    time: string;
    dateGroup?: string;
    status: 'pending' | 'received';
    type: string; // e.g., 'nail', 'hair'
    walletId?: string; // To track which wallet received it for undo
}

interface Wallet {
    id: string;
    name: string;
    balance: number;
}

interface FinanceState {
    wallets: Wallet[];
    tips: Tip[];
    transactions: Transaction[];
    goals: Goal[];

    // Getters
    getTotalBalance: () => number;

    // Actions
    addTransaction: (transaction: Omit<Transaction, 'id' | 'time' | 'date'>) => void;
    addTip: (tip: Omit<Tip, 'id' | 'time' | 'dateGroup' | 'status' | 'walletId'>) => void;
    receiveTips: (tipIds: string[], walletId: string) => void;
    undoReceiveTip: (tipId: string) => void;
}

export const useFinanceStore = create<FinanceState>()(
    persist(
        (set, get) => ({
            wallets: [
                { id: 'cash', name: 'Tiền mặt', balance: 2500000 },
                { id: 'tcb', name: 'Techcombank', balance: 9000000 },
                { id: 'momo', name: 'MoMo', balance: 1000000 },
            ],
            tips: [
                {
                    id: 't1',
                    customerName: 'Chị Lan VIP',
                    amount: 200000,
                    description: 'Làm Nail combo',
                    time: '09:00',
                    dateGroup: 'HÔM QUA',
                    status: 'pending',
                    type: 'nail'
                },
                {
                    id: 't2',
                    customerName: 'Anh Tuấn',
                    amount: 250000,
                    description: 'Gội đầu',
                    time: '14:30',
                    dateGroup: '2 NGÀY TRƯỚC',
                    status: 'pending',
                    type: 'hair'
                },
                {
                    id: 't3',
                    customerName: 'Khách lẻ',
                    amount: 50000,
                    description: '',
                    time: '10:45',
                    dateGroup: 'HÔM NAY',
                    status: 'received',
                    type: 'other'
                },
                {
                    id: 't4',
                    customerName: 'Chị Ngọc',
                    amount: 100000,
                    description: '',
                    time: '15:20',
                    dateGroup: 'HÔM QUA',
                    status: 'received',
                    type: 'other'
                },
                {
                    id: 't5',
                    customerName: 'Khách làm tóc',
                    amount: 150000,
                    description: 'Tip gội sấy',
                    time: '11:15',
                    dateGroup: 'HÔM QUA',
                    status: 'received',
                    type: 'hair'
                }
            ],
            transactions: [
                {
                    id: 'tr1',
                    type: 'income',
                    categoryId: 'salary',
                    amount: 15000000,
                    note: 'Lương tháng',
                    time: '15:00',
                    date: new Date().toISOString().split('T')[0],
                    walletId: 'tcb'
                },
                {
                    id: 'tr2',
                    type: 'expense',
                    categoryId: 'eat',
                    amount: 85000,
                    note: 'Highlands Coffee',
                    time: '10:30',
                    date: new Date().toISOString().split('T')[0],
                    walletId: 'momo'
                },
                {
                    id: 'tr3',
                    type: 'expense',
                    categoryId: 'taxi',
                    amount: 45000,
                    note: 'Tiền Grab',
                    time: '08:15',
                    date: new Date().toISOString().split('T')[0],
                    walletId: 'cash'
                }
            ],
            goals: [],

            getTotalBalance: () => {
                const { wallets } = get();
                return wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
            },

            addTransaction: (transactionData) => set((state) => {
                const now = new Date();
                const newTransaction: Transaction = {
                    ...transactionData,
                    id: 'tr_' + Date.now(),
                    time: now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                    date: now.toISOString().split('T')[0]
                };

                const updatedWallets = state.wallets.map(wallet => {
                    if (wallet.id === transactionData.walletId) {
                        const modifier = transactionData.type === 'income' ? 1 : -1;
                        return { ...wallet, balance: wallet.balance + (transactionData.amount * modifier) };
                    }
                    return wallet;
                });

                return {
                    transactions: [newTransaction, ...state.transactions],
                    wallets: updatedWallets
                };
            }),

            addTip: (tipData) => set((state) => {
                const now = new Date();
                const newTip: Tip = {
                    ...tipData,
                    id: 'tip_' + Date.now(),
                    time: now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                    dateGroup: 'HÔM NAY', // Default for now, can be computed based on real dates
                    status: 'pending'
                };

                return {
                    tips: [newTip, ...state.tips]
                };
            }),

            receiveTips: (tipIds, walletId) => set((state) => {
                let totalAmount = 0;
                const updatedTips = state.tips.map(tip => {
                    if (tipIds.includes(tip.id) && tip.status === 'pending') {
                        totalAmount += tip.amount;
                        return { ...tip, status: 'received' as const, walletId };
                    }
                    return tip;
                });

                if (totalAmount === 0) return state;

                const updatedWallets = state.wallets.map(wallet =>
                    wallet.id === walletId
                        ? { ...wallet, balance: wallet.balance + totalAmount }
                        : wallet
                );

                return {
                    tips: updatedTips,
                    wallets: updatedWallets
                };
            }),
            undoReceiveTip: (tipId) => set((state) => {
                const tipIndex = state.tips.findIndex(t => t.id === tipId);
                if (tipIndex === -1) return state;

                const tip = state.tips[tipIndex];
                if (tip.status === 'pending' || !tip.walletId) return state;

                const updatedTips = [...state.tips];
                updatedTips[tipIndex] = { ...tip, status: 'pending' as const, walletId: undefined };

                const updatedWallets = state.wallets.map(wallet =>
                    wallet.id === tip.walletId
                        ? { ...wallet, balance: wallet.balance - tip.amount }
                        : wallet
                );

                return {
                    tips: updatedTips,
                    wallets: updatedWallets
                };
            })
        }),
        {
            name: 'honey-money-storage',
        }
    )
);
