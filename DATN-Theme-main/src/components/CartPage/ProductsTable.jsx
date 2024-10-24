import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function ProductsTable({ onSelectedTotalChange, accountId }) {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error handling

  const token = Cookies.get('token');
  let userInfo;

  if (token) {
    try {
      userInfo = jwtDecode(token);
      //console.log("Decoded Token:", userInfo);
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


  const handleSelectionChange = (id) => {
    const updatedCartItems = cartItems.map(item =>
      item.id === id ? { ...item, isSelected: !item.isSelected } : item
    );
    setCartItems(updatedCartItems);
    Cookies.set('cart', JSON.stringify(updatedCartItems), { expires: 7 });
  };

  const handleQuantityChange = async (id, change) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(Number(item.quantity) + Number(change), 1);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCartItems(updatedCartItems);
    Cookies.set('cart', JSON.stringify(updatedCartItems), { expires: 7 });

    const itemToUpdate = updatedCartItems.find(item => item.id === id);

    if (accountId) {
      try {
        await axios.put(
          `http://localhost:8080/api/guest/carts/quantity`,
          {
            id: itemToUpdate.id,              // Gửi ID sản phẩm
            accountId: accountId,              // Gửi accountId vào body
            newQuantity: itemToUpdate.quantity  // Gửi số lượng mới
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } catch (error) {
        console.error("Lỗi khi cập nhật số lượng trong cơ sở dữ liệu:", error.response?.data || error.message);
        setError("Không thể cập nhật số lượng sản phẩm.");
      }
    } else {
      // Nếu người dùng chưa đăng nhập, có thể xử lý cập nhật giỏ hàng trong cookie ở đây nếu cần
      //console.log("Người dùng chưa đăng nhập, cập nhật trong cookie.");
    }
  };

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





  // Tính tổng giá cho các mục đã chọn
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => {
      if (item.isSelected) {
        const product = products[item.size.productId] || {};
        return sum + item.quantity * (product.price || 0);
      }
      return sum;
    }, 0);

    onSelectedTotalChange(total);
  }, [cartItems, products, onSelectedTotalChange]);
  // Định dạng tiền VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };
  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="w-full">
      <div className="relative w-full overflow-x-auto border border-[#EDEDED]">
        <table className="w-full text-sm text-left text-gray-500">
          <thead>
            <tr className="text-[13px] font-medium text-black bg-[#F6F6F6] whitespace-nowrap px-2 border-b default-border-bottom uppercase">
              <th className="py-4 text-center">Chọn</th>
              <th className="py-4 pl-10 block whitespace-nowrap min-w-[300px]">Sản phẩm</th>
              <th className="py-4 whitespace-nowrap text-center">Màu</th>
              <th className="py-4 whitespace-nowrap text-center">Kích cỡ</th>
              <th className="py-4 whitespace-nowrap text-center">Số lượng</th>
              <th className="py-4 whitespace-nowrap text-center">Giá</th>
              <th className="py-4 whitespace-nowrap text-center">Tạm tính</th>
              <th className="py-4 whitespace-nowrap text-center"></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.length > 0 ? (
              cartItems.map((item) => {
                const product = products[item.size.productId] || {};
                return (
                  <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="text-center py-4">
                      <input
                        type="checkbox"
                        checked={item.isSelected}
                        onChange={() => handleSelectionChange(item.id)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="pl-10 py-4 w-[380px]">
                      <div className="flex space-x-6 items-center">
                        <div className="w-[80px] h-[80px] overflow-hidden flex justify-center items-center border border-[#EDEDED]">
                          <img
                            src={`/assets/images/${product.firstImage}`}
                            alt="product"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <p className="font-medium text-[15px] text-qblack">
                            {product.name || 'Tên sản phẩm'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-4 px-2">
                      <div className="flex justify-center items-center">
                        <span
                          className="w-[20px] h-[20px] block rounded-full border border-gray-400"
                          style={{ backgroundColor: item.size.color.name }}
                        ></span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-2">
                      <span className="text-[15px] font-normal">{item.size.name}</span>
                    </td>
                    <td className="text-center py-4 px-2">
                      <div className="flex space-x-2 items-center justify-center">
                        <button onClick={() => handleQuantityChange(item.id, -1)} className="bg-gray-200 rounded-full px-2">-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.id, 1)} className="bg-gray-200 rounded-full px-2">+</button>
                      </div>
                    </td>
                    <td className="text-center py-4 px-2">
                      <span className="text-[15px] font-normal">
                       {formatCurrency(product.price)}
                      </span>
                    </td>
                    <td className="text-center py-4 px-2">
                      <span className="text-[15px] font-normal">
                      {formatCurrency(item.quantity * product.price)}
                      </span>
                    </td>
                    <td className="text-center py-4 px-2">
                      <button onClick={() => handleRemoveItem(item.id)} className="text-red-600">Xóa</button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="py-4 text-center">Giỏ hàng của bạn đang trống</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
