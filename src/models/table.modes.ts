import { Table } from '@tanstack/react-table';

export interface DataTableProps<TData> {
  table: Table<TData>;
}

export interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizes?: number[];
}
