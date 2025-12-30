import { useState, useEffect } from 'react';
import GitHubService, { GitHubUser, GitHubRepo } from '../services/github';

interface GitHubData {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  loading: boolean;
  error: string | null;
}

interface CachedData {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  timestamp: number;
}

const CACHE_KEY = 'github_data_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const clearGitHubCache = (username: string = 'sleepyetee'): void => {
  try {
    localStorage.removeItem(`${CACHE_KEY}_${username}`);
  } catch {
    // Silently fail if localStorage is not available
  }
};

const getCache = (username: string): CachedData | null => {
  try {
    const cached = localStorage.getItem(`${CACHE_KEY}_${username}`);
    if (!cached) return null;
    
    const data: CachedData = JSON.parse(cached);
    const isExpired = Date.now() - data.timestamp > CACHE_DURATION;
    
    if (isExpired) {
      localStorage.removeItem(`${CACHE_KEY}_${username}`);
      return null;
    }
    
    return data;
  } catch {
    return null;
  }
};

const setCache = (username: string, user: GitHubUser | null, repos: GitHubRepo[]): void => {
  try {
    const data: CachedData = {
      user,
      repos,
      timestamp: Date.now()
    };
    localStorage.setItem(`${CACHE_KEY}_${username}`, JSON.stringify(data));
  } catch {
    // Silently fail if localStorage is not available
  }
};

export const useGitHub = (username: string = 'sleepyetee'): GitHubData => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Check cache first
      const cached = getCache(username);
      if (cached) {
        setUser(cached.user);
        setRepos(cached.repos);
        setLoading(false);
        return;
      }

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
        
        // Cache the results
        setCache(username, userData, reposData);
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
