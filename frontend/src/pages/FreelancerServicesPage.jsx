import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useServiceStore } from "../store/useServiceStore";
import DashboardLayout from "../components/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import StarRating from "../components/StarRating";
import { Plus, Edit, Trash2, Package, DollarSign } from "lucide-react";
import toast from "react-hot-toast";

const FreelancerServicesPage = () => {
  const navigate = useNavigate();
  const { myServices, isLoading, fetchMyServices, deleteService } = useServiceStore();

  useEffect(() => {
    loadMyServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMyServices = async () => {
    try {
      await fetchMyServices();
    } catch {
      toast.error("Gagal memuat jasa Anda");
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Hapus jasa "${title}"?`)) {
      try {
        await deleteService(id);
        toast.success("Jasa berhasil dihapus");
      } catch (error) {
        toast.error(error.response?.data?.message || "Gagal menghapus jasa");
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <DashboardLayout>
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Jasa Saya</h1>
            <p className="text-gray-600 mt-2">Kelola semua jasa yang Anda tawarkan</p>
          </div>
          <button
            onClick={() => navigate("/create-service")}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            <Plus className="h-5 w-5" />
            <span>Buat Jasa Baru</span>
          </button>
        </div>

        {myServices.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Belum Ada Jasa</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Mulai tawarkan keahlian Anda dengan membuat jasa pertama. Lebih banyak jasa = lebih banyak peluang!
              </p>
              <button
                onClick={() => navigate("/create-service")}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-linear-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5" />
                <span>Buat Jasa Sekarang</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myServices.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Service Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      {service.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <StarRating rating={service.averageRating || 0} size="sm" showValue={false} />
                      <span className="text-xs text-gray-600">({service.totalReviews || 0})</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{service.title}</h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{service.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-y border-gray-200">
                    <div>
                      <div className="flex items-center space-x-2 text-gray-600 mb-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-xs">Harga Mulai</span>
                      </div>
                      <p className="font-bold text-green-600">{formatCurrency(service.packages.basic.price)}</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 text-gray-600 mb-1">
                        <Package className="h-4 w-4" />
                        <span className="text-xs">Total Order</span>
                      </div>
                      <p className="font-bold text-gray-900">{service.totalOrders || 0}</p>
                    </div>
                  </div>

                  {/* Package Preview */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Paket Tersedia:</p>
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                        Basic: {formatCurrency(service.packages.basic.price)}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        Standard: {formatCurrency(service.packages.standard.price)}
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                        Premium: {formatCurrency(service.packages.premium.price)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/edit-service/${service._id}`)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(service._id, service.title)}
                      className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FreelancerServicesPage;
