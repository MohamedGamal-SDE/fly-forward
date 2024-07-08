import { fetchPaginatedFlights } from '@/api';
import { FlightsResponse } from '@/models';
import { UseQueryOptions, keepPreviousData, useQuery } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';

const FLIGHTS_QUERY_KEY = 'flights';

export function useFetchPaginatedFlights(pagination: PaginationState, options?: UseQueryOptions<FlightsResponse, Error>) {
  return useQuery<FlightsResponse, Error>({
    queryKey: [FLIGHTS_QUERY_KEY, pagination],
    queryFn: () => fetchPaginatedFlights({ page: pagination.pageIndex + 1, pageSize: pagination.pageSize }),
    placeholderData: keepPreviousData, // NOTE: Prevent 0 rows flash while changing pages/loading next page
    ...options,
  });
}
