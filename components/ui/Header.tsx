"use client";
import React from 'react';

interface HeaderProps {
  title: string;
  leftIcon?: React.ReactNode;
  rightAction?: React.ReactNode;
  onLeftClick?: () => void;
  className?: string;
  transparentContext?: boolean; // Creates the sticky gradient effect
}

export const Header: React.FC<HeaderProps> = ({ title, leftIcon, rightAction, onLeftClick, className = '', transparentContext = false }) => {
  return (
    <header className={`px-6 py-8 flex items-center justify-between z-50 ${transparentContext ? 'sticky top-0 bg-[linear-gradient(180deg,#fffcfd_0%,#fff9fa_100%)] pt-8 pb-4' : ''} ${className}`}>
      <button onClick={onLeftClick} aria-label="Back" className="w-10 h-10 flex items-center justify-center rounded-full border border-pink-50 shadow-sm bg-white text-brandDark active:scale-95 transition-transform">
        {leftIcon || (
          <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        )}
      </button>
      <h1 className="text-xl font-bold text-brandDark">{title}</h1>
      <div className="flex items-center">
        {rightAction}
      </div>
    </header>
  );
};
