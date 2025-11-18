import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const ClientOnboardingPage = () => {
  const navigate = useNavigate();
  const { updateClientProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateClientProfile(formData);
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

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            disabled={isSubmitting}
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
