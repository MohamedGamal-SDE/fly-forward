import { deleteFlight } from '@/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const FLIGHTS_QUERY_KEY = 'flights';

export function useDeleteFlight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFlight,
    retry: 3,
    retryDelay: 1000,
    onSuccess: () => {
      console.log('Flight delete successfully');
      queryClient.invalidateQueries({ queryKey: [FLIGHTS_QUERY_KEY] });
    },
    onError: () => console.log('Flight delete unsuccessfully'),
  });
}
