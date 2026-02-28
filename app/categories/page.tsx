'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFinanceStore } from '../../store/useFinanceStore';

export default function CategoriesManagementPage() {
    const router = useRouter();
    const { categories, addCategory, deleteCategory } = useFinanceStore();
    const [activeTab, setActiveTab] = useState<'income' | 'expense'>('expense');

    // Add form state
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [newIcon, setNewIcon] = useState('✨');

    const displayedCategories = categories.filter(c => c.type === activeTab);

    const handleAdd = async () => {
        if (!newName.trim()) {
            alert("Vui lòng nhập tên danh mục");
            return;
        }
        await addCategory({
            name: newName.trim(),
            icon: newIcon.trim() || '✨',
            type: activeTab
        });
        setNewName('');
        setNewIcon('✨');
        setIsAdding(false);
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Bạn có chắc muốn xóa danh mục "${name}"? Các giao dịch cũ có thể mất icon tương ứng.`)) {
            await deleteCategory(id);
        }
    };

    return (
        <div className="font-sans antialiased max-w-md mx-auto min-h-screen bg-[#FDF2F8] flex flex-col pb-28 relative overflow-x-hidden">
            <header className="px-6 pt-10 pb-4 flex items-center justify-between sticky top-0 bg-[#FDF2F8]/90 backdrop-blur-md z-40">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-[#1E293B]">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h1 className="text-xl font-extrabold text-[#1E293B]">Quản lý danh mục</h1>
                </div>
            </header>

            <main className="px-6 flex-grow flex flex-col pt-4">
                {/* TABS */}
                <div className="flex bg-white rounded-full p-1 mb-6 shadow-sm border border-pink-50">
                    <button
                        onClick={() => { setActiveTab('expense'); setIsAdding(false); }}
                        className={`flex-1 py-2 text-sm font-bold rounded-full transition-colors ${activeTab === 'expense' ? 'bg-[#F43F5E] text-white shadow-md' : 'text-[#94A3B8]'}`}
                    >
                        Chi Tiêu
                    </button>
                    <button
                        onClick={() => { setActiveTab('income'); setIsAdding(false); }}
                        className={`flex-1 py-2 text-sm font-bold rounded-full transition-colors ${activeTab === 'income' ? 'bg-emerald-500 text-white shadow-md' : 'text-[#94A3B8]'}`}
                    >
                        Thu Nhập
                    </button>
                </div>

                {/* LIST */}
                <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-pink-50 flex flex-col gap-2">
                    {displayedCategories.length === 0 ? (
                        <p className="text-center text-sm text-[#94A3B8] py-4">Chưa có danh mục nào.</p>
                    ) : (
                        displayedCategories.map(cat => (
                            <div key={cat.id} className="flex items-center justify-between p-3 border border-gray-50 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${activeTab === 'income' ? 'bg-emerald-50' : 'bg-pink-50'}`}>
                                        {cat.icon}
                                    </div>
                                    <span className="font-bold text-[#1E293B] text-sm">{cat.name}</span>
                                </div>
                                <button
                                    onClick={() => handleDelete(cat.id, cat.name)}
                                    className="w-8 h-8 flex items-center justify-center text-red-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        ))
                    )}

                    {/* ADD FORM INLINE */}
                    {isAdding ? (
                        <div className="mt-4 p-4 border border-dashed border-pink-200 bg-pink-50/30 rounded-2xl flex flex-col gap-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Icon (VD: 🍔)"
                                    value={newIcon}
                                    onChange={e => setNewIcon(e.target.value)}
                                    className="w-16 px-3 py-2 text-center rounded-xl border border-pink-100 bg-white shadow-sm outline-none focus:border-[#F43F5E]"
                                    maxLength={2}
                                />
                                <input
                                    type="text"
                                    placeholder="Tên danh mục mới"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    className="flex-1 px-3 py-2 rounded-xl border border-pink-100 bg-white shadow-sm outline-none focus:border-[#F43F5E]"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setIsAdding(false)} className="flex-1 py-2 text-sm font-bold text-[#94A3B8] border border-gray-100 rounded-xl hover:bg-gray-50">
                                    Hủy
                                </button>
                                <button onClick={handleAdd} className="flex-1 py-2 text-sm font-bold text-white bg-[#F43F5E] rounded-xl hover:bg-[#E11D48] shadow-md">
                                    Lưu lại
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="mt-2 w-full py-3 border-2 border-dashed border-gray-200 text-[#94A3B8] rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-gray-50 transition-colors"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                            Thêm danh mục mới
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}
