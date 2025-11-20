import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Mail, Lock, DollarSign, Shield, Users } from "lucide-react";

const LoginPage = () => {
  const { login, isLoggingIn, authUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Only redirect if user is already authenticated and on login page
    if (authUser && (location.pathname === "/login" || location.pathname === "/signup")) {
      const userRole = authUser.role;
      if (userRole && userRole !== "" && userRole !== null) {
        if (authUser.isProfileComplete) {
          navigate(`/${userRole}/dashboard`, { replace: true });
        } else {
          navigate(`/${userRole}/onboarding`, { replace: true });
        }
      } else {
        navigate("/select-role", { replace: true });
      }
    }
  }, [authUser, navigate, location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(formData);

      // Handle navigation based on user role
      const userRole = result.user?.role;
      if (userRole && userRole !== "" && userRole !== null) {
        if (result.user.isProfileComplete) {
          navigate(`/${userRole}/dashboard`);
        } else {
          navigate(`/${userRole}/onboarding`);
        }
      } else {
        navigate("/select-role");
      }
    } catch (error) {
      // Error toast already shown by login function
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-green-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full">
        {/* Card Container dengan background premium */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Features dengan background gradient */}
            <div className="p-8 lg:p-12">
              <div className="text-center mb-8">
                <img src="/images/vertical-logo.png" alt="FinancePro" className="mx-auto h-16 mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Masuk ke Akun Anda</h2>
              </div>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Mail className="absolute left-4 top-11 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-12 appearance-none relative block w-full px-4 py-3.5 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Masukkan email Anda"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <Lock className="absolute left-4 top-11 h-5 w-5 text-gray-400 z-10" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="pl-12 pr-12 appearance-none relative block w-full px-4 py-3.5 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                    placeholder="Masukkan password Anda"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-11 text-gray-400 hover:text-gray-600 z-10 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-linear-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {isLoggingIn ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Masuk...
                      </>
                    ) : (
                      "Masuk"
                    )}
                  </button>
                </div>

                <div className="text-center">
                  Tidak memiliki akun?{" "}
                  <RouterLink
                    to="/signup"
                    className="font-medium text-green-600 hover:text-green-700 transition-colors"
                  >
                    <span className="font-semibold">Daftar</span>
                  </RouterLink>
                </div>
              </form>
            </div>

            {/* Right Side - Form */}
            <div className="hidden lg:flex flex-col justify-center bg-linear-to-br from-green-600 via-green-500 to-teal-500 p-12 text-white">
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">Selamat Datang Kembali!</h1>
                <p className="text-lg text-green-50">Lanjutkan perjalanan Anda di FinancePro</p>
              </div>

              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Transaksi Aman</h3>
                    <p className="text-sm text-green-50">Sistem escrow yang melindungi dana Anda</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Freelancer Terverifikasi</h3>
                    <p className="text-sm text-green-50">Profesional terpercaya dan berpengalaman</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Komunitas Aktif</h3>
                    <p className="text-sm text-green-50">Ribuan pengguna yang sudah bergabung</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                  <Shield className="h-4 w-4" />
                  <span>100% Aman</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                  <Users className="h-4 w-4" />
                  <span>10rb+ Pengguna</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
