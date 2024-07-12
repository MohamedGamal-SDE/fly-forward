import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shadcn/components/ui/card';
import { cn } from '@/shadcn/lib/utils';
import { Flight } from '@/models';
import ImageDialog from './image-dialog';

export interface FlightCardProps {
  data: Flight;
  className: string;
}

export function FlightCard({ data, className, ...props }: FlightCardProps) {
  return (
    <Card className={cn('w-auto', className)} {...props}>
      <CardHeader>
        <CardTitle>Flight Code: {data.code}</CardTitle>
        <CardDescription>Departure Date: {data.departureDate} </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="text-blue-600"> Capacity: {data.capacity}</div>
      </CardContent>
      <CardFooter>{<ImageDialog flightId="flightId" />}</CardFooter>
    </Card>
  );
}
