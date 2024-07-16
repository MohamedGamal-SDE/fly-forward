import { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';

import { ButtonVariant, Flight } from '@/models';
import { ConfirmationModal, InfiniteProgressBar, ImageDialog } from '@/components';

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
          <div className="flex justify-center items-center w-8">
            <ConfirmationModal
              triggerLabel={<Trash2 />}
              triggerVariant={ButtonVariant.Destructive}
              confirmVariant={ButtonVariant.Destructive}
              onConfirm={() => handleDeleteFlight(id)}
            />
          </div>
        );
      },
    },
  ];
};
