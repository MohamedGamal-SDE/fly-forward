import { SingleInputFormProps } from '@/models';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/shadcn/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';
import { ZodError } from 'zod';

export function SingleInputForm<T extends FieldValues>(props: SingleInputFormProps<T>) {
  const { schema, defaultValues, onSubmit, name, placeholder, label, onChange, className, setIsInputValid } = props;

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmitClick = (formValues: T) => {
    onSubmit?.(formValues);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const validationResult = schema.safeParse({ [name]: value });

    if (validationResult.success) {
      form.clearErrors(name);
      setIsInputValid(true);
      onChange?.(e);
    } else {
      const zodError = validationResult.error as ZodError<T>;
      const errorMessage = zodError.errors[0]?.message || 'Invalid input';
      setIsInputValid(false);
      form.setError(name, { message: errorMessage });
    }
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
                    handleInputChange(e);
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
