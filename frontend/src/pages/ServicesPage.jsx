import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useServiceStore } from "../store/useServiceStore";
import DashboardLayout from "../components/DashboardLayout";
import ServiceCardSkeleton from "../components/skeletons/ServiceCardSkeleton";
import StarRating from "../components/StarRating";
import { Search, Filter, Package } from "lucide-react";

const ServicesPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { services, isLoading, fetchServices } = useServiceStore();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");

  const categories = [
    "Semua",
    "Laporan Keuangan",
    "Konsultasi Pajak & Pembukuan",
    "Audit Internal",
    "Penyusunan Anggaran & Cashflow",
    "Lainnya",
  ];

  useEffect(() => {
    loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const loadServices = async () => {
    try {
      const filters = {};
      if (searchParams.get("search")) filters.search = searchParams.get("search");
      if (searchParams.get("category") && searchParams.get("category") !== "Semua") {
        filters.category = searchParams.get("category");
      }

      await fetchServices(filters);
    } catch {
      // Silent error
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchParams.set("search", searchQuery);
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category && category !== "Semua") {
      searchParams.set("category", category);
    } else {
      searchParams.delete("category");
    }
    setSearchParams(searchParams);
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
        {/* Premium Search Header */}
        <div className="bg-linear-to-br from-green-600 via-green-700 to-emerald-800 py-10 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-3">Temukan Jasa Keuangan Terbaik</h1>
              <p className="text-green-100 text-lg">
                Lebih dari {services.length} freelancer profesional siap membantu bisnis Anda
              </p>
            </div>

            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="flex space-x-3">
                <div className="flex-1 relative group">
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="Cari jasa keuangan yang Anda butuhkan..."
                    className="w-full pl-14 pr-6 py-4 border-0 rounded-xl shadow-2xl focus:outline-none bg-white focus:ring-4 focus:ring-green-300 text-lg transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-2xl hover:shadow-green-300 transform hover:scale-105"
                >
                  Cari
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Pills */}
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Filter className="h-5 w-5 text-green-600 shrink-0" />
                <h2 className="text-lg font-bold text-gray-900">Kategori</h2>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium sm:font-semibold text-sm sm:text-base transition-all transform hover:scale-105 whitespace-nowrap shrink-0 ${
                    selectedCategory === category || (!selectedCategory && category === "Semua")
                      ? "bg-linear-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/50"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900">{searchParams.get("category") || "Semua Jasa"}</h2>
            <p className="text-gray-600 mt-2 text-lg">
              <span className="font-semibold text-green-600">{services.length}</span> Jasa profesional tersedia
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ServiceCardSkeleton key={i} />
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Belum Ada Jasa Tersedia</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Saat ini belum ada freelancer yang menawarkan jasa di kategori ini. Jadilah yang pertama dengan
                  membuat jasa Anda!
                </p>
                <button
                  onClick={() => navigate("/role-selection")}
                  className="inline-flex items-center px-6 py-3 bg-linear-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Package className="h-5 w-5 mr-2" />
                  Mulai Jadi Freelancer
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {services.map((service) => (
                <div
                  key={service._id}
                  onClick={() => navigate(`/services/${service._id}`)}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-green-500/20 border border-gray-100 transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-2"
                >
                  <div className="p-6">
                    {/* Category Badge - Top Right */}
                    <div className="flex justify-end mb-4">
                      <span className="px-3 py-1 bg-linear-to-r from-green-500 to-green-600 text-white text-xs font-bold rounded-lg shadow-md">
                        {service.category}
                      </span>
                    </div>

                    {/* Freelancer Info */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 shadow-md ring-2 ring-gray-100">
                        {service.freelancerId?.profileImage ? (
                          <img
                            src={`http://localhost:5050${service.freelancerId.profileImage}`}
                            alt={service.freelancerId?.fullName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <img
                            src="/images/avatar.png"
                            alt={service.freelancerId?.fullName}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-700 group-hover:text-green-600 transition-colors truncate">
                          {service.freelancerId?.fullName}
                        </p>
                        <p className="text-xs text-gray-500">Professional Freelancer</p>
                      </div>
                    </div>

                    {/* Service Title */}
                    <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 h-12 group-hover:text-green-600 transition-colors leading-tight">
                      {service.title}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <StarRating rating={service.averageRating || 0} size="sm" />
                        <span className="text-sm font-semibold text-gray-700 ml-2">
                          {(service.averageRating || 0).toFixed(1)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">({service.totalReviews || 0})</span>
                    </div>

                    {/* Price */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Mulai dari</span>
                        <span className="text-xl font-bold bg-linear-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                          {formatCurrency(service.packages.basic.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ServicesPage;
