import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "../store/useOrderStore";
import DashboardLayout from "../components/DashboardLayout";
import OrderCardSkeleton from "../components/skeletons/OrderCardSkeleton";
import { Clock, CheckCircle2, Package, AlertCircle, XCircle, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";

const FreelancerOrdersPage = () => {
  const navigate = useNavigate();
  const { orders, isLoading: loading, fetchMyOrders, acceptOrder } = useOrderStore();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOrders = async () => {
    try {
      await fetchMyOrders();
    } catch {
      toast.error("Gagal memuat pesanan");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleAcceptOrder = async (orderId, e) => {
    e.stopPropagation();
    try {
      await acceptOrder(orderId);
      toast.success("Pesanan berhasil diterima! Mulai kerjakan sekarang.");
      navigate(`/orders/${orderId}`);
    } catch {
      toast.error("Gagal menerima pesanan. Silakan coba lagi.");
    }
  };

  const statusConfig = {
    pending: { icon: Clock, color: "yellow", label: "Menunggu", bg: "bg-yellow-100", text: "text-yellow-700" },
    "in-progress": { icon: Package, color: "blue", label: "Dikerjakan", bg: "bg-blue-100", text: "text-blue-700" },
    submitted: { icon: CheckCircle2, color: "green", label: "Review", bg: "bg-green-100", text: "text-green-700" },
    "revision-requested": {
      icon: RefreshCcw,
      color: "orange",
      label: "Revisi",
      bg: "bg-orange-100",
      text: "text-orange-700",
    },
    completed: { icon: CheckCircle2, color: "green", label: "Selesai", bg: "bg-green-100", text: "text-green-700" },
    cancelled: { icon: XCircle, color: "red", label: "Batal", bg: "bg-red-100", text: "text-red-700" },
  };

  const filteredOrders = filter === "all" ? orders : orders.filter((order) => order.status === filter);

  return (
    <DashboardLayout>
      <div className="flex-1 bg-linear-to-br from-gray-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full -mt-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <OrderCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              {/* Premium Filter Tabs */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 mt-6 mb-8 p-6">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                      filter === "all"
                        ? "bg-linear-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/50"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Semua ({orders.length})
                  </button>
                  <button
                    onClick={() => setFilter("pending")}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                      filter === "pending"
                        ? "bg-linear-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/50"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Menunggu ({orders.filter((o) => o.status === "pending").length})
                  </button>
                  <button
                    onClick={() => setFilter("in-progress")}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                      filter === "in-progress"
                        ? "bg-linear-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/50"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Dikerjakan ({orders.filter((o) => o.status === "in-progress").length})
                  </button>
                  <button
                    onClick={() => setFilter("submitted")}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                      filter === "submitted"
                        ? "bg-linear-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/50"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Review ({orders.filter((o) => o.status === "submitted").length})
                  </button>
                  <button
                    onClick={() => setFilter("revision-requested")}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                      filter === "revision-requested"
                        ? "bg-linear-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/50"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Revisi ({orders.filter((o) => o.status === "revision-requested").length})
                  </button>
                  <button
                    onClick={() => setFilter("completed")}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                      filter === "completed"
                        ? "bg-linear-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/50"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Selesai ({orders.filter((o) => o.status === "completed").length})
                  </button>
                </div>
              </div>

              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-16 text-center">
                  <AlertCircle className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Tidak Ada Pesanan</h2>
                  <p className="text-gray-600 text-lg">
                    {filter === "all"
                      ? "Belum ada client yang memesan jasa Anda"
                      : `Tidak ada pesanan dengan status ${statusConfig[filter]?.label.toLowerCase()}`}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredOrders.map((order) => {
                    const status = statusConfig[order.status];
                    const StatusIcon = status.icon;

                    return (
                      <div
                        key={order._id}
                        className="group bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-2xl hover:shadow-green-500/20 transition-all cursor-pointer transform hover:-translate-y-1"
                        onClick={() => navigate(`/orders/${order._id}`)}
                      >
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                                {order.serviceId.title}
                              </h3>
                              <div
                                className={`flex items-center space-x-2 px-4 py-2 ${status.bg} ${status.text} rounded-xl shadow-md`}
                              >
                                <StatusIcon className="h-5 w-5" />
                                <span className="text-sm font-bold">{status.label}</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <p className="text-sm text-gray-600">
                                <span className="font-semibold text-gray-700">Client:</span>{" "}
                                <span className="text-gray-900">{order.clientId.fullName}</span>
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-semibold text-gray-700">Paket:</span>{" "}
                                <span className="capitalize text-gray-900">{order.packageType}</span>
                              </p>
                            </div>
                          </div>

                          <div className="text-right ml-8">
                            <p className="text-sm font-medium text-gray-500 mb-2">Penghasilan Anda</p>
                            <p className="text-3xl font-bold bg-linear-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">
                              {formatCurrency(order.freelancerEarnings)}
                            </p>
                            <p className="text-sm text-gray-500 font-medium">{formatDate(order.createdAt)}</p>
                          </div>
                        </div>

                        <div className="bg-linear-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
                          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                            <span className="font-bold text-gray-900">Deskripsi Client: </span>
                            {order.requirements}
                          </p>
                        </div>

                        {order.status === "pending" && (
                          <div className="mt-6">
                            <button
                              onClick={(e) => handleAcceptOrder(order._id, e)}
                              className="w-full py-4 bg-linear-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-green-500/50 transition-all transform hover:scale-105"
                            >
                              Terima & Mulai Kerjakan
                            </button>
                          </div>
                        )}

                        {(order.status === "in-progress" || order.status === "revision-requested") && (
                          <div className="mt-6">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/orders/${order._id}`);
                              }}
                              className="w-full py-4 bg-linear-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-green-500/50 transition-all transform hover:scale-105"
                            >
                              📤 Upload Hasil Pekerjaan
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FreelancerOrdersPage;
