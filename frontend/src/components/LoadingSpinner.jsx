import { Loader } from "lucide-react";

const LoadingSpinner = ({ size = "md", fullScreen = false }) => {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader className={`${sizes[size]} animate-spin text-green-600`} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <Loader className={`${sizes[size]} animate-spin text-green-600`} />
    </div>
  );
};

export default LoadingSpinner;
