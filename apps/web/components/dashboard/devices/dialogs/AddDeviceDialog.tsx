'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ExternalLink, QrCode } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AddDeviceDialogProps {
  open: boolean;
  onCloseAction: () => void;
}

export function AddDeviceDialog({ open, onCloseAction }: AddDeviceDialogProps) {
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const appUrl = 'https://github.com/kadirmetin/locatr/releases/latest';

  return (
    <Dialog open={open} onOpenChange={onCloseAction}>
      <DialogContent className="sm:max-w-md [&>button:last-child]:hidden">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl">Download Our Mobile App</DialogTitle>
          <DialogDescription>
            Scan the QR code below with your phone&apos;s camera to download and set up the mobile
            app.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          {/* QR Code Section */}
          <div className="relative">
            <Collapsible open={isCollapsibleOpen} onOpenChange={setIsCollapsibleOpen}>
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-lg border-2 border-dashed border-muted-foreground/20 p-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CollapsibleTrigger asChild>
                          <div className="relative cursor-pointer transition-transform hover:scale-105">
                            <Image
                              src="/mobile-app.svg"
                              alt="QR Code to download mobile app"
                              width={160}
                              height={160}
                              className="rounded-md shadow-sm"
                            />
                            <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/0 transition-colors hover:bg-black/5">
                              <QrCode className="h-6 w-6 text-white opacity-0 transition-opacity hover:opacity-100" />
                            </div>
                          </div>
                        </CollapsibleTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>
                          {isCollapsibleOpen
                            ? 'Click to hide download link'
                            : 'Click to show download link'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="text-center">
                  <p className="text-sm font-medium">Scan with your camera</p>
                  <p className="text-xs text-muted-foreground">
                    Point your phone&apos;s camera at the QR code
                  </p>
                </div>

                <CollapsibleContent className="w-full">
                  <div className="mt-4 space-y-3">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Can&apos;t scan? Use the link below:
                      </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <Link
                        href={appUrl}
                        className="flex-1 text-sm text-primary hover:underline overflow-hidden"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="break-all" title={appUrl}>
                          {appUrl}
                        </span>
                      </Link>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </div>

          {/* Instructions */}
          <div className="w-full rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                <span className="text-xs font-bold">i</span>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Setup Instructions
                </p>
                <ol className="space-y-1 text-xs text-blue-700 dark:text-blue-200">
                  <li>1. Download and install the app</li>
                  <li>2. Open the app and follow the setup wizard</li>
                  <li>3. Your device will be automatically added to your account</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <DialogClose asChild>
            <Button variant="default" className="w-full sm:w-auto">
              Got it, thanks!
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
