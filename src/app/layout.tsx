import { Geist, Geist_Mono, Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OptiAsset - Smart Asset Management",
  description: "Professional Asset Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased dark`}
        style={{ fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif !important' }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <TooltipProvider>
              <div className="flex h-screen overflow-hidden bg-background">
                <Sidebar />
                <div className="flex flex-1 flex-col overflow-hidden">
                  <Topbar />
                  <main className="flex-1 overflow-y-auto p-6 bg-muted/20">
                    {children}
                  </main>
                </div>
              </div>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
