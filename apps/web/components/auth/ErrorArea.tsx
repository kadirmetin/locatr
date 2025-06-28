import { useMemo } from 'react';

import { AlertTriangle } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

export interface CustomError extends Error {
  message: string;
  errors?: {
    field: string;
    message: string;
  }[];
  data?: {
    message?: string;
    errorCode?: string;
    errors?: string[];
  };
}

interface ErrorAreaProps {
  error?: CustomError;
  className?: string;
}

export function ErrorArea({ error, className }: ErrorAreaProps) {
  const errorMessage = useMemo(() => {
    if (!error) return null;

    return (
      error.data?.message ||
      error.message ||
      error.errors?.map((err) => err.message).join(', ') ||
      error.data?.errors?.join(', ') ||
      'An error occurred'
    );
  }, [error]);

  if (!errorMessage) return null;

  return (
    <div
      className={cn(
        'flex items-center space-x-2 rounded-md border p-4 text-sm',
        'border-red-500 bg-red-50 text-red-600',
        'dark:border-red-700 dark:bg-red-900 dark:text-red-300',
        className
      )}
    >
      <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-500 dark:text-red-300" />
      <span>{errorMessage}</span>
    </div>
  );
}
