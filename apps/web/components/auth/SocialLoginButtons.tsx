'use client';

import { Info } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface SocialLoginButtonsProps {
  onGoogleClick: () => Promise<void>;
  isLoading?: boolean;
}

export function SocialLoginButtons({ onGoogleClick, isLoading = false }: SocialLoginButtonsProps) {
  return (
    <div className="grid grid-cols-1 gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            onClick={!isLoading ? onGoogleClick : undefined}
            className="relative"
          >
            <FaGoogle className="mr-2 h-4 w-4" />
            Google
          </Button>
        </PopoverTrigger>
        <PopoverContent className="gap-4">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span className="font-semibold">Feature in development</span>
          </div>
          <p className="text-sm leading-snug">
            We&apos;re working on this feature. You can login with your email and password for now.
          </p>
        </PopoverContent>
      </Popover>
    </div>
  );
}
