import Link from 'next/link';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Menu } from 'lucide-react';

import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../ui/sheet';

interface MenuItem {
  name: string;
  href: string;
}

interface MobileMenuProps {
  menuItems: MenuItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const MobileMenu = ({ menuItems, isOpen, setIsOpen }: MobileMenuProps) => {
  return (
    <div className="flex items-center md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="flex h-full w-[300px] flex-col justify-between sm:w-[400px]"
        >
          <VisuallyHidden>
            <SheetTitle>Menu</SheetTitle>
          </VisuallyHidden>
          <div className="flex items-center justify-between border-b p-4">
            <p className="text-lg font-medium">Menu</p>
          </div>
          <nav className="flex flex-col gap-4 p-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-lg font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="mt-4 border-t pt-4 text-center text-sm text-gray-500">
            <p>&copy; 2024 Your Company Name</p>
            <p>All rights reserved.</p>
            <p>
              <a href="/privacy-policy" className="hover:underline">
                Privacy Policy
              </a>{' '}
              |{' '}
              <a href="/terms-of-service" className="hover:underline">
                Terms of Service
              </a>
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
