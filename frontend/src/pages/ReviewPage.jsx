import { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useReviewStore } from "../store/useReviewStore";
import { useOrderStore } from "../store/useOrderStore";
import DashboardLayout from "../components/DashboardLayout";
import StarRating from "../components/StarRating";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

const ReviewPage = () => {
  const { serviceId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get("orderId");
  const { createReview, isLoading: loading } = useReviewStore();
  const { fetchMyOrders } = useOrderStore();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Silakan pilih rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Silakan tulis komentar Anda");
      return;
    }

    try {
      await createReview({
        serviceId,
        orderId,
        rating,
        comment,
      });

      // Refresh orders data to update review status
      await fetchMyOrders();

      toast.success("Review berhasil dikirim!");
      navigate(`/services/${serviceId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengirim review");
    }
  };

  return (
    <DashboardLayout hideSidebar={true} hideFooter={true}>
      <div className="flex-1 bg-linear-to-br from-gray-50 via-white to-yellow-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Rating */}
              <div className="bg-linear-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border-2 border-amber-100">
                <label className="block text-lg font-bold text-gray-900 mb-4 text-center">
                  ⭐ Berapa rating yang Anda berikan?
                </label>
                <div className="flex justify-center space-x-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-all duration-200 hover:scale-125 active:scale-110"
                    >
                      <Star
                        className={`h-14 w-14 ${
                          star <= rating
                            ? "fill-amber-400 text-amber-500 drop-shadow-lg"
                            : "text-gray-300 hover:text-amber-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <div className="text-center mt-4">
                    <div className="inline-block bg-white rounded-xl px-6 py-3 shadow-lg">
                      <p className="text-xl font-bold bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        {rating === 5 && "Luar biasa! 🎉"}
                        {rating === 4 && "Sangat Baik! 👍"}
                        {rating === 3 && "Baik 😊"}
                        {rating === 2 && "Kurang Baik 😕"}
                        {rating === 1 && "Buruk 😞"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Comment */}
              <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-100">
                <label className="block text-lg font-bold text-gray-900 mb-4">💬 Ceritakan pengalaman Anda</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={6}
                  placeholder="Bagikan detail pengalaman Anda dengan jasa ini. Apa yang Anda sukai? Apa yang bisa ditingkatkan?"
                  className="w-full px-5 py-4 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 text-gray-700 placeholder-gray-400 bg-white shadow-inner transition-all"
                />
                <p className="text-sm text-blue-600 mt-3 font-medium">✓ Minimum 10 karakter</p>
              </div>

              {/* Actions */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 py-4 bg-linear-to-r from-gray-100 to-gray-200 text-gray-700 font-bold rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  ❌ Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || rating === 0 || !comment.trim()}
                  className="flex-1 py-4 bg-linear-to-r from-green-600 via-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-2xl shadow-green-500/50 hover:shadow-green-500/70 transform hover:-translate-y-1 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                >
                  {loading ? "⏳ Mengirim..." : "✅ Kirim Review"}
                </button>
              </div>
            </form>
          </div>

          {/* Info */}
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 mt-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
              <div>
                <h3 className="font-bold text-blue-900 mb-2 text-lg">Mengapa review penting?</h3>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Review Anda akan membantu freelancer meningkatkan kualitas layanan dan membantu client lain membuat
                  keputusan yang lebih baik.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReviewPage;
