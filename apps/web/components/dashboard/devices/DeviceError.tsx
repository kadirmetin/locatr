'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface DeviceErrorProps {
  onRetry: () => void;
  error?: string;
}

const DeviceError = ({ onRetry, error }: DeviceErrorProps) => {
  return (
    <Card className="border-destructive/50">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Failed to load devices</h3>
        <p className="text-muted-foreground text-center mb-6 max-w-sm">
          {error || 'There was an error loading your devices. Please try again.'}
        </p>
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
};

export default DeviceError;
