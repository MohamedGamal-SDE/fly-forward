import { Dispatch, ReactNode, SetStateAction } from 'react';
import { DefaultValues, Path } from 'react-hook-form';
import { ZodSchema } from 'zod';

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

export interface SingleInputFormProps<T> {
  // form: UseFormReturn<T, unknown>;
  schema: ZodSchema<T>;
  name: Path<T>;
  placeholder?: string;
  label?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (data: T) => void;
  className?: string;
  defaultValues?: DefaultValues<T>;
  setIsInputValid: Dispatch<SetStateAction<boolean>>;
}
