import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import DashboardLayout from "../components/DashboardLayout";
import { User as UserIcon, MapPin, Briefcase, Award, Edit2, Save, X, Camera, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, updateProfile, uploadProfilePhoto } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    bio: "",
    skills: [], // Changed to array
    education: [], // Changed to array
    experience: [], // Changed to array
  });

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "skills", "education", "experience"
  const [modalInput, setModalInput] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName || "",
        address: authUser.address || "",
        bio: authUser.bio || "",
        skills: Array.isArray(authUser.skills)
          ? authUser.skills
          : authUser.skills
          ? authUser.skills.split(",").map((s) => s.trim())
          : [],
        education: Array.isArray(authUser.education)
          ? authUser.education
          : authUser.education
          ? authUser.education.split(",").map((e) => e.trim())
          : [],
        experience: Array.isArray(authUser.experience)
          ? authUser.experience.map((exp) => (typeof exp === "string" ? exp : exp.title || exp))
          : authUser.experience
          ? [authUser.experience]
          : [],
      });
    }
  }, [authUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Modal functions
  const openModal = (type, index = null) => {
    setModalType(type);
    setModalOpen(true);
    setEditingIndex(index);
    if (index !== null) {
      // Handle different field types for editing
      const currentValue = formData[type][index];
      if (type === "experience" && typeof currentValue === "object") {
        setModalInput(currentValue.title || "");
      } else {
        setModalInput(currentValue);
      }
    } else {
      setModalInput("");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType("");
    setModalInput("");
    setEditingIndex(null);
  };

  const addItem = () => {
    if (!modalInput.trim()) return;

    setFormData((prev) => ({
      ...prev,
      [modalType]: [...prev[modalType], modalInput.trim()],
    }));
    closeModal();
  };

  const updateItem = () => {
    if (!modalInput.trim() || editingIndex === null) return;

    setFormData((prev) => ({
      ...prev,
      [modalType]: prev[modalType].map((item, index) => (index === editingIndex ? modalInput.trim() : item)),
    }));
    closeModal();
  };

  const removeItem = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data for submission
      const submitData = {
        fullName: formData.fullName,
        address: formData.address,
        bio: formData.bio,
        skills: formData.skills,
        education: formData.education,
        experience: formData.experience,
      };

      const response = await updateProfile(submitData);

      toast.success("Profil berhasil diperbarui");

      if (response.user) {
        setFormData({
          fullName: response.user.fullName || "",
          address: response.user.address || "",
          bio: response.user.bio || "",
          skills: Array.isArray(response.user.skills)
            ? response.user.skills
            : response.user.skills
            ? response.user.skills.split(",").map((s) => s.trim())
            : [],
          education: Array.isArray(response.user.education)
            ? response.user.education
            : response.user.education
            ? response.user.education.split(",").map((e) => e.trim())
            : [],
          experience: Array.isArray(response.user.experience)
            ? response.user.experience.map((exp) => (typeof exp === "string" ? exp : exp.title || exp))
            : response.user.experience
            ? [response.user.experience]
            : [],
        });
      }

      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName || "",
        address: authUser.address || "",
        bio: authUser.bio || "",
        skills: Array.isArray(authUser.skills)
          ? authUser.skills
          : authUser.skills
          ? authUser.skills.split(",").map((s) => s.trim())
          : [],
        education: Array.isArray(authUser.education)
          ? authUser.education
          : authUser.education
          ? authUser.education.split(",").map((e) => e.trim())
          : [],
        experience: Array.isArray(authUser.experience)
          ? authUser.experience.map((exp) => (typeof exp === "string" ? exp : exp.title || exp))
          : authUser.experience
          ? [authUser.experience]
          : [],
      });
    }
    setIsEditing(false);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    setUploadingPhoto(true);
    try {
      await uploadProfilePhoto(file);
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 bg-linear-to-br from-gray-50 via-white to-green-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 my-5">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-linear-to-r from-green-600 to-green-700 px-8 py-12 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="h-24 w-24 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl">
                      {authUser?.profileImage ? (
                        <img
                          src={`http://localhost:5050${authUser.profileImage}`}
                          alt={authUser.fullName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserIcon className="h-12 w-12 text-green-600" />
                      )}
                    </div>
                    <button
                      onClick={handlePhotoClick}
                      disabled={uploadingPhoto}
                      className="absolute bottom-0 right-0 bg-gray-200 hover:bg-gray-50 text-green-600 p-2 rounded-full shadow-xl transition-all disabled:bg-gray-400 transform hover:scale-110"
                      title="Upload foto profil"
                    >
                      {uploadingPhoto ? (
                        <div className="h-5 w-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera className="h-5 w-5" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </div>
                  <div className="text-white">
                    <h1 className="text-3xl font-bold mb-2">{authUser?.fullName}</h1>
                    <p className="text-green-100 capitalize text-lg font-medium">
                      {authUser?.role === "freelancer" ? "Freelancer" : "Client"}
                    </p>
                  </div>
                </div>

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>Edit Profil</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span>Batal</span>
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      <span>{loading ? "Menyimpan..." : "Simpan"}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 relative">
              {/* Loading Overlay */}
              {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-b-2xl">
                  <div className="text-center">
                    <div className="inline-block h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600 font-medium">Menyimpan perubahan...</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Informasi Dasar</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                        <UserIcon className="h-4 w-4" />
                        <span>Nama Lengkap</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span>Alamat</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Jakarta, Indonesia"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="h-4 w-4" />
                    <span>Bio</span>
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Ceritakan tentang diri Anda..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  />
                </div>

                {/* Freelancer Specific Fields */}
                {authUser?.role === "freelancer" && (
                  <>
                    {/* Skills */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                          <Award className="h-4 w-4" />
                          <span>Keahlian</span>
                        </label>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => openModal("skills")}
                            className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm font-medium"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Tambah</span>
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {formData.skills.length === 0 ? (
                          <p className="text-gray-500 text-sm italic">Belum ada keahlian yang ditambahkan</p>
                        ) : (
                          formData.skills.map((skill, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                            >
                              <span className="text-sm text-gray-700">{skill}</span>
                              {isEditing && (
                                <div className="flex space-x-1">
                                  <button
                                    type="button"
                                    onClick={() => openModal("skills", index)}
                                    className="text-blue-600 hover:text-blue-700 text-sm"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeItem("skills", index)}
                                    className="text-red-600 hover:text-red-700 text-sm"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Education */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700 block">Pendidikan</label>
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => openModal("education")}
                              className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              <Plus className="h-4 w-4" />
                              <span>Tambah</span>
                            </button>
                          )}
                        </div>
                        <div className="space-y-2">
                          {formData.education.length === 0 ? (
                            <p className="text-gray-500 text-sm italic">Belum ada pendidikan yang ditambahkan</p>
                          ) : (
                            formData.education.map((edu, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                              >
                                <span className="text-sm text-gray-700">{edu}</span>
                                {isEditing && (
                                  <div className="flex space-x-1">
                                    <button
                                      type="button"
                                      onClick={() => openModal("education", index)}
                                      className="text-blue-600 hover:text-blue-700 text-sm"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => removeItem("education", index)}
                                      className="text-red-600 hover:text-red-700 text-sm"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Experience */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700 block">Pengalaman</label>
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => openModal("experience")}
                              className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              <Plus className="h-4 w-4" />
                              <span>Tambah</span>
                            </button>
                          )}
                        </div>
                        <div className="space-y-2">
                          {formData.experience.length === 0 ? (
                            <p className="text-gray-500 text-sm italic">Belum ada pengalaman yang ditambahkan</p>
                          ) : (
                            formData.experience.map((exp, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                              >
                                <span className="text-sm text-gray-700">
                                  {typeof exp === "object" ? exp.title : exp}
                                </span>
                                {isEditing && (
                                  <div className="flex space-x-1">
                                    <button
                                      type="button"
                                      onClick={() => openModal("experience", index)}
                                      className="text-blue-600 hover:text-blue-700 text-sm"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => removeItem("experience", index)}
                                      className="text-red-600 hover:text-red-700 text-sm"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Modal for Adding/Editing Items */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingIndex !== null ? "Edit" : "Tambah"}{" "}
                  {modalType === "skills" ? "Keahlian" : modalType === "education" ? "Pendidikan" : "Pengalaman"}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {modalType === "skills" ? "Keahlian" : modalType === "education" ? "Pendidikan" : "Pengalaman"}
                  </label>
                  <input
                    type="text"
                    value={modalInput}
                    onChange={(e) => setModalInput(e.target.value)}
                    placeholder={
                      modalType === "skills"
                        ? "Contoh: Financial Analysis"
                        : modalType === "education"
                        ? "Contoh: S1 Akuntansi - Universitas Indonesia"
                        : "Contoh: 5 tahun di bidang konsultasi keuangan"
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    autoFocus
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={editingIndex !== null ? updateItem : addItem}
                    disabled={!modalInput.trim()}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {editingIndex !== null ? "Update" : "Tambah"}
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
