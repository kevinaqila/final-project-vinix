import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

const DashboardLayout = ({ children, hideSidebar = false, hideFooter = false }) => {
  const location = useLocation();
  const shouldHideFooter = hideFooter || location.pathname === "/messages" || location.pathname === "/profile";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {!hideSidebar && <Sidebar />}
      <div className={`flex-1 flex flex-col ${hideSidebar ? "ml-0" : ""}`}>
        <main className="flex-1">{children}</main>
        {!shouldHideFooter && <Footer />}
      </div>
    </div>
  );
};

export default DashboardLayout;
