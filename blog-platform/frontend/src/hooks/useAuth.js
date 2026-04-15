import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getCurrentUser, refreshToken } from '../redux/slices/authSlice';

export const useAuth = () => {
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for existing token and validate it on app load
    const token = localStorage.getItem('accessToken');
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    // Set up token refresh interval
    const interval = setInterval(() => {
      if (isAuthenticated) {
        dispatch(refreshToken());
      }
    }, 14 * 60 * 1000); // Refresh every 14 minutes (access token expires in 15)

    return () => clearInterval(interval);
  }, [dispatch, isAuthenticated]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
  };
};
