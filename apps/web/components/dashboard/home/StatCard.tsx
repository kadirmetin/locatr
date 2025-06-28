import { LucideIcon } from 'lucide-react';

import { Card } from '@/components/ui/card';

import StatCardSkeleton from './skeletons/StatCardSkeleton';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  iconColor: string;
  bgColor: string;
  isLoading?: boolean;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  iconColor,
  bgColor,
  isLoading = false,
}: StatCardProps) => {
  if (isLoading) return <StatCardSkeleton />;
  return (
    <Card className="flex items-center p-4">
      <div className="flex items-center space-x-4">
        <div className={`rounded-full p-3 ${bgColor}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
