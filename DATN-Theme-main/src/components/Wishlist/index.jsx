import BreadcrumbCom from "../BreadcrumbCom";
import EmptyWishlistError from "../EmptyWishlistError";
import PageTitle from "../Helpers/PageTitle";
import LayoutHomeFive from "../Partials/LayoutHomeFive";
import ProductsTable from "./ProductsTable";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; 
import React, { useEffect, useState } from "react"; 
export default function Wishlist({ wishlist = true }) {

  const token = Cookies.get('token');
  let accountId;

  if (token) {
    try {
      const userInfo = jwtDecode(token);
      accountId = userInfo.accountId; // Get accountId from decoded token
    } catch (error) {
      console.error("Token decoding error:", error);
    }
  }
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
              <div className="w-full mt-[30px] flex sm:justify-end justify-start">
                <div className="sm:flex sm:space-x-[30px] items-center">
                  <button type="button">
                    <div className="w-full text-sm font-semibold text-qred mb-5 sm:mb-0">
                    Xóa tất cả
                    </div>
                  </button>
                  <div className="w-[180px] h-[50px]">
                    <button type="button" className="yellow-btn">
                      <div className="w-full text-sm font-semibold">
                      Thêm vào giỏ hàng Tất cả
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </LayoutHomeFive>
  );
}
