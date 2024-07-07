import { z } from 'zod';

const flightStatusSchema = z.enum(['none', 'ready', 'processing']);

const flightRequestSchema = z.object({
  code: z
    .string()
    .length(6, 'Code must be exactly 6 characters long.')
    .regex(/^[a-zA-Z]+$/, 'Code must contain only letters (a-z, A-Z).'),
  capacity: z.number().int('Capacity must be an integer.').min(1, 'Capacity must be at least 1.').max(200, 'Capacity must be at most 200.'),
  departureDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date format.'),
});

const flightSchema = flightRequestSchema.extend({
  id: z.string().uuid('Invalid UUID format.'),
  status: flightStatusSchema,
  img: z.string().url('Invalid URL format.'),
});

const flightsResponseSchema = z.object({
  count: z.number().int('Count must be an integer.').nonnegative('Count must be zero or positive.'),
  resources: z.array(flightSchema),
  total: z.number().int('Total must be an integer.').nonnegative('Total must be zero or positive.'),
});

const flightPaginatedFetchPropsSchema = z.object({
  page: z.number().int('Page must be an integer.').min(1, 'Page must be at least 1.'),
  pageSize: z.number().int('Page size must be an integer.').min(1, 'Page size must be at least 1.'),
});

// Extract TypeScript Types
export type FlightRequest = z.infer<typeof flightRequestSchema>;
export type Flight = z.infer<typeof flightSchema>;
export type FlightsResponse = z.infer<typeof flightsResponseSchema>;
export type FlightPaginatedFetchProps = z.infer<typeof flightPaginatedFetchPropsSchema>;

// Define the FlightStatus Enum for TypeScript
export enum FlightStatus {
  NONE = 'none',
  READY = 'ready',
  PROCESSING = 'processing',
}
