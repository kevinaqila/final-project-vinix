import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useServiceStore } from "../store/useServiceStore";
import { useOrderStore } from "../store/useOrderStore";
import DashboardLayout from "../components/DashboardLayout";
import { Plus, FileText, DollarSign, TrendingUp, Package, Star, Clock, CheckCircle } from "lucide-react";

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { myServices, fetchMyServices } = useServiceStore();
  const { orders, fetchMyOrders } = useOrderStore();

  useEffect(() => {
    fetchMyServices();
    fetchMyOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate real stats
  const activeServices = myServices.length;
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const inProgressOrders = orders.filter((o) => o.status === "in-progress").length;

  // Calculate total earnings from completed orders
  const earnings = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, order) => sum + (order.freelancerEarnings || 0), 0);

  // Get average rating from all services
  const totalRatings = myServices.reduce((sum, service) => sum + (service.averageRating || 0), 0);
  const averageRating = myServices.length > 0 ? (totalRatings / myServices.length).toFixed(1) : 0;

  // Recent orders (last 5)
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Menunggu";
      case "in-progress":
        return "Sedang Dikerjakan";
      case "completed":
        return "Selesai";
      default:
        return status;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="flex-1 bg-linear-to-br from-gray-50 via-white to-green-50">
        {/* Premium Header */}
        <div className="bg-linear-to-r from-green-600 via-green-700 to-emerald-800 py-8 shadow-xl relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-300 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Selamat Datang, {authUser?.fullName}!</h2>
                <p className="text-green-100 text-base">Kelola jasa dan pesanan Anda dengan mudah</p>
              </div>
              <button
                onClick={() => navigate("/create-service")}
                className="inline-flex items-center px-6 py-3 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-2xl hover:shadow-white/50 transform hover:scale-105"
              >
                <Plus className="h-5 w-5 mr-2" />
                Buat Jasa Baru
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {/* Premium Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-20">
            <div className="group bg-linear-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all transform hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <Package className="h-10 w-10 text-white" />
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-white font-bold text-sm">Aktif</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{activeServices}</p>
              <p className="text-blue-100 font-medium">Jasa Aktif</p>
            </div>

            <div className="group bg-linear-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all transform hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <FileText className="h-10 w-10 text-white" />
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-white font-bold text-sm">Total</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{totalOrders}</p>
              <p className="text-purple-100 font-medium">Total Pesanan</p>
            </div>

            <div className="group bg-linear-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl shadow-2xl shadow-emerald-500/50 hover:shadow-emerald-500/70 transition-all transform hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="h-10 w-10 text-white" />
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-white font-bold text-sm">Rp</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{formatCurrency(earnings)}</p>
              <p className="text-emerald-100 font-medium">Total Pendapatan</p>
            </div>

            <div className="group bg-linear-to-br from-amber-500 to-amber-600 p-6 rounded-2xl shadow-2xl shadow-amber-500/50 hover:shadow-amber-500/70 transition-all transform hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <Star className="h-10 w-10 text-white fill-current" />
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-white font-bold text-sm">Avg</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{averageRating}</p>
              <p className="text-amber-100 font-medium">Rating Rata-rata</p>
            </div>
          </div>

          {/* Order Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors">
                  <Clock className="h-7 w-7 text-blue-600" />
                </div>
                <div className="bg-blue-50 px-3 py-1 rounded-full">
                  <span className="text-blue-700 font-bold text-sm">Pending</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{pendingOrders}</p>
              <p className="text-gray-600 font-medium">Menunggu Konfirmasi</p>
            </div>

            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border-l-4 border-amber-500">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-amber-100 p-3 rounded-xl group-hover:bg-amber-200 transition-colors">
                  <TrendingUp className="h-7 w-7 text-amber-600" />
                </div>
                <div className="bg-amber-50 px-3 py-1 rounded-full">
                  <span className="text-amber-700 font-bold text-sm">Active</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{inProgressOrders}</p>
              <p className="text-gray-600 font-medium">Sedang Dikerjakan</p>
            </div>

            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border-l-4 border-emerald-500">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-emerald-100 p-3 rounded-xl group-hover:bg-emerald-200 transition-colors">
                  <CheckCircle className="h-7 w-7 text-emerald-600" />
                </div>
                <div className="bg-emerald-50 px-3 py-1 rounded-full">
                  <span className="text-emerald-700 font-bold text-sm">Done</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{completedOrders}</p>
              <p className="text-gray-600 font-medium">Selesai</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-linear-to-r from-green-600 to-green-700 px-6 py-5">
              <h3 className="text-xl font-bold text-white">Pesanan Terbaru</h3>
              <p className="text-green-100 mt-1">Kelola pesanan yang baru masuk</p>
            </div>
            <div className="divide-y divide-gray-200">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="px-6 py-5 hover:bg-green-50 cursor-pointer transition-all group"
                    onClick={() => navigate(`/orders/${order._id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">
                          {order.serviceId?.title || "Service"}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <span className="font-medium text-gray-700">Klien:</span>
                            <span className="ml-2">{order.clientId?.fullName || "Unknown"}</span>
                          </span>
                          <span className="flex items-center">
                            <span className="font-medium text-gray-700">Tanggal:</span>
                            <span className="ml-2">{new Date(order.createdAt).toLocaleDateString("id-ID")}</span>
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-6">
                        <p className="text-xl font-bold bg-linear-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-3">
                          {formatCurrency(order.packageDetails?.price || order.escrowAmount || 0)}
                        </p>
                        <span
                          className={`inline-block px-3 py-1 rounded-xl text-sm font-bold shadow-md ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium text-base">Belum ada pesanan</p>
                  <p className="text-gray-400 text-sm mt-2">Pesanan baru akan muncul di sini</p>
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-center">
              <button
                onClick={() => navigate("/freelancer/orders")}
                className="inline-flex items-center text-green-600 hover:text-green-700 font-bold text-base transition-colors"
              >
                Lihat Semua Pesanan
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FreelancerDashboard;
