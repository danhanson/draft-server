import './globals.css';
import type { Metadata } from 'next';
import { Sanchez } from 'next/font/google';

const sanchez = Sanchez({ weight: "400", subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The Draft',
  description: 'Not generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={sanchez.className}>{children}</body>
    </html>
  )
};