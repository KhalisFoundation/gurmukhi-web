import Header from '@/components/header/Header'
import './globals.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Shabadavali',
  description: 'Made by Khalis Foundation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex h-screen flex-col justify-center background-layer">
          <Header loggedIn={true}/>
          {children}
        </main>
      </body>
    </html>
  )
}
