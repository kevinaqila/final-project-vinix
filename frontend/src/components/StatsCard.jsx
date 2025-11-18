const StatsCard = ({ value, label, color = "green" }) => {
  const getColorClass = (colorName) => {
    switch (colorName) {
      case "green":
        return "text-green-600";
      case "blue":
        return "text-blue-600";
      case "purple":
        return "text-purple-600";
      case "red":
        return "text-red-600";
      default:
        return "text-green-600";
    }
  };

  return (
    <div className="text-center p-4">
      <div className={`text-4xl font-bold ${getColorClass(color)} mb-2`}>{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};

export default StatsCard;
