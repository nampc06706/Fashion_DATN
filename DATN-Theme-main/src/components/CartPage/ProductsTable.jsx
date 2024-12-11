import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        //setError("Could not fetch product information.");
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
        //setError("Could not fetch cart information.");
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
    // Tìm sản phẩm trong giỏ hàng
    const itemToUpdate = cartItems.find(item => item.id === id);
    if (!itemToUpdate) {
      console.error('Không tìm thấy sản phẩm trong giỏ hàng.');
      return;
    }

    // Lấy thông tin tồn kho từ sản phẩm
    const selectedSizeInfo = itemToUpdate.size;  // Dữ liệu size từ cart item đã có thông tin tồn kho
    if (!selectedSizeInfo) {
      console.error('Không tìm thấy thông tin kích cỡ sản phẩm.');
      return;
    }

    // Tính toán số lượng mới
    const newQuantity = Math.max(Number(itemToUpdate.quantity) + Number(change), 1);

    // Kiểm tra tồn kho
    if (newQuantity > selectedSizeInfo.quantityInStock) {
      toast.error(`Số lượng vượt quá tồn kho. Chỉ còn ${selectedSizeInfo.quantityInStock} sản phẩm.`);
      return;
    }

    // Cập nhật số lượng trong giỏ hàng
    const updatedCartItems = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    // Cập nhật giỏ hàng trong state và cookie
    setCartItems(updatedCartItems);
    Cookies.set('cart', JSON.stringify(updatedCartItems), { expires: 7 });

    // Nếu người dùng đã đăng nhập, gửi yêu cầu cập nhật lên server
    if (accountId) {
      try {
        await axios.put(
          `http://localhost:8080/api/guest/carts/quantity`,
          {
            id: itemToUpdate.id,
            accountId: accountId,
            newQuantity: newQuantity
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        toast.success('Cập nhật số lượng giỏ hàng thành công.');
      } catch (error) {
        console.error("Lỗi khi cập nhật số lượng trong cơ sở dữ liệu:", error.response?.data || error.message);
        setError("Không thể cập nhật số lượng sản phẩm.");
      }
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
    <div className="w-full p-6 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cartItems.length > 0 ? (
          cartItems.map((item) => {
            const product = products[item.size.productId] || {};
            return (
              <div
                key={item.id}
                className="relative bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col space-y-4"
              >
                {/* Hình ảnh sản phẩm */}
                <div className="w-full h-48 flex items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={`/assets/images/${product.firstImage}`}
                    alt="product"
                    className="w-auto h-full object-contain"
                  />
                </div>

                {/* Thông tin sản phẩm */}
                <div className="flex flex-col space-y-2">
                  <h3 className="font-bold text-lg text-gray-800">
                    {product.name || 'Tên sản phẩm'}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Màu:</span>
                    <div
                      className="w-5 h-5 rounded-full border"
                      style={{ backgroundColor: item.size.color.name }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">Kích cỡ: {item.size.name}</div>
                </div>

                {/* Giá và số lượng */}
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Giá:</span>
                    <span className="font-medium text-gray-800">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tạm tính:</span>
                    <span className="font-medium text-gray-800">
                      {formatCurrency(item.quantity * product.price)}
                    </span>
                  </div>
                </div>

                {/* Số lượng và hành động */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-600 font-medium hover:underline"
                  >
                    Xóa
                  </button>
                </div>

                {/* Checkbox chọn */}
                <div className="absolute top-4 right-4">
                  <input
                    type="checkbox"
                    checked={item.isSelected}
                    onChange={() => handleSelectionChange(item.id)}
                    className="cursor-pointer w-5 h-5 accent-black"
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center text-gray-500">
            Giỏ hàng của bạn đang trống
          </div>
        )}
      </div>
      <ToastContainer autoClose={1000} />
    </div>

  );
}
