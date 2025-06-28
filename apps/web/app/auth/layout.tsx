import Script from 'next/script';

import { TooltipProvider } from '@/components/ui/tooltip';

import { DialogProvider } from '@/context/dialog-provider';

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <DialogProvider>
      <TooltipProvider>
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
        {children}
      </TooltipProvider>
    </DialogProvider>
  );
};

export default AuthLayout;
