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
    return {
      page: Number(search?.page ?? 1),
      size: Number(search?.size ?? 10),
    };
  },
});
