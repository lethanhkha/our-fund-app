import { create } from 'zustand';

interface Tip {
    id: string;
    customerName: string;
    amount: number;
    description: string;
    time: string;
    dateGroup?: string;
    status: 'pending' | 'received';
    type: string; // e.g., 'nail', 'hair'
}

interface Wallet {
    id: string;
    name: string;
    balance: number;
}

interface FinanceState {
    balance: number;
    wallets: Wallet[];
    tips: Tip[];
    receiveTip: (tipId: string, walletId: string) => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
    balance: 12500000,
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
    receiveTip: (tipId, walletId) => set((state) => {
        const tipIndex = state.tips.findIndex(t => t.id === tipId);
        if (tipIndex === -1) return state;

        const tip = state.tips[tipIndex];
        if (tip.status === 'received') return state; // Already received

        // 1. Update tip status
        const updatedTips = [...state.tips];
        updatedTips[tipIndex] = { ...tip, status: 'received' };

        // 2. Add amount to selected wallet
        const updatedWallets = state.wallets.map(wallet =>
            wallet.id === walletId
                ? { ...wallet, balance: wallet.balance + tip.amount }
                : wallet
        );

        // 3. Update total balance
        return {
            tips: updatedTips,
            wallets: updatedWallets,
            balance: state.balance + tip.amount
        };
    })
}));
