// eslint-disable-next-line no-unused-vars
const FeatureCard = ({ icon: IconComponent, title, description }) => {
  return (
    <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
      <div className="shrink-0 h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
        <IconComponent className="h-6 w-6 text-green-600" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
