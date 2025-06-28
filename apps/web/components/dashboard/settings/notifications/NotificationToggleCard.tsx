import React from 'react';

import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

interface NotificationToggleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onToggle: (checked: boolean) => void;
}

const NotificationToggleCard: React.FC<NotificationToggleCardProps> = ({
  icon,
  title,
  description,
  checked,
  onToggle,
  disabled,
}) => (
  <Card>
    <CardContent className="py-4 md:py-8">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          {icon}
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
        <Switch
          checked={checked}
          onCheckedChange={onToggle}
          aria-label={title}
          disabled={disabled}
        />
      </div>
    </CardContent>
  </Card>
);

export default NotificationToggleCard;
