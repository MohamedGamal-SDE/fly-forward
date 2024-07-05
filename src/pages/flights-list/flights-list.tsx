import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useReactTable, getCoreRowModel, getPaginationRowModel, Table } from '@tanstack/react-table';

import { createMockFlightItem, fetchFlights } from '@/api';
import { DataTable, DataTablePagination } from '@/components';
import { Flight } from '@/models';
import { flightListTableColumns } from './table-columns';

const FLIGHTS_QUERY_KEY = 'flights';

export default function FlightsList() {
  const queryClient = useQueryClient();

  // TODO: Extract queries and mutations into reusable custom hook
  const {
    data: flightsList,
    error,
    isLoading,
  } = useQuery<Flight[], Error>({
    queryKey: [FLIGHTS_QUERY_KEY],
    queryFn: fetchFlights,
  });

  const mutations = useMutation({
    mutationFn: createMockFlightItem,
    onSuccess() {
      // Invalidate current flights list and refetch
      queryClient.invalidateQueries({ queryKey: [FLIGHTS_QUERY_KEY] });
    },
  });

  const table: Table<Flight> = useReactTable({
    data: flightsList || [],
    columns: flightListTableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleAddMockFlightClick = () => {
    mutations.mutate(flightsList || []);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong, please try again later</div>;

  return (
    <div>
      <div className="flex p-4 items-center justify-center space-x-4 bg-slate-200">
        <button onClick={handleAddMockFlightClick} className="flex-grow p-2 bg-blue-500 text-white">
          Add mock flight
        </button>
      </div>

      <DataTable table={table} />
      <DataTablePagination table={table} />
    </div>
  );
}
