import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

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
    is_default?: boolean;
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
    addWallet: (wallet: Omit<Wallet, 'is_default'>) => Promise<void>;
    setPrimaryWallet: (walletId: string) => Promise<void>;
    updateWallet: (walletId: string, updatedData: Partial<Wallet>) => Promise<void>;
    deleteWallet: (walletId: string) => Promise<void>;
    addCategory: (category: Omit<Category, 'id' | 'created_at'>) => Promise<void>;
    deleteCategory: (categoryId: string) => Promise<void>;
    addTransaction: (transaction: Omit<Transaction, 'id' | 'time' | 'date'>) => Promise<void>;
    deleteTransaction: (transactionId: string) => Promise<void>;
    updateTransaction: (transactionId: string, updatedData: Partial<Transaction>) => Promise<void>;
    addTip: (tip: Omit<Tip, 'id' | 'time' | 'dateGroup' | 'status'>) => Promise<void>;
    receiveTips: (tipIds: string[], walletId: string) => Promise<void>;
    undoReceiveTip: (tipId: string) => Promise<void>;
    deleteTip: (tipId: string) => Promise<void>;
    addGoal: (goal: Pick<Goal, 'name' | 'targetAmount' | 'deadline'>) => Promise<void>;
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
                } catch (error) {
                    console.error('Lỗi khi tải dữ liệu bắt đầu:', error);
                }
            },

            addWallet: async (walletData: Omit<Wallet, 'is_default'>) => {
                try {
                    const { error } = await supabase.from('wallets').insert([{
                        id: walletData.id,
                        name: walletData.name,
                        balance: walletData.balance,
                        icon: walletData.icon,
                        color: walletData.color,
                        is_default: get().wallets.length === 0 ? true : false
                    }]);

                    if (error) {
                        toast.error('Lỗi khi thêm ví! ❌');
                        console.error('Supabase error inserting wallet:', error);
                        return;
                    }

                    await get().fetchInitialData();
                } catch (error: any) {
                    console.error('Lỗi thêm ví:', error);
                    toast.error('Lỗi thêm ví! ❌');
                }
            },

            setPrimaryWallet: async (walletId: string) => {
                try {
                    // Cập nhật tất cả các ví khác thành false
                    const { error: resetError } = await supabase
                        .from('wallets')
                        .update({ is_default: false })
                        .neq('id', walletId);

                    if (resetError) throw resetError;

                    // Cập nhật ví được chọn thành true
                    const { error: setError } = await supabase
                        .from('wallets')
                        .update({ is_default: true })
                        .eq('id', walletId);

                    if (setError) throw setError;

                    set((state) => ({
                        wallets: state.wallets.map(w => ({
                            ...w,
                            is_default: w.id === walletId
                        }))
                    }));

                    toast.success('Đã đặt làm ví chính! 👑');
                    await get().fetchInitialData();
                } catch (error: any) {
                    toast.error('Có lỗi khi cài đặt ví chính ❌');
                    console.error('Lỗi setPrimaryWallet:', error);
                }
            },

            updateWallet: async (walletId: string, updatedData: Partial<Wallet>) => {
                try {
                    const { error } = await supabase
                        .from('wallets')
                        .update(updatedData)
                        .eq('id', walletId);

                    if (error) throw error;

                    toast.success('Đã làm mới thông tin ví! ✨');
                    await get().fetchInitialData();
                } catch (error: any) {
                    toast.error('Có lỗi khi sửa thông tin ví ❌');
                    console.error('Lỗi updateWallet:', error);
                }
            },

            deleteWallet: async (walletId: string) => {
                try {
                    // Check if it's the default wallet
                    const walletObj = get().wallets.find(w => w.id === walletId);
                    if (walletObj?.is_default) {
                        toast.error('Không thể xóa ví chính! Hãy set ví khác làm ví chính trước. 👑');
                        return;
                    }

                    // Query transactions
                    const { data: txs, error: txError } = await supabase
                        .from('transactions')
                        .select('id')
                        .eq('wallet_id', walletId);

                    if (txError) throw txError;

                    // Query tips
                    const { data: tips, error: tipsError } = await supabase
                        .from('tips')
                        .select('id')
                        .eq('wallet_id', walletId);

                    if (tipsError) throw tipsError;

                    const totalCount = (txs?.length || 0) + (tips?.length || 0);

                    if (totalCount > 0) {
                        toast.error('Không thể xóa! Ví này đang chứa giao dịch/tips. Hãy xóa giao dịch trước. 🛑');
                        return;
                    }

                    // Delete from Supabase
                    const { error: deleteError } = await supabase
                        .from('wallets')
                        .delete()
                        .eq('id', walletId);

                    if (deleteError) throw deleteError;

                    // Update state
                    set((state) => ({
                        wallets: state.wallets.filter(w => w.id !== walletId)
                    }));

                    toast.success('Đã xóa ví! 🗑️');
                } catch (error: any) {
                    toast.error('Lỗi khi xóa ví! ❌');
                    console.error('Lỗi deleteWallet:', error);
                }
            },

            addCategory: async (categoryData) => {
                try {
                    const { error } = await supabase
                        .from('categories')
                        .insert({
                            name: categoryData.name,
                            icon: categoryData.icon,
                            type: categoryData.type
                        });
                    if (error) throw error;
                    await get().fetchInitialData();
                } catch (error: any) {
                    console.error("Lỗi khi thêm danh mục:", error?.message || JSON.stringify(error));
                    toast.error("Có lỗi đường truyền, em thử lại nha! 🚧");
                }
            },

            deleteCategory: async (categoryId) => {
                try {
                    const { count, error: countError } = await supabase
                        .from('transactions')
                        .select('*', { count: 'exact', head: true })
                        .eq('category', categoryId);

                    if (countError) throw countError;

                    if (count && count > 0) {
                        toast.error('Không thể xóa! Đang có giao dịch sử dụng danh mục này 🛑');
                        return;
                    }

                    const { error } = await supabase
                        .from('categories')
                        .delete()
                        .eq('id', categoryId);
                    if (error) throw error;
                    toast.success('Xóa danh mục thành công! 🗑️');
                    await get().fetchInitialData();
                } catch (error: any) {
                    console.error("Lỗi khi xóa danh mục:", error?.message || JSON.stringify(error));
                    toast.error("Có lỗi đường truyền, em thử lại nha! 🚧");
                }
            },

            addTransaction: async (transactionData) => {
                try {
                    const state = get();
                    const wallet = state.wallets.find(w => w.id === transactionData.walletId);
                    if (!wallet) {
                        toast.error("Không tìm thấy ví!");
                        throw new Error("Không tìm thấy ví!");
                    }

                    if (transactionData.type === 'expense' && transactionData.amount > wallet.balance) {
                        toast.error('Số dư ví không đủ!');
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

            deleteTransaction: async (transactionId) => {
                try {
                    const state = get();
                    const tx = state.transactions.find(t => t.id === transactionId);
                    if (!tx) return;

                    const wallet = state.wallets.find(w => w.id === tx.walletId);
                    if (wallet) {
                        const modifier = tx.type === 'expense' ? 1 : -1; // Reverse effect
                        const newBalance = wallet.balance + (tx.amount * modifier);

                        const { error: walletError } = await supabase
                            .from('wallets')
                            .update({ balance: newBalance })
                            .eq('id', wallet.id);

                        if (walletError) throw walletError;
                    }

                    const { error } = await supabase
                        .from('transactions')
                        .delete()
                        .eq('id', transactionId);

                    if (error) throw error;

                    toast.success('Đã xóa và hoàn tiền về ví! ♻️');
                    await get().fetchInitialData();
                } catch (error: any) {
                    toast.error("Có lỗi đường truyền, em thử lại nha! 🚧");
                    console.error("Lỗi khi xóa GD:", error?.message || JSON.stringify(error));
                }
            },

            updateTransaction: async (transactionId, updatedData) => {
                try {
                    const state = get();
                    const oldTx = state.transactions.find(t => t.id === transactionId);
                    if (!oldTx) return;

                    // 1. Rollback old transaction
                    const oldWallet = state.wallets.find(w => w.id === oldTx.walletId);
                    if (oldWallet) {
                        const modifier = oldTx.type === 'expense' ? 1 : -1;
                        const revertedBalance = oldWallet.balance + (oldTx.amount * modifier);

                        const { error: oldWalletError } = await supabase
                            .from('wallets')
                            .update({ balance: revertedBalance })
                            .eq('id', oldWallet.id);

                        if (oldWalletError) throw oldWalletError;
                    }

                    // Fetch latest state to reflect rollback before applying new
                    await get().fetchInitialData();
                    const newState = get();

                    // 2. Apply new transaction balance impact
                    const newType = updatedData.type || oldTx.type;
                    const newAmount = updatedData.amount ?? oldTx.amount;
                    const newWalletId = updatedData.walletId || oldTx.walletId;

                    const newWallet = newState.wallets.find(w => w.id === newWalletId);
                    if (newWallet) {
                        const modifier = newType === 'income' ? 1 : -1;
                        const newBalance = newWallet.balance + (newAmount * modifier);

                        if (newType === 'expense' && newAmount > newWallet.balance) {
                            toast.error('Số dư ví không đủ để cập nhật!');
                            throw new Error('Số dư ví không đủ!');
                        }

                        const { error: newWalletError } = await supabase
                            .from('wallets')
                            .update({ balance: newBalance })
                            .eq('id', newWallet.id);

                        if (newWalletError) throw newWalletError;
                    }

                    // 3. Update transaction record
                    const dbUpdate: any = {};
                    if (updatedData.walletId !== undefined) dbUpdate['wallet_id'] = updatedData.walletId;
                    if (updatedData.type !== undefined) dbUpdate['type'] = updatedData.type;
                    if (updatedData.amount !== undefined) dbUpdate['amount'] = updatedData.amount;
                    if (updatedData.categoryId !== undefined) dbUpdate['category'] = updatedData.categoryId;
                    if (updatedData.note !== undefined) dbUpdate['note'] = updatedData.note;

                    const { error: txError } = await supabase
                        .from('transactions')
                        .update(dbUpdate)
                        .eq('id', transactionId);

                    if (txError) throw txError;

                    toast.success('Cập nhật thành công! ✨');
                    await get().fetchInitialData();
                } catch (error: any) {
                    toast.error("Có lỗi đường truyền, em thử lại nha! 🚧");
                    console.error("Lỗi khi sửa GD:", error?.message || JSON.stringify(error));
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
                            status: 'pending',
                            wallet_id: tipData.walletId || null, // Added wallet_id
                            type: tipData.type || 'income', // Added type, assuming default 'income'
                            date: new Date().toISOString() // Added date
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

                    await get().fetchInitialData();
                } catch (error: any) {
                    toast.error("Có lỗi đường truyền, em thử lại nha! 🚧");
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
            },

            deleteTip: async (tipId) => {
                try {
                    const state = get();
                    const tip = state.tips.find(t => t.id === tipId);
                    if (!tip) return;

                    if (tip.status === 'received' && tip.walletId) {
                        const wallet = state.wallets.find(w => w.id === tip.walletId);
                        if (wallet) {
                            const { error: walletError } = await supabase
                                .from('wallets')
                                .update({ balance: wallet.balance - tip.amount })
                                .eq('id', wallet.id);

                            if (walletError) throw walletError;
                        }
                    }

                    const { error } = await supabase
                        .from('tips')
                        .delete()
                        .eq('id', tipId);

                    if (error) throw error;

                    toast.success('Đã xóa Tip! 🗑️');
                    await get().fetchInitialData();
                } catch (error: any) {
                    toast.error("Có lỗi đường truyền, em thử lại nha! 🚧");
                    console.error("Lỗi khi xóa Tip:", error?.message || JSON.stringify(error));
                }
            },

            addGoal: async (goalData) => {
                try {
                    const { error } = await supabase
                        .from('goals')
                        .insert({
                            name: goalData.name,
                            target_amount: goalData.targetAmount,
                            current_amount: 0,
                            target_date: goalData.deadline || null
                        });

                    if (error) throw error;
                    await get().fetchInitialData();
                } catch (error: any) {
                    console.error("Lỗi khi thêm mục tiêu:", error?.message || JSON.stringify(error));
                    toast.error("Có lỗi đường truyền, em thử lại nha! 🚧");
                    throw error;
                }
            }
        }),
        {
            name: 'honey-money-storage',
        }
    )
);
