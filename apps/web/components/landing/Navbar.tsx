'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

import { scrollToSection } from '@/lib/utils/scrollToSection';

import LogoBlack from '@/public/logo-black.svg';
import Logo from '@/public/logo.svg';

import { GitHubStarButton } from '../ui/github-star';

const menuItems = [
  { name: 'Home', href: 'hero' },
  { name: 'Features', href: 'features' },
  { name: 'Why Locatr?', href: 'why-locatr' },
  { name: 'About Me', href: 'about-me' },
];

const Navbar = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const handleMenuClick = (href: string) => {
    scrollToSection(href);
    setIsOpen(false);
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 p-4">
        <nav className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-2xl shadow-lg mx-auto max-w-7xl">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  priority
                  src={resolvedTheme === 'dark' ? Logo : LogoBlack}
                  alt="logo"
                  className="h-6 w-6"
                />
                <span className="font-bold text-xl uppercase">Locatr</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {menuItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                {/* GitHub Star Button - Desktop */}
                <div className="hidden sm:block">
                  <GitHubStarButton owner="kadirmetin" repo="locatr" variant="ghost" />
                </div>

                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-full border border-white/20 dark:border-white/10"
                >
                  {resolvedTheme === 'dark' ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>

                {/* Dasboard Button */}
                <Button className="hidden sm:flex rounded-full px-6" onClick={handleDashboard}>
                  Dashboard
                </Button>

                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(!isOpen)}
                  className="md:hidden rounded-full border border-white/20 dark:border-white/10"
                >
                  {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm">
          <div className="absolute top-24 left-4 right-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 max-w-sm mx-auto">
              <div className="space-y-3">
                {menuItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleMenuClick(item.href)}
                    className="block w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                  >
                    {item.name}
                  </button>
                ))}

                {/* Mobile GitHub Star Button */}
                <div className="flex flex-col pt-3 gap-2 border-t border-gray-200 dark:border-gray-700">
                  <GitHubStarButton
                    owner="kadirmetin"
                    repo="locatr"
                    className="w-full rounded-xl"
                    size="lg"
                  />
                  <Button className="w-full rounded-xl" onClick={handleDashboard}>
                    Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
