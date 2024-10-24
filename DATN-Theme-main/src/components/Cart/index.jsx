import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export default function Cart({ className, type, accountId }) {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = Cookies.get('token');
  let userInfo;

  if (token) {
    try {
      userInfo = jwtDecode(token);
    } catch (error) {
      console.error("Token decoding error:", error);
    }
  }

  useEffect(() => {
    const savedCart = Cookies.get('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error("Error parsing cart from cookie:", error);
      }
    }
  }, []);


  useEffect(() => {
    const fetchProductDetails = async () => {
      if (cartItems.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const productIds = Array.from(new Set(cartItems.map(item => item.size.productId)));
        const productRequests = productIds.map(id =>
          axios.get(`http://localhost:8080/api/guest/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );
        const responses = await Promise.all(productRequests);
        const productDetails = responses.reduce((acc, response) => {
          const product = response.data;
          acc[product.id] = product;
          return acc;
        }, {});
        setProducts(productDetails);
      } catch (error) {
        console.error("Error fetching product information:", error);
        setError("Could not fetch product information.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [cartItems, token]);

  useEffect(() => {
    if (!accountId) return;

    const fetchCartFromDatabase = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/guest/carts`, {
          params: { accountId: accountId },
          headers: { Authorization: `Bearer ${token}` }
        });
        const cartData = response.data || [];
        setCartItems(cartData);
        Cookies.set('cart', JSON.stringify(cartData), { expires: 7 });
      } catch (error) {
        console.error("Error fetching cart from database:", error);
        setError("Could not fetch cart information.");
      }
    };

    fetchCartFromDatabase();
  }, [accountId, token]);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  const formatPriceVND = (price) => {
    const priceInteger = Math.round(price);
    return priceInteger.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  return (
    <div
      className={`w-[300px] bg-white border-t-[3px] shadow-lg ${type === 3 ? "border-qh3-blue" : "cart-wrapper"} ${className || ""}`}
    >
      <div className="w-full h-full p-4">
        <h2 className="text-lg font-bold mb-4">Giỏ Hàng</h2>
        <div className="product-items h-[310px] overflow-y-auto mb-4">
          <ul>
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => {
                const product = products[item.size.productId];

                if (!product) return null;

                return (
                  <li key={index} className="flex mb-4 border-b border-gray-200 pb-2">
                    <div className="w-[65px] h-full mr-3">
                      <img
                        src={`/assets/images/${product.firstImage}`}
                        className="w-full h-full object-contain"
                        alt={product.name || "Product Image"}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="title text-sm font-semibold line-clamp-2 hover:text-blue-600">
                        {product.name || "Product Name"}
                      </h3>
                      <p className="price text-qred font-semibold text-[15px]">
                        {formatPriceVND(product.price || 0)}
                      </p>
                      <div className="items-center justify-between">
                        <p className="size text-[12px]">size: {item.size.name || "N/A"}</p>
                        <p className="color text-[12px] items-center">
                          <span
                            className="w-[15px] h-[15px] inline-block rounded-full border border-gray-400 ml-1"
                            style={{ backgroundColor: item.size.color.name }}
                          ></span>
                        </p>
                        <p className="quantity text-[12px]">SL: {item.quantity}</p>
                      </div>
                    </div>
                    <button className="ml-2 text-gray-400 hover:text-qred">
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 8 8"
                        fill="none"
                        className="inline fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M7.76 0.24C7.44 -0.08 6.96 -0.08 6.64 0.24L4 2.88L1.36 0.24C1.04 -0.08 0.56 -0.08 0.24 0.24C-0.08 0.56 -0.08 1.04 0.24 1.36L2.88 4L0.24 6.64C-0.08 6.96 -0.08 7.44 0.24 7.76C0.56 8.08 1.04 8.08 1.36 7.76L4 5.12L6.64 7.76C6.96 8.08 7.44 8.08 7.76 7.76C8.08 7.44 8.08 6.96 7.76 6.64L5.12 4L7.76 1.36C8.08 1.04 8.08 0.56 7.76 0.24Z" />
                      </svg>
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="text-center">Chưa có sản phẩm nào trong giỏ hàng</li>
            )}
          </ul>
        </div>
        <div className="h-[1px] bg-gray-200 mb-4"></div>
        <div className="total-equation flex justify-between items-center mb-4">
          <span className="text-md font-semibold">TỔNG TIỀN</span>
          <span className="text-md font-semibold text-qred">
            {formatPriceVND(cartItems.reduce((total, item) => total + (products[item.size.productId]?.price || 0) * item.quantity, 0))}
          </span>
        </div>
        <div className="product-action-btn">
          <a href="#" className="block w-full text-center py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
            MUA NGAY
          </a>
        </div>
      </div>
    </div>
  );
}
