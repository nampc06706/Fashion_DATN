import React, { useEffect, useState } from "react";
import BreadcrumbCom from "../BreadcrumbCom";
import EmptyCardError from "../EmptyCardError";
import PageTitle from "../Helpers/PageTitle";
import LayoutHomeFive from "../Partials/LayoutHomeFive";
import ProductsTable from "./ProductsTable";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export default function CardPage({ cart = true }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTotal, setSelectedTotal] = useState(0);
  const navigate = useNavigate();

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

  // Load cart data from cookies
  const loadCartFromCookies = () => {
    const cookieCart = Cookies.get('cart');
    const cartList = cookieCart ? JSON.parse(cookieCart) : [];
    setCartItems(cartList);
    setLoading(false);
  };

  const loadCartFromDatabase = async (accountId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/guest/carts`, {
        params: { accountId },
        headers: { Authorization: `Bearer ${token}` }
      });

      const cartList = response.data.map(item => ({
        ...item,
        isSelected: item.isSelected ?? false, // Default to false
      }));

      setCartItems(cartList);
      Cookies.set('cart', JSON.stringify(cartList), { expires: 7 });
      setLoading(false);
    } catch (err) {
      setError("Có lỗi xảy ra khi tải dữ liệu giỏ hàng.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadCartFromDatabase(accountId);
    } else {
      loadCartFromCookies();
    }
  }, []);

  // Show loading or error if any
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleCheckout = async () => {
    // Kiểm tra nếu không có token
    if (!token) {
      toast.warning("Vui lòng đăng nhập để thực hiện thanh toán.");
      //navigate('/login'); // Điều hướng đến trang đăng nhập nếu không có token
      return;
    }

    // Phân tích giỏ hàng từ cookie
    const cartData = JSON.parse(Cookies.get('cart') || '[]');

    // Lọc các sản phẩm được chọn
    const selectedItems = cartData.filter(item => item.isSelected);
    console.log(selectedItems); // In ra để kiểm tra sản phẩm đã chọn

    // Kiểm tra xem có sản phẩm nào được chọn không
    if (selectedItems.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    }

    // Điều hướng đến trang thanh toán nếu các điều kiện trên đều thỏa mãn
    navigate('/checkout');
  };





  return (
    <LayoutHomeFive childrenClasses={cart ? "pt-0 pb-0" : ""}>
      <ToastContainer autoClose={1000} />
      {cartItems.length === 0 ? (
        <div className="cart-page-wrapper w-full">
          <div className="container-x mx-auto">
            <BreadcrumbCom
              paths={[{ name: "home", path: "/" }, { name: "cart", path: "/cart" }]}
            />
            <EmptyCardError />
          </div>
        </div>
      ) : (
        <div className="cart-page-wrapper w-full bg-white pb-[60px]">
          <div className="w-full">
            <PageTitle
              title="GIỎ HÀNG CỦA TÔI"
              breadcrumb={[{ name: "home", path: "/" }, { name: "cart", path: "/cart" }]}
            />
          </div>
          <div className="w-full mt-[23px]">
            <div className="container-x mx-auto">
              <ProductsTable
                cartItems={cartItems}
                onSelectedTotalChange={setSelectedTotal}
                className="mb-[30px]"
                accountId={accountId}
              />
              <div className="w-full mt-[30px] flex sm:justify-end">
                <div className="sm:w-[370px] w-full border border-[#EDEDED] px-[30px] py-[26px]">
                  <div className="total mb-6">
                    <div className="flex justify-between">
                      <p className="text-[18px] font-medium text-qblack">Tổng tiền đã chọn</p>
                      <p className="text-[18px] font-medium text-qred">
                        {selectedTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </p>
                    </div>
                  </div>
                  <div onClick={handleCheckout} className="w-full h-[50px] black-btn flex justify-center items-center cursor-pointer">
                    <span className="text-sm font-semibold">Tiến hành thanh toán</span>
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
