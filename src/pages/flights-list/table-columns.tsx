import { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { Button } from '@/shadcn';

import { Flight } from '@/models';
import ImageDialog from '@/components/image-dialog';
import { InfiniteProgressBar } from '@/components/infinite-progress-bar';

export const flightListTableColumns = (handleDeleteFlight: (id: string) => void): ColumnDef<Flight>[] => {
  return [
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
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <div className="flex justify-center items-center w-8">
            <Button onClick={() => handleDeleteFlight(id)} variant="destructive" className="text-base">
              <Trash2 />
            </Button>
          </div>
        );
      },
    },
  ];
};
