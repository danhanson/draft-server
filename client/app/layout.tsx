import './globals.css';
import styles from './layout.module.css';
import type { Metadata } from 'next';
import { Sanchez } from 'next/font/google';
import Link from 'next/link';
import { WithStore } from '@/data';

const sanchez = Sanchez({ weight: "400", subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The Draft',
  description: 'Not generated by create next app',
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body className={sanchez.className}>
        <nav className={styles.nav}>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/teams">Teams</Link></li>
            <li><Link href="/players">Players</Link></li>
          </ul>
        </nav>
        <WithStore>
          {children}
        </WithStore>
      </body>
    </html>
  );
};
