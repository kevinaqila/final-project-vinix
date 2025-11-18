import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useMessageStore } from "../store/useMessageStore";
import useSidebarState from "../hooks/useSidebarState";
import {
  Menu,
  X,
  Home,
  Search,
  Package,
  ShoppingCart,
  Wallet,
  User,
  LogOut,
  Plus,
  FileText,
  MessageSquare,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser, logout } = useAuthStore();
  const { unreadCount, fetchUnreadCount } = useMessageStore();
  const { isOpen, toggleSidebar } = useSidebarState();

  // Get role from authUser
  const role = authUser?.role || "client";

  useEffect(() => {
    // Fetch unread count when component mounts
    fetchUnreadCount();

    // Poll for new messages every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  // Client menu items
  const clientMenuItems = [
    { icon: Home, label: "Dashboard", path: "/client/dashboard" },
    { icon: Search, label: "Cari Jasa", path: "/services" },
    { icon: ShoppingCart, label: "Pesanan Saya", path: "/client/orders" },
    { icon: MessageSquare, label: "Pesan", path: "/messages", badge: unreadCount > 0 ? unreadCount : null },
  ];

  // Freelancer menu items
  const freelancerMenuItems = [
    { icon: Home, label: "Dashboard", path: "/freelancer/dashboard" },
    { icon: Package, label: "Jasa Saya", path: "/freelancer/services" },
    { icon: Plus, label: "Buat Jasa", path: "/create-service" },
    { icon: FileText, label: "Pesanan", path: "/freelancer/orders" },
    { icon: Wallet, label: "Dompet", path: "/wallet" },
    { icon: MessageSquare, label: "Pesan", path: "/messages", badge: unreadCount > 0 ? unreadCount : null },
  ];

  const menuItems = role === "freelancer" ? freelancerMenuItems : clientMenuItems;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-colors"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={toggleSidebar} />}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-lg z-40 transition-all duration-300 ${
          isOpen ? "w-64" : "w-0 lg:w-20"
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {isOpen && (
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 ml-2 hover:opacity-80 transition-opacity"
              >
                <img src="/images/horizontal-logo.png" alt="FinancePro" className="h-8" />
              </button>
            )}
            <button
              onClick={toggleSidebar}
              className="hidden lg:block p-2 ml-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isOpen ? <X className="h-5 w-5 text-gray-600" /> : <Menu className="h-5 w-5 text-gray-600" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <li key={item.path}>
                    <button
                      onClick={() => {
                        navigate(item.path);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        active ? "bg-green-600 text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                      title={!isOpen ? item.label : ""}
                    >
                      <Icon className={`h-5 w-5 ${isOpen ? "" : "mx-auto"}`} />
                      {isOpen && <span className="flex-1 text-left font-medium">{item.label}</span>}
                      {isOpen && item.badge && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            typeof item.badge === "number" ? "bg-red-600 text-white" : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile & Logout */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={() => {
                navigate("/profile");
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive("/profile") ? "bg-green-600 text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
              title={!isOpen ? "Profile" : ""}
            >
              {isOpen ? (
                <>
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                    {authUser?.profileImage ? (
                      <img
                        src={`${authUser.profileImage}?t=${Date.now()}`}
                        alt={authUser.fullName}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          console.log('Profile image load error:', authUser.profileImage);
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {!authUser?.profileImage && (
                      <div className="h-full w-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm truncate flex-1">{authUser?.fullName}</p>
                        <span
                          className={`shrink-0 px-2 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap ${
                            isActive("/profile") ? "bg-white/20 text-white" : "bg-green-100 text-green-700"
                          }`}
                        >
                          {role === "freelancer" ? "Freelancer" : "Client"}
                        </span>
                      </div>
                      <p className="text-xs opacity-75 truncate">{authUser?.email}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-8 w-8 mx-auto rounded-full overflow-hidden flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
              )}
            </button>

            <button
              onClick={handleLogout}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-2`}
              title={!isOpen ? "Logout" : ""}
            >
              <LogOut className={`h-5 w-5 ${isOpen ? "" : "mx-auto"}`} />
              {isOpen && <span className="font-medium">Keluar</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Spacer for content */}
      <div className={`transition-all duration-300 ${isOpen ? "lg:ml-64" : "lg:ml-20"}`} />
    </>
  );
};

export default Sidebar;
