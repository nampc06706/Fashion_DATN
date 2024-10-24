import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import InputCom from "../Helpers/InputCom";
import PageTitle from "../Helpers/PageTitle";
import LayoutHomeFive from "../Partials/LayoutHomeFive";
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CheckoutPage() {
  const [shippingMethods, setShippingMethods] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [addressData, setAddressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [shippingFee, setShippingFee] = useState(0); // Phí vận chuyển
  const [totalAmount, setTotalAmount] = useState(0); // Tổng tiền
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullname: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    note: '',
    isdefault: false
  });

  const token = Cookies.get('token');
  let userInfo = null;

  if (token) {
    try {
      userInfo = jwtDecode(token);

    } catch (error) {
      console.error("Token decoding error:", error);
    }
  }

  useEffect(() => {
    // Lấy giỏ hàng từ cookie
    const cartData = JSON.parse(Cookies.get('cart') || '[]');
    // Lọc sản phẩm được chọn
    const selectedItems = cartData.filter(item => item.isSelected);
    setCartItems(selectedItems);
  }, []);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!userInfo) {
        setError("Không tìm thấy thông tin người dùng.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/user/addresses/account/${userInfo.accountId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true,
        });
        console.log(response.data)
        setAddressData(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu địa chỉ:", error);
        if (error.response) {
          if (error.response.status === 403) {
            setError("Bạn không có quyền truy cập vào tài nguyên này.");
          } else {
            setError("Có lỗi xảy ra khi tải địa chỉ.");
          }
        } else {
          setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [userInfo?.accountId, token]);

  const handleAddAddress = async () => {
    if (!userInfo) {
      toast.error("Bạn cần đăng nhập để thêm địa chỉ mới.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/user/addresses/add?accountId=${userInfo.accountId}`, // Gửi accountId qua URL
        newAddress, // newAddress sẽ chỉ chứa dữ liệu của địa chỉ
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      toast.success("Thêm địa chỉ thành công!");
      setAddressData((prevData) => [...prevData, response.data]);
      setShowNewAddressForm(false); // Ẩn form sau khi thêm địa chỉ thành công
      setNewAddress({ fullname: '', phone: '', province: '', district: '', ward: '', note: '', isdefault: false }); // Reset input
    } catch (error) {
      console.error("Lỗi khi thêm địa chỉ:", error);
      toast.error("Có lỗi xảy ra khi thêm địa chỉ.");
    }
  };


  const toggleNewAddressForm = () => {
    setShowNewAddressForm(!showNewAddressForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };


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
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
        setError("Không thể lấy thông tin sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [cartItems, token]);

  useEffect(() => {
    const loadShippingMethods = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/guest/shipping-methods`);
        const dataShippingMethod = response.data;
        setShippingMethods(dataShippingMethod);
      } catch (err) {
        setError('Không thể tải phương thức vận chuyển');
      }
    };

    loadShippingMethods();
  }, []);

  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/guest/payments`);
        const dataPaymentMethod = response.data;
        setPaymentMethods(dataPaymentMethod);
      } catch (err) {
        setError('Không thể tải phương thức thanh toán');
      }
    };

    loadPaymentMethods();
  }, []);

  useEffect(() => {
    const calculateTotalAmount = () => {
      let total = 0;
      cartItems.forEach(item => {
        const product = products[item.size.productId];
        if (product) {
          total += Number(item.quantity) * Number(product.price);
        }
      });
      total += Number(shippingFee);
      setTotalAmount(total);
    };

    calculateTotalAmount();
  }, [cartItems, products, shippingFee]);

  // Định dạng tiền VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleAddressChange = (id) => {
    setSelectedAddressId(selectedAddressId === id ? null : id);
  };
  const handlePaymentChange = (id) => {
    setSelectedPaymentMethod(selectedPaymentMethod === id ? null : id);
  };
  const handleShippingChange = (id, method) => {
    // Kiểm tra nếu phương thức đã chọn, bỏ chọn nó và đặt phí vận chuyển về 0
    if (selectedShippingMethod === id) {
      setSelectedShippingMethod(null);
      setShippingFee(0);
    } else {
      // Nếu phương thức khác được chọn, cập nhật phương thức và phí vận chuyển
      setSelectedShippingMethod(id);
      setShippingFee(method.price);
    }
  };



  useEffect(() => {
    if (addressData.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addressData[0].id); // Đặt địa chỉ đầu tiên làm mặc định
    }
  }, [addressData]);


  const handleCreateOrder = async () => {
    if (!selectedAddressId || !selectedShippingMethod || !selectedPaymentMethod) {
      toast.error("Vui lòng chọn địa chỉ, phương thức vận chuyển và phương thức thanh toán."); // Thông báo lỗi
      return;
    }

    const orderData = {
      accountId: userInfo.accountId,
      addressId: selectedAddressId,
      paymentId: selectedPaymentMethod,
      shippingMethodId: selectedShippingMethod,
      note: "",
      cartItems: cartItems.map(item => ({
        id: item.id || null,
        accountId: userInfo.accountId,
        quantity: Number(item.quantity),
        size: {
          id: item.size.id,
          productId: item.size.productId || null,
          name: item.size.name || null,
          quantityInStock: item.size.quantityInStock || null,
          color: item.size.color || null,
        }
      }))
    };

    try {
      const response = await axios.post('http://localhost:8080/api/user/orders/create', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      // Kiểm tra nếu phương thức thanh toán là VNPAY
      if (selectedPaymentMethod === 1) {
        // Nếu chọn VNPAY, chuyển hướng đến trang thanh toán VNPAY với thông tin đơn hàng
        const vnpayUrl = response.data.vnpayUrl; // Giả sử server trả về URL thanh toán
        window.location.href = vnpayUrl; // Chuyển hướng đến trang thanh toán VNPAY
      } else {
        toast.success("Đặt hàng thành công!"); // Thông báo thành công
        // Reset lại trạng thái sau khi đặt hàng thành công

        // Xóa sản phẩm khỏi giỏ hàng
        const orderCartItemIds = cartItems.map(item => item.id); // Lấy danh sách ID sản phẩm đã đặt hàng
        setCartItems(prevCartItems => prevCartItems.filter(item => !orderCartItemIds.includes(item.id))); // Lọc ra sản phẩm đã đặt hàng

        setCartItems([]);
        setSelectedAddressId(null);
        setSelectedShippingMethod(null);
        setSelectedPaymentMethod(null);
        setShippingFee(0);
        setTotalAmount(0);
      }
    } catch (error) {
      if (error.response) {
        // Kiểm tra mã lỗi
        if (error.response.status === 400) {
          // Thông báo lỗi 400 cụ thể
          const errorMessage = error.response.data.message || "Có lỗi xảy ra với đơn hàng."; // Lấy thông điệp lỗi từ phản hồi
          toast.error(`Lỗi 400: ${errorMessage}`); // Thông báo lỗi 400
        } else if (error.response.data.message.includes("Insufficient stock")) {
          // Thông báo khi hết số lượng trong kho
          toast.error("Không đủ hàng trong kho để hoàn tất đơn hàng.");
        } else {
          // Các lỗi khác
          toast.error("Có lỗi xảy ra khi tạo đơn hàng."); // Thông báo lỗi chung
        }
      } else {
        toast.error("Có lỗi xảy ra khi tạo đơn hàng."); // Thông báo lỗi chung
      }
    }
  };

  // Kiểm tra và cập nhật địa chỉ mặc định
  const handleSetDefaultAddress = async (addressId) => {
    if (!userInfo || !token) {
      toast.error("Bạn cần đăng nhập để thực hiện thao tác này.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/user/addresses/${userInfo.accountId}/set-default/${addressId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      toast.success("Đặt địa chỉ mặc định thành công!");

      // Cập nhật địa chỉ mặc định trong state
      setAddressData((prevData) =>
        prevData.map((address) => ({
          ...address,
          isdefault: address.id === addressId,
        }))
      );
    } catch (error) {
      console.error("Lỗi khi đặt địa chỉ mặc định:", error.message);
      toast.error("Có lỗi xảy ra khi đặt địa chỉ mặc định.");
    }
  };



  if (loading) {
    return <p>Đang tải thông tin...</p>;
  }
  return (

    <LayoutHomeFive childrenClasses="pt-0 pb-0">
      <ToastContainer />
      <div className="checkout-page-wrapper w-full bg-white pb-[60px]">
        <div className="w-full mb-5">
          <PageTitle
            title="Thanh Toán"
            breadcrumb={[{ name: "Trang chủ", path: "/" }, { name: "Thanh toán", path: "/checkout" }]}
          />
        </div>
        <div className="checkout-main-content w-full">
          <div className="container-x mx-auto">
            <div className="w-full lg:flex lg:space-x-[30px]">
              <div className="lg:w-1/2 w-full">
                <h1 className="sm:text-2xl text-xl text-qblack font-medium mb-5">Thông tin thanh toán</h1>
                <div className="address-wrapper p-5 border border-gray-200 rounded-lg mt-5">
                  <div className="form-area">
                    <h1 className="text-2xl text-qblack font-medium mb-3">Địa chỉ của tôi</h1>
                    <p className="text-[15px] text-qgray mb-2">Chọn địa chỉ nhận hàng</p>
                    <div>
                      {addressData.length > 0 ? (
                        addressData.map((address) => (
                          <div key={address.id} className="address-item mb-4 p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="mb-2">
                              <p className="text-lg font-semibold text-gray-700 mb-1">Thông tin liên hệ:</p>
                              <p className="text-xl font-medium text-blue-500">Tên người nhận: {address.fullname}</p>
                              <p className="text-gray-600">Số điện thoại: {address.phone}</p>
                            </div>
                            <div className="mb-2">
                              <p className="text-lg font-semibold text-gray-700 mb-1">Địa chỉ:</p>
                              <p className="text-gray-600">Tỉnh {address.province}, Quận/Huyện {address.district}, Xã/Phường {address.ward}</p>
                            </div>
                            <p className="text-gray-500">Số nhà, Số đường: {address.note}</p>
                            <div className="flex items-center mt-4 space-x-3">
                              <input
                                type="checkbox"
                                onChange={() => handleSetDefaultAddress(address.id)}
                                className="hidden"
                              />
                              <label className="relative flex items-center cursor-pointer" onClick={() => handleSetDefaultAddress(address.id)}>
                                <span className={`block w-10 h-5 rounded-full transition-colors duration-300 ${address.isdefault ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                                <span className={`absolute left-1 top-1 w-3.5 h-3.5 bg-white rounded-full transition-transform duration-300 transform ${address.isdefault ? 'translate-x-5' : 'translate-x-0'}`}></span>
                                <span className="text-gray-600 ml-3">Đặt làm địa chỉ mặc định</span>
                              </label>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="no-address-message text-center p-4 border border-red-200 bg-red-50 text-red-600 rounded-lg">
                          Chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.
                        </div>
                      )}


                      {/* Nút thêm địa chỉ mới */}
                      <button
                        onClick={toggleNewAddressForm}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Thêm địa chỉ mới
                      </button>

                      {/* Hiển thị overlay nếu showNewAddressForm là true */}
                      {showNewAddressForm && (
                        <div
                          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                          onClick={toggleNewAddressForm}
                        >
                          <div
                            className="bg-white p-6 shadow-lg rounded-lg w-96"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <h2 className="text-xl font-medium mb-3">Thêm địa chỉ mới</h2>
                            <InputCom
                              label="Họ và tên"
                              name="fullname"
                              placeholder="Nhập họ và tên"
                              value={newAddress.fullname}
                              inputHandler={handleInputChange}
                              required
                            />
                            <InputCom
                              label="Số điện thoại"
                              name="phone"
                              placeholder="Nhập số điện thoại"
                              value={newAddress.phone}
                              inputHandler={handleInputChange}
                              required
                            />
                            <InputCom
                              label="Tỉnh/Thành phố"
                              name="province"
                              placeholder="Nhập tỉnh/thành phố"
                              value={newAddress.province}
                              inputHandler={handleInputChange}
                            />
                            <InputCom
                              label="Quận/Huyện"
                              name="district"
                              placeholder="Nhập quận/huyện"
                              value={newAddress.district}
                              inputHandler={handleInputChange}
                            />
                            <InputCom
                              label="Xã/Phường"
                              name="ward"
                              placeholder="Nhập xã/phường"
                              value={newAddress.ward}
                              inputHandler={handleInputChange}
                            />
                            <InputCom
                              label="Số nhà, Số đường: "
                              name="note"
                              placeholder="Số nhà, Số đường: "
                              value={newAddress.note}
                              inputHandler={handleInputChange}
                            />
                            <button
                              onClick={handleAddAddress}
                              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                              type="button" // Ngăn chặn submit mặc định
                            >
                              Lưu địa chỉ
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>

                <div className="modal-overlay">
                  <div className="modal-content">
                    <form>
                      <InputCom
                        label="Ghi chú*"
                        name="note"
                        placeholder=""
                        inputClasses="w-full h-[50px]"
                      />
                    </form>
                  </div>
                </div>

              </div>

              <div className="flex-1">
                <h1 className="sm:text-2xl text-xl text-qblack font-medium mb-5">Tóm tắt đơn hàng</h1>

                <div className="w-full px-10 py-[30px] border border-[#EDEDED] rounded-lg shadow-sm">
                  <div className="sub-total mb-6">
                    <div className="flex justify-between mb-5">
                      <p className="text-[13px] font-medium text-qblack uppercase">Sản phẩm</p>
                      <p className="text-[13px] font-medium text-qblack uppercase">Tổng cộng</p>
                    </div>
                    <div className="w-full h-[1px] bg-[#EDEDED] mb-5"></div>
                  </div>
                  <div className="product-list w-full mb-[30px]">
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => {
                        const product = products[item.size.productId] || {};
                        return (
                          <ul className="flex flex-col space-y-5" key={item.id}>
                            <li>
                              <div className="flex justify-between items-center">
                                <img
                                  src={`/assets/images/${product.firstImage}`}
                                  alt="product"
                                  className="mb-4 border-b border-gray-200 pb-2 w-20 h-20 object-cover"
                                />
                                <div className="flex-grow ml-3">
                                  <h4 className="text-[15px] text-qblack mb-2.5">
                                    {product.name || 'Tên sản phẩm'}
                                    <sup className="text-[13px] text-qgray ml-2 mt-2">x{item.quantity}</sup>
                                  </h4>
                                  <p className="text-[13px] text-qgray">
                                    {item.size.color.name}, {item.size.name}, {formatCurrency(product.price)}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-[15px] text-qblack font-medium">
                                    {formatCurrency(item.quantity * product.price)}
                                  </span>
                                </div>
                              </div>
                            </li>
                          </ul>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="8" className="py-4 text-center">Giỏ hàng của bạn đang trống</td>
                      </tr>
                    )}
                  </div>

                  <div className="w-full h-[1px] bg-[#EDEDED] mb-6"></div>

                  <div className="payment-method mb-5">
                    <h1 className="text-2xl text-qblack font-medium mb-3">Phương thức vận chuyển</h1>
                    <p className="text-[15px] text-qgray mb-2">Chọn phương thức vận chuyển</p>
                    {shippingMethods.map(methodship => (
                      <div className="bg-[#F6F6F6] p-3 border border-[#EDEDED] rounded mb-4" key={methodship.id}>
                        <div className="flex items-center justify-between mb-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="shippingMethod"
                              checked={selectedShippingMethod === methodship.id}
                              onChange={() => handleShippingChange(methodship.id, methodship)} // Gọi hàm với id và method
                              className="mr-2 accent-qblack"
                            />
                            <h3 className="text-[15px] text-qblack">{methodship.methodName}</h3>
                            <p className="text-[13px] text-qgray">({methodship.estimatedDeliveryTime})</p>
                          </label>
                          <p className="text-[15px] text-qblack">{formatCurrency(methodship.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="payment-method mb-5">
                    <h1 className="text-2xl text-qblack font-medium mb-3">Phương thức thanh toán</h1>
                    <p className="text-[15px] text-qgray mb-2">Chọn phương thức thanh toán</p>
                    {paymentMethods.map(methodpay => (
                      <div className="bg-[#F6F6F6] p-3 border border-[#EDEDED] rounded mb-4" key={methodpay.id}>
                        <div className="flex items-center justify-between mb-2">
                          <label className="flex items-center">
                            <input type="radio" checked={selectedPaymentMethod === methodpay.id}
                              onChange={() => handlePaymentChange(methodpay.id)} className="mr-2 accent-qblack" />
                            <h3 className="text-[15px] text-qblack">{methodpay.method}</h3>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mb-2">
                    <p className="text-[14px] font-medium text-qblack">Tổng tiền</p>
                    <p className="text-[14px] font-medium text-qblack">{formatCurrency(totalAmount - shippingFee)}</p>
                  </div>
                  <div className="flex justify-between mb-2">
                    <p className="text-[14px] font-medium text-qblack">Phí vận chuyển</p>
                    <p className="text-[14px] font-medium text-qblack">{formatCurrency(shippingFee)}</p>
                  </div>
                  <div className="flex justify-between mb-5">
                    <p className="text-[14px] font-medium text-qblack">Tổng cộng</p>
                    <p className="text-[14px] font-medium text-qblack">{formatCurrency(totalAmount)}</p>
                  </div>
                </div>
                <div className="mt-5">
                  <button
                    className="w-full bg-qgreen text-black py-3 rounded-lg hover:bg-qdarkgreen transition-colors duration-300 shadow-md"
                    onClick={handleCreateOrder} >
                    Đặt hàng
                  </button>
                </div>


              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutHomeFive>
  );

}
