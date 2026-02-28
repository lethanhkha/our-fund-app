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
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                borderRadius: '1rem',
                background: '#333',
                color: '#fff',
                fontFamily: 'var(--font-quicksand)'
              }
            }}
          />
        </SupabaseProvider>
      </body>
    </html>
  );
}
