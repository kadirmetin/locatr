'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { GB, TR } from 'country-flag-icons/react/3x2';
import { Info } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import {
  type ChangeLanguageFormValues,
  changeLanguageSchema,
} from '@/lib/schemas/change-language-schema';

interface ChangeLanguageSectionProps {
  initialLanguage?: string;
}

const languages = [
  {
    label: 'English',
    value: 'en',
    icon: <GB title="English" className="h-6 w-8 rounded shadow-sm" />,
  },
  {
    label: 'Turkish',
    value: 'tr',
    icon: <TR title="Turkish" className="h-6 w-8 rounded shadow-sm" />,
  },
];

const ChangeLanguageSection = ({ initialLanguage = 'en' }: ChangeLanguageSectionProps) => {
  const form = useForm<ChangeLanguageFormValues>({
    resolver: zodResolver(changeLanguageSchema),
    defaultValues: {
      language: initialLanguage,
    },
    mode: 'onChange',
  });

  const { isDirty } = form.formState;

  const onSubmit = () => {
    // TODO: add language change feat
  };

  return (
    <Card className="mx-auto h-full w-full">
      <CardHeader>
        <CardTitle>Change Language</CardTitle>
        <CardDescription>Choose your preferred application language.</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex flex-col justify-center space-y-2"
                  >
                    {languages.map(({ label, value, icon }) => (
                      <FormItem key={value} className="flex items-center space-x-3 cursor-pointer">
                        <RadioGroupItem id={value} value={value} />
                        <FormLabel
                          htmlFor={value}
                          className="flex cursor-pointer items-center gap-2"
                        >
                          {icon}
                          <span>{label}</span>
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="flex justify-end p-0">
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="submit" disabled={!isDirty}>
                    Save Changes
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="gap-4">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    <span className="font-semibold">Feature in development</span>
                  </div>
                  <p className="text-sm leading-snug">
                    We&apos;re working on Turkish language support. This feature will be available
                    in the next update.
                  </p>
                </PopoverContent>
              </Popover>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ChangeLanguageSection;
