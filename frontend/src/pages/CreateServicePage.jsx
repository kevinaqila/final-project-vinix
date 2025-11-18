import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useServiceStore } from "../store/useServiceStore";
import DashboardLayout from "../components/DashboardLayout";
import { Plus, X, ChevronLeft, ChevronRight, Check } from "lucide-react";
import toast from "react-hot-toast";

// Category templates - defined outside component to avoid hoisting issues
const categoryTemplates = {
  "Laporan Keuangan": {
    clientUploads: [
      "Mutasi bank",
      "Bukti transaksi (jual/beli)",
      "Dokumen pajak",
      "Data aset & utang",
      "Data gaji",
      "Info usaha & periode laporan",
    ],
    freelancerDelivers: [
      "Neraca",
      "Laba Rugi",
      "Arus Kas",
      "Buku besar & jurnal",
      "File Excel + PDF",
      "Catatan keuangan",
      "Analisis sederhana",
    ],
    descriptionSuggestion:
      "Saya akan membuat laporan keuangan lengkap berdasarkan data yang Anda berikan. Termasuk neraca, laba rugi, dan arus kas sesuai standar akuntansi.",
  },
  "Konsultasi Pajak & Pembukuan": {
    clientUploads: [
      "NPWP / dokumen pajak",
      "Mutasi bank & e-wallet",
      "Invoice penjualan & pembelian",
      "Bukti setor pajak",
      "Data karyawan",
      "Daftar aset / utang / piutang",
      "Pertanyaan untuk konsultasi",
    ],
    freelancerDelivers: [
      "Hasil konsultasi (PDF/summary)",
      "Pembukuan (jurnal, buku besar, neraca saldo)",
      "Rekap pajak",
      "Mini laporan keuangan",
      "Template excel",
      "Rekomendasi pajak & action plan",
    ],
    descriptionSuggestion:
      "Saya akan membantu konsultasi pajak dan pembukuan online. Dari pembukuan rutin hingga rekomendasi strategi pajak untuk bisnis Anda.",
  },
  "Audit Internal": {
    clientUploads: [
      "Laporan keuangan",
      "Mutasi bank & e-wallet",
      "Dokumen penjualan/pembelian",
      "Dokumen aset/utang/piutang",
      "SOP proses bisnis",
      "Informasi masalah yang ingin diperiksa",
    ],
    freelancerDelivers: [
      "Laporan temuan audit internal",
      "Evaluasi kontrol internal",
      "Rekonsiliasi & pemeriksaan dokumen",
      "Analisis keuangan",
      "Rekomendasi langkah perbaikan",
      "File pendukung (Excel/PDF)",
      "Penjelasan temuan",
    ],
    descriptionSuggestion:
      "Audit internal ringan untuk memastikan kepatuhan dan efisiensi bisnis Anda. Fokus pada kontrol internal dan rekomendasi perbaikan.",
  },
  "Penyusunan Anggaran & Cashflow": {
    clientUploads: [
      "Data penjualan",
      "Data pembelian & biaya",
      "Mutasi bank",
      "Rencana bisnis ke depan",
      "Data aset & utang",
      "Masalah keuangan yang sedang dihadapi",
    ],
    freelancerDelivers: [
      "Anggaran pendapatan & biaya",
      "Proyeksi cashflow",
      "Analisis & insight",
      "Strategi perbaikan",
      "File Excel + PDF",
      "Penjelasan hasil",
    ],
    descriptionSuggestion:
      "Penyusunan anggaran dan proyeksi cashflow untuk perencanaan keuangan bisnis Anda. Termasuk analisis dan strategi perbaikan.",
  },
  Lainnya: {
    clientUploads: [""],
    freelancerDelivers: [""],
    descriptionSuggestion: "",
  },
};

