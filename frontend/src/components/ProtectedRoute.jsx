import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Loader } from "lucide-react";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Check auth on mount/refresh without navigation
    if (!authUser && !isCheckingAuth) {
      checkAuth(null, false); // false = don't navigate, just verify token
    }
  }, []); // Only run once on mount

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

// Role-based route protection
export const FreelancerRoute = () => {
  const { authUser, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (authUser.role !== "freelancer") {
    return <Navigate to="/client/dashboard" replace />;
  }
  const isDashboardRoute = location.pathname.includes("/dashboard");
  if (isDashboardRoute && !authUser.isProfileComplete) {
    return <Navigate to="/freelancer/onboarding" replace />;
  }

  return <Outlet />;
};

export const ClientRoute = () => {
  const { authUser, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (authUser.role !== "client") {
    return <Navigate to="/freelancer/dashboard" replace />;
  }

  const isDashboardRoute = location.pathname.includes("/dashboard");
  if (isDashboardRoute && !authUser.isProfileComplete) {
    return <Navigate to="/client/onboarding" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
