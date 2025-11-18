const ServiceCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-48 bg-gray-200"></div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Category Badge */}
        <div className="h-6 w-24 bg-gray-200 rounded-full"></div>

        {/* Title */}
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="h-5 w-24 bg-gray-200 rounded"></div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCardSkeleton;
