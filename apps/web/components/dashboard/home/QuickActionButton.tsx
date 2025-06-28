import type { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export interface QuickActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

const QuickActionButton = ({ icon: Icon, label, onClick }: QuickActionButtonProps) => {
  return (
    <Button variant="outline" className="h-20 flex-col gap-2" onClick={onClick}>
      <Icon className="h-6 w-6" />
      <span className="text-sm">{label}</span>
    </Button>
  );
};

export default QuickActionButton;
