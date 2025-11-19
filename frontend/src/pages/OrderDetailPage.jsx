import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useOrderStore } from "../store/useOrderStore";
import { useMessageStore } from "../store/useMessageStore";
import DashboardLayout from "../components/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmModal from "../components/ConfirmModal";
import InputModal from "../components/InputModal";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Package,
  Upload,
  Download,
  Send,
  FileText,
  RefreshCcw,
  Loader,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const {
    selectedOrder: order,
    isLoading: loading,
    fetchOrderById,
    acceptOrder,
    submitWork,
    requestRevision,
    approveOrder,
    uploadOrderFiles,
  } = useOrderStore();

  const { messages, fetchMessages, sendMessage, isSending } = useMessageStore();

  // Validate order ID
  useEffect(() => {
    if (!id || id === "undefined") {
      toast.error("ID pesanan tidak valid");
      navigate(-1);
      return;
    }
  }, [id, navigate]);

  const [actionLoading, setActionLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    loadOrderDetail();
    loadMessages();

    // Smart polling: only poll if not typing and not sending
    const interval = setInterval(() => {
      // Only poll if user is not actively typing and not sending
      if (!isTyping && !isSending) {
        loadMessages();
      }
    }, 5000); // Increased to 5 seconds

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    // Only auto-scroll if user hasn't scrolled up
    if (!userScrolledUp) {
      // Use instant scroll without animation to prevent jump
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }
  }, [messages, userScrolledUp]);

  // Detect user scroll
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100; // 100px threshold

      setUserScrolledUp(!isNearBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const loadOrderDetail = async () => {
    try {
      await fetchOrderById(id);
    } catch {
      toast.error("Gagal memuat detail order");
    }
  };

  const loadMessages = async () => {
    try {
      await fetchMessages(id, false);
    } catch {
      // Silent error for polling
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAcceptOrder = async () => {
    setActionLoading(true);
    try {
      await acceptOrder(id);
      toast.success("Order diterima! Silakan mulai mengerjakan.");
      await loadOrderDetail();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menerima order");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitWork = async () => {
    if (files.length === 0) {
      toast.error("Silakan upload file terlebih dahulu");
      return;
    }

    setUploading(true);
    try {
      await uploadOrderFiles(id, files);

      if (isFreelancer) {
        await submitWork(id);
        toast.success("Pekerjaan berhasil disubmit!");
      } else {
        toast.success("File berhasil diupload!");
      }

      setFiles([]);
      await loadOrderDetail();
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Gagal upload file";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const handleRequestRevision = async (reason) => {
    setActionLoading(true);
    try {
      await requestRevision(id, { message: reason });
      toast.success("Revisi diminta");
      await loadOrderDetail();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal meminta revisi");
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveOrder = async () => {
    setActionLoading(true);
    try {
      await approveOrder(id);
      toast.success("Order selesai! Dana telah diteruskan ke freelancer.");
      await loadOrderDetail();

      // Navigate to review page
      navigate(`/review/${order.serviceId._id}?orderId=${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menyetujui order");
    } finally {
      setActionLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Lock scroll position at bottom before sending
    const container = messagesContainerRef.current;
    const wasAtBottom = container && container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    try {
      await sendMessage(id, { message: message.trim() });
      setMessage("");

      // If was at bottom, stay at bottom
      if (wasAtBottom) {
        setUserScrolledUp(false);
        setTimeout(() => {
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        }, 0);
      }
    } catch {
      toast.error("Gagal mengirim pesan");
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);

    // Set typing state
    setIsTyping(true);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000); // Stop typing after 1 second of no input
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (!order) {
    return (
      <DashboardLayout hideSidebar={true}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order tidak ditemukan</h2>
            <button onClick={() => navigate(-1)} className="text-green-600 hover:text-green-700 font-medium">
              Kembali
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isClient = authUser._id === order.clientId._id;
  const isFreelancer = authUser._id === order.freelancerId._id;

  // Status configuration
  const statusConfig = {
    pending: { icon: Clock, color: "yellow", label: "Menunggu Konfirmasi" },
    "in-progress": { icon: Package, color: "blue", label: "Sedang Dikerjakan" },
    submitted: { icon: CheckCircle2, color: "green", label: "Menunggu Review" },
    "revision-requested": { icon: RefreshCcw, color: "orange", label: "Revisi Diminta" },
    completed: { icon: CheckCircle2, color: "green", label: "Selesai" },
    cancelled: { icon: XCircle, color: "red", label: "Dibatalkan" },
  };

  const currentStatus = statusConfig[order.status];
  const StatusIcon = currentStatus.icon;

  return (
    <>
      <DashboardLayout hideSidebar={true}>
        <div className="flex-1 bg-linear-to-br from-gray-50 via-white to-blue-50">
          {/* Premium Header */}
          <div className="bg-white border-b border-gray-200 py-6 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="h-6 w-6" />
                  </button>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Order #{order._id.slice(-8)}</h1>
                    <p className="text-gray-600 mt-1">Dibuat pada {formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div
                  className={`flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-md ${
                    order.status === "pending"
                      ? "bg-yellow-100/90 text-yellow-800"
                      : order.status === "in-progress"
                      ? "bg-blue-100/90 text-blue-800"
                      : order.status === "completed"
                      ? "bg-green-100/90 text-green-800"
                      : order.status === "cancelled"
                      ? "bg-red-100/90 text-red-800"
                      : "bg-gray-100/90 text-gray-800"
                  }`}
                >
                  <StatusIcon className="h-7 w-7" />
                  <span className="font-bold text-lg">{currentStatus.label}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-4">
            <div className="grid grid-cols-1 gap-8">
              {/* Main Content */}
              <div className="space-y-6">
                {/* Service Info */}
                <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    Detail Jasa
                  </h2>

                  <div className="flex items-start space-x-4 mb-6">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-4">{order.serviceId.title}</h3>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-xl">
                        <Package className="h-4 w-4 text-blue-600" />
                        <p className="text-sm text-blue-800 font-bold">
                          Paket: <span className="capitalize">{order.packageType}</span>
                        </p>
                      </div>

                      <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl mt-6 border-2 border-blue-100">
                        <p className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          Deskripsi:
                        </p>
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">{order.requirements}</p>
                      </div>

                      {/* Service Requirements Checklist */}
                      <div className="mt-6 space-y-6">
                        {/* Client Requirements */}
                        <div className="bg-linear-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-100">
                          <p className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            Persyaratan untuk Client:
                          </p>
                          <div className="space-y-3">
                            {(order.serviceId?.clientUploads && order.serviceId.clientUploads.length > 0
                              ? order.serviceId.clientUploads
                              : [
                                  "Mutasi bank 3 bulan terakhir",
                                  "Bukti transaksi (invoice, nota, dll)",
                                  "Data aset dan utang perusahaan",
                                  "Informasi periode laporan yang dibutuhkan",
                                ]
                            ).map((req, idx) => (
                              <div key={idx} className="flex items-start gap-3">
                                <div className="shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">{req}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Freelancer Requirements */}
                        <div className="bg-linear-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl border-2 border-purple-100">
                          <p className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                            <Package className="h-5 w-5 text-purple-600" />
                            Yang akan dikerjakan Freelancer:
                          </p>
                          <div className="space-y-3">
                            {(order.serviceId?.freelancerDelivers && order.serviceId.freelancerDelivers.length > 0
                              ? order.serviceId.freelancerDelivers
                              : [
                                  "Laporan Neraca lengkap",
                                  "Laporan Laba Rugi",
                                  "Laporan Arus Kas",
                                  "File Excel dengan detail perhitungan",
                                  "Catatan dan penjelasan laporan",
                                ]
                            ).map((req, idx) => (
                              <div key={idx} className="flex items-start gap-3">
                                <div className="shrink-0 w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                                  <Package className="h-3 w-3 text-purple-600" />
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">{req}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Order</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Harga Paket</span>
                        <span className="font-semibold text-lg">
                          {formatCurrency(order.escrowAmount || order.amount || 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Biaya Platform</span>
                        <span className="font-semibold text-lg">{formatCurrency(order.platformFee || 0)}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-200">
                        <span className="font-bold text-gray-900 text-lg">Total Dibayar</span>
                        <span className="font-bold text-green-600 text-xl">
                          {formatCurrency((order.escrowAmount || order.amount || 0) + (order.platformFee || 0))}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Client:</span>
                        <button
                          onClick={() => navigate(`/user/${order.clientId._id}`)}
                          className="font-semibold text-green-600 hover:text-green-700 hover:underline transition-colors"
                        >
                          {order.clientId.fullName}
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Freelancer:</span>
                        <button
                          onClick={() => navigate(`/user/${order.freelancerId._id}`)}
                          className="font-semibold text-green-600 hover:text-green-700 hover:underline transition-colors"
                        >
                          {order.freelancerId.fullName}
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Estimasi:</span>
                        <span className="font-semibold text-lg">
                          {order.serviceId?.packages?.[order.packageType]?.deliveryTime ||
                            order.estimatedDelivery ||
                            "-"}{" "}
                          hari
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Progress */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Progress Order</h2>

                  <div className="space-y-4">
                    {/* Timeline */}
                    <div className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            order.status === "pending" ? "bg-yellow-500" : "bg-green-500"
                          }`}
                        >
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        </div>
                        {order.status !== "pending" && <div className="w-0.5 h-12 bg-green-500"></div>}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-semibold text-gray-900">Order Dibuat</p>
                        <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                        <p className="text-sm text-gray-500 mt-1">Pembayaran telah dikonfirmasi</p>
                      </div>
                    </div>

                    {order.status !== "pending" && (
                      <div className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              ["in-progress", "submitted", "revision-requested", "completed"].includes(order.status)
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          >
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          </div>
                          {["submitted", "revision-requested", "completed"].includes(order.status) && (
                            <div className="w-0.5 h-12 bg-green-500"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-semibold text-gray-900">Dikerjakan Freelancer</p>
                          <p className="text-sm text-gray-600">Sedang dalam proses pengerjaan</p>
                        </div>
                      </div>
                    )}

                    {["submitted", "revision-requested", "completed"].includes(order.status) && (
                      <div className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              order.status === "completed" ? "bg-green-500" : "bg-blue-500"
                            }`}
                          >
                            {order.status === "completed" ? (
                              <CheckCircle2 className="h-5 w-5 text-white" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-white" />
                            )}
                          </div>
                          {order.status === "completed" && <div className="w-0.5 h-12 bg-green-500"></div>}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-semibold text-gray-900">
                            {order.status === "completed" ? "Selesai & Disetujui" : "Menunggu Review Client"}
                          </p>
                          {order.revisionCount > 0 && (
                            <p className="text-sm text-gray-600">Revisi: {order.revisionCount} kali</p>
                          )}
                        </div>
                      </div>
                    )}

                    {order.status === "completed" && (
                      <div className="flex items-start space-x-4">
                        <div className="h-8 w-8 rounded-full flex items-center justify-center bg-green-500">
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">Dana Dirilis</p>
                          <p className="text-sm text-gray-600">
                            Freelancer menerima {formatCurrency(order.freelancerEarnings)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Files */}
                {(order.freelancerFiles?.length > 0 || order.clientFiles?.length > 0 || isFreelancer || isClient) && (
                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">File Pekerjaan</h2>

                    {/* Freelancer Files Section */}
                    {order.freelancerFiles?.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">File dari Freelancer</h3>
                        <div className="space-y-2">
                          {order.freelancerFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5 text-green-600" />
                                <span className="text-sm font-medium text-gray-900">{file.filename}</span>
                              </div>
                              <a
                                href={`http://localhost:5050${file.url}`}
                                download
                                className="text-green-600 hover:text-green-700"
                              >
                                <Download className="h-5 w-5" />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Client Files Section */}
                    {order.clientFiles?.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">File dari Client</h3>
                        <div className="space-y-2">
                          {order.clientFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <span className="text-sm font-medium text-gray-900">{file.filename}</span>
                              </div>
                              <a
                                href={`http://localhost:5050${file.url}`}
                                download
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Download className="h-5 w-5" />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Freelancer Upload Section */}
                    {isFreelancer && ["in-progress", "revision-requested"].includes(order.status) && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Upload File Hasil Pekerjaan</h3>
                        <div className="mb-4">
                          <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
                          />
                        </div>

                        {files.length > 0 && (
                          <div className="mb-4 space-y-2">
                            {files.map((file, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg">
                                <span className="text-sm text-gray-900">{file.name}</span>
                                <button onClick={() => removeFile(idx)} className="text-red-600 hover:text-red-700">
                                  <XCircle className="h-5 w-5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <button
                          onClick={handleSubmitWork}
                          disabled={files.length === 0 || uploading}
                          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          {uploading ? (
                            <>
                              <Loader className="h-5 w-5 animate-spin" />
                              <span>Mengupload...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="h-5 w-5" />
                              <span>Submit Pekerjaan</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Client Upload Section */}
                    {isClient && ["accepted", "in-progress"].includes(order.status) && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Upload File Requirements/Referensi</h3>
                        <div className="mb-4">
                          <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                          />
                        </div>

                        {files.length > 0 && (
                          <div className="mb-4 space-y-2">
                            {files.map((file, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg">
                                <span className="text-sm text-gray-900">{file.name}</span>
                                <button onClick={() => removeFile(idx)} className="text-red-600 hover:text-red-700">
                                  <XCircle className="h-5 w-5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <button
                          onClick={handleSubmitWork}
                          disabled={files.length === 0 || uploading}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          {uploading ? (
                            <>
                              <Loader className="h-5 w-5 animate-spin" />
                              <span>Mengupload...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="h-5 w-5" />
                              <span>Upload Requirements</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Aksi</h2>

                  <div className="space-y-3">
                    {isFreelancer && order.status === "in-progress" && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="shrink-0">
                            <Package className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-blue-900 mb-1">Sedang Dikerjakan</h3>
                            <p className="text-sm text-blue-700">
                              Anda sedang mengerjakan order ini. Silakan upload hasil pekerjaan ketika sudah selesai.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {isClient && order.status === "in-progress" && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="shrink-0">
                            <Package className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-blue-900 mb-1">Sedang Dikerjakan</h3>
                            <p className="text-sm text-blue-700">
                              Freelancer sedang mengerjakan order Anda. Anda akan menerima notifikasi ketika pekerjaan
                              selesai.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {isFreelancer && order.status === "submitted" && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="shrink-0">
                            <CheckCircle2 className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-blue-900 mb-1">Pekerjaan Telah Disubmit</h3>
                            <p className="text-sm text-blue-700">
                              Menunggu review dari client. Client dapat menyetujui atau meminta revisi.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {isFreelancer && order.status === "revision-requested" && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="shrink-0">
                            <RefreshCcw className="h-6 w-6 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-orange-900 mb-1">Revisi Diminta</h3>
                            <p className="text-sm text-orange-700 mb-2">
                              Client meminta revisi. Silakan upload file yang sudah direvisi.
                            </p>
                            {order.revisionRequests && order.revisionRequests.length > 0 && (
                              <div className="bg-white p-2 rounded border border-orange-200 mt-2">
                                <p className="text-xs font-semibold text-orange-900 mb-1">Alasan:</p>
                                <p className="text-xs text-gray-700">
                                  {order.revisionRequests[order.revisionRequests.length - 1].message}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {isClient && order.status === "revision-requested" && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="shrink-0">
                            <RefreshCcw className="h-6 w-6 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-orange-900 mb-1">Revisi Diminta</h3>
                            <p className="text-sm text-orange-700">
                              Menunggu freelancer mengerjakan revisi. Revisi ke-{order.revisionCount} dari{" "}
                              {order.packageDetails.revisions} kali.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {isClient && order.status === "submitted" && (
                      <div className="space-y-3">
                        <button
                          onClick={() => setShowApproveModal(true)}
                          disabled={actionLoading}
                          className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center justify-center"
                        >
                          {actionLoading ? (
                            <>
                              <Loader className="h-5 w-5 animate-spin mr-2" />
                              Memproses...
                            </>
                          ) : (
                            "Setujui Pekerjaan"
                          )}
                        </button>

                        <button
                          onClick={() => setShowRevisionModal(true)}
                          disabled={actionLoading}
                          className="w-full py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400"
                        >
                          Minta Revisi
                        </button>
                      </div>
                    )}

                    {order.status === "completed" && isClient && !order.reviewId && (
                      <button
                        onClick={() => navigate(`/review/${order.serviceId._id}?orderId=${id}`)}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        ⭐ Beri Review
                      </button>
                    )}

                    {order.status === "completed" && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="shrink-0">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-green-900 mb-1">Order Selesai</h3>
                            <p className="text-sm text-green-700">
                              {isFreelancer
                                ? `Pembayaran ${formatCurrency(order.freelancerEarnings)} telah masuk ke wallet Anda.`
                                : "Terima kasih! Order telah selesai dengan baik."}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Fallback message when no actions are available */}
                    {!isFreelancer && !isClient && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                        <p className="text-gray-600 text-sm">Tidak ada aksi yang tersedia untuk order ini.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chat UI - Moved to floating chat box */}
                {/* <div className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col h-96">
                  <h2 className="text-lg font-bold text-gray-900 p-4 border-b border-gray-200 shrink-0">Komunikasi</h2>

                  <div className="flex-1 overflow-hidden min-h-0">
                    <div ref={messagesContainerRef} className="h-full overflow-y-auto p-4 space-y-3 bg-gray-50">
                      {messages.length === 0 ? (
                        <p className="text-center text-gray-500 text-sm py-8">Belum ada percakapan</p>
                      ) : (
                        <>
                          {messages.map((msg) => {
                            const isMine = msg.senderId === authUser?._id;
                            const sender = isMine ? "Anda" : isClient ? "Freelancer" : "Client";

                            return (
                              <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[70%]`}>
                                  <p
                                    className={`text-xs font-semibold mb-1 ${
                                      isMine ? "text-right text-green-700" : "text-left text-gray-600"
                                    }`}
                                  >
                                    {sender}
                                  </p>
                                  <div
                                    className={`px-4 py-2 rounded-lg ${
                                      isMine
                                        ? "bg-green-600 text-white rounded-br-sm"
                                        : "bg-white text-gray-900 rounded-bl-sm border border-gray-200"
                                    }`}
                                  >
                                    <p className="text-sm">{msg.message}</p>
                                    <p className={`text-xs mt-1 ${isMine ? "text-green-100" : "text-gray-500"}`}>
                                      {new Date(msg.createdAt).toLocaleTimeString("id-ID", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          <div ref={messagesEndRef} />
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-200 bg-white shrink-0 flex space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={handleMessageChange}
                      onKeyPress={(e) => e.key === "Enter" && !isSending && handleSendMessage()}
                      placeholder="Ketik pesan..."
                      disabled={isSending}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isSending}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSending ? (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* Floating Chat Box */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen ? (
          // Chat Toggle Button
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center"
          >
            <Send className="h-6 w-6" />
            <span className="ml-2 font-medium">Chat</span>
          </button>
        ) : (
          // Chat Box
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 h-[500px] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-green-600 text-white rounded-t-2xl">
              <h3 className="font-bold text-lg">Obrolan</h3>
              <button
                onClick={() => setIsChatOpen(false)}
                className="hover:bg-green-700 p-2 rounded-full transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-hidden min-h-0">
              <div ref={messagesContainerRef} className="h-full overflow-y-auto p-4 bg-gray-50">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-500 text-sm py-8">Belum ada percakapan</p>
                ) : (
                  <>
                    {messages.map((msg) => {
                      // Fix: senderId could be object or string
                      const senderId = typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;
                      const isMine = senderId === authUser?._id;
                      const sender = isMine ? "Anda" : isClient ? "Freelancer" : "Client";

                      return (
                        <div key={msg._id} className={`w-full flex mb-4 ${isMine ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[80%] flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                            <div
                              className={`text-xs font-semibold mb-1 ${
                                isMine ? "text-green-700 self-end" : "text-gray-600 self-start"
                              }`}
                            >
                              {sender}
                            </div>
                            <div
                              className={`px-4 py-2 rounded-lg shadow-sm max-w-full ${
                                isMine
                                  ? "bg-green-600 text-white rounded-br-sm"
                                  : "bg-white text-gray-900 rounded-bl-sm border border-gray-200"
                              }`}
                            >
                              <p className="text-sm wrap-break-word">{msg.message}</p>
                              <p className={`text-xs mt-1 ${isMine ? "text-green-100" : "text-gray-500"}`}>
                                {new Date(msg.createdAt).toLocaleTimeString("id-ID", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={handleMessageChange}
                onKeyPress={(e) => e.key === "Enter" && !isSending && handleSendMessage()}
                placeholder="Ketik pesan..."
                disabled={isSending}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isSending}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSending ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        onConfirm={handleAcceptOrder}
        title="Terima Order"
        message="Apakah Anda yakin ingin menerima order ini dan mulai mengerjakan?"
        confirmText="Terima Order"
        cancelText="Batal"
        confirmColor="green"
      />

      <ConfirmModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApproveOrder}
        title="Setujui Pekerjaan"
        message="Setujui pekerjaan ini? Dana akan diteruskan ke freelancer dan order akan selesai."
        confirmText="Setujui"
        cancelText="Batal"
        confirmColor="green"
      />

      <InputModal
        isOpen={showRevisionModal}
        onClose={() => setShowRevisionModal(false)}
        onSubmit={handleRequestRevision}
        title="Minta Revisi"
        label="Alasan Revisi"
        placeholder="Jelaskan apa yang perlu direvisi..."
        submitText="Kirim Permintaan"
        cancelText="Batal"
      />
    </>
  );
};

export default OrderDetailPage;
