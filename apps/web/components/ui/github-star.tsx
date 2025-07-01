'use client';

import Link from 'next/link';

import { Star } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils/cn';

import { useGitHubStars } from '@/hooks/use-github-stars';

import { GitHubStarButtonSkeleton } from '../landing/skeletons/GitHubStarButtonSkeleton';

export interface GitHubStarButtonProps {
  owner: string;
  repo: string;
  variant?: 'default' | 'ghost' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  displayStyle?: 'full' | 'logo-only';
}

const formatStarCount = (count: number): string => {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`;
  return count.toLocaleString();
};

const getDisplayText = (
  stars: number,
  error: boolean,
  displayStyle: 'full' | 'logo-only'
): string => {
  if (error) return displayStyle === 'full' ? 'Star on GitHub' : '';
  const starCount = formatStarCount(stars || 0);
  return displayStyle === 'full' ? `${starCount} stars on GitHub` : '';
};

export const GitHubStarButton = ({
  owner,
  repo,
  variant = 'default',
  size = 'default',
  className = '',
  displayStyle = 'full',
}: GitHubStarButtonProps) => {
  const { stars, loading, error } = useGitHubStars(owner, repo);
  const repoUrl = `https://github.com/${owner}/${repo}`;

  if (loading) {
    return <GitHubStarButtonSkeleton displayStyle={displayStyle} />;
  }

  return (
    <Link href={repoUrl} target="_blank" rel="noopener noreferrer">
      <Button
        variant={variant}
        size={size}
        className={cn(
          'group relative overflow-hidden rounded-full border border-white/20 dark:border-white/10',
          'transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg',
          'w-fit justify-center',
          className
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <div className="flex items-center gap-2 relative z-10">
          <Star className="h-4 w-4 transition-all duration-200 group-hover:scale-110 group-hover:rotate-12 group-hover:fill-yellow-400 group-hover:text-yellow-400" />
          {displayStyle !== 'logo-only' && (
            <span className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
              {getDisplayText(stars || 0, !!error, displayStyle)}
            </span>
          )}
        </div>
      </Button>
    </Link>
  );
};
