import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

/**
 * Hook to handle automatic redirects based on authentication state
 */
export const useAuthRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const redirectToDashboard = () => {
    if (user) {
      const dashboardPath = user.role === 'client' ? '/dashboard/client' : '/dashboard/provider';
      navigate(dashboardPath, { replace: true });
    }
  };

  const redirectToLogin = () => {
    navigate('/login', { replace: true });
  };

  return {
    redirectToDashboard,
    redirectToLogin,
    user,
    loading
  };
};

/**
 * Component that redirects users to their appropriate dashboard
 */
export const DashboardRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      const dashboardPath = user.role === 'client' ? '/dashboard/client' : '/dashboard/provider';
      navigate(dashboardPath, { replace: true });
    } else if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return null;
};

/**
 * Get the appropriate dashboard path for a user
 */
export const getDashboardPath = (user) => {
  if (!user) return '/login';
  return user.role === 'client' ? '/dashboard/client' : '/dashboard/provider';
};

/**
 * Get the appropriate home path based on auth status
 */
export const getHomePath = (user) => {
  if (user) {
    return getDashboardPath(user);
  }
  return '/';
};
