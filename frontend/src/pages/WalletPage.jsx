import { useState, useEffect } from "react";
import { useWalletStore } from "../store/useWalletStore";
import DashboardLayout from "../components/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmModal from "../components/ConfirmModal";
import {
  Wallet as WalletIcon,
  ArrowDownToLine,
  Clock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  XCircle,
  History,
} from "lucide-react";
import toast from "react-hot-toast";

const WalletPage = () => {
  const {
    walletBalance,
    pendingWithdrawal,
    availableBalance,
    withdrawalHistory,
    isLoading,
    isSubmitting,
    fetchWalletBalance,
    fetchWithdrawalHistory,
    requestWithdrawal,
    cancelWithdrawal,
  } = useWalletStore();

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });
  const [activeTab, setActiveTab] = useState("withdraw");

  useEffect(() => {
    loadWalletData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadWalletData = async () => {
    await fetchWalletBalance();
    await fetchWithdrawalHistory();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeUntilAutoComplete = (autoCompleteAt) => {
    if (!autoCompleteAt) return null;

    const now = new Date();
    const autoCompleteTime = new Date(autoCompleteAt);
    const diffMs = autoCompleteTime - now;

    if (diffMs <= 0) return "Sedang diproses...";

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);

    if (diffHours > 0) {
      return `Sedang diproses dalam ${diffHours} jam ${diffMins % 60} menit`;
    } else if (diffMins > 0) {
      return `Sedang diproses dalam ${diffMins} menit`;
    } else {
      return "Sedang diproses dalam beberapa detik";
    }
  };

  const ADMIN_FEE = 7000;

  const calculateEstimate = () => {
    const amount = parseInt(withdrawAmount) || 0;
    const totalDeduction = amount + ADMIN_FEE;
    const remainingBalance = availableBalance - totalDeduction;
    return {
      amount,
      totalDeduction,
      remainingBalance: Math.max(0, remainingBalance),
    };
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();

    const amount = parseInt(withdrawAmount);

    if (!amount || amount <= 0) {
      toast.error("Masukkan jumlah yang valid");
      return;
    }

    if (amount < 100000) {
      toast.error("Minimal penarikan Rp 100.000");
      return;
    }

    if (amount + ADMIN_FEE > availableBalance) {
      toast.error(`Saldo tidak mencukupi. Diperlukan Rp ${amount + ADMIN_FEE} (termasuk biaya admin Rp ${ADMIN_FEE})`);
      return;
    }

    if (!bankName || !accountNumber || !accountName) {
      toast.error("Lengkapi informasi rekening");
      return;
    }

    try {
      await requestWithdrawal({
        amount,
        bankName,
        accountNumber,
        accountName,
      });

      // Reset form
      setWithdrawAmount("");
      setBankName("");
      setAccountNumber("");
      setAccountName("");
    } catch {
      // Error handled in store
    }
  };

  const handleCancelWithdrawal = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Batalkan Penarikan",
      message: "Apakah Anda yakin ingin membatalkan permintaan penarikan ini? Dana akan dikembalikan ke saldo Anda.",
      confirmText: "Ya, Batalkan",
      cancelText: "Tidak",
      confirmColor: "red",
      onConfirm: async () => {
        try {
          await cancelWithdrawal(id);
          await loadWalletData(); // Refresh data setelah cancel
        } catch {
          // Error handled in store
        }
      },
    });
  };

  const statusConfig = {
    pending: { icon: Clock, label: "Menunggu", color: "yellow", bg: "bg-yellow-100", text: "text-yellow-700" },
    processing: { icon: Clock, label: "Diproses", color: "blue", bg: "bg-blue-100", text: "text-blue-700" },
    completed: { icon: CheckCircle2, label: "Selesai", color: "green", bg: "bg-green-100", text: "text-green-700" },
    rejected: { icon: XCircle, label: "Ditolak", color: "red", bg: "bg-red-100", text: "text-red-700" },
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <DashboardLayout>
      <div className="flex-1 bg-linear-to-br from-gray-50 via-white to-green-50">
        {/* Balance Cards - Moved to top */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Available Balance Card */}
            <div className="bg-linear-to-br from-green-600 via-green-700 to-emerald-700 rounded-2xl shadow-2xl shadow-green-500/50 p-8 text-white transform hover:-translate-y-2 transition-all">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <WalletIcon className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm opacity-90 font-medium">Saldo Tersedia</p>
                  <p className="text-4xl font-bold">{formatCurrency(availableBalance)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm opacity-90 bg-white/10 rounded-xl px-4 py-2">
                <span className="font-bold">Aktif & Aman</span>
              </div>
            </div>

            {/* Pending Withdrawal */}
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-yellow-100 p-8 transform hover:-translate-y-2 transition-all">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-14 w-14 bg-linear-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-yellow-600 font-bold">Dalam Proses</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(pendingWithdrawal)}</p>
                </div>
              </div>
              <p className="text-xs text-yellow-600 mt-3 font-medium">Penarikan yang sedang diproses</p>
            </div>

            {/* Total Balance */}
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-100 p-8 transform hover:-translate-y-2 transition-all">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-14 w-14 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <DollarSign className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-bold">Total Saldo</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(walletBalance)}</p>
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-3 font-medium">Total saldo di wallet (termasuk pending)</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("withdraw")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "withdraw"
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ArrowDownToLine className="h-5 w-5" />
                    <span>Tarik Dana</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "history"
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <History className="h-5 w-5" />
                    <span>Riwayat Penarikan</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "withdraw" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Withdrawal Form */}
              <div className="bg-white rounded-2xl shadow-2xl border-2 border-green-100 p-8">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <ArrowDownToLine className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Tarik Dana</h2>
                </div>

                <form onSubmit={handleWithdraw} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">Jumlah Penarikan</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rp</span>
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        onWheel={(e) => e.target.blur()} // Prevent scroll from changing value
                        placeholder="0"
                        className="w-full pl-12 pr-4 py-4 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-500 text-gray-900 font-bold text-lg placeholder-gray-400 bg-green-50/50 transition-all"
                      />
                    </div>
                    <p className="text-xs text-green-600 mt-2 font-medium">Minimal Rp 100.000</p>
                  </div>

                  {/* Estimation Box */}
                  {withdrawAmount && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                      <p className="text-xs font-bold text-blue-600 mb-3">📊 ESTIMASI SISA SALDO</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Saldo Tersedia:</span>
                          <span className="text-sm font-bold text-gray-900">{formatCurrency(availableBalance)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Jumlah Tarik:</span>
                          <span className="text-sm font-bold text-red-600">
                            - {formatCurrency(calculateEstimate().amount)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Biaya Admin:</span>
                          <span className="text-sm font-bold text-red-600">- {formatCurrency(ADMIN_FEE)}</span>
                        </div>
                        <div className="border-t border-blue-200 pt-2 mt-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-bold text-gray-900">Sisa Saldo:</span>
                            <span className="text-sm font-bold text-blue-600">
                              {formatCurrency(calculateEstimate().remainingBalance)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t-2 border-green-100">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                      <span>🏦</span> Informasi Rekening
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Nama Bank</label>
                        <select
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-500 bg-green-50/50 text-gray-900 font-medium transition-all"
                        >
                          <option value="">Pilih Bank</option>
                          <option value="BCA">BCA</option>
                          <option value="Mandiri">Mandiri</option>
                          <option value="BNI">BNI</option>
                          <option value="BRI">BRI</option>
                          <option value="CIMB">CIMB Niaga</option>
                          <option value="Permata">Permata</option>
                          <option value="Danamon">Danamon</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Nomor Rekening</label>
                        <input
                          type="text"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          placeholder="1234567890"
                          className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-500 bg-green-50/50 text-gray-900 font-medium placeholder-gray-400 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Nama Pemilik Rekening</label>
                        <input
                          type="text"
                          value={accountName}
                          onChange={(e) => setAccountName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-500 bg-green-50/50 text-gray-900 font-medium placeholder-gray-400 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-linear-to-r from-green-600 via-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-2xl shadow-green-500/50 hover:shadow-green-500/70 transform hover:-translate-y-1 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                  >
                    {isSubmitting ? "Memproses..." : "Ajukan Penarikan"}
                  </button>

                  <p className="text-xs text-green-600 text-center font-medium">
                    Dana akan diproses dalam waktu kurang dari 5 menit
                  </p>
                </form>
              </div>

              {/* Info Box */}
              <div className="bg-linear-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 shadow-lg">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="p-3 bg-blue-600 rounded-xl">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900">Informasi Penting</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-600 font-bold mt-1">✓</span>
                    <div>
                      <p className="font-semibold text-gray-900">Minimal Penarikan</p>
                      <p className="text-sm text-gray-600">Rp 100.000 per transaksi</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="text-blue-600 font-bold mt-1">✓</span>
                    <div>
                      <p className="font-semibold text-gray-900">Auto-Complete</p>
                      <p className="text-sm text-gray-600">Penarikan otomatis selesai dalam 5 menit (testing)</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="text-blue-600 font-bold mt-1">✓</span>
                    <div>
                      <p className="font-semibold text-gray-900">Waktu Proses</p>
                      <p className="text-sm text-gray-600">Auto-complete dalam 5 menit, atau manual 1-3 hari</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="text-blue-600 font-bold mt-1">✓</span>
                    <div>
                      <p className="font-semibold text-gray-900">Keamanan Data</p>
                      <p className="text-sm text-gray-600">Informasi rekening terenkripsi</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-sm text-yellow-800 font-medium mb-2">
                    ⚠️ <strong>Perhatian:</strong>
                  </p>
                  <p className="text-sm text-yellow-800 mb-2">
                    Biaya admin Rp 7.000 akan langsung dipotong dari saldo Anda saat mengajukan penarikan.
                  </p>
                  <p className="text-sm text-yellow-800">
                    Penarikan akan otomatis selesai dalam 5 menit tanpa perlu persetujuan manual.
                  </p>
                </div>

                <div className="mt-4 p-4 bg-blue-100 rounded-xl">
                  <p className="text-sm text-blue-800 font-medium">
                    💡 <strong>Tips:</strong> Pastikan data rekening bank Anda akurat untuk menghindari penundaan proses
                    penarikan.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* History Tab */
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-6 border-2 border-green-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Berhasil</p>
                      <p className="text-xl font-bold text-green-600">
                        {withdrawalHistory.filter((item) => item.status === "completed").length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border-2 border-yellow-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Diproses</p>
                      <p className="text-xl font-bold text-yellow-600">
                        {
                          withdrawalHistory.filter((item) => item.status === "pending" || item.status === "processing")
                            .length
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border-2 border-red-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ditolak</p>
                      <p className="text-xl font-bold text-red-600">
                        {withdrawalHistory.filter((item) => item.status === "rejected").length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Withdrawal History */}
              <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <History className="h-6 w-6 text-purple-600" />
                  </div>
                  Riwayat Penarikan Lengkap
                </h2>

                {withdrawalHistory.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="p-6 bg-gray-100 rounded-3xl inline-block mb-4">
                      <AlertCircle className="h-16 w-16 text-gray-400 mx-auto" />
                    </div>
                    <p className="text-gray-600 font-medium text-lg">Belum ada riwayat penarikan</p>
                    <p className="text-sm text-gray-500 mt-2">Riwayat penarikan akan muncul di sini</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {withdrawalHistory.map((item) => {
                      const status = statusConfig[item.status];
                      const StatusIcon = status.icon;

                      return (
                        <div
                          key={item._id}
                          className="flex items-start justify-between p-6 bg-linear-to-r from-gray-50 to-gray-100 rounded-2xl hover:from-gray-100 hover:to-gray-200 transition-all border-2 border-gray-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          <div className="flex items-start space-x-4 flex-1">
                            <div
                              className={`h-10 w-10 ${status.bg} rounded-full flex items-center justify-center shrink-0`}
                            >
                              <StatusIcon className={`h-5 w-5 ${status.text}`} />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="font-semibold text-gray-900">#{item._id.slice(-8)}</p>
                                <span
                                  className={`px-2 py-0.5 ${status.bg} ${status.text} text-xs font-semibold rounded-full`}
                                >
                                  {status.label}
                                </span>
                              </div>

                              <p className="text-sm text-gray-600 mb-1">
                                {item.bankName} - {item.accountNumber}
                              </p>

                              <p className="text-xs text-gray-500">{formatDateTime(item.createdAt)}</p>

                              {item.status === "pending" && item.autoCompleteAt && (
                                <p className="text-xs text-blue-600 font-medium mt-1">
                                  ⏰ {getTimeUntilAutoComplete(item.autoCompleteAt)}
                                </p>
                              )}

                              {item.isAutoCompleted && (
                                <p className="text-xs text-green-600 font-medium mt-1">
                                  ✅ Auto-completed pada {formatDateTime(item.processedAt)}
                                </p>
                              )}

                              {item.notes && <p className="text-xs text-gray-500 mt-1 italic">Catatan: {item.notes}</p>}
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">{formatCurrency(item.amount)}</p>
                            {item.status === "pending" && (
                              <button
                                onClick={() => handleCancelWithdrawal(item._id)}
                                className="text-xs text-red-600 hover:text-red-700 mt-2"
                              >
                                Batalkan
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>{" "}
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        confirmColor={confirmModal.confirmColor}
      />
    </DashboardLayout>
  );
};

export default WalletPage;
