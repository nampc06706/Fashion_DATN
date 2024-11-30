import React, { useEffect, useState } from "react";
import BreadcrumbCom from "../BreadcrumbCom";
import EmptyWishlistError from "../EmptyWishlistError";
import PageTitle from "../Helpers/PageTitle";
import LayoutHomeFive from "../Partials/LayoutHomeFive";
import ProductsTable from "./ProductsTable"; 
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; 
import { toast } from "react-toastify"; // Đảm bảo đã cài đặt react-toastify

export default function Wishlist({ wishlist = true }) {
  const token = Cookies.get('token');
  let accountId;

  if (token) {
    try {
      const userInfo = jwtDecode(token);
      accountId = userInfo.accountId; // Lấy accountId từ token đã giải mã
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
    }
  }

  // // Hàm xóa tất cả sản phẩm yêu thích
  // const handleRemoveAllFavourites = async () => {
  //   try {
  //     await axios.delete(`http://localhost:8080/api/user/favourites/removeAll/${accountId}`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
      
  //     toast.success("Đã xóa tất cả sản phẩm yêu thích!");
  //     window.location.reload();
  //   } catch (error) {
  //     console.error("Lỗi khi xóa tất cả sản phẩm yêu thích:", error);
  //     toast.error("Không thể xóa tất cả sản phẩm yêu thích.");
  //   }
  // };

  // // Hàm thêm tất cả sản phẩm yêu thích vào giỏ hàng
  // const handleAddAllFavouritesToCart = async () => {
  //   try {
  //     await axios.post(`http://localhost:8080/api/user/favourites/addToCart/${accountId}`, {}, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });

  //     toast.success("Đã thêm tất cả sản phẩm yêu thích vào giỏ hàng!");
  //     window.location.reload();
  //   } catch (error) {
  //     console.error("Lỗi khi thêm tất cả sản phẩm yêu thích vào giỏ hàng:", error.response.data); // Ghi log thông tin lỗi
  //     toast.error("Không thể thêm sản phẩm yêu thích vào giỏ hàng.");
  //   }
    
  // };

  return (
    <LayoutHomeFive childrenClasses={wishlist ? "pt-0 pb-0" : ""}>
      {wishlist === false ? (
        <div className="wishlist-page-wrapper w-full">
          <div className="container-x mx-auto">
            <BreadcrumbCom
              paths={[
                { name: "home-five", path: "/" },
                { name: "Yêu Thích", path: "/wishlist" },
              ]}
            />
            <EmptyWishlistError />
          </div>
        </div>
      ) : (
        <div className="wishlist-page-wrapper w-full bg-white pb-[60px]">
          <div className="w-full">
            <PageTitle
              title="Sản Phẩm Yêu Thích Của Tôi"
              breadcrumb={[
                { name: "Trang Chủ", path: "/" },
                { name: "Yêu Thích", path: "/wishlist" },
              ]}
            />
          </div>
          <div className="w-full mt-[23px]">
            <div className="container-x mx-auto">
              <ProductsTable className="mb-[30px]" accountId={accountId} />
            </div>
          </div>
        </div>
      )}
    </LayoutHomeFive>
  );
}
