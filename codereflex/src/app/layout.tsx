import "~/app/global.css";
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

import { type Metadata, type Viewport } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "./_components/theme-toggle";

export const metadata: Metadata = {
  title: "CodeReflex | Never Stop Learning",
  description: "Stay ahead of the curve with daily fun facts and discoveries from the coding world. Learn something new every day.",
  generator: 'CodeReflex',
  keywords: ['coding', 'programming', 'daily facts', 'tech news', 'developer'],
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>
          {children}
          <ThemeToggle />
          <Analytics />
          </TRPCReactProvider>
        </ThemeProvider>   
      </body>
    </html>
  );
}
