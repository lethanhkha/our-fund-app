import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

export interface Transaction {
    id: string;
    type: 'income' | 'expense';
    categoryId: string;
    amount: number;
    note: string;
    time: string;
    date: string;
    walletId: string;
}

export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
}

export interface Tip {
    id: string;
    customerName: string;
    amount: number;
    description: string;
    time: string;
    dateGroup?: string;
    status: 'pending' | 'received';
    type: string;
    walletId?: string;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    type: 'income' | 'expense';
    created_at?: string;
}

export interface Wallet {
    id: string;
    name: string;
    balance: number;
    icon?: string;
    color?: string;
}

interface FinanceState {
    wallets: Wallet[];
    categories: Category[];
    tips: Tip[];
    transactions: Transaction[];
    goals: Goal[];

    // Getters
    getTotalBalance: () => number;

    // Actions
    fetchInitialData: () => Promise<void>;
    addTransaction: (transaction: Omit<Transaction, 'id' | 'time' | 'date'>) => Promise<void>;
    addTip: (tip: Omit<Tip, 'id' | 'time' | 'dateGroup' | 'status' | 'walletId'>) => Promise<void>;
    receiveTips: (tipIds: string[], walletId: string) => Promise<void>;
    undoReceiveTip: (tipId: string) => Promise<void>;
}

// Utility to categorize dates for tips
const getDateGroup = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const itemDate = dateStr.split('T')[0];

    if (itemDate === today) return 'HÔM NAY';
    if (itemDate === yesterday) return 'HÔM QUA';
    return itemDate; // Fallback
};

