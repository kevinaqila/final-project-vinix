const OrderCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        {/* Status Badge Skeleton */}
        <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
        {/* Date Skeleton */}
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>

      {/* Service Title */}
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>

      {/* Service Info */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>

      {/* Price & Button */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
        <div className="h-9 w-28 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default OrderCardSkeleton;
