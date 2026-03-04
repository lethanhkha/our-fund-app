'use client';

import { useEffect } from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { activeUserId } = useFinanceStore();

    useEffect(() => {
        if (activeUserId === 'kha') {
            document.body.classList.add('theme-kha');
        } else {
            document.body.classList.remove('theme-kha');
        }
    }, [activeUserId]);

    return <>{children}</>;
}
