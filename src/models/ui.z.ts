import { ReactNode } from 'react';

export enum ButtonVariant {
  Default = 'default',
  Destructive = 'destructive',
  Outline = 'outline',
  Secondary = 'secondary',
  Ghost = 'ghost',
  Link = 'link',
}

export interface ConfirmationModalProps {
  triggerLabel?: string;
  triggerClass?: string;
  triggerVariant?: ButtonVariant;
  containerClass?: string;
  title?: string;
  titleClass?: string;
  contentClass?: string;
  contentMessage?: string;
  footerClass?: string;
  cancelLabel?: string;
  cancelClass?: string;
  cancelVariant?: ButtonVariant;
  onCancel?: () => void;
  confirmLabel?: string;
  confirmClass?: string;
  confirmVariant?: ButtonVariant;
  onConfirm?: () => void;
  children?: ReactNode;
}
