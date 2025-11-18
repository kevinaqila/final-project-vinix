import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Mail, Lock, User, DollarSign, Shield, Users, AlertCircle } from "lucide-react";

const SignUpPage = () => {
  const { signup, isSigningUp, authUser } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  // Validation functions
  const validateFullName = (name) => {
    if (!name.trim()) return "Nama lengkap wajib diisi";
    if (name.trim().length < 2) return "Nama minimal 2 karakter";
    if (name.trim().length > 50) return "Nama maksimal 50 karakter";
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "Email wajib diisi";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Format email tidak valid";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password wajib diisi";
    if (password.length < 8) return "Password minimal 8 karakter";
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Password harus mengandung huruf besar, kecil, dan angka";
    }
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return "Konfirmasi password wajib diisi";
    if (confirmPassword !== password) return "Password tidak cocok";
    return "";
  };

  // Handle input changes with validation
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    // Real-time validation
    let error = "";
    switch (field) {
      case "fullName":
        error = validateFullName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
        // Also validate confirm password if it exists
        if (formData.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: validateConfirmPassword(formData.confirmPassword, value),
          }));
        }
        break;
      case "confirmPassword":
        error = validateConfirmPassword(value, formData.password);
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const validationErrors = {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password),
    };

    setErrors(validationErrors);

    // Check if any errors
    const hasErrors = Object.values(validationErrors).some((error) => error !== "");

    if (hasErrors) {
      return;
    }

    // If no errors, submit
    signup(formData);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-green-50 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full">
        {/* Card Container dengan background premium */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] lg:min-h-[500px]">
            {/* Left Side - Form */}
            <div className="p-6 lg:p-8 flex flex-col justify-center">
              <div className="text-center mb-6">
                <img src="/images/vertical-logo.png" alt="FinancePro" className="mx-auto h-12 mb-3" />
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Buat akun Anda</h2>
              </div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
                  <User className="absolute left-3 top-10 h-4 w-4 text-gray-400" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    className={`pl-9 appearance-none relative block w-full px-3 py-2 border placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                      errors.fullName ? "border-red-300 focus:ring-red-500" : "border-gray-300"
                    }`}
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                  />
                  {errors.fullName && (
                    <div className="flex items-center mt-1 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.fullName}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <Mail className="absolute left-3 top-10 h-4 w-4 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`pl-9 appearance-none relative block w-full px-3 py-2 border placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                      errors.email ? "border-red-300 focus:ring-red-500" : "border-gray-300"
                    }`}
                    placeholder="Masukkan email Anda"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                  {errors.email && (
                    <div className="flex items-center mt-1 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.email}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <Lock className="absolute left-3 top-10 h-4 w-4 text-gray-400 z-10" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className={`pl-9 pr-9 appearance-none relative block w-full px-3 py-2 border placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all [&::-ms-reveal]:hidden [&::-ms-clear]:hidden ${
                      errors.password ? "border-red-300 focus:ring-red-500" : "border-gray-300"
                    }`}
                    placeholder="Buat password yang kuat"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 z-10 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  {errors.password && (
                    <div className="flex items-center mt-1 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.password}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                  <Lock className="absolute left-3 top-10 h-4 w-4 text-gray-400 z-10" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className={`pl-9 pr-9 appearance-none relative block w-full px-3 py-2 border placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all [&::-ms-reveal]:hidden [&::-ms-clear]:hidden ${
                      errors.confirmPassword ? "border-red-300 focus:ring-red-500" : "border-gray-300"
                    }`}
                    placeholder="Konfirmasi password Anda"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 z-10 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  {errors.confirmPassword && (
                    <div className="flex items-center mt-1 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSigningUp}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-linear-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {isSigningUp ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Membuat akun...
                      </>
                    ) : (
                      "Daftar"
                    )}
                  </button>
                </div>

                <div className="text-center text-sm">
                  Sudah memiliki akun?{" "}
                  <Link to="/login" className="font-medium text-green-600 hover:text-green-700 transition-colors">
                    <span className="font-semibold">Masuk</span>
                  </Link>
                </div>
              </form>
            </div>

            {/* Right Side - Features */}
            <div className="hidden lg:flex flex-col justify-center bg-linear-to-br from-green-600 via-green-500 to-teal-500 p-8 pl-12 text-white">
              <div className="mb-6 ">
                <h1 className="text-3xl font-bold mb-3">Bergabung dengan FinancePro</h1>
                <p className="text-base text-green-50">
                  Platform marketplace terpercaya untuk jasa keuangan profesional
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="shrink-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base mb-1">Transaksi Aman</h3>
                    <p className="text-sm text-green-50">Sistem escrow yang melindungi dana Anda</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="shrink-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base mb-1">Freelancer Terverifikasi</h3>
                    <p className="text-sm text-green-50">Profesional terpercaya dan berpengalaman</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="shrink-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base mb-1">Komunitas Aktif</h3>
                    <p className="text-sm text-green-50">Ribuan pengguna yang sudah bergabung</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">
                  <Shield className="h-3.5 w-3.5" />
                  <span>100% Aman</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">
                  <Users className="h-3.5 w-3.5" />
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

export default SignUpPage;
