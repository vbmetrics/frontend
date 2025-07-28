import "./globals.css";

import { cn } from "@/lib/utils"; 

import { Toaster } from "sonner";

import { Inter } from "next/font/google";

import type { Metadata, Viewport } from "next";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'vbmetrics',
  description: 'Gather, store, analyze volleyball statistics.',
  openGraph: {
    title: 'vbmetrics',
    description: 'Gather, store, analyze volleyball statistics.',
    // images: ['.png'], 
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
  themeColor: '#0ddd6ff',
};

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
    <html lang="pl" suppressHydrationWarning>
      <body>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
