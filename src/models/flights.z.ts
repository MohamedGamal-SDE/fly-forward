import { z } from 'zod';

export const flightStatusSchema = z.enum(['none', 'ready', 'processing']);

export const flightRequestSchema = z.object({
  code: z
    .string()
    .length(6, 'Code must be exactly 6 characters long.')
    .regex(/^[a-zA-Z]+$/, 'Code must contain only letters (a-z, A-Z).'),
  capacity: z.number().int('Capacity must be an integer.').min(1, 'Capacity must be at least 1.').max(200, 'Capacity must be at most 200.'),
  departureDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date format.'),
  photo: z
    .instanceof(File)
    .refine((file) => file.type.startsWith('image/'), 'Only image files are allowed')
    .optional(),
});

export const flightSchema = flightRequestSchema.extend({
  id: z.string().uuid('Invalid UUID format.'),
  status: flightStatusSchema,
  img: z.string().url('Invalid URL format.'),
});

export const flightsResponseSchema = z.object({
  count: z.number().int('Count must be an integer.').nonnegative('Count must be zero or positive.'),
  resources: z.array(flightSchema),
  total: z.number().int('Total must be an integer.').nonnegative('Total must be zero or positive.'),
});

export const flightSearchCodeSchema = z
  .string()
  .optional()
  .or(z.literal(''))
  .refine((val) => val === undefined || /^[a-zA-Z]*$/.test(val), {
    message: 'Code must contain only letters (a-z, A-Z).',
  });

export const flightSearchSchema = z.object({
  code: flightSearchCodeSchema,
});

export const flightPaginatedFetchPropsSchema = z.object({
  page: z.number().int('Page must be an integer.').min(1, 'Page must be at least 1.'),
  pageSize: z.number().int('Page size must be an integer.').min(1, 'Page size must be at least 1.'),
  code: flightSearchCodeSchema,
});

// Extract TypeScript Types
export type FlightRequest = z.infer<typeof flightRequestSchema>;
export type Flight = z.infer<typeof flightSchema>;
export type FlightsResponse = z.infer<typeof flightsResponseSchema>;
export type FlightPaginatedFetchProps = z.infer<typeof flightPaginatedFetchPropsSchema>;
export type FlightSearch = z.infer<typeof flightSearchCodeSchema>;

// Define the FlightStatus Enum for TypeScript
export enum FlightStatus {
  NONE = 'none',
  READY = 'ready',
  PROCESSING = 'processing',
}
