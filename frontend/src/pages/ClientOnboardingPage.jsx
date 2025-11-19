import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const ClientOnboardingPage = () => {
  const navigate = useNavigate();
  const { updateClientProfile } = useAuthStore();
  const [clientType, setClientType] = useState("");
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    investmentExperience: "",
    timeHorizon: "",
    primaryGoal: "",
    riskTolerance: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClientTypeChange = (type) => {
    setClientType(type);
    setFormData({
      businessName: "",
      businessType: "",
      ageRange: "",
      investmentExperience: "",
      timeHorizon: "",
      primaryGoal: "",
      riskTolerance: "",
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = {
        clientType,
        ...formData,
      };

      await updateClientProfile(submitData);
      navigate("/client/dashboard");
    } catch (error) {
      console.error("Error updating client profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Lengkapi Profil Client</h1>

        {/* ✅ Client Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Tipe Client</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="clientType"
                value="business"
                checked={clientType === "business"}
                onChange={(e) => handleClientTypeChange(e.target.value)}
                className="mr-2"
              />
              Business Owner
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="clientType"
                value="personal"
                checked={clientType === "personal"}
                onChange={(e) => handleClientTypeChange(e.target.value)}
                className="mr-2"
              />
              Personal Finance
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ✅ Conditional Fields */}
          {clientType === "business" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bisnis</label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="PT. Example Corp"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Bisnis</label>
                <select
                  required
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Pilih tipe bisnis</option>
                  <option value="startup">Startup</option>
                  <option value="corporate">Corporate</option>
                  <option value="consulting">Consulting</option>
                  <option value="finance">Finance</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </>
          )}

          {clientType === "personal" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pengalaman Investasi</label>
                <select
                  required
                  value={formData.investmentExperience}
                  onChange={(e) => setFormData({ ...formData, investmentExperience: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Pilih tingkat pengalaman Anda</option>
                  <option value="beginner">Pemula - Baru mulai berinvestasi</option>
                  <option value="intermediate">Menengah - Sudah berinvestasi 1-3 tahun</option>
                  <option value="advanced">Mahir - Berpengalaman >3 tahun</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horizon Waktu Investasi</label>
                <select
                  required
                  value={formData.timeHorizon}
                  onChange={(e) => setFormData({ ...formData, timeHorizon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Pilih jangka waktu investasi Anda</option>
                  <option value="short">Jangka Pendek (1-3 tahun) - Kebutuhan mendesak</option>
                  <option value="medium">Jangka Menengah (3-7 tahun) - Tujuan jangka menengah</option>
                  <option value="long">Jangka Panjang (7+ tahun) - Persiapan masa depan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tujuan Utama</label>
                <select
                  required
                  value={formData.primaryGoal}
                  onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Pilih tujuan investasi utama Anda</option>
                  <option value="retirement">Persiapan Pensiun - Mengumpulkan dana untuk masa tua</option>
                  <option value="wealth">Membangun Kekayaan - Meningkatkan nilai investasi jangka panjang</option>
                  <option value="education">Pendidikan - Biaya kuliah anak atau pengembangan diri</option>
                  <option value="emergency">Dana Darurat - Tabungan untuk keadaan darurat</option>
                  <option value="debt">Pelunasan Hutang - Mengurangi beban hutang</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Toleransi Risiko</label>
                <select
                  required
                  value={formData.riskTolerance}
                  onChange={(e) => setFormData({ ...formData, riskTolerance: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Pilih tingkat toleransi risiko Anda</option>
                  <option value="low">Rendah (Konservatif) - Lebih suka keamanan, hindari kerugian</option>
                  <option value="medium">Sedang (Moderat) - Seimbang antara risiko dan return</option>
                  <option value="high">Tinggi (Agresif) - Siap menerima fluktuasi untuk return tinggi</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !clientType}
            className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? "Menyimpan..." : "Lengkapi Profil"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientOnboardingPage;
