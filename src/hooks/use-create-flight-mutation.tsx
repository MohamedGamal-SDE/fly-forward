import { createFlight } from '@/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const FLIGHTS_QUERY_KEY = 'flights';

export function useCreateFlightMutation() {
  const queryClient = useQueryClient();

  const mutations = useMutation({
    mutationFn: createFlight,
    retry: 3,
    retryDelay: 1000,
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: [FLIGHTS_QUERY_KEY] });

      return data;
    },
    onError(error) {
      return error;
    },
  });

  return mutations;
}
