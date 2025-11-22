import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { User, BookOpen, Award, Briefcase, FileText, ArrowLeft } from "lucide-react";

const FreelancerOnboardingPage = () => {
  const navigate = useNavigate();
  const { updateFreelancerProfile } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    education: [""],
    skills: [""],
    bio: "",
    certifications: [{ name: "", issuer: "", year: "" }],
    experience: [{ title: "", company: "", duration: "", description: "" }],
  });

  const handleAddCertification = () => {
    setFormData({
      ...formData,
      certifications: [...formData.certifications, { name: "", issuer: "", year: "" }],
    });
  };

  const handleRemoveCertification = (index) => {
    const newCerts = formData.certifications.filter((_, i) => i !== index);
    setFormData({ ...formData, certifications: newCerts });
  };

  const handleCertificationChange = (index, field, value) => {
    const newCerts = [...formData.certifications];
    newCerts[index][field] = value;
    setFormData({ ...formData, certifications: newCerts });
  };

  const handleAddSkill = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, ""],
    });
  };

  const handleRemoveSkill = (index) => {
    const newSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: newSkills });
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData({ ...formData, skills: newSkills });
  };

  const handleAddEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, ""],
    });
  };

  const handleRemoveEducation = (index) => {
    const newEducation = formData.education.filter((_, i) => i !== index);
    setFormData({ ...formData, education: newEducation });
  };

  const handleEducationChange = (index, value) => {
    const newEducation = [...formData.education];
    newEducation[index] = value;
    setFormData({ ...formData, education: newEducation });
  };

  const handleAddExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { title: "", company: "", duration: "", description: "" }],
    });
  };

  const handleRemoveExperience = (index) => {
    const newExp = formData.experience.filter((_, i) => i !== index);
    setFormData({ ...formData, experience: newExp });
  };

  const handleExperienceChange = (index, field, value) => {
    const newExp = [...formData.experience];
    newExp[index][field] = value;
    setFormData({ ...formData, experience: newExp });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.bio.trim()) {
        alert("Deskripsi singkat wajib diisi");
        setIsSubmitting(false);
        return;
      }

      if (!formData.education.some((edu) => edu.trim())) {
        alert("Minimal satu pendidikan wajib diisi");
        setIsSubmitting(false);
        return;
      }

      if (!formData.skills.some((skill) => skill.trim())) {
        alert("Minimal satu keahlian wajib diisi");
        setIsSubmitting(false);
        return;
      }

      // Clean up empty entries
      const cleanData = {
        ...formData,
        education: formData.education.filter((edu) => edu.trim()),
        skills: formData.skills.filter((skill) => skill.trim()),
        certifications: formData.certifications.filter((cert) => cert.name.trim() || cert.issuer.trim()),
        experience: formData.experience.filter((exp) => exp.title.trim()),
      };

      await updateFreelancerProfile(cleanData);

      navigate("/freelancer/dashboard");
    } catch (error) {
      console.error("Failed to update freelancer profile:", error);
      alert("Gagal menyimpan profil. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/role-selection")}
          className="mb-4 flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Kembali ke Pilihan Role</span>
        </button>

        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Lengkapi Profil Freelancer Anda</h1>
            <p className="text-gray-600">Informasi ini akan membantu klien menemukan dan mempercayai Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Education - Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="inline h-5 w-5 mr-2 text-green-600" />
                Pendidikan <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {formData.education.map((edu, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      required
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                      placeholder={`Pendidikan ${index + 1} (Contoh: S1 Akuntansi - Universitas Indonesia)`}
                      value={edu}
                      onChange={(e) => handleEducationChange(index, e.target.value)}
                    />
                    {formData.education.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                >
                  + Tambah Pendidikan
                </button>
              </div>
            </div>

            {/* Skills - Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Award className="inline h-5 w-5 mr-2 text-green-600" />
                Keahlian <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      required
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                      placeholder={`Keahlian ${index + 1} (Contoh: Laporan Keuangan)`}
                      value={skill}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                    />
                    {formData.skills.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                >
                  + Tambah Keahlian
                </button>
              </div>
            </div>

            {/* Bio - Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline h-5 w-5 mr-2 text-green-600" />
                Deskripsi Singkat <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                placeholder="Ceritakan tentang pengalaman dan keahlian Anda..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            {/* Certifications - Optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Award className="inline h-5 w-5 mr-2 text-green-600" />
                Sertifikasi (Opsional)
              </label>
              {formData.certifications.map((cert, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                      placeholder="Nama Sertifikasi"
                      value={cert.name}
                      onChange={(e) => handleCertificationChange(index, "name", e.target.value)}
                    />
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                      placeholder="Penerbit"
                      value={cert.issuer}
                      onChange={(e) => handleCertificationChange(index, "issuer", e.target.value)}
                    />
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                      placeholder="Tahun"
                      value={cert.year}
                      onChange={(e) => handleCertificationChange(index, "year", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCertification(index)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddCertification}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                + Tambah Sertifikasi
              </button>
            </div>

            {/* Experience - Optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="inline h-5 w-5 mr-2 text-green-600" />
                Pengalaman Kerja (Opsional)
              </label>
              {formData.experience.map((exp, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                  <div className="space-y-3">
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                      placeholder="Posisi/Jabatan"
                      value={exp.title}
                      onChange={(e) => handleExperienceChange(index, "title", e.target.value)}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder="Perusahaan"
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                      />
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder="Durasi (Contoh: 2020-2023)"
                        value={exp.duration}
                        onChange={(e) => handleExperienceChange(index, "duration", e.target.value)}
                      />
                    </div>
                    <textarea
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                      placeholder="Deskripsi singkat"
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(index)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddExperience}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                + Tambah Pengalaman
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Menyimpan..." : "Selesaikan Profil"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FreelancerOnboardingPage;
