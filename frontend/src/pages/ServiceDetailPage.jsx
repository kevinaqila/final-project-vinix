import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useServiceStore } from "../store/useServiceStore";
import { useReviewStore } from "../store/useReviewStore";
import DashboardLayout from "../components/DashboardLayout";
import StarRating from "../components/StarRating";
import LoadingSpinner from "../components/LoadingSpinner";
import { Clock, RefreshCcw, Check, User as UserIcon, Star, Calendar } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedService: service, isLoading, fetchServiceById } = useServiceStore();
  const { reviews, fetchServiceReviews } = useReviewStore();
  const [selectedPackage, setSelectedPackage] = useState("basic");

  useEffect(() => {
    loadServiceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadServiceData = async () => {
    try {
      await fetchServiceById(id);
      await fetchServiceReviews(id);
    } catch {
      // Silent error - will show in UI
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
      month: "long",
      day: "numeric",
    });
  };

  const handleOrderNow = () => {
    navigate(`/checkout/${id}?package=${selectedPackage}`);
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Sidebar role="client" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Jasa tidak ditemukan</h2>
            <button onClick={() => navigate("/services")} className="text-green-600 hover:text-green-700 font-medium">
              Kembali ke pencarian
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const packageData = {
    basic: { label: "Basic", color: "green" },
    standard: { label: "Standard", color: "blue" },
    premium: { label: "Premium", color: "red" },
  };

  return (
    <DashboardLayout>
      <div className="flex-1 bg-linear-to-br from-gray-50 via-white to-green-50">
        {/* Premium Hero Section */}
        <div className="relative bg-linear-to-br from-green-600 via-green-700 to-emerald-800 py-12 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-300 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category and Rating */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full text-sm">
                {service.category}
              </span>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Star className="h-4 w-4 text-yellow-300 fill-current" />
                <span className="text-white font-semibold">{(service.averageRating || 0).toFixed(1)}</span>
                <span className="text-green-100 text-sm">({service.totalReviews || 0} ulasan)</span>
              </div>
            </div>

            {/* Service Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{service.title}</h1>

            {/* Service Description */}
            <p className="text-lg text-green-100 mb-8 max-w-4xl leading-relaxed">{service.description}</p>

            {/* Freelancer Info */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(`/api/user/${service.freelancerId._id}`)}
                className="flex items-center space-x-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-4 rounded-xl transition-all group"
              >
                <div className="h-12 w-12 rounded-xl overflow-hidden bg-gray-200 ring-2 ring-white/30 group-hover:ring-white/50 transition-all">
                  {service.freelancerId?.profileImage ? (
                    <>
                      <img
                        src={`${service.freelancerId.profileImage}?t=${Date.now()}`}
                        alt={service.freelancerId.fullName}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          console.log("Profile image load error:", service.freelancerId.profileImage);
                          e.target.style.display = "none";
                          const fallback = e.target.parentElement.querySelector(".fallback-icon");
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                      <div className="fallback-icon hidden h-full w-full items-center justify-center">
                        <img
                          src="/images/avatar.png"
                          alt={service.freelancerId.fullName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </>
                  ) : (
                    <img
                      src="/images/avatar.png"
                      alt={service.freelancerId.fullName}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-white font-bold text-lg group-hover:text-green-100 transition-colors">
                    {service.freelancerId.fullName}
                  </p>
                  <p className="text-green-100 text-sm">Klik untuk lihat profil lengkap</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Service Description Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">📝 Deskripsi Layanan</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{service.description}</p>
              </div>

              {/* Checklist Section */}
              {(service.clientUploads?.length > 0 || service.freelancerDelivers?.length > 0) && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Detail Proses Kerja</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {service.clientUploads?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <span className="text-blue-600 mr-2">📤</span>
                          Yang Perlu Disediakan Klien
                        </h3>
                        <ul className="space-y-3">
                          {service.clientUploads.map((item, idx) => (
                            <li key={idx} className="flex items-start space-x-3 text-gray-700">
                              <span className="text-blue-600 font-bold mt-1">•</span>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {service.freelancerDelivers?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <span className="text-green-600 mr-2">📋</span>
                          Yang Akan Dikerjakan Freelancer
                        </h3>
                        <ul className="space-y-3">
                          {service.freelancerDelivers.map((item, idx) => (
                            <li key={idx} className="flex items-start space-x-3 text-gray-700">
                              <span className="text-green-600 font-bold mt-1">•</span>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">⭐ Review Pelanggan ({reviews.length})</h2>
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                        <div className="flex items-start space-x-4">
                          <div className="h-12 w-12 rounded-xl overflow-hidden bg-gray-200 shrink-0 shadow-lg">
                            {review.clientId?.profileImage ? (
                              <>
                                <img
                                  src={`${review.clientId.profileImage}?t=${Date.now()}`}
                                  alt={review.clientId.fullName}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    console.log("Profile image load error:", review.clientId.profileImage);
                                    e.target.style.display = "none";
                                    const fallback = e.target.parentElement.querySelector(".fallback-icon");
                                    if (fallback) fallback.style.display = "flex";
                                  }}
                                />
                                <div className="fallback-icon hidden h-full w-full items-center justify-center">
                                  <img
                                    src="/images/avatar.png"
                                    alt={review.clientId.fullName}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              </>
                            ) : (
                              <img
                                src="/images/avatar.png"
                                alt={review.clientId.fullName}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <p className="font-bold text-gray-900 text-lg">{review.clientId.fullName}</p>
                                <StarRating rating={review.rating} size="sm" showValue={false} />
                              </div>
                              <span className="text-sm text-gray-500 flex items-center">
                                <Calendar className="inline h-4 w-4 mr-1" />
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                            {review.response && (
                              <div className="mt-4 pl-6 border-l-4 border-green-500 bg-green-50 p-4 rounded-r-xl">
                                <p className="text-sm font-bold text-green-700 mb-2">💬 Respon Freelancer:</p>
                                <p className="text-sm text-gray-700">{review.response.message}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Belum ada review untuk jasa ini</p>
                )}
              </div>
            </div>

            {/* Sidebar - Package Selection */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Package Selector */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <div className="flex space-x-2 mb-6">
                    {Object.keys(packageData).map((pkg) => {
                      const isSelected = selectedPackage === pkg;
                      const getButtonClass = () => {
                        if (!isSelected) return "bg-gray-100 text-gray-700 hover:bg-gray-200";

                        switch (packageData[pkg].color) {
                          case "green":
                            return "bg-green-600 text-white";
                          case "blue":
                            return "bg-blue-600 text-white";
                          case "red":
                            return "bg-red-600 text-white";
                          default:
                            return "bg-green-600 text-white";
                        }
                      };

                      return (
                        <button
                          key={pkg}
                          onClick={() => setSelectedPackage(pkg)}
                          className={`flex-1 py-2 px-3 rounded-md font-semibold text-sm transition-colors ${getButtonClass()}`}
                        >
                          {packageData[pkg].label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Package Details */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">
                        {formatCurrency(service.packages[selectedPackage].price)}
                      </p>
                      <p className="text-sm text-gray-600 mt-3">{service.packages[selectedPackage].description}</p>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-700 py-3 border-y border-gray-200">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{service.packages[selectedPackage].deliveryTime} hari</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RefreshCcw className="h-4 w-4" />
                        <span>{service.packages[selectedPackage].revisions} revisi</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Yang Termasuk:</h3>
                      <ul className="space-y-2">
                        {service.packages[selectedPackage].features.map((feature, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                            <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={handleOrderNow}
                    className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md"
                  >
                    Pesan Sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ServiceDetailPage;