export const useFinanceStore = create<FinanceState>()(
    persist(
        (set, get) => ({
            wallets: [],
            categories: [],
            tips: [],
            transactions: [],
            goals: [],

            getTotalBalance: () => {
                const { wallets } = get();
                return wallets.reduce((sum, wallet) => sum + Number(wallet.balance), 0);
            },

            fetchInitialData: async () => {
                try {
                    // Fetch categories
                    const { data: categoriesData } = await supabase.from('categories').select('*').order('created_at', { ascending: true });

                    // Fetch wallets
                    const { data: walletsData } = await supabase.from('wallets').select('*').order('created_at', { ascending: true });

                    // Fetch transactions
                    const { data: txData } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });

                    // Fetch tips
                    const { data: tipsData } = await supabase.from('tips').select('*').order('created_at', { ascending: false });

                    // Fetch goals
                    const { data: goalsData } = await supabase.from('goals').select('*').order('created_at', { ascending: true });

                    set({
                        categories: categoriesData || [],
                        wallets: (walletsData || []).map(w => ({
                            id: w.id,
                            name: w.name,
                            balance: Number(w.balance),
                            icon: w.icon,
                            color: w.color
                        })),
                        transactions: (txData || []).map(tx => {
                            const dateObj = new Date(tx.created_at);
                            return {
                                id: tx.id,
                                walletId: tx.wallet_id,
                                type: tx.type,
                                amount: Number(tx.amount),
                                categoryId: tx.category,
                                note: tx.note || '',
                                date: tx.created_at.split('T')[0],
                                time: dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                            };
                        }),
                        tips: (tipsData || []).map(t => {
                            const dateObj = new Date(t.created_at);
                            return {
                                id: t.id,
                                customerName: t.customer,
                                amount: Number(t.amount),
                                description: t.service || '',
                                status: t.status,
                                walletId: t.wallet_id || undefined,
                                type: 'other', // Defaulted or mapped
                                dateGroup: getDateGroup(t.created_at),
                                time: dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                            };
                        }),
                        goals: (goalsData || []).map(g => ({
                            id: g.id,
                            name: g.name,
                            targetAmount: Number(g.target_amount),
                            currentAmount: Number(g.current_amount),
                            deadline: g.target_date || ''
                        }))
                    });
                } catch (error: any) {
                    console.error("Chi tiết lỗi:", error?.message || JSON.stringify(error));
                }
            },

            addTransaction: async (transactionData) => {
                try {
                    const state = get();
                    const wallet = state.wallets.find(w => w.id === transactionData.walletId);
                    if (!wallet) throw new Error("Không tìm thấy ví!");

                    if (transactionData.type === 'expense' && transactionData.amount > wallet.balance) {
                        throw new Error('Số dư ví không đủ!');
                    }
                    // 1. Insert into transactions table
                    const dbTransaction = {
                        wallet_id: transactionData.walletId,
                        type: transactionData.type,
                        amount: transactionData.amount,
                        category: transactionData.categoryId,
                        note: transactionData.note
                    };
                    const { data: newTx, error: txError } = await supabase
                        .from('transactions')
                        .insert(dbTransaction)
                        .select()
                        .single();

                    if (txError) throw txError;

                    // 2. Update wallet balance
                    if (wallet) {
                        const modifier = transactionData.type === 'income' ? 1 : -1;
                        const newBalance = wallet.balance + (transactionData.amount * modifier);

                        const { error: walletError } = await supabase
                            .from('wallets')
                            .update({ balance: newBalance })
                            .eq('id', wallet.id);

                        if (walletError) throw walletError;
                    }

                    // 3. Refresh data from cloud
                    await get().fetchInitialData();
                } catch (error: any) {
                    console.error("Chi tiết lỗi:", error?.message || JSON.stringify(error));
                }
            },

            addTip: async (tipData) => {
                try {
                    const { error } = await supabase
                        .from('tips')
                        .insert({
                            amount: tipData.amount,
                            customer: tipData.customerName,
                            service: tipData.description,
                            status: 'pending'
                        });

                    if (error) throw error;

                    await get().fetchInitialData();
                } catch (error: any) {
                    console.error("Chi tiết lỗi:", error?.message || JSON.stringify(error));
                }
            },

            receiveTips: async (tipIds, walletId) => {
                try {
                    const state = get();
                    const tipsToReceive = state.tips.filter(t => tipIds.includes(t.id) && t.status === 'pending');
                    if (tipsToReceive.length === 0) return;

                    const totalAmount = tipsToReceive.reduce((sum, tip) => sum + tip.amount, 0);

                    // 1. Update all tips
                    const { error: tipsError } = await supabase
                        .from('tips')
                        .update({ status: 'received', wallet_id: walletId })
                        .in('id', tipIds);

                    if (tipsError) throw tipsError;

                    // 2. Auto sync tips to transactions
                    const tipsCategory = get().categories.find(c => c.name === 'Tiền Tips');
                    for (const tip of tipsToReceive) {
                        await get().addTransaction({
                            type: 'income',
                            categoryId: tipsCategory?.id || '',
                            amount: tip.amount,
                            note: tip.description ? `Tiền tips: ${tip.description}` : `Tiền tips khách hàng`,
                            walletId: walletId
                        });
                    }

                    // 3. Refresh data
                    await get().fetchInitialData();
                } catch (error: any) {
                    console.error("Chi tiết lỗi:", error?.message || JSON.stringify(error));
                }
            },

            undoReceiveTip: async (tipId) => {
                try {
                    const state = get();
                    const tip = state.tips.find(t => t.id === tipId);

                    if (!tip || tip.status === 'pending' || !tip.walletId) return;

                    // 1. Revert tip status
                    const { error: tipError } = await supabase
                        .from('tips')
                        .update({ status: 'pending', wallet_id: null })
                        .eq('id', tipId);

                    if (tipError) throw tipError;

                    // 2. Revert wallet balance
                    const wallet = state.wallets.find(w => w.id === tip.walletId);
                    if (wallet) {
                        const { error: walletError } = await supabase
                            .from('wallets')
                            .update({ balance: wallet.balance - tip.amount })
                            .eq('id', wallet.id);

                        if (walletError) throw walletError;
                    }

                    // 3. Refresh data
                    await get().fetchInitialData();
                } catch (error: any) {
                    console.error("Chi tiết lỗi:", error?.message || JSON.stringify(error));
                }
            }
        }),
        {
            name: 'honey-money-storage',
        }
    )
);
