import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from './components/auth/AuthProvider'
import { AuthProvider as AuthContextProvider } from '@/contexts/AuthContext'
import { PermissionProvider } from '@/contexts/PermissionContext'
import EnumsProvider from './components/providers/EnumsProvider'
import ToastProvider from './components/providers/ToastProvider'
import SentryProvider from './components/providers/SentryProvider'
import ErrorBoundary from './components/ui/ErrorBoundary'

// Google Fonts - Inter
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '99Club Admin - Konut Yönetim Sistemi',
  description: '99Club konut yönetim sistemi admin paneli',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} font-sans antialiased bg-background-primary overflow-x-hidden dark`}>
        <SentryProvider>
          <ErrorBoundary>
            <AuthContextProvider>
              <PermissionProvider>
                <AuthProvider>
                  <EnumsProvider>
                    <ToastProvider>
                      {children}
                    </ToastProvider>
                  </EnumsProvider>
                </AuthProvider>
              </PermissionProvider>
            </AuthContextProvider>
          </ErrorBoundary>
        </SentryProvider>
      </body>
    </html>
  )
}