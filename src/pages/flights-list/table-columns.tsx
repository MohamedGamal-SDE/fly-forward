import { ColumnDef } from '@tanstack/react-table';

import { Flight } from '@/models';

export const flightListTableColumns: ColumnDef<Flight>[] = [
  {
    accessorKey: 'code',
    header: 'Code',
  },
  {
    accessorKey: 'capacity',
    header: 'Capacity',
  },
  {
    accessorKey: 'departureDate',
    header: () => <div className="font-bold">Departure Date</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue('departureDate'));
      const localDate = date.toLocaleDateString();

      return <div className="font-bold">{localDate}</div>;
    },
  },
  // TODO: Add actions menu for edit and delete
];
