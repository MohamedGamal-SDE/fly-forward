import { fetchPaginatedFlights } from '@/api';
import { FlightSearch, FlightsResponse } from '@/models';
import { UseQueryOptions, keepPreviousData, useQuery } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';

const FLIGHTS_QUERY_KEY = 'flights';

// CHK:FIXME:  code: string use zod typing
export function useFetchPaginatedFlights(pagination: PaginationState, code: FlightSearch, options?: UseQueryOptions<FlightsResponse, Error>) {
  return useQuery<FlightsResponse, Error>({
    queryKey: [FLIGHTS_QUERY_KEY, pagination],
    queryFn: () => fetchPaginatedFlights({ page: pagination.pageIndex + 1, pageSize: pagination.pageSize, code }),
    placeholderData: keepPreviousData, // NOTE: Prevent 0 rows flash while changing pages/loading next page
    ...options,
  });
}
