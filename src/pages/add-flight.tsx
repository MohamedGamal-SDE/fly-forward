import { FlightRequest, flightRequestSchema } from '@/models';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button, Input, Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn/components';
import { useCreateFlightMutation, useFetchFlights } from '@/hooks';
import axios from 'axios';
import { isCodeUnique } from '@/utilities';

export default function AddFlight() {
  const { data: flightsList, isFetched, isError: isFetchingFlightsError } = useFetchFlights();

  // Form Instance
  const form = useForm<FlightRequest>({
    resolver: zodResolver(flightRequestSchema),
    defaultValues: { code: '', capacity: 0, departureDate: '' },
  });

  const watchCapacity = form.watch('capacity', 0);

  const { mutateAsync, isPending, isError, isSuccess } = useCreateFlightMutation();

  // Handle form submission
  async function onSubmit(values: FlightRequest) {
    if (!isFetched || isFetchingFlightsError) return;

    if (!isCodeUnique(values.code, flightsList ?? [])) {
      form.setError('code', { type: 'manual', message: 'The flight code is already in use. Please choose a different code.' });
      return;
    }

    await mutateAsync(values, {
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.data.code === 106) {
            // DEV: Set a form error for the code field to notify about duplicate entry.
            form.setError('code', { type: 'manual', message: 'The flight code is already in use. Please choose a different code.' });
          }
        }
      },
    });
  }

  return (
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
        {isSuccess && <p className="p-2 bg-green-200  w-full text-green-800">Flight Created successfully</p>}
        {(isError || isFetchingFlightsError) && <p className="p-2 bg-red-200 w-full text-red-800">Add Flight failed, please try again.</p>}
      </form>
    </Form>
  );
}