const CreateServicePage = () => {
  const navigate = useNavigate();
  const { createService, isLoading: isSubmitting } = useServiceStore();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const [formData, setFormData] = useState({
    title: "",
    category: "Laporan Keuangan",
    description: categoryTemplates["Laporan Keuangan"].descriptionSuggestion,
    clientUploads: [...categoryTemplates["Laporan Keuangan"].clientUploads],
    freelancerDelivers: [...categoryTemplates["Laporan Keuangan"].freelancerDelivers],
    packages: {
      basic: {
        name: "basic",
        price: "",
        description: "",
        deliveryTime: "",
        features: [""],
        revisions: 0,
      },
      standard: {
        name: "standard",
        price: "",
        description: "",
        deliveryTime: "",
        features: [""],
        revisions: 1,
      },
      premium: {
        name: "premium",
        price: "",
        description: "",
        deliveryTime: "",
        features: [""],
        revisions: 3,
      },
    },
  });

  const categories = Object.keys(categoryTemplates);

  const handleCategoryChange = (category) => {
    const template = categoryTemplates[category];
    const isDescriptionEmptyOrDefault =
      !formData.description ||
      Object.values(categoryTemplates).some((t) => t.descriptionSuggestion === formData.description);

    setFormData({
      ...formData,
      category,
      clientUploads: [...template.clientUploads],
      freelancerDelivers: [...template.freelancerDelivers],
      description: isDescriptionEmptyOrDefault ? template.descriptionSuggestion : formData.description,
    });
  };

  const handleChecklistChange = (type, index, value) => {
    const newList = [...formData[type]];
    newList[index] = value;
    setFormData({
      ...formData,
      [type]: newList,
    });
  };

  const addChecklistItem = (type) => {
    setFormData({
      ...formData,
      [type]: [...formData[type], ""],
    });
  };

  const removeChecklistItem = (type, index) => {
    const newList = formData[type].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [type]: newList,
    });
  };

  const handlePackageChange = (packageType, field, value) => {
    setFormData({
      ...formData,
      packages: {
        ...formData.packages,
        [packageType]: {
          ...formData.packages[packageType],
          [field]: value,
        },
      },
    });
  };

  const handleFeatureChange = (packageType, index, value) => {
    const newFeatures = [...formData.packages[packageType].features];
    newFeatures[index] = value;
    handlePackageChange(packageType, "features", newFeatures);
  };

  const addFeature = (packageType) => {
    const newFeatures = [...formData.packages[packageType].features, ""];
    handlePackageChange(packageType, "features", newFeatures);
  };

  const removeFeature = (packageType, index) => {
    const newFeatures = formData.packages[packageType].features.filter((_, i) => i !== index);
    handlePackageChange(packageType, "features", newFeatures);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Clean up features (remove empty ones)
      const cleanedPackages = {};
      Object.keys(formData.packages).forEach((key) => {
        cleanedPackages[key] = {
          ...formData.packages[key],
          features: formData.packages[key].features.filter((f) => f.trim() !== ""),
          price: Number(formData.packages[key].price),
          deliveryTime: Number(formData.packages[key].deliveryTime),
        };
      });

      await createService({
        ...formData,
        packages: cleanedPackages,
        clientUploads: formData.clientUploads.filter((item) => item.trim() !== ""),
        freelancerDelivers: formData.freelancerDelivers.filter((item) => item.trim() !== ""),
      });

      toast.success("Jasa berhasil dibuat!");
      navigate("/freelancer/services");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal membuat jasa");
    }
  };

  const renderPackageCard = (packageType, label, description) => {
    const pkg = formData.packages[packageType];

    return (
      <div
        key={packageType}
        className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-200 hover:border-green-500 hover:shadow-xl transition-all duration-300"
      >
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center">
            <span
              className={`h-2 w-2 rounded-full mr-2 ${
                packageType === "basic" ? "bg-blue-500" : packageType === "standard" ? "bg-purple-500" : "bg-yellow-500"
              }`}
            ></span>
            {label}
          </h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Harga (Rp) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              value={pkg.price}
              onChange={(e) => handlePackageChange(packageType, "price", e.target.value)}
              onWheel={(e) => e.target.blur()}
              placeholder="50000"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deskripsi Paket <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
              value={pkg.description}
              onChange={(e) => handlePackageChange(packageType, "description", e.target.value)}
              placeholder="Jelaskan apa saja yang termasuk dalam paket ini"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Waktu Pengerjaan (hari) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              value={pkg.deliveryTime}
              onChange={(e) => handlePackageChange(packageType, "deliveryTime", e.target.value)}
              onWheel={(e) => e.target.blur()}
              placeholder="3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fitur Yang Termasuk <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {pkg.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Contoh: Laporan Laba Rugi"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    value={feature}
                    onChange={(e) => handleFeatureChange(packageType, index, e.target.value)}
                  />
                  {pkg.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(packageType, index)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addFeature(packageType)}
              className="mt-3 text-sm text-green-600 hover:text-green-700 font-semibold flex items-center hover:bg-green-50 px-3 py-2 rounded-lg transition-all"
            >
              <Plus className="h-4 w-4 mr-1" />
              Tambah Fitur
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Jumlah Revisi</label>
            <input
              type="number"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              value={pkg.revisions}
              onChange={(e) => handlePackageChange(packageType, "revisions", e.target.value)}
              onWheel={(e) => e.target.blur()}
              placeholder="0"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Buat Jasa Baru</h1>
          <p className="text-gray-600 mt-2">Isi informasi lengkap untuk menarik lebih banyak klien</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[
              { step: 1, title: "Informasi Dasar", description: "Judul, kategori & deskripsi" },
              { step: 2, title: "Persyaratan", description: "Checklist untuk klien & freelancer" },
              { step: 3, title: "Paket Harga", description: "Harga & paket layanan" },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    currentStep > item.step
                      ? "bg-green-600 border-green-600 text-white"
                      : currentStep === item.step
                      ? "border-green-600 text-green-600 bg-green-50"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {currentStep > item.step ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{item.step}</span>
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${currentStep >= item.step ? "text-gray-900" : "text-gray-500"}`}>
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                {index < 2 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                      currentStep > item.step ? "bg-green-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step Content */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Informasi Dasar</h2>
                  <p className="text-gray-600">Berikan informasi utama tentang jasa yang akan Anda tawarkan</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Judul Jasa <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength="100"
                      placeholder="Jasa Pembukuan Bulanan UMKM"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100 karakter</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kategori <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                      value={formData.category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Deskripsi Jasa <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows="8"
                      placeholder="Jelaskan detail jasa Anda, keahlian, dan apa yang akan klien dapatkan..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Persyaratan & Deliverables</h2>
                  <p className="text-gray-600">
                    Tentukan apa yang dibutuhkan dari klien dan apa yang akan Anda kerjakan
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Yang Perlu Disediakan Klien
                    </label>
                    <div className="space-y-3">
                      {formData.clientUploads.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            placeholder="Contoh: Mutasi bank"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                            value={item}
                            onChange={(e) => handleChecklistChange("clientUploads", index, e.target.value)}
                          />
                          {formData.clientUploads.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeChecklistItem("clientUploads", index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => addChecklistItem("clientUploads")}
                      className="mt-3 text-sm text-green-600 hover:text-green-700 font-semibold flex items-center hover:bg-green-50 px-3 py-2 rounded-lg transition-all"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Tambah Item
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Yang Akan Dikerjakan Freelancer
                    </label>
                    <div className="space-y-3">
                      {formData.freelancerDelivers.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            placeholder="Contoh: Laporan keuangan"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                            value={item}
                            onChange={(e) => handleChecklistChange("freelancerDelivers", index, e.target.value)}
                          />
                          {formData.freelancerDelivers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeChecklistItem("freelancerDelivers", index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => addChecklistItem("freelancerDelivers")}
                      className="mt-3 text-sm text-green-600 hover:text-green-700 font-semibold flex items-center hover:bg-green-50 px-3 py-1 rounded-lg transition-all"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Tambah Item
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Paket Harga</h2>
                  <p className="text-gray-600">Buat tiga pilihan paket untuk memberikan fleksibilitas kepada klien</p>
                </div>

                <div className="space-y-6">
                  {renderPackageCard("basic", "Basic", "Paket dasar dengan fitur standar")}
                  {renderPackageCard("standard", "Standard", "Paket dengan lebih banyak fitur")}
                  {renderPackageCard("premium", "Premium", "Paket lengkap dengan semua fitur")}
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Navigation Buttons - Outside Form */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={currentStep === 1 ? () => navigate("/freelancer/dashboard") : prevStep}
            className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>{currentStep === 1 ? "Batal" : "Sebelumnya"}</span>
          </button>

          <div className="flex space-x-3">
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-linear-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {isSubmitting ? "Menyimpan..." : "Publikasikan Jasa"}
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateServicePage;
