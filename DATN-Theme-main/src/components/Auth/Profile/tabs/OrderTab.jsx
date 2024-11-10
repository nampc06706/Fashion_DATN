import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Sửa import cho jwtDecode
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function OrderTab({ accountId: initialAccountId }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [accountId, setAccountId] = useState(initialAccountId);
  const [error, setError] = useState(null);
  const [stars, setStars] = useState(1);
  const [review, setReview] = useState("");
  const [sizeId, setSizeId] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [ratingStatus, setRatingStatus] = useState(""); // state để lưu trạng thái đánh giá
  const [hasRated, setHasRated] = useState(false);
  const token = Cookies.get("token");

  // Hàm kiểm tra người dùng đã đánh giá chưa
  const checkIfRated = async (orderId, sizeId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/user/ratings/check/${orderId}/${sizeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Log để kiểm tra dữ liệu trả về từ API
      //console.log("API Response:", response.data);

      // Kiểm tra giá trị hasRated để phân biệt kết quả
      if (response.data.hasRated) {
        setHasRated(true);
        setRatingStatus("Bạn đã đánh giá sản phẩm này.");
        //console.log("User has rated: ", response.data.hasRated); // Log hasRated
      } else {
        setHasRated(false);
        setRatingStatus("Bạn có thể đánh giá sản phẩm này.");
        //console.log("User has not rated: ", response.data.hasRated); // Log hasRated
      }
    } catch (error) {
      console.error("Có lỗi khi kiểm tra đánh giá:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra để lấy sizeId một cách an toàn
    const orderDetails = selectedOrder?.orderDetails?.[0]; // Lấy phần tử đầu tiên từ orderDetails nếu có

    const reviewData = {
      orderId: selectedOrder.id, // Dùng selectedOrder.id
      sizeId: orderDetails ? orderDetails.size.id : sizeId, // Nếu orderDetails có thì lấy size.id, nếu không dùng sizeId từ state
      stars: stars,
      review: review,
    };

    console.log("Submitting review:", reviewData);
    createRating(reviewData);
  };
  // Mở modal chi tiết đơn hàng
  const handleOpenDetailModal = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
    // Kiểm tra xem người dùng đã đánh giá chưa khi mở modal chi tiết đơn hàng
    const orderDetails = order.orderDetails[0]; // Lấy phần tử đầu tiên từ orderDetails
    checkIfRated(order.id, orderDetails.size.id);
  };

  // Đóng modal chi tiết đơn hàng
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
  };

  // Mở modal đánh giá
  const handleOpenReviewModal = (order) => {
    if (hasRated) {
      alert(ratingStatus); // Nếu đã đánh giá thì không mở modal
    } else {
      setSelectedOrder(order);
      setIsReviewModalOpen(true); // Chỉ mở modal khi chưa đánh giá
    }
  };

  // Đóng modal đánh giá
  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
  };



  useEffect(() => {
    if (token) {
      try {
        const userInfo = jwtDecode(token);
        setAccountId(userInfo.accountId);
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
      }
    } else {
      console.warn("Không có token.");
    }
  }, [token]);

  const formatDateArray = (dateArray) => {
    const [year, month, day, hour, minute, second] = dateArray;
    return new Date(year, month - 1, day, hour, minute, second); // `month - 1` vì tháng trong Date bắt đầu từ 0
  };

  // Hàm đánh giá
  const createRating = async (reviewData) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/ratings/create", // Địa chỉ API của bạn
        reviewData, // Gửi trực tiếp dữ liệu reviewData
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`, // Gửi token trong header
          },
        }
      );

      toast.success("Đánh giá thành công!");
      //console.log(response.data); // Đối tượng rating trả về

      // Sau khi đánh giá thành công, reload lại trang sau 1 giây
      setTimeout(() => {
        window.location.reload(); // Reload lại trang
      }, 1000); // Thời gian chờ 1 giây (1000ms)

    } catch (error) {
      //console.error("Có lỗi xảy ra:", error);
      toast.error("Có lỗi khi tạo đánh giá");
    }
  };


  // Định nghĩa hàm fetchOrders bên ngoài useEffect
  const fetchOrders = async () => {
    if (accountId) {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/orders/${accountId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Sắp xếp đơn hàng theo ngày mới nhất
        const sortedOrders = response.data.sort((a, b) =>
          formatDateArray(b.date) - formatDateArray(a.date)
        );

        setOrders(sortedOrders);
        //console.log('Đơn hàng đã sắp xếp:', sortedOrders);
      } catch (error) {
        //console.error('Lỗi khi lấy đơn hàng:', error);
        //toast.error('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.');
      }
    } else {
      console.warn('Không có accountId.');
    }
  };

  // Gọi fetchOrders khi component được render
  useEffect(() => {
    fetchOrders();
  }, [accountId, token]);

  // Hàm cập nhật trạng thái đơn hàng thành 5
  const updateOrderStatus = async (orderId) => {
    try {
      //console.log('Token:', token);
      //console.log('Order ID:', orderId);

      // Gọi API với token trong header
      const response = await axios.put(
        `http://localhost:8080/api/user/orders/${orderId}/setStatus`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(`Đã hủy đơn ${orderId} thành công`);
        // Gọi lại hàm fetchOrders để cập nhật danh sách đơn hàng
        fetchOrders();
      } else {
        const errorMessage = response.data?.message || 'Không thể cập nhật trạng thái đơn hàng.';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
      toast.error('Lỗi khi cập nhật trạng thái đơn hàng.');
    }
  };




  // Hàm chuyển đổi trạng thái đơn hàng thành chuỗi mô tả
  const getOrderStatus = (status) => {
    switch (status.toString()) { // Đảm bảo status là chuỗi để so sánh
      case '1': return "Chờ xác nhận";
      case '2': return "Đã xác nhận";
      case '3': return "Đang giao hàng";
      case '4': return "Hoàn thành";
      case '5': return "Đã hủy";
      case '99': return "Thanh toán VNPay thất bại";
      case '0': return "Đã thanh toán, Chờ xác nhận";
      default: return "Không xác định";
    }
  };

  const handlePaymentAgain = async (orderId) => {
    try {
      // In ra token và orderId để kiểm tra giá trị
      // console.log('Token:', token);
      // console.log('Order ID:', orderId);

      // Gửi yêu cầu POST đến API với token trong header
      const response = await axios.post(
        'http://localhost:8080/api/user/payments/payment-again',
        { orderId: orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào header
          },
        }
      );

      // Kiểm tra phản hồi API
      //console.log('API Response:', response.data);

      const vnpayUrl = response.data.vnpayUrl;
      //console.log('VNPAY URL:', vnpayUrl);

      // Kiểm tra và chuyển hướng đến link thanh toán
      if (vnpayUrl) {
        setError(null); // Reset error state
        window.location.href = vnpayUrl; // Chuyển hướng trực tiếp
      } else {
        setError('URL thanh toán không hợp lệ');
      }
    } catch (error) {
      // Xử lý lỗi khi gọi API
      //console.error('API Error:', error);
      setError(error.response?.data?.error || 'Có lỗi xảy ra khi gọi API');
    }
  };


  // Hàm tính tổng tiền từ orderDetails và giá của shippingMethod
  const calculateTotalPrice = (orderDetails, shippingMethod) => {
    const productTotal = orderDetails.reduce((total, detail) => {
      return total + parseFloat(detail.price);
    }, 0);

    const shippingCost = parseFloat(shippingMethod?.price) || 0; // Tránh lỗi khi không có shippingMethod
    return productTotal + shippingCost;
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} />

      <div className="relative w-full overflow-x-auto sm:rounded-lg">

        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead>
            <tr className="text-base text-qgray whitespace-nowrap px-2 border-b default-border-bottom">
              <th className="py-4 block whitespace-nowrap text-center">Đặt hàng</th>
              <th className="py-4 whitespace-nowrap text-center">Ngày</th>
              <th className="py-4 whitespace-nowrap text-center">Trạng thái</th>
              <th className="py-4 whitespace-nowrap text-center">Tổng tiền</th>
              <th className="py-4 whitespace-nowrap text-center"></th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="text-center py-4">
                    <span className="text-lg text-qgray font-medium">#{order.id}</span>
                  </td>
                  <td className="text-center py-4 px-2">
                    <span className="text-base text-qgray whitespace-nowrap">
                      {new Date(order.date[0], order.date[1] - 1, order.date[2], order.date[3], order.date[4], order.date[5])
                        .toLocaleString("vi-VN")}
                    </span>
                  </td>
                  <td className="text-center py-4 px-2">
                    <span
                      className={`text-sm rounded p-2 ${order.status === "5" || order.status === "99"
                        ? "text-red-500 bg-red-100" // Màu đỏ cho số 5 và 99
                        : order.status === "4"
                          ? "text-green-500 bg-green-100" // Màu xanh cho trạng thái 4
                          : "text-blue-500 bg-blue-100" // Màu khác cho các số khác
                        }`}
                    >
                      {getOrderStatus(order.status)}
                    </span>
                  </td>

                  <td className="text-center py-4 px-2">
                    <span className="text-base text-qblack whitespace-nowrap px-2">
                      {calculateTotalPrice(order.orderDetails, order.shippingMethod).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                    </span>
                  </td>
                  <td className="text-center py-4">
                    <button
                      type="button"
                      onClick={() => handleOpenDetailModal(order)}
                      className="w-[116px] h-[46px] bg-qyellow text-qblack font-bold"
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white border-b">
                <td colSpan="5" className="text-center py-4">Không có đơn hàng nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isDetailModalOpen && selectedOrder && (
        <>
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 z-40" onClick={handleCloseDetailModal}></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl z-50 w-11/12 max-w-lg max-h-screen overflow-y-auto p-6 transition-transform duration-300 ease-in-out">
            <h2 className="text-3xl font-bold mb-4 text-center text-blue-800">HÓA ĐƠN THÀNH TOÁN</h2>
            <div className="flex flex-col mb-6 space-y-4">

              {/* Chi tiết đơn hàng */}
              <div className="flex justify-between items-center border-b-2 pb-2">
                <span className="font-semibold text-gray-800">Tên người nhận:</span>
                <span className="text-gray-700">{selectedOrder.address.fullname || "Tên khách hàng"}</span>
              </div>
              <div className="flex justify-between items-center border-b-2 pb-2">
                <span className="font-semibold text-gray-800">Số điện thoại:</span>
                <span className="text-gray-700">0{selectedOrder.address.phone || "Tên khách hàng"}</span>
              </div>
              <div className="flex justify-between items-center border-b-2 pb-2">
                <span className="font-semibold text-gray-800">Ghi chú:</span>
                <span className="text-gray-700">{selectedOrder.note || "Không có ghi chú"}</span>
              </div>
              <div className="flex justify-between items-center border-b-2 pb-2">
                <span className="font-semibold text-gray-800">Địa chỉ giao hàng:</span>
                <span className="text-gray-700">{`${selectedOrder.address.province}, ${selectedOrder.address.district}, ${selectedOrder.address.ward}, ${selectedOrder.address.note}`}</span>
              </div><div className="flex flex-col space-y-4">
                {selectedOrder.orderDetails.map((detail, index) => (
                  <div key={index} className="border-b pb-4 flex justify-between">
                    <div className="flex-grow">
                      <span className="text-gray-800 font-semibold">{detail.size?.product?.name || "Tên sản phẩm"}</span>
                      <div className="text-gray-700">
                        <p>{`Kích thước: ${detail.size?.name || "N/A"}`}</p>
                        <div className="w-[30px] h-[30px] rounded-full border">
                          <p
                            style={{
                              backgroundColor: detail.size?.color?.name || 'gray', // Nếu không có màu, sẽ dùng màu gray làm mặc định
                              width: '100%', // Đảm bảo thẻ <p> chiếm đầy đủ chiều rộng của <div>
                              height: '100%', // Đảm bảo thẻ <p> chiếm đầy đủ chiều cao của <div>
                              margin: 0, // Bỏ margin mặc định của thẻ <p>
                              borderRadius: '50%', // Đảm bảo rằng thẻ <p> có dạng hình tròn
                            }}
                          />
                        </div>
                        <p>
                          {`Giá: ${detail.size?.product?.price !== undefined
                            ? Math.round(detail.size?.product?.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })
                            : "Không có thông tin"}`}
                        </p>

                        <p>{`Số lượng: ${detail.quantity}`}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {/* Hiển thị hình ảnh sản phẩm */}
                      {detail.images && detail.images.length > 0 ? (
                        <img
                          src={`/assets/images/${detail.images[0].image}`} // Cập nhật đường dẫn hình ảnh
                          alt={detail.size?.product?.name || "Hình ảnh sản phẩm"}
                          className="h-20 w-20 object-cover"
                        />
                      ) : (
                        <div className="h-20 w-20 bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-500">Không có hình ảnh</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>



              {/* Tổng tiền và phí giao hàng */}
              <div className="flex justify-between items-center border-t-2 pt-2 font-semibold text-gray-800">
                <span>Tổng tiền:</span>
                <span>{calculateTotalPrice(selectedOrder.orderDetails).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
              </div>

              <div className="flex justify-between items-center border-t-2 pt-2 font-semibold text-gray-800">
                <span>Phí giao hàng:</span>
                <span>
                  {selectedOrder.shippingMethod && selectedOrder.shippingMethod.price !== undefined
                    ? Math.round(selectedOrder.shippingMethod.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })
                    : "Không có thông tin"}
                </span>
              </div>

              <div className="flex justify-between items-center border-t-2 pt-2 font-semibold text-gray-800">
                <span>Tổng cộng:</span>
                <span>
                  {calculateTotalPrice(selectedOrder.orderDetails, selectedOrder.shippingMethod).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                </span>
              </div>

              {/* Thông tin thanh toán và giao hàng */}
              <div className="flex justify-between items-center border-t-2 pt-2 font-semibold text-gray-800">
                <span>Phương thức thanh toán:</span>
                <span>{selectedOrder.payment.method}</span>
              </div>

              <div className="flex justify-between items-center border-t-2 pt-2 font-semibold text-gray-800">
                <span>Phương thức giao hàng:</span>
                <span>{selectedOrder.shippingMethod.methodName}</span>
              </div>

              <div className="flex justify-between items-center border-t-2 pt-2 font-semibold text-gray-800">
                <span>Thời gian giao hàng dự kiến:</span>
                <span>{selectedOrder.shippingMethod.estimatedDeliveryTime}</span>
              </div>
              {["0", "1", "2", "3", "4"].includes(selectedOrder.status) && selectedOrder.payment.id === "1" && (
                <div className="flex justify-between items-center border-t-2 pt-2 text-green-600 font-semibold">
                  <span>Thông báo:</span>
                  <span>Đã thanh toán</span>
                </div>
              )}

              {selectedOrder.payment && selectedOrder.payment.id === "2" && (
                <div className="flex justify-between items-center border-t-2 pt-2 text-yellow-600 font-semibold">
                  <span>Thông báo:</span>
                  <span>
                    Bạn cần thanh toán {calculateTotalPrice(selectedOrder.orderDetails).toLocaleString("vi-VN", { style: "currency", currency: "VND" })} khi nhận hàng.
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 mt-4">
              {/* Thanh toán lại */}
              {selectedOrder.status === "99" && (
                <button
                  onClick={() => handlePaymentAgain(selectedOrder.id)}
                  className="bg-yellow-500 text-white px-6 py-2 rounded-full shadow-md transition duration-300 ease-in-out hover:bg-yellow-600 hover:shadow-lg transform hover:scale-105 border border-yellow-500 hover:border-yellow-600">
                  Thanh toán lại
                </button>
              )}
              {/* Hủy đơn */}
              {selectedOrder.status === "1" && (
                <div className="w-full text-left">  {/* Chiếm toàn bộ chiều rộng và căn trái */}
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id)}
                    className="bg-yellow-500 text-white px-6 py-2 rounded-full shadow-md transition duration-300 ease-in-out hover:bg-yellow-600 hover:shadow-lg transform hover:scale-105 border border-yellow-500 hover:border-yellow-600">
                    Hủy đơn
                  </button>
                </div>
              )}



              {/* Hiển thị các đơn hàng */}
              {orders.map((order) => (
                <div key={order.id} className="order-item">
                  {/* Hiển thị nút Đánh giá chỉ khi đơn hàng có trạng thái '4' và chưa đánh giá */}
                  {order.status === "4" && selectedOrder && selectedOrder.id === order.id && !hasRated && (
                    <div className="order-actions">
                      <button
                        className="btn-submit bg-blue-500 text-white px-6 py-2 rounded-full shadow-md transition duration-300 ease-in-out hover:bg-blue-600 hover:shadow-lg"
                        onClick={() => handleOpenReviewModal(order)}>
                        Đánh giá
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Form đánh giá (Modal) */}
              {isReviewModalOpen && selectedOrder && selectedOrder.status === "4" && (
                <div className="modal fixed inset-0 bg-opacity-70 z-50 flex justify-center items-center">
                  <div className="modal-content bg-black rounded-lg shadow-lg w-96 p-6">
                    <form onSubmit={handleSubmit} className="rating-form space-y-4">
                      {/* Ẩn orderId */}
                      <input
                        id="orderId"
                        type="text"
                        value={selectedOrder.id}
                        hidden
                      />

                      {/* Ẩn sizeId */}
                      <input
                        id="sizeId"
                        type="text"
                        value={selectedOrder.orderDetails && selectedOrder.orderDetails.length > 0 ? selectedOrder.orderDetails[0].size.id : sizeId}
                        hidden
                        onChange={(e) => setSizeId(e.target.value)}
                      />

                      <div className="form-group">
                        <h3 className="text-white block font-semibold">ĐÁNH GIÁ ĐƠN HÀNG</h3>
                      </div>

                      {/* Chọn số sao bằng icon ngôi sao */}
                      <div className="form-group">
                        <label htmlFor="stars" className=" text-white block font-semibold">Đánh Giá:</label>
                        <div className="star-rating flex space-x-1 text-white">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setStars(star)}
                              className={`text-2xl ${star <= stars ? 'text-yellow-500' : 'text-gray-300'
                                } transition duration-300 ease-in-out hover:scale-110`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>


                      {/* Nhập nội dung đánh giá */}
                      <div className="form-group">
                        <label htmlFor="review" className="text-white block font-semibold">Nội Dung Đánh Giá:</label>
                        <textarea
                          id="review"
                          value={review}
                          onChange={(e) => setReview(e.target.value)}
                          className="form-textarea w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      {/* Nút Gửi Đánh Giá */}
                      <button
                        type="submit"
                        className="btn-submit bg-blue-500 text-white px-6 py-2 rounded-full shadow-md transition duration-300 ease-in-out hover:bg-blue-600 hover:shadow-lg"
                      >
                        Gửi Đánh Giá
                      </button>

                      {/* Nút Đóng Modal */}
                      <button
                        onClick={handleCloseReviewModal}
                        className="bg-red-500 text-white px-6 py-2 rounded-full shadow-md transition duration-300 ease-in-out hover:bg-red-600 hover:shadow-lg transform hover:scale-105 border border-red-500 hover:border-red-600"
                      >
                        Đóng
                      </button>
                    </form>

                  </div>
                </div>
              )}
              {/* Nút Đóng Modal */}
              <button
                onClick={handleCloseDetailModal}
                className="bg-red-500 text-white px-6 py-2 rounded-full shadow-md transition duration-300 ease-in-out hover:bg-red-600 hover:shadow-lg transform hover:scale-105 border border-red-500 hover:border-red-600">
                Đóng
              </button>
            </div>
          </div>
        </>
      )}


    </>
  );
}
