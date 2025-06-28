'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useTheme } from 'next-themes';

import { scrollToSection } from '@/lib/utils/scrollToSection';

import LogoBlack from '@/public/logo-black.svg';
import Logo from '@/public/logo.svg';

const NAVIGATION_LINKS = {
  quick: [
    { name: 'features', href: 'features' },
    { name: 'Why Locatr?', href: 'why-locatr' },
    { name: 'FAQ', href: 'faq' },
    { name: 'About Me', href: 'about-me' },
  ],
  legal: [
    { name: 'Terms of service', href: '/terms' },
    { name: 'Privacy policy', href: '/privacy' },
  ],
} as const;

const Footer = () => {
  const { resolvedTheme } = useTheme();

  const renderLogo = () => (
    <div className="flex flex-col gap-2">
      <div className="flex items-center space-x-2">
        <Image
          priority
          src={resolvedTheme === 'dark' ? Logo : LogoBlack}
          alt="logo"
          className="h-6 w-6"
        />
        <p className="font-bold uppercase">Locatr</p>
      </div>
      <p className="text-muted-foreground text-sm">
        Track your family&#39;s location with <span className="font-bold">Locatr</span>
      </p>
    </div>
  );

  const renderLinks = (
    title: string,
    links: typeof NAVIGATION_LINKS.quick | typeof NAVIGATION_LINKS.legal
  ) => (
    <div className="flex flex-col space-y-3">
      <h6 className="font-semibold uppercase">{title}</h6>
      <div className="flex flex-col space-y-2">
        {links.map((item, index) =>
          title === 'Quick Links' ? (
            <button
              key={index}
              onClick={() => scrollToSection(item.href)}
              className="text-muted-foreground hover:text-primary text-left text-sm capitalize transition-colors hover:underline"
            >
              {item.name}
            </button>
          ) : (
            <Link
              key={index}
              href={item.href}
              className="text-muted-foreground hover:text-primary text-sm capitalize transition-colors hover:underline"
            >
              {item.name}
            </Link>
          )
        )}
      </div>
    </div>
  );

  return (
    <footer className="w-full bg-linear-to-t from-[#FAFAFA] to-[#FFFFFF] px-4 py-8 md:py-12 dark:from-[#18181B] dark:to-[#09090B]">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col justify-between space-y-8">
            {renderLogo()}
            <p className="text-muted-foreground text-sm">
              Made with ❤️ by{' '}
              <Link
                href="https://www.kadirmetin.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary underline transition-colors"
              >
                Kadir METIN
              </Link>
            </p>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {renderLinks('Quick Links', NAVIGATION_LINKS.quick)}
              {renderLinks('Legal', NAVIGATION_LINKS.legal)}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
