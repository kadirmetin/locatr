import { GitHubStarButtonProps } from '@/components/ui/github-star';
import { Skeleton } from '@/components/ui/skeleton';

export const GitHubStarButtonSkeleton = ({
  displayStyle,
}: {
  displayStyle: GitHubStarButtonProps['displayStyle'];
}) => (
  <div
    className="
      inline-flex items-center gap-2 px-4 py-2 rounded-full 
      border border-white/20 dark:border-white/10 
      backdrop-blur-sm bg-white/10 dark:bg-black/10
    "
  >
    <Skeleton className="w-4 h-4 rounded" />
    {displayStyle === 'full' && <Skeleton className="w-16 h-4 rounded" />}
  </div>
);
