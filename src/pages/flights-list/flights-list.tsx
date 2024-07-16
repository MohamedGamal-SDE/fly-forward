import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { getRouteApi } from '@tanstack/react-router';
import { useReactTable, getCoreRowModel, Table, PaginationState, getFilteredRowModel } from '@tanstack/react-table';

import { DataTable, DataTablePagination, SingleInputForm, Spinner, FlightCard } from '@/components';
import { Flight, FlightSearch, flightSearchSchema } from '@/models';
import { flightListTableColumns } from './table-columns';
import { useDeleteFlight, useFetchPaginatedFlights } from '@/hooks';
import { useDebounce } from '@/hooks/use-debounce';

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
  const searchCode = queryParams.code || '';

  const [searchTerm, setSearchTerm] = useState<FlightSearch>(searchCode);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex, pageSize });
  const [isInputValid, setIsInputValid] = useState(true);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: flightsData, error, isPending, isFetching } = useFetchPaginatedFlights(pagination, debouncedSearchTerm);

  const deleteFlightMutation = useDeleteFlight();

  const handleDeleteFlight = useCallback(
    (id: string) => {
      deleteFlightMutation.mutate(id);
    },
    [deleteFlightMutation]
  );

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setPagination({ ...pagination, pageIndex: 0 }); //NOTE:DEV: Reset to first page on search
    navigate({
      to: '/flights',
      search: { page: 1, size: pagination.pageSize, code: (isInputValid && value) || undefined },
    });
  };

  const { resources: flightsList } = flightsData ?? {};

  // DEV: Table setup
  const optimizedColumns = useMemo(() => flightListTableColumns(handleDeleteFlight), [handleDeleteFlight]);
  const defaultData = useMemo(() => [], []);

  const table: Table<Flight> = useReactTable({
    data: isInputValid ? flightsList || defaultData : defaultData,
    columns: optimizedColumns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    // debugTable: true,
    manualPagination: true,
    pageCount: Math.ceil((flightsData?.total || 0) / pagination.pageSize), // Calculate the total number of pages
    state: { pagination, globalFilter: searchTerm },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setSearchTerm,
    getFilteredRowModel: getFilteredRowModel(),
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
        search: { page: pagination.pageIndex + 1, size: pagination.pageSize, code: searchTerm || undefined },
      });
    }
  }, [pagination, navigate, searchTerm]);

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
  if (isPending)
    return (
      <div>
        <Spinner />
      </div>
    );
  if (isFetching) return <div>Fetching...</div>;

  if (error) return <div>Something went wrong, please try again later</div>;

  return (
    <div>
      <div className="flex w-full bg-slate-600 p-8">
        <SingleInputForm
          schema={flightSearchSchema}
          name="code"
          placeholder="Enter flight code"
          defaultValues={{ code: searchTerm }}
          onChange={handleSearch}
          setIsInputValid={setIsInputValid}
        />
      </div>
      {renderTableView()}
      {renderCardView()}
    </div>
  );
}
