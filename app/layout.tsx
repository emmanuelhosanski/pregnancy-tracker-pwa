import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { PregnancyProvider } from '@/contexts/PregnancyContext'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Suivi de Grossesse',
  description: 'Application de suivi quotidien de grossesse',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PregnancyProvider>
            {children}
            <Toaster />
          </PregnancyProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

