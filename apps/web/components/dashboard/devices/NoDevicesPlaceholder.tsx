import { Plus, Smartphone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { useDialog } from '@/context/dialog-provider';

const NoDevicesPlaceholder = () => {
  const { openDialog } = useDialog();
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Smartphone className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No devices found</h3>
        <p className="text-muted-foreground text-center mb-6 max-w-sm">
          You haven&apos;t added any devices yet. Add your first device to start tracking its
          location and status.
        </p>
        <Button onClick={() => openDialog('addDevice', {})}>
          <Plus className="mr-2 h-4 w-4" />
          Add Your First Device
        </Button>
      </CardContent>
    </Card>
  );
};

export default NoDevicesPlaceholder;
