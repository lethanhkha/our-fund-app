"use client";
import React, { useRef } from 'react';

// Custom hook for long press
function useLongPress(
    onLongPress: () => void,
    onClick: () => void,
    { delay = 500 } = {}
) {
    const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const isLongPress = useRef(false);

    const start = React.useCallback(
        () => {
            isLongPress.current = false;
            timeout.current = setTimeout(() => {
                isLongPress.current = true;
                onLongPress();
            }, delay);
        },
        [onLongPress, delay]
    );

    const clear = React.useCallback(
        (e?: React.SyntheticEvent, shouldTriggerClick = true) => {
            timeout.current && clearTimeout(timeout.current);
            if (shouldTriggerClick && !isLongPress.current) {
                onClick();
            }
        },
        [onClick]
    );

    return {
        onMouseDown: start,
        onTouchStart: start,
        onMouseUp: clear,
        onMouseLeave: (e: React.SyntheticEvent) => clear(e, false),
        onTouchEnd: clear,
    };
}

interface KeypadProps {
    onKeyPress: (key: string) => void;
}

export const Keypad: React.FC<KeypadProps> = ({ onKeyPress }) => {
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    // Backspace button long press config
    const backspaceLongPress = useLongPress(
        () => onKeyPress('clear'), // Long press triggers clear
        () => onKeyPress('delete'), // Short click triggers delete
        { delay: 400 }
    );

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (e.key >= '0' && e.key <= '9') {
                onKeyPress(e.key);
            } else if (e.key === 'Backspace') {
                onKeyPress('delete');
            } else if (e.key === 'Escape' || e.key === 'Delete') {
                onKeyPress('clear');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onKeyPress]);

    return (
        <div className="grid grid-cols-3 gap-4 mb-8 mt-auto w-full">
            {numbers.map((num) => (
                <button
                    key={num}
                    onClick={() => onKeyPress(num)}
                    className="h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-gray-700 shadow-sm transition-all active:bg-gray-100 active:scale-95 touch-manipulation"
                >
                    {num}
                </button>
            ))}
            <button
                onClick={() => onKeyPress('000')}
                className="h-16 bg-white rounded-full flex items-center justify-center text-xl font-bold text-gray-700 shadow-sm transition-all active:bg-gray-100 active:scale-95 touch-manipulation"
            >
                000
            </button>
            <button
                onClick={() => onKeyPress('0')}
                className="h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-gray-700 shadow-sm transition-all active:bg-gray-100 active:scale-95 touch-manipulation"
            >
                0
            </button>
            <button
                {...backspaceLongPress}
                className="h-16 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm transition-all active:bg-gray-100 active:scale-95 touch-manipulation select-none"
            >
                <svg className="h-6 w-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                </svg>
            </button>
        </div>
    );
};
