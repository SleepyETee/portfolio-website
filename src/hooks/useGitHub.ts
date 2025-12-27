import { useState, useEffect } from 'react';
import GitHubService, { GitHubUser, GitHubRepo } from '../services/github';

interface GitHubData {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  loading: boolean;
  error: string | null;
}

export const useGitHub = (username: string = 'sleepyetee'): GitHubData => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const githubService = new GitHubService(username);
        const [userData, reposData] = await Promise.all([
          githubService.getUser(),
          githubService.getRepos()
        ]);
        
        setUser(userData);
        setRepos(reposData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch GitHub data');
        console.error('GitHub data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  return { user, repos, loading, error };
};

export default useGitHub;
