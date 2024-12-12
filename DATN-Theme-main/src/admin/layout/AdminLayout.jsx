import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaBox, FaShoppingCart, FaUsers,
  FaTags, FaRuler, FaSignOutAlt, FaBars, FaTimes, FaHome, FaBolt,
  FaBell,
  FaUserCircle
} from 'react-icons/fa';
import Cookies from 'js-cookie';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeLink, setActiveLink] = useState(location.pathname);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = [
    { to: '/admin', label: 'Thống kê', icon: <FaTachometerAlt /> },
    { to: '/admin/products', label: 'Sản phẩm', icon: <FaBox /> },
    { to: '/admin/orders', label: 'Đơn hàng', icon: <FaShoppingCart /> },
    { to: '/admin/users', label: 'Người dùng', icon: <FaUsers /> },
    { to: '/admin/category', label: 'Loại sản phẩm', icon: <FaTags /> },
    { to: '/admin/size', label: 'Kích thước', icon: <FaRuler /> },
    { to: '/admin/flash-sales', label: 'Flash sales', icon: <FaBolt /> },
    { label: 'Đăng xuất', icon: <FaSignOutAlt />, action: 'logout' }
  ];

  useEffect(() => {
    const currentLink = links.find(link => link.to === location.pathname);
    if (currentLink) setActiveLink(currentLink.to);
  }, [location.pathname]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/login');
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } w-64 px-6 py-4 flex flex-col`}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-blue-600">Admin</h1>
          <button className="text-gray-700" onClick={toggleSidebar}>
            <FaTimes size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {links.map((link, index) => (
            link.action === 'logout' ? (
              <button
                key={index}
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-100 rounded-lg"
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            ) : (
              <Link
                key={index}
                to={link.to}
                onClick={() => setActiveLink(link.to)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeLink === link.to
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-blue-100'
                  }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            )
          ))}
        </nav>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="bg-gray-800 shadow-lg py-4 px-8 flex items-center justify-between">
          {/* Logo hoặc Tiêu đề */}
          <div className="flex items-center space-x-4">
            <button className="text-white" onClick={toggleSidebar}>
              <FaBars size={24} />
            </button>
            <h1 className="text-xl font-semibold text-white">Trang Quản Trị</h1>
          </div>
          <div className="flex justify-center items-center gap-6">
            {/* Logo */}
            <div className="relative z-10">
              <img
                src="../assets/images/logo-8.png"
                alt="Logo"
                className="w-48 h-10 object-contain"
              />
            </div>
          </div>


          {/* Các biểu tượng hoặc các nút khác (nếu có) */}
          <div className="flex items-center space-x-6">
            <button className="text-white hover:text-gray-300 transition-colors duration-200"
              onClick={() => navigate('/')}>

              <FaHome size={20} />
            </button>
            <button className="text-white hover:text-gray-300 transition-colors duration-200">
              <FaBell size={20} />
            </button>
            <button className="text-white hover:text-gray-300 transition-colors duration-200">
              <FaUserCircle size={20} />
            </button>
          </div>
        </div>


        {/* Content Area */}
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
