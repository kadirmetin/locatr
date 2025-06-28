'use client';

import { ReactNode, useRef } from 'react';

import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import { uploadAvatarMutationFunction } from '@/lib/api/user.api';
import { cn } from '@/lib/utils/cn';
import { toBase64 } from '@/lib/utils/toBase64';

import { useToast } from '@/hooks/use-toast';

interface UploaderProps {
  children: ReactNode;
  refetch?: () => void;
}

const MAX_FILE_SIZE = 40 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const Uploader = ({ children, refetch }: UploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: uploadAvatarMutationFunction,
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Only JPEG, PNG, and WebP images are allowed.',
        variant: 'destructive',
      });
      event.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File size is too large',
        description: 'The maximum file size is 4MB.',
        variant: 'destructive',
      });
      event.target.value = '';
      return;
    }

    try {
      const base64 = await toBase64(file);
      await mutateAsync(base64 as string);

      toast({ title: 'Avatar changed successfully' });
      refetch?.();
    } catch (error) {
      console.error(error);

      toast({
        title: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      event.target.value = '';
    }
  };

  const handleClick = () => {
    if (!isPending) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn('relative', isPending ? 'cursor-not-allowed opacity-70' : 'cursor-pointer')}
    >
      {children}

      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
        </div>
      )}

      <input
        type="file"
        accept="image/jpeg, image/png, image/webp"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        disabled={isPending}
      />
    </div>
  );
};

export default Uploader;
