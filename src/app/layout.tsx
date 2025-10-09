import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

import { cn } from "@/lib/utils"; 

import { cookies } from "next/headers";

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

export default async function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const accent = (await cookies()).get("vbm-accent")?.value || "indigo"; // default
    return (
    <html lang="en" suppressHydrationWarning className={`accent-${accent}`}>
      <body>
        <ThemeProvider>
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
