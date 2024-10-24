import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt, FaBox, FaShoppingCart, FaUsers,
  FaTags, FaRuler, FaPalette, FaSignOutAlt, FaBars, FaTimes
} from 'react-icons/fa';

const AdminLayout = ({ children }) => {
  const location = useLocation(); // Lấy thông tin vị trí hiện tại
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [navbarTitle, setNavbarTitle] = useState('Thống kê');
  const [sidebarOpen, setSidebarOpen] = useState(true); // Trạng thái mở/tắt sidebar

  const links = [
    { to: '/admin', label: 'Thống kê', icon: <FaTachometerAlt /> },
    { to: '/admin/products', label: 'Sản phẩm', icon: <FaBox /> },
    { to: '/admin/orders', label: 'Đơn hàng', icon: <FaShoppingCart /> },
    { to: '/admin/users', label: 'Người dùng', icon: <FaUsers /> },
    { to: '/admin/category', label: 'Loại sản phẩm', icon: <FaTags /> },
    { to: '/admin/size', label: 'Kích thước', icon: <FaRuler /> }
  ];

  const handleSidebarClick = (link) => {
    setActiveLink(link.to);
    setNavbarTitle(link.label);
  };

  useEffect(() => {
    // Cập nhật activeLink và navbarTitle dựa trên đường dẫn hiện tại
    const currentLink = links.find(link => link.to === location.pathname);
    if (currentLink) {
      setActiveLink(currentLink.to);
      setNavbarTitle(currentLink.label);
    }
  }, [location.pathname, links]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-gradient-to-b from-blue-900 to-blue-500 text-gray-100 shadow-lg transition-all duration-500 ease-in-out`}>
        {/* Menubar */}
        <div className="flex items-center justify-between p-4 bg-blue-800 shadow-md">
          <h1 className={`${sidebarOpen ? 'block' : 'hidden'} text-xl font-semibold`}>
            Admin
          </h1>
          <button onClick={toggleSidebar} className="text-white">
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div className="flex flex-col">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`p-4 flex items-center gap-2 text-left rounded-tl-full rounded-bl-full transition duration-300 ease-in-out ${activeLink === link.to
                  ? 'bg-white text-black text-lg font-semibold'
                  : 'text-gray-100 hover:bg-white hover:text-black hover:text-xl'
                }`}
              onClick={() => handleSidebarClick(link)}
              aria-current={activeLink === link.to ? 'page' : undefined}
            >
              {link.icon}
              <span className={`${sidebarOpen ? 'block' : 'hidden'} transition-transform duration-300 ease-in-out transform hover:scale-110`}>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="w-full bg-gradient-to-t from-green-300 to-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            {navbarTitle === 'Thống kê' ? navbarTitle : `Quản lý ${navbarTitle.toLowerCase()}`}
          </h1>
          <button className="relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-blue-600 transition duration-300 ease-out border-2 border-blue-500 rounded-lg shadow-md group">
            {/* Hiệu ứng nền xanh khi hover */}
            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white bg-blue-500 transition-all duration-300 -translate-x-full group-hover:translate-x-0 ease">
              <FaSignOutAlt className="mr-2" />
              Logout
            </span>

            {/* Chỉ hiển thị "Logout" khi không hover */}
            <span className="absolute flex items-center justify-center w-full h-full text-blue-500 transition-all duration-300 transform group-hover:translate-x-full ease">
              Logout
            </span>

            {/* Ẩn ban đầu */}
            <span className="relative invisible">
              Logout
            </span>
          </button>

        </div>

        {/* Main Content Area */}
        <div className="p-6 bg-gray-100 flex-1 overflow-y-auto transition-all duration-300 ease-in-out">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
