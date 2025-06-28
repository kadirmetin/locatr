'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { editProfileMutationFunction } from '@/lib/api/user.api';
import { EditProfileFormValues, editProfileSchema } from '@/lib/schemas/edit-profile-schema';
import { UserType } from '@/lib/types/user.type';

import { useToast } from '@/hooks/use-toast';

interface UserEditFormProps {
  initialData: UserType;
  isLoading?: boolean;
  refetch: () => void;
}

export function EditProfileForm({ initialData, isLoading = false, refetch }: UserEditFormProps) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: editProfileMutationFunction,
  });

  const { toast } = useToast();

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: initialData || {},
    mode: 'onBlur',
  });

  if (!initialData) return null;

  const watchedValues = form.watch();

  const handleFormSubmit = async () => {
    const changedFields: Partial<EditProfileFormValues> = {};

    (Object.keys(watchedValues) as (keyof EditProfileFormValues)[]).forEach((key) => {
      if (watchedValues[key] !== initialData[key]) {
        changedFields[key] = watchedValues[key];
      }
    });

    if (Object.keys(changedFields).length === 0) return;

    try {
      await mutateAsync(changedFields);

      toast({
        title: 'Profile updated successfully!',
      });

      refetch();
    } catch (error) {
      console.error('Profile update failed:', error);

      toast({
        title: `${(error as Error).message}`,
      });
    }
  };

  const renderInput = (
    name: keyof EditProfileFormValues,
    label: string,
    placeholder: string,
    isTextarea = false
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {isTextarea ? (
              <Textarea
                {...field}
                placeholder={placeholder}
                className={fieldState.error ? 'border-red-500' : ''}
              />
            ) : (
              <Input
                {...field}
                placeholder={placeholder}
                className={fieldState.error ? 'border-red-500' : ''}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="w-full space-y-5">
        {renderInput('firstName', 'First Name', 'John')}
        {renderInput('lastName', 'Last Name', 'Doe')}
        {renderInput('bio', 'Bio', 'Tell us about yourself.', true)}

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading || isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
