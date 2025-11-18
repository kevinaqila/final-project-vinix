import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import FreelancerOnboardingPage from "./pages/FreelancerOnboardingPage";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import CreateServicePage from "./pages/CreateServicePage";
import EditServicePage from "./pages/EditServicePage";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import OrderCheckoutPage from "./pages/OrderCheckoutPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import FreelancerServicesPage from "./pages/FreelancerServicesPage";
import ClientOrdersPage from "./pages/ClientOrdersPage";
import FreelancerOrdersPage from "./pages/FreelancerOrdersPage";
import WalletPage from "./pages/WalletPage";
import ProfilePage from "./pages/ProfilePage";
import PublicProfilePage from "./pages/PublicProfilePage";
import ReviewPage from "./pages/ReviewPage";
import MessagesPage from "./pages/MessagesPage";
import ProtectedRoute, { FreelancerRoute, ClientRoute } from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAuthStore } from "./store/useAuthStore";
import ClientOnboardingPage from "./pages/ClientOnboardingPage";

const App = () => {
  const { checkAuth, authUser } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!authUser && token) {
      checkAuth();
    }
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Dashboard redirect component
  const DashboardRedirect = () => {
    const { authUser } = useAuthStore();

    useEffect(() => {
      if (authUser?.role === "freelancer") {
        navigate("/freelancer/dashboard", { replace: true });
      } else if (authUser?.role === "client") {
        navigate("/client/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }, [authUser]);

    return null;
  };

  return (
    <ErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <div>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route path="/role-selection" element={<RoleSelectionPage />} />

            {/* Client Only Routes */}
            <Route element={<ClientRoute />}>
              <Route path="/client/onboarding" element={<ClientOnboardingPage />} />
              <Route path="/client/dashboard" element={<ClientDashboard />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:id" element={<ServiceDetailPage />} />
              <Route path="/checkout/:id" element={<OrderCheckoutPage />} />
              <Route path="/client/orders" element={<ClientOrdersPage />} />
              <Route path="/review/:serviceId" element={<ReviewPage />} />
            </Route>

            {/* Freelancer Only Routes */}
            <Route element={<FreelancerRoute />}>
              <Route path="/freelancer/onboarding" element={<FreelancerOnboardingPage />} />
              <Route path="/freelancer/dashboard" element={<FreelancerDashboard />} />
              <Route path="/create-service" element={<CreateServicePage />} />
              <Route path="/edit-service/:id" element={<EditServicePage />} />
              <Route path="/freelancer/services" element={<FreelancerServicesPage />} />
              <Route path="/freelancer/orders" element={<FreelancerOrdersPage />} />
              <Route path="/wallet" element={<WalletPage />} />
            </Route>

            {/* Shared Routes */}
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/user/:userId" element={<PublicProfilePage />} />
            <Route path="/messages" element={<MessagesPage />} />
          </Route>
        </Routes>
      </div>
    </ErrorBoundary>
  );
};

export default App;
