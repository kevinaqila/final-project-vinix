import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useServiceStore } from "../store/useServiceStore";
import { useReviewStore } from "../store/useReviewStore";
import DashboardLayout from "../components/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import StarRating from "../components/StarRating";
import { User, Calendar, Briefcase, Star, MessageSquare, Award, Package, MapPin } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const PublicProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { services, fetchServicesByFreelancer } = useServiceStore();
  const { reviews, fetchReviewsByFreelancer } = useReviewStore();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    loadUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/user/profile/${userId}`);
      setUser(res.data);

      // Load services if freelancer
      if (res.data.role === "freelancer") {
        await fetchServicesByFreelancer(userId);
        await fetchReviewsByFreelancer(userId);
      }
    } catch {
      toast.error("Gagal memuat profil");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pengguna tidak ditemukan</h2>
            <button onClick={() => navigate(-1)} className="text-green-600 hover:text-green-700 font-medium">
              Kembali
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  return (
    <DashboardLayout>
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Profile Header */}
        <div className="bg-linear-to-r from-green-600 to-green-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                {user.profileImage ? (
                  <>
                    <img
                      src={`${user.profileImage}?t=${Date.now()}`}
                      alt={user.fullName}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        console.log("Profile image load error:", user.profileImage);
                        e.target.style.display = "none";
                        const fallback = e.target.parentElement.querySelector(".fallback-icon");
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                    <div className="fallback-icon hidden h-full w-full items-center justify-center">
                      <User className="h-12 w-12 text-green-600" />
                    </div>
                  </>
                ) : (
                  <User className="h-12 w-12 text-green-600" />
                )}
              </div>

              {/* Info */}
              <div>
                <h1 className="text-3xl font-bold mb-2">{user.fullName}</h1>
                <div className="flex items-center space-x-4 text-green-100 mb-2">
                  <span className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    {user.role === "freelancer" ? "Freelancer" : "Client"}
                  </span>
                  {user.role === "freelancer" && (
                    <span className="flex items-center leading-none">
                      <Star className="h-4 w-4 mr-2 fill-yellow-400 stroke-yellow-400" />
                      {avgRating.toFixed(1)} ({reviews.length})
                    </span>
                  )}
                </div>
                <p className="text-green-100 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Bergabung {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("about")}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === "about"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <User className="h-5 w-5 inline mr-2" />
              Tentang
            </button>
            {user.role === "freelancer" && (
              <>
                <button
                  onClick={() => setActiveTab("services")}
                  className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                    activeTab === "services"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Package className="h-5 w-5 inline mr-2" />
                  Jasa ({services.length})
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                    activeTab === "reviews"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Star className="h-5 w-5 inline mr-2" />
                  Review ({reviews.length})
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        {activeTab === "about" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info Card */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio Card */}
              {user.bio && (
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Briefcase className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 ml-3">Bio</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                </div>
              )}

              {/* Freelancer Specific Cards */}
              {user.role === "freelancer" && (
                <>
                  {/* Skills Card */}
                  {user.skills && user.skills.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                      <div className="flex items-center mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Award className="h-5 w-5 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 ml-3">Keahlian</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-full hover:bg-green-200 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience Card */}
                  {user.experience && user.experience.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                      <div className="flex items-center mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Briefcase className="h-5 w-5 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 ml-3">Pengalaman</h3>
                      </div>
                      <div className="space-y-4">
                        {user.experience.map((exp, index) => (
                          <div key={index} className="border-l-4 border-green-500 pl-4 py-3 bg-gray-50 rounded-r-lg">
                            <p className="font-semibold text-gray-900">{exp.title}</p>
                            {exp.company && <p className="text-sm text-gray-600 mt-1">{exp.company}</p>}
                            {exp.duration && <p className="text-sm text-green-600 font-medium mt-1">{exp.duration}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Client Specific Cards */}
              {user.role === "client" && (
                <>
                  {/* Business Info Card */}
                  {(user.businessName || user.businessType) && (
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                      <div className="flex items-center mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Package className="h-5 w-5 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 ml-3">Informasi Bisnis</h3>
                      </div>
                      <div className="space-y-3">
                        {user.businessName && (
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <Briefcase className="h-4 w-4 text-gray-400 mr-3" />
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Nama Bisnis</p>
                              <p className="font-medium text-gray-900">{user.businessName}</p>
                            </div>
                          </div>
                        )}
                        {user.businessType && (
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <Package className="h-4 w-4 text-gray-400 mr-3" />
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Tipe Bisnis</p>
                              <p className="font-medium text-gray-900">{user.businessType}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Contact Info Card */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-green-600" />
                  Informasi Kontak
                </h3>
                <div className="space-y-3">
                  {user.address && (
                    <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-4 w-4 text-gray-400 mr-3 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Alamat</p>
                        <p className="font-medium text-gray-900 text-sm">{user.address}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-gray-400 mr-3 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Bergabung</p>
                      <p className="font-medium text-gray-900 text-sm">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education Card (Freelancer only) */}
              {user.role === "freelancer" && user.education && user.education.length > 0 && (
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 ml-3">Pendidikan</h3>
                  </div>
                  <div className="space-y-2">
                    {user.education.map((edu, index) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-600 rounded-full shrink-0 mr-3"></div>
                        <span className="text-sm text-gray-700">{edu}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "services" && user.role === "freelancer" && (
          <div>
            {services.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Jasa</h3>
                <p className="text-gray-600">Freelancer ini belum membuat jasa apapun</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div
                    key={service._id}
                    onClick={() => navigate(`/services/${service._id}`)}
                    className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                  >
                    <div className="p-6">
                      {/* Category Badge */}
                      <div className="flex justify-end mb-3">
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          {service.category}
                        </span>
                      </div>

                      {/* Service Title */}
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-3">
                        {service.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>

                      {/* Rating */}
                      <div className="flex items-center mb-4">
                        <StarRating rating={service.averageRating || 0} size="sm" />
                        <span className="text-sm font-semibold text-gray-700 ml-2">
                          {(service.averageRating || 0).toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">({service.totalReviews || 0})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <span className="text-sm font-medium text-gray-600">Mulai dari</span>
                        <span className="text-xl font-bold text-green-600">
                          {formatCurrency(service.packages.basic.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && user.role === "freelancer" && (
          <div>
            {reviews.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-16 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Belum Ada Review</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Freelancer ini belum menerima review dari klien. Jadilah klien pertama yang menggunakan jasanya!
                  </p>
                  <button
                    onClick={() => navigate("/services")}
                    className="inline-flex items-center px-6 py-3 bg-linear-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Package className="h-5 w-5 mr-2" />
                    Cari Jasa
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                          {review.clientId.profileImage ? (
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
                                <User className="h-5 w-5 text-gray-600" />
                              </div>
                            </>
                          ) : (
                            <User className="h-5 w-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{review.clientId.fullName}</p>
                          <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center">
                        <Package className="h-4 w-4 mr-1" />
                        {review.serviceId.title}
                      </span>
                      {review.response && <span className="text-green-600 font-medium">Dibalas Freelancer</span>}
                    </div>

                    {review.response && (
                      <div className="mt-4 pl-6 border-l-4 border-green-500 bg-green-50 p-4 rounded-r-xl">
                        <p className="text-sm font-bold text-green-700 mb-2">💬 Balasan Freelancer:</p>
                        <p className="text-sm text-gray-700">{review.response.message}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PublicProfilePage;
