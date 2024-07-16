import { ColumnDef } from '@tanstack/react-table';
import { FilePenLine, Trash2 } from 'lucide-react';

import { ButtonVariant, Flight } from '@/models';
import { ConfirmationModal, InfiniteProgressBar, ImageDialog } from '@/components';
import { Link } from '@tanstack/react-router';

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
      id: 'status',
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
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <div className="flex justify-center items-center w-8 space-x-2">
            <ConfirmationModal
              triggerLabel={<Trash2 />}
              triggerVariant={ButtonVariant.Destructive}
              confirmVariant={ButtonVariant.Destructive}
              onConfirm={() => handleDeleteFlight(id)}
            />

            <Link
              to={'/edit-flight/$id'}
              params={{ id }}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-500 text-blue-500 hover:bg-blue-400/90 h-10 px-4 py-2">
              <FilePenLine className="text-white" />
            </Link>
          </div>
        );
      },
    },
  ];
};
