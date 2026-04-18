import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "@/shared/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TableOps — Restaurant Management",
  description: "Manage your restaurant portfolio with TableOps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system">
          <div className="relative min-h-screen bg-[#fafafa] dark:bg-[#020617] overflow-x-hidden text-slate-900 dark:text-slate-50 selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-300">
            
            {/* Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            {/* Glow blobs */}
            <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-purple-600 opacity-10 dark:opacity-20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-[20%] right-[-100px] w-[400px] h-[400px] bg-rose-500 opacity-10 dark:opacity-10 blur-[150px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
            <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-blue-500 opacity-10 dark:opacity-20 blur-[120px] rounded-full pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 w-full min-h-screen">
              <Toaster />
              {children}
            </div>

          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
