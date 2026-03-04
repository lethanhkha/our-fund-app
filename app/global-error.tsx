'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Force a hard reload if encountering chunk loading errors
        if (
            error.message.includes('Failed to load') ||
            error.message.includes('ChunkLoadError') ||
            error.message.includes('Loading chunk')
        ) {
            window.location.reload();
        }
    }, [error]);

    return (
        <html>
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDF2F8] px-4">
                    <div className="bg-white rounded-[2rem] p-8 shadow-xl max-w-sm w-full text-center border border-pink-100">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex flex-col items-center justify-center mx-auto mb-4 border border-red-100 text-3xl">
                            🔌
                        </div>
                        <h2 className="text-xl font-extrabold text-[#1E293B] mb-2">Đã xảy ra lỗi kết nối!</h2>
                        <p className="text-[#64748B] text-sm mb-6">
                            Đã có bản cập nhật mới. Vui lòng tải lại trang để tiếp tục.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[#F43F5E] text-white px-6 py-3 rounded-xl font-bold w-full hover:bg-rose-600 active:scale-95 transition-all shadow-md shadow-pink-200"
                        >
                            Tải lại trang ngay
                        </button>
                        <button
                            onClick={() => reset()}
                            className="mt-3 bg-gray-50 text-gray-600 px-6 py-3 rounded-xl font-bold w-full hover:bg-gray-100 active:scale-95 transition-all"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
