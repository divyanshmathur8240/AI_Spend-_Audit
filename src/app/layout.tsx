import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SpendGPT Audit',
  description: 'Instant AI spend audit for teams and founders.',
  openGraph: {
    title: 'SpendGPT Audit',
    description: 'Instant AI tool spend audit with savings recommendations.',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
