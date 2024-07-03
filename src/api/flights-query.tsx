import axios from 'axios';

import { Flight, FlightsResponse } from '@/models';
import { generateRandomFlight } from '@/utilities';

const apiUrl = `${import.meta.env.VITE_API_URL}/flights`;

export const fetchFlights = async (): Promise<Flight[]> => {
  try {
    const response = await axios.get<FlightsResponse>(apiUrl);

    return response.data.resources;
  } catch (error) {
    // DEV:RMV: For dev debug purpose only!!!
    console.warn('❌ Error Fetching data:', error);
    return [];
  }
};

export const createMockFlightItem = async (flightsList: Flight[]) => {
  const mockFlight = await axios.post<Flight>(apiUrl, generateRandomFlight(flightsList));

  return mockFlight;
};
