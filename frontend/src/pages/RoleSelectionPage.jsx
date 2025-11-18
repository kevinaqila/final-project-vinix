import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Briefcase, UserCircle } from "lucide-react";

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const { selectRole, authUser } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSelection = async (role) => {
    setSelectedRole(role);
    setIsSubmitting(true);

    try {
      await selectRole(role);

      if (role === "client") {
        if (authUser?.isProfileComplete) {
          navigate("/client/dashboard"); // ✅ Sudah isi profile
        } else {
          navigate("/client/onboarding"); // ✅ Belum isi, ke onboarding
        }
      } else if (role === "freelancer") {
        if (authUser?.isProfileComplete) {
          navigate("/freelancer/dashboard");
        } else {
          navigate("/freelancer/onboarding");
        }
      }
    } catch (error) {
      console.error("Error selecting role:", error);
      setSelectedRole(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Selamat Datang di FinancePro!</h1>
          <p className="text-xl text-gray-600">Apa yang ingin Anda lakukan?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Client Card */}
          <div
            onClick={() => !isSubmitting && handleRoleSelection("client")}
            className={`bg-white p-8 rounded-lg shadow-lg border-2 cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
              selectedRole === "client" ? "border-green-600" : "border-gray-200"
            } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <UserCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Saya ingin Merekrut</h2>
              <p className="text-gray-600 mb-6">
                Cari dan rekrut freelancer untuk menyelesaikan pekerjaan keuangan Anda
              </p>
              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">Akses ribuan freelancer terpercaya</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">Sistem escrow yang aman</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">Chat langsung dengan freelancer</span>
                </li>
              </ul>
              <button
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {selectedRole === "client" && isSubmitting ? "Memproses..." : "Mulai Merekrut"}
              </button>
            </div>
          </div>

          {/* Freelancer Card */}
          <div
            onClick={() => !isSubmitting && handleRoleSelection("freelancer")}
            className={`bg-white p-8 rounded-lg shadow-lg border-2 cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
              selectedRole === "freelancer" ? "border-green-600" : "border-gray-200"
            } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <Briefcase className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Saya ingin Bekerja</h2>
              <p className="text-gray-600 mb-6">Tawarkan keahlian keuangan Anda dan dapatkan penghasilan</p>
              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">Buat profil dan jasa Anda</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">Terima pembayaran dengan aman</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">Bangun reputasi Anda</span>
                </li>
              </ul>
              <button
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {selectedRole === "freelancer" && isSubmitting ? "Memproses..." : "Mulai Bekerja"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
