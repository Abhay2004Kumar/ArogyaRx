import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, User, Package, CreditCard, Home, HelpCircle, Settings } from "lucide-react";
import API from "../../services/api";
import EditProfile from "./EditProfile";
import MyOrders from "./MyOrders";
import MyAddresses from "./MyAddresses";

const MyProfile = () => {
  const [activeSection, setActiveSection] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, []);

  const handleSidebarClick = (section) => setActiveSection(section);
  const handleCloseSection = () => setActiveSection("");

  const menuItems = [
    { label: "My Orders", icon: <Package size={18} />, section: "orders" },
    { label: "My Payments", icon: <CreditCard size={18} /> },
    { label: "My Wallet", icon: <CreditCard size={18} /> },
    { label: "My Addresses", icon: <Home size={18} />, section: "addresses" },
    { label: "My Profile", icon: <User size={18} />, section: "profile" },
  ];

  const infoBoxes = [
    { title: "My Orders", subtitle: "View, Modify And Track Orders", icon: <Package size={24} />, section: "orders" },
    { title: "My Payments", subtitle: "View And Modify Payment Methods", icon: <CreditCard size={24} /> },
    { title: "My Wallet", subtitle: "Wallet History And Redeemed Gift Cards", icon: <CreditCard size={24} /> },
    { title: "My Addresses", subtitle: "Edit, Add Or Remove Addresses", icon: <Home size={24} />, section: "addresses" },
    { title: "My Profile", subtitle: "Edit Info And Change Password", icon: <User size={24} />, section: "profile" },
    { title: "Help & Support", subtitle: "Reach Out To Us", icon: <HelpCircle size={24} /> },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-gray-800 shadow-md md:shadow-xl border-r border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white rounded-tr-xl">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="inline-block w-4 h-4 bg-white rounded-sm"></span>
            Overview
          </h2>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {menuItems.map((item, index) => (
            <SidebarButton
              key={index}
              label={item.label}
              icon={item.icon}
              isActive={activeSection === item.section}
              onClick={() => item.section && handleSidebarClick(item.section)}
            />
          ))}
          <button className="flex items-center gap-2 text-left px-3 py-2 rounded-lg text-red-500 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-4">
            <Settings size={18} />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
        {activeSection === "profile" && (
          <SectionWrapper onBack={handleCloseSection}>
            <EditProfile userProfile={userProfile} />
          </SectionWrapper>
        )}
        {activeSection === "orders" && (
          <SectionWrapper onBack={handleCloseSection}>
            <MyOrders />
          </SectionWrapper>
        )}
        {activeSection === "addresses" && (
          <SectionWrapper onBack={handleCloseSection}>
            <MyAddresses />
          </SectionWrapper>
        )}

        {!activeSection && (
          <>
            {/* Overview Cards */}
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 flex-1"
              >
                {loading ? (
                  <div className="animate-pulse flex items-center gap-4">
                    <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-16 w-16"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ) : userProfile ? (
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-green-500 dark:bg-green-600 rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold shadow">
                      {userProfile.firstName?.[0] || "U"}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold dark:text-white">
                        {userProfile.firstName} {userProfile.lastName}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{userProfile.email}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{userProfile.contact}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Failed to load profile</p>
                )}

                <button
                  className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors shadow-sm"
                  onClick={() => setActiveSection("profile")}
                >
                  EDIT PROFILE
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-green-200 dark:border-green-800 flex-1 text-center"
              >
                <h2 className="text-xl font-semibold dark:text-white mb-2">
                  Arogya <span className="text-green-500 dark:text-green-400 font-bold">RX</span>
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Upgrade to the premium experience now
                </p>
                <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-gray-700 dark:text-gray-300">
                  {["🚚 Free Shipping", "⏰ Early Access", "🎁 VIP Support"].map((item, i) => (
                    <div key={i} className="text-center">
                      <p className="text-sm">{item.split(" ")[0]}</p>
                      <p className="text-xs">{item.split(" ").slice(1).join(" ")}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-colors shadow-sm">
                  GET TRIBE MEMBERSHIP
                </button>
              </motion.div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {infoBoxes.map((box, index) => (
                <InfoBox
                  key={index}
                  title={box.title}
                  subtitle={box.subtitle}
                  icon={box.icon}
                  onClick={() => box.section && handleSidebarClick(box.section)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

// Sidebar Button Component
const SidebarButton = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
      isActive
        ? "text-green-600 dark:text-green-400 font-semibold bg-green-100 dark:bg-green-900/30"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

// Section Wrapper with Back Button
const SectionWrapper = ({ children, onBack }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="space-y-6"
  >
    <button
      onClick={onBack}
      className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
    >
      <ChevronLeft size={18} />
      Back to Dashboard
    </button>
    {children}
  </motion.div>
);

// InfoBox Component
const InfoBox = ({ title, subtitle, icon, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 dark:border-gray-700"
    onClick={onClick}
  >
    <div className="text-green-500 dark:text-green-400 mb-3">
      {icon}
    </div>
    <h3 className="font-bold text-lg dark:text-white">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-300">{subtitle}</p>
  </motion.div>
);

export default MyProfile;