// src/components/ImageDialog.tsx

import { fetchFlightPhoto } from '@/api';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shadcn/components';
import { Button } from '@/shadcn/components';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

type ImageDialogProps = {
  flightId: string;
};

const ImageDialog: React.FC<ImageDialogProps> = ({ flightId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  const { data: photo, isLoading, isError } = useQuery({ queryKey: [flightId], queryFn: () => fetchFlightPhoto(flightId), enabled: isOpen });

  useEffect(() => {
    if (photo) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(photo);
    } else {
      setImageUrl('');
    }
  }, [photo]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View Image</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col max-h-[95vh]">
        <DialogHeader>
          <DialogTitle>Flight Image</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden"></DialogDescription>
        <div className="flex-1 overflow-auto flex items-center justify-center">
          {isLoading ? (
            <div>Loading...</div>
          ) : isError ? (
            <div>Something went wrong, please try again later</div>
          ) : photo && imageUrl ? (
            <img src={imageUrl} alt="Flight" className="w-full h-auto max-h-[80vh] object-contain" />
          ) : (
            <DialogDescription>N/A</DialogDescription>
          )}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDialog;
