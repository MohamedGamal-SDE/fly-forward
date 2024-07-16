import { createFileRoute } from '@tanstack/react-router';

import FlightsList from '@/pages/flights-list/flights-list';
import { z } from 'zod';
import { flightSearchCodeSchema } from '@/models';

const flightQueryParamsSchema = z.object({
  page: z.number().int().default(1),
  size: z.number().int().default(10),
  code: flightSearchCodeSchema,
});

export const Route = createFileRoute('/flights')({
  component: FlightsList,
  validateSearch: (queryParams) => flightQueryParamsSchema.parse(queryParams),
});
