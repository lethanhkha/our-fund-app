import React from 'react';

interface NoteInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

export const NoteInput: React.FC<NoteInputProps> = ({ icon, ...props }) => {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                {icon || (
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                )}
            </div>
            <input
                className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-full text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-sm transition-all"
                {...props}
            />
        </div>
    );
};
