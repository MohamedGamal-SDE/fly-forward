import { createFileRoute } from '@tanstack/react-router';

import FlightsList from '@/pages/flights-list/flights-list';

type FlightsQueryParams = {
  page: number;
  size: number;
};

export const Route = createFileRoute('/flights')({
  component: FlightsList,
  // TODO: Try out https://zod.dev/ typing
  validateSearch: (search: Record<string, unknown>): FlightsQueryParams => {
    const page = Number(search?.page ?? 1);
    const size = Number(search?.size ?? 10);

    return { page, size };
  },
});
