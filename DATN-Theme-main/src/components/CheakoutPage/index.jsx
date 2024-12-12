import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import InputCom from "../Helpers/InputCom";
import PageTitle from "../Helpers/PageTitle";
import LayoutHomeFive from "../Partials/LayoutHomeFive";
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
  const navigate = useNavigate();
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
  const [note, setNote] = useState("");
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
      //console.error("Token decoding error:", error);
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
        //console.log(response.data)
        setAddressData(response.data);
      } catch (error) {
        //console.error("Lỗi khi lấy dữ liệu địa chỉ:", error);
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
      //console.error("Lỗi khi thêm địa chỉ:", error);
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
        //console.error("Lỗi khi lấy thông tin sản phẩm:", error);
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
        const response = await axios.get(`http://localhost:8080/api/user/payments`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Thêm token vào header
            'Content-Type': 'application/json', // Thêm Content-Type nếu cần
          },
          withCredentials: true, // Nếu bạn cần gửi cookies cùng với yêu cầu
        });

        const dataPaymentMethod = response.data;
        console.log(dataPaymentMethod);

        setPaymentMethods(dataPaymentMethod);
      } catch (err) {
        setError('Không thể tải phương thức thanh toán');
      }
    };

    loadPaymentMethods();
  }, [token]); // Thêm token vào dependency array nếu nó có thể thay đổi


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
    // Kiểm tra xem người dùng đã chọn đủ thông tin chưa
    if (!selectedAddressId || !selectedShippingMethod || !selectedPaymentMethod) {
      toast.error("Vui lòng chọn địa chỉ, phương thức vận chuyển và phương thức thanh toán."); // Thông báo lỗi
      return;
    }
    // Kiểm tra nếu giỏ hàng trống
    if (!cartItems || cartItems.length === 0) {
      toast.error("Giỏ hàng của bạn không có sản phẩm.");
      // Chuyển hướng sang trang /order sau 2 giây
      setTimeout(() => {
        navigate('/cart');
      }, 2000);
      return;
    }


    const orderData = {
      accountId: userInfo.accountId,
      addressId: selectedAddressId,
      paymentId: selectedPaymentMethod,
      shippingMethodId: selectedShippingMethod,
      note: note, // Sử dụng giá trị note từ state
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

    // console.log("Order Data: ", orderData); // Log thông tin đơn hàng

    try {
      // Sử dụng endpoint của PaymentController
      const response = await fetch('http://localhost:8080/api/user/payments/create-payment-url', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
        credentials: 'include', // Để gửi cookie
      });

      const data = await response.json();
      //console.log("Payment Response: ", data);

      // Kiểm tra nếu phương thức thanh toán là VNPAY
      //console.log("Selected Payment Method: ", selectedPaymentMethod); // Log giá trị phương thức thanh toán

      if (selectedPaymentMethod == 1) {
        const vnpayUrl = data.vnpayUrl;
        console.log("VNPAY URL: ", vnpayUrl); // Log URL VNPAY

        if (vnpayUrl) {
          console.log("Redirecting to VNPAY URL: ", vnpayUrl);
          window.location.href = vnpayUrl; // Chuyển hướng tự động
          return;
        } else {
          console.error("No vnpayUrl found in the response.");
          toast.error("Không nhận được URL thanh toán từ server.");
          return; // Ngừng thực hiện nếu không có URL
        }
      }

      // Nếu không phải là phương thức VNPAY
      toast.success("Đặt hàng thành công!"); // Thông báo thành công

      // Reset lại trạng thái sau khi đặt hàng thành công
      const orderCartItemIds = cartItems.map(item => item.id); // Lấy danh sách ID sản phẩm đã đặt hàng
      setCartItems(prevCartItems => prevCartItems.filter(item => !orderCartItemIds.includes(item.id))); // Lọc ra sản phẩm đã đặt hàng

      // Reset các giá trị trạng thái
      setSelectedAddressId(null);
      setSelectedShippingMethod(null);
      setSelectedPaymentMethod(null);
      setShippingFee(0);
      setTotalAmount(0);

      // Chuyển hướng sang trang /order sau 2 giây
      setTimeout(() => {
        navigate('/profile#order');
      }, 2000);

      // navigate('/profile#order');
    } catch (error) {
      console.error("Error creating order: ", error); // Log lỗi
      if (error.response) {
        // Kiểm tra mã lỗi
        if (error.response.status === 400) {
          const errorMessage = error.response.data.message || "Không đủ hàng trong kho để hoàn tất đơn hàng, vui lòng liên hệ 098765432 để được hỗ trợ!"; // Lấy thông điệp lỗi từ phản hồi
          toast.error(`Lỗi: ${errorMessage}`); // Thông báo lỗi 400
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

      // Gọi lại fetchDefaultAddress để đảm bảo rằng chúng ta có dữ liệu mới nhất
      fetchDefaultAddress(); // Cập nhật lại địa chỉ mặc định từ server
    } catch (error) {
      //console.error("Lỗi khi đặt địa chỉ mặc định:", error.message);
      toast.error("Có lỗi xảy ra khi đặt địa chỉ mặc định.");
    }
  };

  // Hàm lấy địa chỉ mặc định
  const fetchDefaultAddress = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/user/addresses/${userInfo.accountId}/default`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (response.data) {
        setSelectedAddressId(response.data.id); // Đặt địa chỉ mặc định
      }
    } catch (error) {
      //console.error("Lỗi khi lấy địa chỉ mặc định:", error.message);
      //toast.error("Không thể lấy địa chỉ mặc định.");
    }
  };

  // Gọi hàm này khi component load để lấy địa chỉ mặc định
  useEffect(() => {
    if (userInfo && token) {
      fetchDefaultAddress();
    }
  }, [userInfo, token]);




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
                <h1 className="sm:text-2xl text-xl text-qblack font-semibold mb-5 border-b pb-2">
                  Thông tin thanh toán
                </h1>
                <div className="address-wrapper bg-white shadow-md rounded-lg p-6 border border-gray-200 mt-6">
                  <div className="form-area">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Địa chỉ của tôi</h1>
                    <p className="text-sm text-gray-500 mb-6">Bạn có thể chọn hoặc thêm địa chỉ mới để sử dụng.</p>

                    <div>
                      <div className="address-list-container">
                        <div className="overflow-y-auto h-[320px] space-y-4 p-4">
                          {addressData.length > 0 ? (
                            addressData.map((address) => (
                              <div
                                key={address.id}
                                className={`address-card p-4 rounded-lg ${address.isdefault
                                  ? 'border-l-4 border-indigo-400 bg-indigo-50 shadow-sm'
                                  : 'border-l-4 border-gray-300 bg-white shadow-sm p-2'} transition-all transform`}
                              >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                  {/* Name and Phone (smaller for non-default) */}
                                  <div>
                                    <p className={`font-semibold text-gray-900 ${address.isdefault ? 'text-lg' : 'text-xs'}`}>
                                      {address.fullname}
                                    </p>
                                    <p className={`text-gray-600 mt-1 flex items-center ${address.isdefault ? 'text-sm' : 'text-[10px]'}`}>
                                      <i className="fas fa-phone-alt mr-1 text-green-500"></i> {address.phone}
                                    </p>
                                  </div>

                                  {/* Default Address Tag - Hiển thị khi là địa chỉ mặc định */}
                                  {address.isdefault && (
                                    <div
                                      className="py-1 px-4 mt-2 md:mt-0 rounded-full text-[9px] font-semibold bg-indigo-100 text-indigo-600 text-xs"
                                    >
                                      Mặc định
                                    </div>
                                  )}
                                </div>

                                {/* Address Note (smaller for non-default) */}
                                <div className={`text-[9px] text-gray-600 mt-2 ${address.isdefault ? 'text-sm' : 'text-[8px]'}`}>
                                  <p className="flex items-center">
                                    <i className="fas fa-map-marker-alt mr-1 text-red-500"></i>
                                    {address.note}, {address.ward}, {address.district}, {address.province}
                                  </p>
                                </div>

                                {/* Set Default Address Button - Hide if address is default */}
                                {!address.isdefault && (
                                  <div className="flex justify-between items-center mt-2">
                                    <button
                                      onClick={() => handleSetDefaultAddress(address.id)}
                                      className="py-1 px-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold text-[10px] rounded-lg shadow-sm hover:scale-105 transition-transform duration-300"
                                      title="Đặt làm mặc định"
                                    >
                                      Đặt làm mặc định
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="no-address-message text-center p-6 border-2 border-indigo-300 bg-indigo-50 text-indigo-600 rounded-xl shadow-sm">
                              <p className="text-lg font-semibold">Chưa có địa chỉ nào</p>
                              <p>Vui lòng thêm địa chỉ mới để tiếp tục.</p>
                            </div>
                          )}
                        </div>
                      </div>



                      <button
                        onClick={toggleNewAddressForm}
                        className="mt-6 bg-indigo-600 text-white py-2 px-4 text-sm font-medium shadow-md flex items-center justify-center hover:bg-indigo-700 transition-all duration-200 ease-in-out"
                      >
                        <i className="fas fa-plus mr-2 text-lg"></i>
                        <span>Thêm địa chỉ mới</span>
                      </button>



                      {showNewAddressForm && (
                        <div
                          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
                          onClick={toggleNewAddressForm}
                        >
                          <div
                            className="bg-white p-8 rounded-3xl shadow-xl w-[450px] animate-fade-in"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Thêm địa chỉ mới</h2>
                            <div className="space-y-6">
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
                                label="Số nhà, Số đường:"
                                name="note"
                                placeholder="Nhập số nhà, số đường"
                                value={newAddress.note}
                                inputHandler={handleInputChange}
                              />
                            </div>
                            <button
                              onClick={handleAddAddress}
                              className="mt-6 w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 rounded-xl transform transition-all hover:scale-105 hover:shadow-2xl"
                              type="button"
                            >
                              Lưu địa chỉ
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <form>
                    <div className="mb-4">
                      <label htmlFor="note" className="block text-sm font-semibold text-gray-700">
                        Ghi chú*
                      </label>
                      <input
                        id="note"
                        name="note"
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Nhập ghi chú"
                        className="w-full h-[50px] p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:animate-borderRound"
                      />
                    </div>
                  </form>
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

                                  </h4>
                                  <p className="text-[13px] text-qgray">
                                    <span
                                      className="w-[20px] h-[20px] block rounded-full border border-gray-400"
                                      style={{ backgroundColor: item.size.color.name }}
                                    ></span>
                                    Size: {item.size.name}
                                    , Giá:{formatCurrency(product.price)}<span className="text-[13px] text-qgray ml-2 mt-2">x{item.quantity}</span>
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
