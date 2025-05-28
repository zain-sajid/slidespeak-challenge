import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata = {
  title: 'PowerPoint optimizer - SlideSpeak',
  description:
    'Reduce the size of your PowerPoint file without losing quality.',
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body>
      {children}
      <Toaster />
    </body>
  </html>
);

export default RootLayout;
