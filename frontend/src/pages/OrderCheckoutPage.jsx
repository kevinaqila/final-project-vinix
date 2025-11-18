import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useServiceStore } from "../store/useServiceStore";
import { useOrderStore } from "../store/useOrderStore";
import DashboardLayout from "../components/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { Clock, RefreshCcw, Check, AlertCircle, CreditCard, Wallet as WalletIcon } from "lucide-react";
import toast from "react-hot-toast";

const OrderCheckoutPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { selectedService: service, isLoading: loading, fetchServiceById } = useServiceStore();
  const { createOrder } = useOrderStore();
  const [submitting, setSubmitting] = useState(false);
  const [requirements, setRequirements] = useState("");

  const packageType = searchParams.get("package") || "basic";

  useEffect(() => {
    loadService();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadService = async () => {
    try {
      await fetchServiceById(id);
    } catch {
      toast.error("Gagal memuat data jasa");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmitOrder = async () => {
    if (!requirements.trim()) {
      toast.error("Silakan isi detail deskripsi Anda");
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder({
        serviceId: id,
        packageType,
        requirements,
      });

      toast.success("Order berhasil dibuat! Pembayaran otomatis terproses.");

      // Add small delay to ensure order is fully saved before navigation
      setTimeout(() => {
        if (order && order.order && order.order._id) {
          navigate(`/orders/${order.order._id}`);
        } else {
          toast.error("Terjadi kesalahan, silakan coba lagi");
        }
      }, 500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal membuat order");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (!service) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Jasa tidak ditemukan</h2>
            <button onClick={() => navigate("/services")} className="text-green-600 hover:text-green-700 font-medium">
              Kembali ke pencarian
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const selectedPackage = service.packages[packageType];
  const platformFee = selectedPackage.price * 0.1;
  const totalAmount = selectedPackage.price + platformFee;

  const packageLabels = {
    basic: { label: "Basic", color: "green" },
    standard: { label: "Standard", color: "blue" },
    premium: { label: "Premium", color: "red" },
  };

  return (
    <DashboardLayout>
      <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Konfirmasi Pesanan</h1>
          <p className="text-gray-600 mt-2">Review pesanan Anda dan lanjutkan pembayaran</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Info */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Detail Jasa</h2>

              <div className="flex items-start space-x-4 mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{service.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">oleh {service.freelancerId.fullName}</p>

                  <div className="inline-block">
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        packageType === "basic"
                          ? "bg-green-100 text-green-700"
                          : packageType === "standard"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      Paket {packageLabels[packageType].label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Harga Paket</span>
                  <span className="font-semibold">{formatCurrency(selectedPackage.price)}</span>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{selectedPackage.deliveryTime} hari pengerjaan</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RefreshCcw className="h-4 w-4" />
                    <span>{selectedPackage.revisions} revisi</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="font-semibold text-gray-900 mb-2 text-sm">Yang Termasuk:</p>
                  <ul className="space-y-1">
                    {selectedPackage.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                        <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Deskripsi</h2>
              <p className="text-sm text-gray-600 mb-4">
                Jelaskan kebutuhan Anda secara detail agar freelancer dapat memahami dengan baik.
              </p>

              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Contoh: Saya membutuhkan analisis laporan keuangan untuk Q1 2024 dengan fokus pada arus kas dan profitabilitas. Format yang diinginkan adalah Excel dengan visualisasi grafik..."
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-2">Minimum 20 karakter</p>
            </div>

            {/* Payment Info Note */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Tentang Pembayaran Escrow</p>
                  <p>
                    Dana Anda akan diamankan dalam sistem escrow dan hanya akan diteruskan ke freelancer setelah Anda
                    menyetujui hasil pekerjaan. Ini melindungi kedua belah pihak.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Pesanan</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Harga Paket</span>
                  <span className="font-semibold">{formatCurrency(selectedPackage.price)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Biaya Platform (10%)</span>
                  <span className="font-semibold">{formatCurrency(platformFee)}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-green-600">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              {/* Payment Method Selection (UI Only) */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Metode Pembayaran</h3>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border-2 border-green-600 bg-green-50 rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="wallet"
                      defaultChecked
                      className="h-4 w-4 text-green-600 focus:ring-green-500"
                    />
                    <div className="ml-3 flex items-center">
                      <WalletIcon className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium text-gray-900">FinancePro Wallet</span>
                    </div>
                  </label>

                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="bank"
                      disabled
                      className="h-4 w-4 text-green-600 focus:ring-green-500"
                    />
                    <div className="ml-3 flex items-center">
                      <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-500">Transfer Bank (Coming Soon)</span>
                    </div>
                  </label>
                </div>
              </div>

              <button
                onClick={handleSubmitOrder}
                disabled={submitting || !requirements.trim()}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? "Memproses..." : "Konfirmasi & Bayar"}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Dengan melanjutkan, Anda menyetujui{" "}
                <a href="#" className="text-green-600 hover:underline">
                  Syarat & Ketentuan
                </a>{" "}
                kami
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrderCheckoutPage;
