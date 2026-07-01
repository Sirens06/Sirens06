import type { Metadata } from 'next';
import './globals.css';
import { DonationButton } from '@/components/layout/DonationButton';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'Multi-Game Platform',
  description: 'Sfida i tuoi amici ogni giorno in mini-giochi diversi: musica, calcio, cultura e trivia.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>
        <Navbar />
        {children}
        <DonationButton />
      </body>
    </html>
  );
}
