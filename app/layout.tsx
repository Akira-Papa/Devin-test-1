import { ClientProviders } from '@/components/providers/ClientProviders';

export const metadata = {
  title: 'Business Dashboard',
  description: 'A professional business dashboard application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
