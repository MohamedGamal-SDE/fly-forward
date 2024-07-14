import { ColumnDef } from '@tanstack/react-table';

import { Flight } from '@/models';
import ImageDialog from '@/components/image-dialog';
import { InfiniteProgressBar } from '@/components/infinite-progress-bar';

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
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return status === 'processing' ? <InfiniteProgressBar /> : <p>{status}</p>;
    },
  },
  {
    id: 'photo',
    header: 'Photo',
    cell: ({ row }) => {
      const id = row.original.id;
      return <ImageDialog flightId={id} />;
    },
  },
  // TODO: Add actions menu for edit and delete.
];
