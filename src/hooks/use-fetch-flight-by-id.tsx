import { fetchFlightById } from '@/api';
import { Flight } from '@/models';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

const FLIGHTS_QUERY_KEY = 'flights';

export function useFetchFlightById(flightId: string, options?: UseQueryOptions<Flight, Error>) {
  return useQuery<Flight, Error>({
    queryKey: [FLIGHTS_QUERY_KEY, flightId],
    queryFn: () => fetchFlightById(flightId),
    ...options,
  });
}
