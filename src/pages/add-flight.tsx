import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axios from 'axios';

import { FlightRequest, flightRequestSchema } from '@/models';
import { Button, Input, Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn/components';
import { useCreateFlightMutation, useFetchFlights } from '@/hooks';
import { isCodeUnique } from '@/utilities';
import { Spinner } from '@/components';

export default function AddFlight() {
  const { data: flightsList, isFetched, isError: isFetchingFlightsError } = useFetchFlights();
  const navigate = useNavigate();

  // Form Instance
  const form = useForm<FlightRequest>({
    resolver: zodResolver(flightRequestSchema),
    // TODO: Check models and handle photo being optional for now for testing
    defaultValues: { code: '', capacity: 0, departureDate: '', photo: undefined },
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const watchCapacity = form.watch('capacity', 0);
  const watchPhoto = form.watch('photo');

  const { mutateAsync, isPending, isError, isSuccess } = useCreateFlightMutation();

  useEffect(() => {
    if (watchPhoto instanceof File) {
      // console.log('🚀 ~ useEffect ~ watchPhoto:', watchPhoto);
      const reader = new FileReader();
      // console.log('🚀 ~ useEffect ~ reader:', reader);

      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(watchPhoto);
    } else {
      setPhotoPreview(null);
    }
  }, [watchPhoto]);

  // Handle form submission
  async function onSubmit(values: FlightRequest) {
    setIsSubmitting(true);

    //NOTE: Validate values against FlightRequest type before use FormData
    // Since we changes the mutation query to accept type FormData
    // TODO: find a better type safe solution
    const isValid = flightRequestSchema.safeParse(values);

    if (!isValid.success) {
      //TODO: Handle validation errors if we going with this solution
      return;
    }

    // DEV: Checking for Flight list available or no for the unique check later

    if (!isFetched || isFetchingFlightsError) return;

    const formData = new FormData();
    formData.append('code', values.code);
    formData.append('capacity', String(values.capacity));
    formData.append('departureDate', values.departureDate);
    if (values.photo) {
      formData.append('photo', values.photo);
    }

    if (!isCodeUnique(values.code, flightsList ?? [])) {
      form.setError('code', { type: 'manual', message: 'The flight code is already in use. Please choose a different code.' });
      return;
    }

    await mutateAsync(formData, {
      onSuccess: () => {
        form.reset();
        setPhotoPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        navigate({ to: '/flights', search: (params) => ({ ...params, page: params.page || 1, size: params.size || 10 }) });
        // // NOTE: Temp notify setup,
        // // TODO: Replace with toast/snackbar
        // setSuccessMessage('Flight Created successfully');
        // setTimeout(() => {
        //   setSuccessMessage(null);
        // }, 3000);
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.data.code === 106) {
            // DEV: Set a form error for the code field to notify about duplicate entry.
            form.setError('code', { type: 'manual', message: 'The flight code is already in use. Please choose a different code.' });
          }
        }
      },
      onSettled: () => {
        setIsSubmitting(false);
      },
    });
  }

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
          <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photo:</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={(e) => {
                      field.ref;
                      fileInputRef.current = e;
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {photoPreview && (
            <div className="flex justify-center">
              <img src={photoPreview} alt="Photo Preview" className="max-w-xs max-h-xs" />
            </div>
          )}

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
    </div>
  );
}
