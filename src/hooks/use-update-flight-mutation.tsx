import { updateFlightWithPhoto } from '@/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const FLIGHTS_QUERY_KEY = 'flights';

export function useUpdateFlightMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ flight, flightId }: { flight: FormData; flightId: string }) => updateFlightWithPhoto(flight, flightId),
    retry: 3,
    retryDelay: 1000,
    onSuccess: (data) => {
      console.log('🚀 ~ useUpdateFlightMutation ~ onSuccess ~ data:', data);
      queryClient.invalidateQueries({ queryKey: [FLIGHTS_QUERY_KEY] });

      return data;
    },
    onError(error) {
      console.log('❌ ~ useUpdateFlight ~ onError ~ error:', error);
    },
  });
}

// return useMutation({
//   mutationFn: ({ flight, flightId }: { flight: FlightRequest; flightId: string }) => updateFlight(flight, flightId),
//   retry: 3,
//   retryDelay: 1000,
//   onSuccess: (data) => {
//     console.log('🚀 ~ useUpdateFlight ~ onSuccess ~ data:', data);
//     queryClient.invalidateQueries({ queryKey: [FLIGHTS_QUERY_KEY] });

//     return data;
//   },
//   onError(error) {
//     console.log('❌ ~ useUpdateFlight ~ onError ~ error:', error);
//   },
// });
