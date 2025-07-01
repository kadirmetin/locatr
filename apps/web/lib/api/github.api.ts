import axios from 'axios';

export interface GitHubRepo {
  stargazers_count: number;
}

export const fetchStarsQueryFunction = async (owner: string, repo: string): Promise<GitHubRepo> => {
  const response = await axios.get<GitHubRepo>(`https://api.github.com/repos/${owner}/${repo}`);
  return response.data;
};
