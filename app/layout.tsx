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
        className={`${quicksand.variable} antialiased`}
      >
        <SupabaseProvider>
          <div className="max-w-md mx-auto bg-white min-h-screen relative shadow-lg overflow-x-hidden">
            {children}
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
