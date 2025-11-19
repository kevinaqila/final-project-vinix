import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  Loader,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  FileText,
  Clock,
  DollarSign,
} from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (authUser) {
      // Only redirect if user is on the root path "/"
      // Don't redirect if they're already on a specific page
      if (location.pathname === "/") {
        // If user hasn't selected a role yet, redirect to role selection
        if (!authUser.role) {
          navigate("/role-selection");
        }
        // If user is a client, redirect to client dashboard
        else if (authUser.role === "client") {
          if (authUser.isProfileComplete) {
            navigate("/client/dashboard");
          } else {
            navigate("/client/onboarding");
          }
        }
        // If user is a freelancer, redirect to freelancer dashboard
        else if (authUser.role === "freelancer") {
          // Check if profile is complete
          if (authUser.isProfileComplete) {
            navigate("/freelancer/dashboard");
          } else {
            navigate("/freelancer/onboarding");
          }
        }
      }
    }
  }, [authUser, navigate, location.pathname]);

  // If user is authenticated and on root path, show loading while redirecting
  if (authUser && location.pathname === "/") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  // If user is not authenticated, show premium landing page
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-green-50 to-blue-50">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-linear-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                  FinancePro
                </h1>
                <p className="text-xs text-gray-600">Professional Finance Services</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2.5 text-gray-700 font-semibold hover:text-green-600 transition-colors"
              >
                Masuk
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-6 py-2.5 bg-linear-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Daftar Gratis
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 rounded-full border border-green-200">
                <Star className="h-4 w-4 text-green-600 fill-green-600" />
                <span className="text-sm font-semibold text-green-700">Platform Terpercaya #1 Indonesia</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Temukan Ahli
                <span className="block bg-linear-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                  Keuangan Profesional
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Hubungkan bisnis Anda dengan freelancer akuntansi dan keuangan terbaik. Dari pembukuan hingga konsultasi
                pajak, semua dalam satu platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/signup")}
                  className="group px-8 py-4 bg-linear-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-2xl hover:shadow-green-500/50 transform hover:scale-105"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>Mulai Sekarang</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button
                  onClick={() => navigate("/services")}
                  className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl border-2 border-gray-300 hover:border-green-600 hover:text-green-600 transition-all shadow-lg hover:shadow-xl"
                >
                  Jelajahi Jasa
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                <div>
                  <p className="text-3xl font-bold text-gray-900">500+</p>
                  <p className="text-sm text-gray-600">Freelancer Ahli</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">1000+</p>
                  <p className="text-sm text-gray-600">Project Selesai</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">4.9/5</p>
                  <p className="text-sm text-gray-600">Rating Rata-rata</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Floating Cards */}
                <div className="absolute -top-8 -right-8 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 transform rotate-3 hover:rotate-0 transition-transform">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Laporan Keuangan</p>
                      <p className="font-bold text-gray-900">Rp 500.000</p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-32 -left-8 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 transform -rotate-3 hover:rotate-0 transition-transform">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Konsultasi Pajak</p>
                      <p className="font-bold text-gray-900">Rp 750.000</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-8 right-16 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 transform rotate-6 hover:rotate-0 transition-transform">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pembukuan Bulanan</p>
                      <p className="font-bold text-gray-900">Rp 1.200.000</p>
                    </div>
                  </div>
                </div>

                {/* Main Card */}
                <div className="bg-linear-to-br from-green-600 to-green-800 rounded-3xl shadow-2xl p-12 text-white">
                  <h3 className="text-2xl font-bold mb-4">Raih Kesuksesan Finansial</h3>
                  <p className="text-green-100 mb-6">Bergabung dengan ribuan bisnis yang telah mempercayai kami</p>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-2 font-semibold">5.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -z-10 opacity-20">
          <div className="h-96 w-96 bg-green-600 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 -z-10 opacity-20">
          <div className="h-96 w-96 bg-blue-600 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Mengapa Memilih FinancePro?</h2>
            <p className="text-xl text-gray-600">Platform lengkap untuk semua kebutuhan finansial bisnis Anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Aman & Terpercaya",
                description: "Sistem escrow melindungi dana Anda hingga pekerjaan selesai",
                color: "green",
              },
              {
                icon: Zap,
                title: "Proses Cepat",
                description: "Temukan freelancer dalam hitungan menit, selesaikan project tepat waktu",
                color: "yellow",
              },
              {
                icon: Users,
                title: "Ahli Terverifikasi",
                description: "Semua freelancer telah melalui proses verifikasi ketat",
                color: "blue",
              },
              {
                icon: Award,
                title: "Kualitas Terjamin",
                description: "Review transparan dan rating dari client sebelumnya",
                color: "purple",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-linear-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 hover:border-green-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div
                  className={`h-14 w-14 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`h-7 w-7 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-linear-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Layanan Populer</h2>
            <p className="text-xl text-gray-600">Jasa keuangan terbaik untuk mengembangkan bisnis Anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Laporan Keuangan",
                description: "Laporan keuangan lengkap sesuai standar akuntansi",
                price: "Mulai Rp 500.000",
                popular: false,
              },
              {
                title: "Konsultasi Pajak & Pembukuan",
                description: "Konsultasi perpajakan dan pembukuan untuk kepatuhan bisnis",
                price: "Mulai Rp 750.000",
                popular: true,
              },
              {
                title: "Audit Internal",
                description: "Audit internal untuk memastikan kepatuhan dan efisiensi",
                price: "Mulai Rp 1.500.000",
                popular: false,
              },
              {
                title: "Penyusunan Anggaran & Cashflow",
                description: "Perencanaan anggaran dan proyeksi cashflow bisnis",
                price: "Mulai Rp 1.000.000",
                popular: false,
              },
            ].map((service, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                  service.popular ? "border-2 border-green-500 scale-105" : "border border-gray-200"
                }`}
              >
                {service.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-linear-to-r from-green-600 to-green-700 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg">
                      Paling Populer
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                <p className="text-3xl font-bold text-green-600 mb-6">{service.price}</p>
                <button
                  onClick={() => navigate("/services")}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    service.popular
                      ? "bg-linear-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Lihat Detail
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-linear-to-r from-green-600 to-green-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Siap Mengembangkan Bisnis Anda?</h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan bisnis yang telah mempercayai FinancePro untuk kebutuhan keuangan mereka
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/signup")}
                className="group px-10 py-4 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-2xl transform hover:scale-105"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Daftar Sebagai Client</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-10 py-4 bg-green-700 text-white font-bold rounded-xl border-2 border-white hover:bg-green-600 transition-all shadow-2xl"
              >
                Daftar Sebagai Freelancer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 bg-linear-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">FinancePro</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Platform terpercaya untuk menghubungkan bisnis dengan profesional keuangan terbaik di Indonesia.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Laporan Keuangan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Konsultasi Pajak & Pembukuan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Audit Internal
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Penyusunan Anggaran & Cashflow
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Perusahaan</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Karir
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    Kontak
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">© 2025 FinancePro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
