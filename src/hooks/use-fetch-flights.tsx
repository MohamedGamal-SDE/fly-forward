import { fetchAllFlights } from '@/api';
import { Flight } from '@/models';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

const FLIGHTS_QUERY_KEY = 'flights';

export function useFetchFlights(options?: UseQueryOptions<Flight[], Error>) {
  return useQuery<Flight[], Error>({
    queryKey: [FLIGHTS_QUERY_KEY],
    queryFn: fetchAllFlights,
    ...options,
  });
}
