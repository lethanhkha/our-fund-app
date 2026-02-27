import React from 'react';

export interface BadgeProps {
    type?: 'primary' | 'urgent';
    children: React.ReactNode;
    icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ type = 'primary', children, icon }) => {
    const styles = {
        primary: 'bg-pink-100 text-primary',
        urgent: 'bg-red-100 text-red-500'
    };

    return (
        <div className={`px-4 py-1.5 ${styles[type]} text-xs font-semibold rounded-full flex items-center gap-1 w-fit`}>
            {icon}
            <span>{children}</span>
        </div>
    );
};
