import { useCallback, useEffect, useMemo, useState } from 'react';
import { getRouteApi } from '@tanstack/react-router';
import { useReactTable, getCoreRowModel, Table, PaginationState } from '@tanstack/react-table';

import { DataTable, DataTablePagination } from '@/components';
import { Flight } from '@/models';
import { flightListTableColumns } from './table-columns';
import { useDeleteFlight, useFetchPaginatedFlights } from '@/hooks';
import { FlightCard } from '@/components/flight-card';

const route = getRouteApi('/flights');

export default function FlightsList() {
  const navigate = route.useNavigate();
  const queryParams = route.useSearch();

  // NOTE:
  //      - pageIndex: we adjust page to a 0-based index
  //      - to match tanstack default pagination setup
  //      - adjust fetching params for page to API (1-based)

  const pageIndex = queryParams.page - 1;
  const pageSize = queryParams.size;

  const [pagination, setPagination] = useState<PaginationState>({ pageIndex, pageSize });

  const { data: flightsData, error, isPending, isFetching } = useFetchPaginatedFlights(pagination);

  const deleteFlightMutation = useDeleteFlight();

  const handleDeleteFlight = useCallback(
    (id: string) => {
      deleteFlightMutation.mutate(id);
    },
    [deleteFlightMutation]
  );

  const { resources: flightsList } = flightsData ?? {};

  // DEV: Table setup
  const optimizedColumns = useMemo(() => flightListTableColumns(handleDeleteFlight), [handleDeleteFlight]);
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

  // NOTE: Mobile view start from 0 to (sm: = 640px)
  const renderTableView = () => {
    return (
      <div className="hidden sm:block">
        <DataTable table={table} />
        <DataTablePagination table={table} />
      </div>
    );
  };

  const renderCardView = () => {
    const flights = flightsList || defaultData;
    const cardsList = flights.map((flight) => {
      return (
        <div key={flight.id} className="">
          <FlightCard data={flight} className="border border-spacing-1 border-orange-400" />
        </div>
      );
    });

    return (
      <div className="sm:hidden flex flex-col gap-2 p-4">
        {cardsList}
        <DataTablePagination table={table} />
      </div>
    );
  };

  // NOTE: Docs user isPending instead of isLoading for paginated fetch
  if (isPending) return <div>Loading...</div>;
  if (isFetching) return <div>Fetching...</div>;

  if (error) return <div>Something went wrong, please try again later</div>;

  return (
    <div>
      {renderTableView()}
      {renderCardView()}
    </div>
  );
}
