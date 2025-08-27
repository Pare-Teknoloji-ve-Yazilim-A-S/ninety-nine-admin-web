import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { User } from '@/services/types/user.types';
import { useToast } from './useToast';

interface UseUserProfileReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { error: showErrorToast } = useToast();

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = await authService.getCurrentUser();
      console.log('User profile data from auth/me-v2:', userData);
      setUser(userData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user profile';
      setError(errorMessage);
      showErrorToast(errorMessage);
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  }, [showErrorToast]);

  const refetch = useCallback(async () => {
    await fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return {
    user,
    loading,
    error,
    refetch
  };
};

export default useUserProfile;