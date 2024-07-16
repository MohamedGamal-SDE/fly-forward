import { useState } from 'react';
import { Button, DialogHeader, DialogFooter, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/shadcn';
import { ConfirmationModalProps } from '@/models';

export function ConfirmationModal(props: ConfirmationModalProps) {
  const {
    triggerLabel,
    triggerClass = '',
    triggerVariant = 'default',
    containerClass = '',
    title = 'Confirmation',
    titleClass = '',
    contentClass = '',
    contentMessage = 'Are you sure you want to proceed with this action!.',
    footerClass = '',
    cancelLabel = 'Cancel',
    cancelClass = '',
    cancelVariant = 'default',
    onCancel = () => {},
    confirmLabel = 'Confirm',
    confirmClass = '',
    confirmVariant = 'default',
    onConfirm = () => {},
    children,
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  const handleConfirmClick = () => {
    onConfirm?.();
    setIsOpen(false);
  };

  const handleCancelClick = () => {
    onCancel?.();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} className={triggerClass}>
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className={`flex flex-col max-h-[95vh] ${containerClass}`}>
        <DialogHeader>
          <DialogTitle className={titleClass}>{title}</DialogTitle>
        </DialogHeader>

        {children ? children : <DialogDescription className={contentClass}>{contentMessage}</DialogDescription>}
        <DialogFooter className={footerClass}>
          <Button variant={cancelVariant} className={cancelClass} onClick={handleCancelClick}>
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} className={confirmClass} onClick={handleConfirmClick}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
