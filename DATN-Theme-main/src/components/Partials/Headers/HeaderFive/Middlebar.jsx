import React from "react";
import Cookies from "js-cookie";
import Cart from "../../../Cart";
import ThinBag from "../../../Helpers/icons/ThinBag";
import ThinLove from "../../../Helpers/icons/ThinLove";
import ThinPeople from "../../../Helpers/icons/ThinPeople";
import SearchBox from "../../../Helpers/SearchBox";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

export default function Middlebar({ className }) {
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ cookie
  const token = Cookies.get("token");
  let username = "";

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      username = decodedToken.sub || "";
    } catch (error) {
      console.error("Lỗi khi giải mã token:", error);
    }
  }

  const handleLogout = () => {
    Cookies.remove('user');
    Cookies.remove('token');
    Cookies.remove('cart');
    navigate("/login");
    window.location.reload();
  };

  // Lấy số lượng sản phẩm trong giỏ hàng từ cookie
  const cart = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : [];
  const cartCount = cart.length;

  return (
    <div className={`w-full h-[86px] bg-white ${className}`}>
      <div className="container-x mx-auto h-full">
        <div className="relative h-full">
          <div className="flex justify-between items-center h-full">

            {/* Tìm kiếm */}
            <div className="w-[517px] h-[44px] flex justify-center">
              <SearchBox className="search-com" />
            </div>

            {/* Logo - Đặt logo ở giữa và lớn hơn */}
            <div className="flex-1 flex justify-center">
              <a href="/">
                <img
                  width="220" // Tăng kích thước logo
                  height="55"
                  src={`/assets/images/logo-8.png`}
                  alt="logo"
                  className="hover:opacity-80 transition-all duration-300 transform scale-105" // Thêm hiệu ứng zoom khi hover
                />
              </a>
            </div>

            {/* Biểu tượng yêu thích, giỏ hàng và thông tin người dùng */}
            <div className="flex space-x-8 items-center">
              {/* Biểu tượng yêu thích */}
              <div className="favorite relative p-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full shadow-md hover:shadow-2xl hover:scale-110 transform transition-all duration-300 ease-in-out hover:rotate-6">
                <a href="/wishlist" className="flex items-center justify-center">
                  <ThinLove className="w-6 h-6 text-white" />
                </a>
              </div>

              {/* Giỏ hàng */}
              <div className="cart-wrapper group relative p-2 bg-gradient-to-l from-blue-500 to-teal-400 rounded-full shadow-md hover:shadow-2xl hover:scale-110 transform transition-all duration-300 ease-in-out hover:rotate-6">
                <div className="cart relative cursor-pointer">
                  <a href="/cart" className="flex items-center justify-center">
                    <ThinBag className="w-6 h-6 text-white" />
                  </a>
                  {cartCount > 0 && (
                    <span className="w-[16px] h-[16px] rounded-full bg-red-600 absolute -top-2.5 -right-2.5 flex justify-center items-center text-[8px] font-bold text-white shadow-md">
                      {cartCount}
                    </span>
                  )}
                </div>
              </div>

              {/* Hiển thị thông tin tùy thuộc vào trạng thái đăng nhập */}
              {username ? (
                <>
                  <div className="flex items-center space-x-4 text-gray-800">
                    <Link to="/profile" className="flex items-center hover:text-blue-500 transition duration-200">
                      {/* Biểu tượng người dùng với hiệu ứng hover và thay đổi màu sắc */}
                      <ThinPeople className="w-6 h-6 text-gray-700 hover:text-yellow-500 transition-all duration-300 transform hover:scale-110 hover:rotate-6" />
                      <span className="ml-3 text-sm font-semibold text-gray-900">Xin chào, {username}</span>
                    </Link>
                  </div>
                  <div className="mt-1">
                    <Link to="#" onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800 transition duration-200">
                      Đăng xuất
                    </Link>
                  </div>
                </>
              ) : (
                <div className="flex space-x-8">
                  <Link to="/login" className="text-sm text-gray-700 hover:text-blue-500 transition duration-200">
                    Đăng nhập
                  </Link>
                  <Link to="/signup" className="text-sm text-gray-700 hover:text-blue-500 transition duration-200">
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
