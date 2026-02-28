'use client';

import { useEffect, useState } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
    const fetchInitialData = useFinanceStore(state => state.fetchInitialData);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchInitialData();
    }, [fetchInitialData]);

    if (!mounted) return null; // Avoid hydration mismatch

    return <>{children}</>;
}
