import axios from 'axios';

import { Flight, FlightPaginatedFetchProps, FlightRequest, FlightsResponse } from '@/models';
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

export const createMockFlightItem = async (flightsList: Flight[]) => {
  const mockFlight = await axios.post<Flight>(apiUrl, generateRandomFlight(flightsList));

  return mockFlight;
};

export const createFlight = async (flight: FlightRequest): Promise<Flight> => {
  try {
    const response = await axios.post<Flight>(apiUrl, flight);

    return response.data;
  } catch (error) {
    // DEV:RMV: For dev debug purpose only!!!
    console.warn('❌ Error creating flight:', error);
    throw error;
  }
};
