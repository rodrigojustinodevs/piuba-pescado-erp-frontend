import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { QueryProvider } from '@/shared/contexts/QueryProvider';
import { ToastProvider } from '@/shared/contexts/ToastContext';
import { AlertModalProvider } from '@/shared/components/AlertModal';
import { AuthProvider } from '@/shared/contexts/AuthContext';
import { CompanySettingsProvider } from '@/shared/contexts/CompanySettingsContext';
import { OnboardingWizardModal } from '@/features/onboarding';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Piúba Pescado',
    template: '%s | Piúba Pescado',
  },
  description: 'Gestão e monitoramento de piscicultura e carcinicultura.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <QueryProvider>
          <AuthProvider>
            <CompanySettingsProvider>
              <ToastProvider>
                <AlertModalProvider>
                  {children}
                  <OnboardingWizardModal />
                </AlertModalProvider>
              </ToastProvider>
            </CompanySettingsProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
