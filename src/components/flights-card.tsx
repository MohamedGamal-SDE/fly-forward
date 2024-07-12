// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shadcn/components/ui/card';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { cn } from '@/shadcn/lib/utils';
import { Flight } from '@/models';
import ImageDialog from './image-dialog';

export interface FlightCardProps {
  data: Flight;
  className: string;
}

export function CardDemo({ data, className, ...props }: FlightCardProps) {
  return (
    <Card className={cn('w-auto', className)} {...props}>
      {/* <CardHeader>
        <CardTitle>Flight: {data.code}</CardTitle>
        <CardDescription>Departure: {data.departureDate} </CardDescription>
      </CardHeader> */}
      <CardContent className="grid gap-4">
        <div>
          {/* {data.map((item, index) => ( */}
          <div key={data.id} className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{data.code}</p>
              <p className="text-sm text-muted-foreground">{data.capacity}</p>
              <p className="text-sm text-muted-foreground">{data.departureDate}</p>
              <p className="text-sm text-muted-foreground">{<ImageDialog flightId="flightId" />}</p>
            </div>
          </div>
          {/* ))} */}
        </div>
      </CardContent>
      {/* <CardFooter>{data.id}</CardFooter> */}
    </Card>
  );
}
