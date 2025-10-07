import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/providers/query-provider'
import { Toaster } from '@/components/ui/toaster'
import { MSWProvider } from '@/providers/msw-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'POS & Inventory Management',
  description: 'Point of Sale and Inventory Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MSWProvider>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </MSWProvider>
      </body>
    </html>
  )
}