import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { Search, FileText, DollarSign, MessageSquare, Briefcase, ShoppingCart, Clock, CheckCircle } from "lucide-react";
import { useOrderStore } from "../store/useOrderStore";
import StatsCard from "../components/StatsCard";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { orders, fetchMyOrders } = useOrderStore();

  useEffect(() => {
    fetchMyOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate real stats
  const totalOrders = orders.length;
  const activeOrders = orders.filter((o) => o.status === "in-progress" || o.status === "pending").length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;

  const categories = [
    { name: "Laporan Keuangan", icon: FileText, count: 125 },
    { name: "Konsultasi Pajak & Pembukuan", icon: DollarSign, count: 156 },
    { name: "Audit Internal", icon: FileText, count: 78 },
    { name: "Penyusunan Anggaran & Cashflow", icon: MessageSquare, count: 45 },
    { name: "Lainnya", icon: Briefcase, count: 67 },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/services?category=${encodeURIComponent(category)}`);
  };

  return (
    <DashboardLayout>
      {/* Hero Section with Search - Premium Banner Image */}
      <section
        className="relative bg-cover bg-center bg-no-repeat text-white py-20 overflow-hidden"
        style={{ backgroundImage: "url('/images/banner.jpg')" }}
      >
        {/* Dark Overlay for Better Text Readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 drop-shadow-lg animate-fade-in">
              Temukan Freelancer Keuangan Terbaik
            </h2>
            <p className="text-lg text-green-100 drop-shadow-md">
              Ribuan profesional siap membantu bisnis Anda berkembang
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="flex shadow-2xl rounded-xl overflow-hidden">
              <div className="flex-1 relative group">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Cari jasa... (Contoh: SPT Tahunan, Pembukuan)"
                  className="w-full pl-14 pr-6 py-5 text-gray-900 focus:outline-none focus:ring-4 focus:ring-green-300 bg-white text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="px-10 py-5 bg-gray-800 hover:bg-gray-900 text-white font-bold transition-all transform hover:scale-105"
              >
                Cari
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Total Pesanan */}
          <div className="group bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all transform hover:-translate-y-2 cursor-pointer">
            <div className="flex items-center justify-between mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl group-hover:bg-white/30 transition-all">
                <ShoppingCart className="h-8 w-8" />
              </div>
              <span className="text-sm font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">Total</span>
            </div>
            <p className="text-4xl font-bold mb-2">{totalOrders}</p>
            <p className="text-blue-100 text-base font-medium">Total Pesanan</p>
          </div>

          {/* Sedang Berjalan */}
          <div className="group bg-linear-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/70 transition-all transform hover:-translate-y-2 cursor-pointer">
            <div className="flex items-center justify-between mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl group-hover:bg-white/30 transition-all">
                <Clock className="h-8 w-8" />
              </div>
              <span className="text-sm font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">Aktif</span>
            </div>
            <p className="text-4xl font-bold mb-2">{activeOrders}</p>
            <p className="text-yellow-100 text-base font-medium">Sedang Berjalan</p>
          </div>

          {/* Selesai */}
          <div className="group bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-2xl shadow-green-500/50 hover:shadow-green-500/70 transition-all transform hover:-translate-y-2 cursor-pointer">
            <div className="flex items-center justify-between mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl group-hover:bg-white/30 transition-all">
                <CheckCircle className="h-8 w-8" />
              </div>
              <span className="text-sm font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">Done</span>
            </div>
            <p className="text-4xl font-bold mb-2">{completedOrders}</p>
            <p className="text-green-100 text-base font-medium">Selesai</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">Kategori Populer</h3>
        <p className="text-gray-600 mb-8">Temukan layanan yang Anda butuhkan</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className="group bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl hover:border-green-500 transition-all text-left transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-green-50 p-3 rounded-xl group-hover:bg-green-100 transition-colors">
                  <category.icon className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {category.count}+
                </span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                {category.name}
              </h4>
              <p className="text-sm text-gray-600">Freelancer tersedia</p>
            </button>
          ))}
        </div>

        {/* Platform Stats */}
        <div className="bg-linear-to-br from-slate-50 via-blue-50 to-green-50 rounded-2xl p-8 border border-gray-200 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-10 text-center">Kenapa Memilih FinancePro?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-linear-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg shadow-green-500/30 inline-block mb-4 transform group-hover:scale-110 transition-all">
                <Briefcase className="h-12 w-12 text-white mx-auto" />
              </div>
              <h4 className="text-3xl font-bold bg-linear-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">
                500+
              </h4>
              <p className="text-gray-700 font-semibold text-base">Freelancer Terpercaya</p>
            </div>
            <div className="text-center group">
              <div className="bg-linear-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-500/30 inline-block mb-4 transform group-hover:scale-110 transition-all">
                <FileText className="h-12 w-12 text-white mx-auto" />
              </div>
              <h4 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">
                2,500+
              </h4>
              <p className="text-gray-700 font-semibold text-base">Proyek Selesai</p>
            </div>
            <div className="text-center group">
              <div className="bg-linear-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-500/30 inline-block mb-4 transform group-hover:scale-110 transition-all">
                <DollarSign className="h-12 w-12 text-white mx-auto" />
              </div>
              <h4 className="text-3xl font-bold bg-linear-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent mb-2">
                100%
              </h4>
              <p className="text-gray-700 font-semibold text-base">Pembayaran Aman</p>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default ClientDashboard;
