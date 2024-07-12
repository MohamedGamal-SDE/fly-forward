import axios from 'axios';

import { Flight, FlightPaginatedFetchProps, FlightsResponse } from '@/models';
import { generateRandomFlight } from '@/utilities';

const apiUrl = `${import.meta.env.VITE_API_URL}/flights`;

export const fetchAllFlights = async (): Promise<Flight[]> => {
  try {
    // TODO: Implement dynamic size and page setup
    const response = await axios.get<FlightsResponse>(`${apiUrl}`);

    return response.data.resources;
  } catch (error) {
    // DEV:RMV: For dev debug purpose only!!!
    console.warn('❌ Error Fetching data:', error);
    return [];
  }
};

export const fetchPaginatedFlights = async (queryParams: FlightPaginatedFetchProps): Promise<FlightsResponse> => {
  const { page, pageSize } = queryParams;

  try {
    // await new Promise((r) => setTimeout(r, 500)); // RMV:

    const response = await axios.get<FlightsResponse>(apiUrl, {
      params: {
        page,
        size: pageSize,
      },
    });

    return response.data;
  } catch (error) {
    // DEV:RMV: For dev debug purpose only!!!
    console.warn(`❌ Error Fetching Page ${page} data:`, error);
    return {
      total: 0,
      count: 0,
      resources: [],
    };
  }
};

export const fetchFlightPhoto = async (flightId: string): Promise<Blob | null> => {
  try {
    // TODO: Implement dynamic size and page setup
    const response = await axios.get<Blob>(`${apiUrl}/${flightId}/photo`, {
      responseType: 'blob',
    });

    console.log('👀 ~ fetchFlightPhoto ~ response:', response);

    // Check the Content-Type header for the type of response
    if (response.headers['content-type']?.includes('application/json')) {
      // Convert the Blob to text and then parse it as JSON
      const errorText = await response.data.text();
      console.log('🪢 ~ fetchFlightPhoto ~ errorText:', errorText);
      const errorObj = JSON.parse(errorText);
      console.log('🪢 ~ fetchFlightPhoto ~ errorObj:', errorObj);
      throw new Error(errorObj);
    }

    return response.data;
  } catch (error) {
    console.log('CATCH ERROR RUNNING');
    // // DEV:RMV: For dev debug purpose only!!!
    console.warn('❌ Error Fetching Flight photo:', error);
    return null;
  }
};

export const createMockFlightItem = async (flightsList: Flight[]) => {
  const mockFlight = await axios.post<Flight>(apiUrl, generateRandomFlight(flightsList));

  return mockFlight;
};

export const createFlight = async (flight: FormData): Promise<Flight> => {
  try {
    const response = await axios.post<Flight>(`${apiUrl}/withPhoto`, flight);

    return response.data;
  } catch (error) {
    // DEV:RMV: For dev debug purpose only!!!
    console.warn('❌ Error creating flight:', error);
    throw error;
  }
};
