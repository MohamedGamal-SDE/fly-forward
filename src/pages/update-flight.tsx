import { useEffect, useRef, useState } from 'react';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axios from 'axios';

import { Input, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Button } from '@/shadcn/components';
import { FlightRequest, flightRequestSchema } from '@/models';
import { useFetchFlightPhoto, useFetchFlights, useUpdateFlightMutation } from '@/hooks';
import { isCodeUnique } from '@/utilities';
import { Spinner } from '@/components';
import { useFetchFlightById } from '@/hooks/use-fetch-flight-by-id';

const Route = getRouteApi('/edit-flight/$id');

export default function UpdateFlight() {
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);

  const { data: flightPhoto, isLoading: isPhotoLoading, isError: isPhotoError } = useFetchFlightPhoto(id);

  const { data: flightsList, isFetched, isError: isFetchingFlightsError } = useFetchFlights();
  const { data: flight, isLoading, isError: isErrorFetchingFlight } = useFetchFlightById(id);
  const { mutateAsync, isPending, isError, isSuccess } = useUpdateFlightMutation();

  // console.log('🚀 ~ UpdateFlight ~ id:', id);
  // console.log('🚀 ~ UpdateFlight ~ flight:', flight);
  // Form Instance
  const form = useForm<FlightRequest>({
    resolver: zodResolver(flightRequestSchema),
    // TODO: Check models and handle photo being optional for now for testing
    defaultValues: {
      code: '',
      capacity: 0,
      departureDate: '',
      photo: undefined,
    },
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const watchCapacity = form.watch('capacity', 0);
  const watchPhoto = form.watch('photo');

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
      setIsSubmitting(false);
      return;
    }

    // DEV: Checking for Flight list available or no for the unique check later

    if (!isFetched || isFetchingFlightsError) return;

    if (flight?.code !== newCode && !isCodeUnique(newCode, flightsList ?? [])) {
      form.setError('code', { type: 'manual', message: 'The flight code is already in use. Please choose a different code.' });
      setIsSubmitting(false);
      return;
    }

    // const updatedFlight: FlightRequest = {
    //   code: values.code || flight?.code || '',
    //   capacity: values.capacity || flight?.capacity || 0,
    //   departureDate: values.departureDate || flight?.departureDate || '',
    // };

    const updatedFlight = new FormData();
    updatedFlight.append('code', values.code || flight?.code || '');
    updatedFlight.append('capacity', String(values.capacity || flight?.capacity || 0));
    updatedFlight.append('departureDate', values.departureDate || flight?.departureDate || '');

    if (values.photo) {
      updatedFlight.append('photo', values.photo);
    } else if (flightPhoto) {
      updatedFlight.append('photo', flightPhoto);
    }

    console.log('🚀 ~ onSubmit ~ updatedFlight:', updatedFlight);

    await mutateAsync(
      { flight: updatedFlight, flightId: id },
      {
        onSuccess: () => {
          console.log('Submit success');
          navigate({ to: '/flights', search: (params) => ({ ...params, page: params.page || 1, size: params.size || 10 }) });
        },
        onError: (error) => {
          console.log('isSubmitting Error', error);
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
      }
    );
  }

  // TODO: move to utils after finish setup
  const convertBlobToDataURL = (blob: Blob, callback: (dataURL: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result as string);
    reader.readAsDataURL(blob);
  };

  useEffect(() => {
    if (flight) {
      form.reset(flight);
      if (flightPhoto) {
        convertBlobToDataURL(flightPhoto, setPhoto);
      }
    }
  }, [flight, flightPhoto, form]);

  useEffect(() => {
    if (watchPhoto instanceof File) {
      convertBlobToDataURL(watchPhoto, setPhoto);
    } else {
      setPhoto(null);
    }
  }, [watchPhoto]);

  // Rendering Logic
  if (isLoading || isPending || isPhotoLoading) return <div>Loading...</div>;
  if (isErrorFetchingFlight || isError || isPhotoError) return <div>Something went wrong....</div>;

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
                      console.log('🚀 ~ UpdateFlight ~ fileInputRef.current:', fileInputRef.current);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {photo && (
            <div className="flex justify-center">
              <img src={photo} alt="Photo Preview" className="max-w-xs max-h-xs" />
            </div>
          )}

          <div className="flex p-4 items-center justify-center space-x-4 bg-slate-200">
            <Button
              type="button"
              className="flex-grow p-2 bg-red-500 text-white"
              onClick={() => {
                form.setValue('photo', undefined);
                setPhoto(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}>
              Remove Photo
            </Button>
          </div>

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
