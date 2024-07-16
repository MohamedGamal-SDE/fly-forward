import { useMemo, useState } from 'react';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axios from 'axios';

import { Input, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Button } from '@/shadcn/components';
import { FlightRequest, flightRequestSchema } from '@/models';
import { useFetchFlights, useUpdateFlight } from '@/hooks';
import { isCodeUnique } from '@/utilities';
import { Spinner } from '@/components';
import { useFetchFlightById } from '@/hooks/use-fetch-flight-by-id';

// interface FlightUpdateProps {
//   flight: Flight;
// }

const Route = getRouteApi('/edit-flight/$id');

export default function UpdateFlight() {
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: flightsList, isFetched, isError: isFetchingFlightsError } = useFetchFlights();
  const { data: flight, isLoading, isError: isErrorFetchingFlight } = useFetchFlightById(id);
  const { mutateAsync, isPending, isError, isSuccess } = useUpdateFlight();

  // Form Instance
  const form = useForm<FlightRequest>({
    resolver: zodResolver(flightRequestSchema),
    // TODO: Check models and handle photo being optional for now for testing
    defaultValues: useMemo(() => ({ ...flight }), [flight]),
  });

  const watchCapacity = form.watch('capacity', 0);

  // Handle form submission
  async function onSubmit(values: FlightRequest) {
    setIsSubmitting(true);

    //NOTE: Validate values against FlightRequest type before use FormData
    // Since we changes the mutation query to accept type FormData
    // TODO: find a better type safe solution
    const isValid = flightRequestSchema.safeParse(values);
    const newCode = values.code;

    if (!isValid.success) {
      //TODO: Handle validation errors if we going with this solution
      return;
    }

    // DEV: Checking for Flight list available or no for the unique check later

    if (!isFetched || isFetchingFlightsError) return;

    if (flight?.code !== newCode && !isCodeUnique(newCode, flightsList ?? [])) {
      form.setError('code', { type: 'manual', message: 'The flight code is already in use. Please choose a different code.' });
      return;
    }

    const updatedFlight: FlightRequest = {
      code: values.code || flight?.code || '',
      capacity: values.capacity || flight?.capacity || 0,
      departureDate: values.departureDate || flight?.departureDate || '',
    };

    await mutateAsync(
      { flight: updatedFlight, flightId: id },
      {
        onSuccess: () => {
          // form.reset();
          navigate({ to: '/flights', search: (params) => ({ ...params, page: params.page || 1, size: params.size || 10 }) });
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            if (error.response?.data.code === 106) {
              // DEV: Set a form error for the code field to notify about duplicate entry.
              form.setError('code', { type: 'manual', message: 'The flight code is already in use. Please choose a different code.' });
            }
          }
          setIsSubmitting(false);
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      }
    );
  }

  if (isLoading || isPending) return <div>Loading...</div>;
  if (isErrorFetchingFlight || isError) return <div>Something went wrong....</div>;

  return (
    <div className="relative">
      {isSubmitting && <Spinner />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code:</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Flight Code." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity:</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Flight Capacity."
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={watchCapacity === 0 ? '' : watchCapacity}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="departureDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departure Date:</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Flight Departure Date." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex p-4 items-center justify-center space-x-4 bg-slate-200">
            <Button type="submit" className="flex-grow p-2 bg-blue-500 text-white" disabled={isPending}>
              {isPending ? 'Submitting...' : 'Submit'}
            </Button>
          </div>

          {/* Simple notifications */}
          {isSuccess && <p className="p-2 bg-green-200  w-full text-green-800">Flight Edited successfully</p>}
          {(isError || isFetchingFlightsError) && <p className="p-2 bg-red-200 w-full text-red-800">Edit Flight failed, please try again.</p>}
        </form>
      </Form>
    </div>
  );
}
