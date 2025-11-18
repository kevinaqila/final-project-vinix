import { Shield, Award, Users } from "lucide-react";

const TrustBadge = ({ variant = "secure" }) => {
  const badges = {
    secure: {
      icon: Shield,
      text: "Aman & Terpercaya",
      color: "green",
    },
    verified: {
      icon: Award,
      text: "Freelancer Terverifikasi",
      color: "blue",
    },
    community: {
      icon: Users,
      text: "10,000+ Pengguna Aktif",
      color: "purple",
    },
  };

  const badge = badges[variant];
  const Icon = badge.icon;

  const getColorClasses = (colorName) => {
    switch (colorName) {
      case "green":
        return "bg-green-50 text-green-700 border-green-200";
      case "blue":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "purple":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-green-50 text-green-700 border-green-200";
    }
  };

  return (
    <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border ${getColorClasses(badge.color)}`}>
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{badge.text}</span>
    </div>
  );
};

export default TrustBadge;
