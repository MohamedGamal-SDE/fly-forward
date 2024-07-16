import { SingleInputFormProps } from '@/models';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/shadcn/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';

export function SingleInputForm<T extends FieldValues>(props: SingleInputFormProps<T>) {
  const { schema, defaultValues, onSubmit, name, placeholder, label, onChange, className } = props;

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmitClick = (formValues: T) => {
    onSubmit?.(formValues);
  };

  if (!form) return;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitClick)} className={`w-full ${className}`}>
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              {label && <FormLabel>{label}</FormLabel>}
              <FormControl>
                <Input
                  placeholder={placeholder}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    onChange?.(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
