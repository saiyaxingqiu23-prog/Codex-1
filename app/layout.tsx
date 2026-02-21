import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/layout/navigation';

export const metadata: Metadata = {
  title: 'FluentMind',
  description: 'Output-driven English learning app for intermediate Chinese learners.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main className="mx-auto min-h-screen max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
