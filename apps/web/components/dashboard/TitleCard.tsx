import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TitleCardProps {
  title: string;
  description: string;
}

const TitleCard = ({ title, description }: TitleCardProps) => {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>
          <h3 className="text-xl font-semibold">{title}</h3>
        </CardTitle>
        <CardDescription>
          <p className="text-muted-foreground">{description}</p>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default TitleCard;
