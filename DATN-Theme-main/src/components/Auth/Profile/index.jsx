import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BreadcrumbCom from "../../BreadcrumbCom";
import LayoutHomeFive from "../../Partials/LayoutHomeFive";
import IcoAdress from "./icons/IcoAdress";
import IcoCart from "./icons/IcoCart";
import IcoDashboard from "./icons/IcoDashboard";
import IcoLove from "./icons/IcoLove";
import IcoPassword from "./icons/IcoPassword";
import IcoPeople from "./icons/IcoPeople";
import AddressesTab from "./tabs/AddressesTab";
import Dashboard from "./tabs/Dashboard";
import OrderTab from "./tabs/OrderTab";
import PasswordTab from "./tabs/PasswordTab";
import ProfileTab from "./tabs/ProfileTab";
import WishlistTab from "./tabs/WishlistTab";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; 

export default function Profile() {
  const location = useLocation();
  const getHashContent = location.hash.split("#");
  const [active, setActive] = useState("dashboard");
  const [accountId, setAccountId] = useState(null); // State để lưu accountId

  useEffect(() => {
    const token = Cookies.get("token");
    let accountId;

    if (token) {
      try {
        const userInfo = jwtDecode(token); // Giải mã token
        accountId = userInfo.accountId; // Lấy accountId từ thông tin người dùng
        setAccountId(accountId); // Cập nhật state
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
      }
    }

    setActive(
      getHashContent && getHashContent.length > 1
        ? getHashContent[1]
        : "dashboard"
    );
  }, [getHashContent]);

  return (
    <LayoutHomeFive childrenClasses="pt-0 pb-0">
      <div className="profile-page-wrapper w-full">
        <div className="container-x mx-auto">
          <div className="w-full my-10">
            <BreadcrumbCom
              paths={[
                { name: "home", path: "/" },
                { name: "profile", path: "/profile" },
              ]}
            />
            <div className="w-full bg-white px-10 py-9">
              <div className="title-area w-full flex justify-between items-center">
                <h1 className="text-[22px] font-bold text-qblack">
                  Trang tổng quan của bạn
                </h1>
              </div>
              <div className="profile-wrapper w-full mt-8 flex space-x-10">
                <div className="w-[236px] min-h-[600px] border-r border-[rgba(0, 0, 0, 0.1)]">
                  <div className="flex flex-col space-y-10">
                    <div className="item group">
                      <Link to="/profile#dashboard">
                        <div className="flex space-x-3 items-center text-qgray hover:text-qblack">
                          <span>
                            <IcoDashboard />
                          </span>
                          <span className="font-normal text-base">
                            Trang tổng quan
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="item group">
                      <Link to="/profile#profile">
                        <div className="flex space-x-3 items-center text-qgray hover:text-qblack">
                          <span>
                            <IcoPeople />
                          </span>
                          <span className="font-normal text-base">
                            Thông tin cá nhân
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="item group">
                      <Link to="/profile#order">
                        <div className="flex space-x-3 items-center text-qgray hover:text-qblack">
                          <span>
                            <IcoCart />
                          </span>
                          <span className=" font-normal text-base">Đặt hàng</span>
                        </div>
                      </Link>
                    </div>
                    <div className="item group">
                      <Link to="/profile#wishlist">
                        <div className="flex space-x-3 items-center text-qgray hover:text-qblack">
                          <span>
                            <IcoLove />
                          </span>
                          <span className=" font-normal text-base">
                            Danh sách yêu thích
                          </span>
                        </div>
                      </Link>
                    </div><div className="item group">
                      <Link to="/profile#address">
                        <div className="flex space-x-3 items-center text-qgray hover:text-qblack">
                          <span>
                            <IcoAdress />
                          </span>
                          <span className=" font-normal text-base">
                            Địa chỉ
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="item group">
                      <Link to="/profile#password">
                        <div className="flex space-x-3 items-center text-qgray hover:text-qblack">
                          <span>
                            <IcoPassword />
                          </span>
                          <span className=" font-normal text-base">
                            Thay đổi mật khẩu
                          </span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="item-body dashboard-wrapper w-full">
                    {active === "dashboard" ? (
                      <Dashboard />
                    ) : active === "profile" ? (
                      <ProfileTab />
                    ) : active === "order" ? (
                      <OrderTab accountId={accountId} />
                    ) : active === "wishlist" ? (
                      <WishlistTab accountId={accountId}  />
                    ) : active === "address" ? (
                      <AddressesTab accountId={accountId} />
                    ) : active === "password" ? (
                      <PasswordTab />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutHomeFive>
  );
}