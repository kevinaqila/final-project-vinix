import { Star } from "lucide-react";

const StarRating = ({ rating, size = "sm", showValue = true }) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizes[size]} ${star <= rating ? "text-yellow-500 fill-current" : "text-gray-300"}`}
        />
      ))}
      {showValue && <span className="text-sm text-gray-700 font-medium ml-2">{rating.toFixed(1)}</span>}
    </div>
  );
};

export default StarRating;
