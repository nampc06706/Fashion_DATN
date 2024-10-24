import React from "react";
import Cookies from "js-cookie";
import Cart from "../../../Cart";
import ThinBag from "../../../Helpers/icons/ThinBag";
import ThinLove from "../../../Helpers/icons/ThinLove";
import ThinPeople from "../../../Helpers/icons/ThinPeople";
import SearchBox from "../../../Helpers/SearchBox";
import { Link, useNavigate } from "react-router-dom";
import {jwtDecode} from 'jwt-decode'; // Chỉ cần import một lần

export default function Middlebar({ className }) {
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ cookie
  const token = Cookies.get("token");
  let username = "";

  if (token) {
    try {
      const decodedToken = jwtDecode(token); // Giải mã token
      username = decodedToken.sub || ""; // Lấy username từ trường sub (subject)
    } catch (error) {
      console.error("Lỗi khi giải mã token:", error);
    }
  }

  const handleLogout = () => {
    Cookies.remove('user'); // Xóa cookie của người dùng khi đăng xuất
    Cookies.remove('token');
    Cookies.remove('cart');
    window.location.reload();
    navigate("/login");
  };

  return (
    <div className={`w-full h-[86px] bg-white ${className}`}>
      <div className="container-x mx-auto h-full">
        <div className="relative h-full">
          <div className="flex justify-between items-center h-full">
            <div>
              <a href="/">
                <img
                  width="152"
                  height="36"
                  src={`/assets/images/logo-8.png`}
                  alt="logo"
                />
              </a>
            </div>
            <div className="w-[517px] h-[44px]">
              <SearchBox className="search-com" />
            </div>
            <div className="flex space-x-6 items-center">
              <div className="favorite relative">
                <a href="/wishlist">
                  <span>
                    <ThinLove />
                  </span>
                </a>
                <span className="w-[18px] h-[18px] rounded-full bg-qh5-bwhite absolute -top-2.5 -right-2.5 flex justify-center items-center text-[9px] text-qblack">
                  1
                </span>
              </div>
              <div className="cart-wrapper group relative py-4">
                <div className="cart relative cursor-pointer">
                  <a href="/cart">
                    <span>
                      <ThinBag />
                    </span>
                  </a>
                  <span className="w-[18px] h-[18px] rounded-full bg-qh5-bwhite absolute -top-2.5 -right-2.5 flex justify-center items-center text-[9px] text-qblack">
                    15
                  </span>
                </div>
                <Cart className="absolute -right-[45px] top-11 z-50 hidden group-hover:block" />
              </div>

              {/* Hiển thị thông tin tùy thuộc vào trạng thái đăng nhập */}
              {username ? (
                <>
                  <div className="flex items-center space-x-2">
                    <Link to="/profile">
                      <span>
                        <ThinPeople />
                      </span>
                    </Link>
                    <span>Xin chào, {username}</span>
                  </div>
                  <div>
                    <Link to="#" onClick={handleLogout}>
                      <span>Đăng xuất</span>
                    </Link>
                  </div>
                </>
              ) : (
                <div>
                  <Link to="/login">
                    <span>Đăng nhập </span>
                  </Link>
                  <Link to="/signup">
                    <span> Đăng ký</span>
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
