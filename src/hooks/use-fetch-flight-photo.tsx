import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { fetchFlightPhoto } from '@/api';

export function useFetchFlightPhoto(flightId: string, options?: UseQueryOptions<Blob | null, Error>) {
  return useQuery<Blob | null, Error>({
    queryKey: [flightId],
    queryFn: () => fetchFlightPhoto(flightId),
    ...options,
  });
}
