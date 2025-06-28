import { useState } from 'react';

import { format } from 'date-fns';
import { RefreshCw, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { sessionItemType } from '@/lib/types/session.type';
import { getDeviceIcon, getDeviceName, getDeviceType } from '@/lib/utils/parseUserAgent';

interface SessionItemProps {
  session: sessionItemType;
  isCurrentUser: boolean;
  onTerminate: (sessionId: string) => Promise<void>;
}

const SessionItem = ({ session, isCurrentUser, onTerminate }: SessionItemProps) => {
  const [isTerminating, setIsTerminating] = useState(false);
  const [isIpVisible, setIsIpVisible] = useState(false);

  const deviceType = session.deviceType || getDeviceType(session.userAgent);
  const deviceName = session.device || getDeviceName(session.userAgent);

  const handleTerminate = async () => {
    if (isCurrentUser) return;

    setIsTerminating(true);
    try {
      await onTerminate(session._id);
    } finally {
      setIsTerminating(false);
    }
  };

  const handleToggleIpVisibility = () => {
    setIsIpVisible(!isIpVisible);
  };

  const createdAtDate = new Date(session.createdAt);
  const lastActiveDate = session.lastActive
    ? new Date(session.lastActive)
    : new Date(session.expiredAt);

  return (
    <div className="bg-muted/50 flex flex-col space-y-2 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getDeviceIcon(deviceType)}
          <span className="font-medium">{deviceName}</span>
          {isCurrentUser && (
            <Badge variant="outline" className="bg-primary/10 text-primary ml-2">
              Current
            </Badge>
          )}
        </div>

        {!isCurrentUser && (
          <Button variant="ghost" size="icon" onClick={handleTerminate} disabled={isTerminating}>
            {isTerminating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="text-destructive h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      <div className="text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <span>Location:</span>
        <span>{session.location || 'Unknown'}</span>

        <span>IP Address:</span>
        <span className="cursor-pointer" onClick={handleToggleIpVisibility}>
          {isIpVisible ? session.ip : 'Click to show'}
        </span>

        <span>Last Active:</span>
        <div>{format(lastActiveDate, 'MMM d, yyyy HH:mm')}</div>

        <span>Created:</span>
        <span>{format(createdAtDate, 'MMM d, yyyy HH:mm')}</span>
      </div>
    </div>
  );
};

export default SessionItem;
