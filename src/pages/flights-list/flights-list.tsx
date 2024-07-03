import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { DataTable } from '@/components';
import { Flight, FlightsResponse } from '@/models';
import { flightListTableColumns } from './table-columns';

const fetchFlights = async (): Promise<Flight[]> => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await axios.get<FlightsResponse>(`${apiUrl}/flights`);

    return response.data.resources;
  } catch (error) {
    // DEV:RMV: For dev debug purpose only!!!
    console.warn('❌ Error Fetching data:', error);
    return [];
  }
};

export default function FlightsList() {
  const { data, error, isLoading } = useQuery<Flight[]>({
    queryKey: ['flights'],
    queryFn: fetchFlights,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong, please try again later</div>;

  return (
    <div>
      <DataTable columns={flightListTableColumns} data={data || []} />
    </div>
  );
}
