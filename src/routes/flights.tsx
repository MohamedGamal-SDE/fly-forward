import { createFileRoute } from '@tanstack/react-router';

import FlightsList from '@/pages/flights-list/flights-list';
import { z } from 'zod';

// type FlightsQueryParams = {
//   page: number;
//   size: number;
//   code: string;
// };

const flightQueryParamsSchema = z.object({
  page: z.number().int().default(1),
  size: z.number().int().default(10),
  code: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => val === undefined || /^[a-zA-Z]*$/.test(val), {
      message: 'Code must contain only letters (a-z, A-Z).',
    }),
});

export const Route = createFileRoute('/flights')({
  component: FlightsList,
  // TODO: Try out https://zod.dev/ typing
  // validateSearch: (search: Record<string, unknown>): flightQueryParamsSchema => {
  //   const page = Number(search?.page ?? 1);
  //   const size = Number(search?.size ?? 10);
  //   const code = String(search?.code);

  //   return { page, size, code };
  // },
  validateSearch: (queryParams) => flightQueryParamsSchema.parse(queryParams),
});
