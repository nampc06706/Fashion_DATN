import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
export default function Cart({ className, type, accountId }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasProductsInCart, setHasProductsInCart] = useState(false);
  const token = Cookies.get('token');
  let userInfo;
 
  if (token) {
    try {
      userInfo = jwtDecode(token);
    } catch (error) {
      console.error("Token decoding error:", error);
    }
  }

  // Tải giỏ hàng từ cookies
  const loadCartFromCookies = () => {
    const cookieCart = Cookies.get('cart');
    const cartList = cookieCart ? JSON.parse(cookieCart) : [];
    setCartItems(cartList);
    setLoading(false); // Đặt loading thành false sau khi đã tải giỏ hàng từ cookies
  };



  // Định nghĩa hàm fetchCartFromDatabase
  const fetchCartFromDatabase = async () => {
    if (!accountId) return;

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

  useEffect(() => {
    loadCartFromCookies(); // Gọi hàm để tải giỏ hàng từ cookies
  }, []);

  useEffect(() => {
    if (token) {
      fetchCartFromDatabase(); // Tải giỏ hàng từ cơ sở dữ liệu nếu có token
    } else {
      loadCartFromCookies(); // Nếu không có token, tải giỏ hàng từ cookies
    }
  }, [accountId, token]);

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

    fetchProductDetails(); // Tải chi tiết sản phẩm khi giỏ hàng có item
  }, [cartItems, token]);


  const handleRemoveItem = async (id) => {
    //console.log("ID sản phẩm cần xóa:", id);
    // Cập nhật giỏ hàng trong trạng thái local
    const updatedCartItems = cartItems.filter(item => item.id !== id);
    //console.log(updatedCartItems)
    setCartItems(updatedCartItems); // Cập nhật trạng thái giỏ hàng
    Cookies.set('cart', JSON.stringify(updatedCartItems), { expires: 7 }); // Lưu giỏ hàng vào cookie

    // Lấy thông tin người dùng từ cookie
    const userInfo = JSON.parse(Cookies.get('user') || '{}'); // Sử dụng '{}' nếu cookie không tồn tại
    const accountId = userInfo?.accountId; // Lấy accountId từ userInfo
    //console.log("accountId:", accountId);

    // Nếu người dùng đã đăng nhập
    if (accountId) {
      try {
        // Gọi API xóa sản phẩm
        const response = await axios.delete(`http://localhost:8080/api/guest/carts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true, // Đảm bảo rằng cookie được gửi
        });

        // Kiểm tra trạng thái phản hồi
        if (response.status === 204) {
          // Chỉ cập nhật khi xóa thành công
          setCartItems(updatedCartItems);
          Cookies.set('cart', JSON.stringify(updatedCartItems), { expires: 7 });
          //console.log("Xóa sản phẩm thành công và đã cập nhật giỏ hàng.");
        }
        else {
          console.error("Lỗi khi xóa sản phẩm:", response.status);
        }
      } catch (error) {
        // Log chi tiết lỗi
        console.error("Lỗi khi xóa mục khỏi cơ sở dữ liệu:", error.response?.data || error.message);
      }
    } else {
      //console.log("Người dùng chưa đăng nhập, không thể xóa sản phẩm.");
    }
  };

  // Cập nhật trạng thái hasProductsInCart dựa trên giỏ hàng của bạn
  useEffect(() => {
    // Kiểm tra nếu giỏ hàng có sản phẩm
    setHasProductsInCart(cartItems && cartItems.length > 0);
  }, [cartItems]); // cartItems là dữ liệu giỏ hàng

  const handleCheckout = async () => {
    const token = Cookies.get("token");
    
    // Kiểm tra nếu không có token
    if (!token) {
      toast.warning("Vui lòng đăng nhập để thực hiện thanh toán.");
      return;
    }
  
    // Lấy dữ liệu giỏ hàng từ cookie
    const cartData = JSON.parse(Cookies.get('cart') || '[]');
  
    // Đánh dấu tất cả sản phẩm là đã chọn
    const updatedCartData = cartData.map(item => ({
      ...item,
      isSelected: true
    }));
  
    // Lưu lại giỏ hàng đã cập nhật vào cookie
    Cookies.set('cart', JSON.stringify(updatedCartData));
  
    // Điều hướng đến trang thanh toán
    navigate('/checkout');
  };
  



  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
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
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="ml-2 text-gray-400 hover:text-qred">
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
          <button
            onClick={handleCheckout}
            disabled={!hasProductsInCart} // Vô hiệu hóa nút nếu giỏ hàng trống
            className={`block w-full text-center py-2 rounded ${hasProductsInCart
              ? "bg-yellow-500 text-white hover:bg-yellow-600"
              : "bg-gray-200 text-gray-700 cursor-not-allowed"
              }`}
          >
            MUA NGAY
          </button>
        </div>


      </div>
    </div>
  );
}
