import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/hooks/use-auth'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: '--font-sans' });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'H&I POS System - Gestión Integral de Negocios',
  description: 'Sistema de Punto de Venta (POS) multifuncional para bodegas, ferreterías, restaurantes, zapaterías, tiendas de ropa y repuestos de motos',
  generator: 'v0.app',
  keywords: ['POS', 'Sistema de Ventas', 'Facturación', 'Inventario', 'Gestión Empresarial'],
  creator: 'H&I Community',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0f172a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased bg-slate-950 text-slate-100`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster richColors position="top-right" />
        <Analytics />
      </body>
    </html>
  )
}
