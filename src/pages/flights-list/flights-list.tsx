import { useEffect, useMemo, useState } from 'react';
import { getRouteApi } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useReactTable, getCoreRowModel, Table, PaginationState } from '@tanstack/react-table';

import { createMockFlightItem } from '@/api';
import { DataTable, DataTablePagination } from '@/components';
import { Flight } from '@/models';
import { flightListTableColumns } from './table-columns';
import { useFetchPaginatedFlights } from '@/hooks';

const route = getRouteApi('/flights');
const FLIGHTS_QUERY_KEY = 'flights';

export default function FlightsList() {
  const queryClient = useQueryClient();
  const navigate = route.useNavigate();
  const queryParams = route.useSearch();

  // NOTE:
  //      - pageIndex: we adjust page to a 0-based index
  //      - to match tanstack default pagination setup
  //      - adjust fetching params for page to API (1-based)

  const pageIndex = queryParams.page - 1;
  const pageSize = queryParams.size;

  const [pagination, setPagination] = useState<PaginationState>({ pageIndex, pageSize });

  useEffect(() => {
    if (isNaN(pagination.pageIndex) || isNaN(pagination.pageSize) || pagination.pageIndex < 0 || pagination.pageSize < 1) {
      navigate({
        to: '/bad-request',
      });
    } else {
      navigate({
        to: '/flights',
        search: { page: pagination.pageIndex + 1, size: pagination.pageSize },
      });
    }
  }, [pagination, navigate]);

  const { data: flightsData, error, isPending, isFetching } = useFetchPaginatedFlights(pagination);

  const { resources: flightsList } = flightsData ?? {};

  // DEV: Create mock flight
  const mutations = useMutation({
    mutationFn: createMockFlightItem,
    onSuccess() {
      // Invalidate current flights list and refetch
      queryClient.invalidateQueries({ queryKey: [FLIGHTS_QUERY_KEY] });
    },
  });

  // DEV: Table setup
  const optimizedColumns = useMemo(() => flightListTableColumns, []);
  const defaultData = useMemo(() => [], []);

  const table: Table<Flight> = useReactTable({
    data: flightsList || defaultData,
    columns: optimizedColumns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    // debugTable: true,
    manualPagination: true,
    pageCount: Math.ceil((flightsData?.total || 0) / pagination.pageSize), // Calculate the total number of pages
    state: { pagination },
    onPaginationChange: setPagination,
  });

  const handleAddMockFlightClick = () => {
    mutations.mutate(flightsList || []);
  };

  // DEV:IDEA:
  // Prefetch next page:
  // useEffect(() => {
  //   if (!isPlaceholderData && flightsList?.hasMore) {
  //     queryClient.prefetchQuery({
  //       queryKey: ['projects', page + 1],
  //       queryFn: () => fetchPaginatedFlights({ page: page + 1, pageSize }),
  //     });
  //   }
  // }, [data, isPlaceholderData, page, queryClient]);

  // NOTE: Docs user isPending instead of isLoading for paginated fetch
  if (isPending) return <div>Loading...</div>;
  // if (isLoading) return <div>Loading...</div>;
  if (isFetching) return <div>Fetching...</div>;

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
