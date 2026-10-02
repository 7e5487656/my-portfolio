import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Моё портфолио',
  description: 'Работы, проекты, эксперименты',
  openGraph: {
    title: 'Моё портфолио',
    description: 'Работы, проекты, эксперименты',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}