import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ReduxProvider } from "@/components/providers/redux-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import QueryProvider from "@/components/providers/query-provider"
import { Toaster } from 'react-hot-toast';

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ProductHub - Product Management Dashboard",
  description: "Manage your product inventory with ease",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider defaultTheme="light">
          <ReduxProvider>
            <QueryProvider>
              <AuthProvider>{children}</AuthProvider>
            </QueryProvider>
          </ReduxProvider>
        </ThemeProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
