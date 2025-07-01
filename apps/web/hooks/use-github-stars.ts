'use client';

import { useQuery } from '@tanstack/react-query';

import { fetchStarsQueryFunction, GitHubRepo } from '@/lib/api/github.api';

export const useGitHubStars = (owner: string, repo: string) => {
  const { data, isLoading, isError, error } = useQuery<GitHubRepo, Error>({
    queryKey: ['github-stars', owner, repo],
    queryFn: () => fetchStarsQueryFunction(owner, repo),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!owner && !!repo,
  });

  return {
    stars: data?.stargazers_count || null,
    loading: isLoading,
    error: isError ? error.message : null,
  };
};
