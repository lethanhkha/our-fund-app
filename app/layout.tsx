import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import SupabaseProvider from "@/components/providers/SupabaseProvider";
import { Toaster } from "react-hot-toast";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["vietnamese", "latin"],
});

export const metadata: Metadata = {
  title: "Our Fund App",
  description: "Manage your funds easily",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${quicksand.variable} antialiased [scrollbar-gutter:stable]`}
      >
        <SupabaseProvider>
          <div className="w-full min-h-screen bg-gray-50 flex flex-col md:flex-row relative shadow-lg overflow-x-hidden">
            <div className="flex-1 md:ml-64 pb-20 md:pb-0">
              {children}
            </div>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 2500,
                style: {
                  borderRadius: '1rem',
                  background: '#333',
                  color: '#fff',
                  fontFamily: 'var(--font-quicksand)',
                  marginBottom: '20px'
                }
              }}
            />
          </div>
        </SupabaseProvider>
      </body>
    </html>
  );
}
