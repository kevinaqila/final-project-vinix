import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  ArrowRight,
  CheckCircle2,
  Star,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Award,
  MessageSquare,
  Wallet,
  Menu,
  X,
} from "lucide-react";

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { authUser, isCheckingAuth } = useAuthStore();
  const navigate = useNavigate();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (authUser && !isCheckingAuth) {
      const userRole = authUser.role;
      if (userRole && userRole !== "" && userRole !== null) {
        if (authUser.isProfileComplete) {
          navigate(`/${userRole}/dashboard`, { replace: true });
        } else {
          navigate(`/${userRole}/onboarding`, { replace: true });
        }
      } else {
        navigate("/role-selection", { replace: true });
      }
    }
  }, [authUser, isCheckingAuth, navigate]);

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  // Smooth scroll function
  const smoothScrollTo = (targetId) => {
    const element = document.getElementById(targetId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed navbar height
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  // Handle anchor link clicks
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    smoothScrollTo(targetId);
    setMobileMenuOpen(false); // Close mobile menu after click
  };

  const features = [
    {
      icon: Shield,
      title: "Transaksi Aman",
      description: "Sistem escrow terpercaya melindungi dana Anda di setiap transaksi",
    },
    {
      icon: Users,
      title: "Freelancer Terverifikasi",
      description: "Akses ke ribuan profesional berpengalaman dan tersertifikasi",
    },
    {
      icon: Wallet,
      title: "Dompet Digital Terintegrasi",
      description: "Kelola dana dengan mudah, penarikan cepat, dan biaya minimal",
    },
    {
      icon: MessageSquare,
      title: "Komunikasi Langsung",
      description: "Chat real-time dengan freelancer untuk kolaborasi yang lebih baik",
    },
    {
      icon: TrendingUp,
      title: "Analytics & Reporting",
      description: "Pantau progress proyek dengan dashboard yang informatif",
    },
    {
      icon: Award,
      title: "Rating & Review System",
      description: "Transparansi penuh melalui sistem rating terverifikasi",
    },
  ];

  const benefits = [
    {
      number: "01",
      title: "Untuk Freelancer",
      items: [
        "Dapatkan proyek berkualitas",
        "Pembayaran terjamin & tepat waktu",
        "Bangun portfolio profesional",
        "Tingkatkan penghasilan",
      ],
    },
    {
      number: "02",
      title: "Untuk Klien",
      items: ["Temukan talenta terbaik", "Kualitas kerja terjamin", "Hemat biaya operasional", "Skalabilitas bisnis"],
    },
    {
      number: "03",
      title: "Untuk Semua",
      items: ["Keamanan data terjaga", "Support 24/7 responsif", "Transaksi transparan", "Komunitas aktif"],
    },
  ];

  const testimonials = [
    {
      name: "Budi Santoso",
      role: "Freelancer - Web Developer",
      image: "👨‍💻",
      text: "Plafforma terbaik yang pernah saya gunakan! Pembayaran selalu tepat waktu dan klien sangat profesional.",
      rating: 5,
    },
    {
      name: "Siti Nurhaliza",
      role: "Klien - CEO Startup",
      image: "👩‍💼",
      text: "Sangat mudah menemukan developer berkualitas. Proses pembayaran aman dan transparan. Highly recommended!",
      rating: 5,
    },
    {
      name: "Ahmad Wijaya",
      role: "Freelancer - Graphic Designer",
      image: "🎨",
      text: "Dashboard mereka sangat user-friendly. Saya bisa fokus mengerjakan proyek tanpa khawatir pembayaran.",
      rating: 5,
    },
  ];

  const stats = [
    { label: "Pengguna Aktif", value: "10,000+" },
    { label: "Proyek Selesai", value: "50,000+" },
    { label: "Total Transaksi", value: "$5M+" },
    { label: "Kepuasan Klien", value: "98%" },
  ];

  return (
    <div className="bg-white" style={{ scrollBehavior: "smooth" }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img
              src="/images/horizontal-logo.png"
              alt="FinancePro"
              className="h-10 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              onClick={(e) => handleNavClick(e, "features")}
              className="text-gray-600 hover:text-gray-900 transition cursor-pointer"
            >
              Fitur
            </a>
            <a
              href="#benefits"
              onClick={(e) => handleNavClick(e, "benefits")}
              className="text-gray-600 hover:text-gray-900 transition cursor-pointer"
            >
              Manfaat
            </a>
            <a
              href="#testimonials"
              onClick={(e) => handleNavClick(e, "testimonials")}
              className="text-gray-600 hover:text-gray-900 transition cursor-pointer"
            >
              Testimoni
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium transition">
              Masuk
            </Link>
            <Link
              to="/signup"
              className="bg-linear-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Daftar Gratis
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-4">
              <a
                href="#features"
                onClick={(e) => handleNavClick(e, "features")}
                className="block text-gray-600 hover:text-gray-900 transition cursor-pointer py-2"
              >
                Fitur
              </a>
              <a
                href="#benefits"
                onClick={(e) => handleNavClick(e, "benefits")}
                className="block text-gray-600 hover:text-gray-900 transition cursor-pointer py-2"
              >
                Manfaat
              </a>
              <a
                href="#testimonials"
                onClick={(e) => handleNavClick(e, "testimonials")}
                className="block text-gray-600 hover:text-gray-900 transition cursor-pointer py-2"
              >
                Testimoni
              </a>
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <Link
                  to="/login"
                  className="block text-gray-600 hover:text-gray-900 font-medium transition py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Masuk
                </Link>
                <Link
                  to="/signup"
                  className="block bg-linear-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold text-center hover:from-green-700 hover:to-emerald-700 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Daftar Gratis
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-slate-50 via-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                🚀 Platform Terdepan di Indonesia
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Temukan Talenta Terbaik,
                <span className="text-transparent bg-clip-text bg-linear-to-r from-green-600 to-emerald-600">
                  {" "}
                  Wujudkan Visi
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Platform freelancing terpercaya dengan sistem pembayaran aman, komunitas profesional, dan dukungan penuh
                untuk kesuksesan Anda.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center bg-linear-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-2xl shadow-green-500/50 transform hover:-translate-y-1"
              >
                Mulai Sekarang Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-900 hover:text-white transition-all transform hover:-translate-y-1"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
              {stats.map((stat, idx) => (
                <div key={idx}>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative h-96 lg:h-full">
              <div className="absolute inset-0 bg-linear-to-r from-green-400/20 to-blue-400/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-linear-to-br from-green-600 via-emerald-600 to-teal-700 rounded-3xl p-8 text-white shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold">Sistem Pembayaran Aman</p>
                      <p className="text-sm text-green-100">Escrow terintegrasi untuk keamanan maksimal</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold">Komunitas Profesional</p>
                      <p className="text-sm text-green-100">10,000+ freelancer terverifikasi</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Zap className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold">Proses Cepat</p>
                      <p className="text-sm text-green-100">Dari posting hingga pembayaran dalam hitungan hari</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Globe className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold">Jangkauan Global</p>
                      <p className="text-sm text-green-100">Bekerjasama dengan klien dari seluruh dunia</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Fitur Unggulan Kami</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk sukses di satu platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="p-8 bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 hover:border-green-500 hover:shadow-xl transition-all transform hover:-translate-y-2"
                >
                  <div className="h-12 w-12 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-slate-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Manfaat untuk Semua</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Baik Anda freelancer atau klien, kami punya solusinya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-200"
              >
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-green-600 to-emerald-600 mb-4">
                  {benefit.number}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{benefit.title}</h3>
                <ul className="space-y-4">
                  {benefit.items.map((item, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Apa Kata Mereka?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ribuan pengguna puas sudah membuktikan kualitas platform kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 hover:border-green-500 transition-all"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{testimonial.image}</div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-green-600 via-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Siap Memulai Perjalanan Anda?</h2>
          <p className="text-xl text-green-50 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan freelancer dan klien yang telah merasakan manfaatnya
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl transform hover:-translate-y-1"
            >
              Daftar sebagai Freelancer
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all transform hover:-translate-y-1"
            >
              Daftar sebagai Klien
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src="/images/vertical-logo.png" alt="FinancePro" className="h-8 mb-4" />
              <p className="text-sm">Platform freelancing terpercaya di Indonesia</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Produk</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Untuk Freelancer
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Untuk Klien
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Harga
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Karir
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 FinancePro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
