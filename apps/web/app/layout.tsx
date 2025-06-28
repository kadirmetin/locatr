import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import { ConsentManagerDialog, ConsentManagerProvider, CookieBanner } from '@c15t/nextjs';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { RenderMounted } from '@/components/client-render';

import './globals.css';
import { Providers } from './providers';

const APP_NAME = 'Locatr';
const APP_DEFAULT_TITLE = "Locatr - Track your family's location";
const APP_TITLE_TEMPLATE = `%s | ${APP_NAME}`;
const APP_DESCRIPTION =
  'Locatr, helps you keep track of your devices and loved ones with real-time location services.';
const APP_URL = process.env.NEXT_PUBLIC_WEB_APP_URL as string;

export const metadata: Metadata = {
  applicationName: APP_NAME,
  description: APP_DESCRIPTION,
  title: {
    template: APP_TITLE_TEMPLATE,
    default: APP_DEFAULT_TITLE,
  },
  metadataBase: new URL(APP_URL),

  openGraph: {
    title: {
      template: APP_TITLE_TEMPLATE,
      default: APP_DEFAULT_TITLE,
    },
    description: APP_DESCRIPTION,
    url: new URL(APP_URL),
    siteName: APP_NAME,
    images: ['/opengraph-image.png'],
    type: 'website',
    locale: 'en_US',
  },

  twitter: {
    card: 'summary_large_image',
    site: '@locatr',
    creator: '@_kadirmetin',
    title: APP_DEFAULT_TITLE,
    description: APP_DESCRIPTION,
    images: ['/opengraph-image.png'],
  },
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-poppins',
});

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable}`}>
      <body className="font-main">
        <ConsentManagerProvider
          options={{
            mode: 'c15t',
            backendURL: '/api/c15t',
            consentCategories: ['necessary', 'experience', 'measurement'],
            ignoreGeoLocation: true,
          }}
        >
          <CookieBanner />
          <ConsentManagerDialog />

          <RenderMounted>
            <Providers>
              <main>{children}</main>
            </Providers>
            <Analytics />
            <SpeedInsights />
            {process.env.NODE_ENV === 'production' && (
              <>
                {process.env.NEXT_PUBLIC_GA_ID && (
                  <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
                )}
                {process.env.NEXT_PUBLIC_GTM_ID && (
                  <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
                )}
              </>
            )}
          </RenderMounted>
        </ConsentManagerProvider>
      </body>
    </html>
  );
};

export default RootLayout;
