import { updateFlight } from '@/api';
import { FlightRequest } from '@/models';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const FLIGHTS_QUERY_KEY = 'flights';

export function useUpdateFlight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ flight, flightId }: { flight: FlightRequest; flightId: string }) => updateFlight(flight, flightId),
    retry: 3,
    retryDelay: 1000,
    onSuccess: (data) => {
      console.log('🚀 ~ useUpdateFlight ~ onSuccess ~ data:', data);
      queryClient.invalidateQueries({ queryKey: [FLIGHTS_QUERY_KEY] });

      return data;
    },
    onError(error) {
      console.log('❌ ~ useUpdateFlight ~ onError ~ error:', error);
    },
  });
}
