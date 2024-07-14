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
  triggerLabel?: string | JSX.Element;
  triggerClass?: string;
  triggerVariant?: ButtonVariant;
  containerClass?: string;
  title?: string;
  titleClass?: string;
  contentClass?: string;
  contentMessage?: string;
  footerClass?: string;
  cancelLabel?: string | JSX.Element;
  cancelClass?: string;
  cancelVariant?: ButtonVariant;
  onCancel?: () => void;
  confirmLabel?: string | JSX.Element;
  confirmClass?: string;
  confirmVariant?: ButtonVariant;
  onConfirm?: () => void;
  children?: ReactNode;
}
