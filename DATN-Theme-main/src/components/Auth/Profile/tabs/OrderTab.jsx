import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Sửa import cho jwtDecode
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrderDetails from "./OrderDetails";
import OrderTable from "./OrderTable";

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
      if (response.data.hasRated) {
        setHasRated(true);
        setRatingStatus("Bạn đã đánh giá sản phẩm này.");
      } else {
        setHasRated(false);
        setRatingStatus("Bạn có thể đánh giá sản phẩm này.");
      }
    } catch (error) {
      console.error("Có lỗi khi kiểm tra đánh giá:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderDetails = selectedOrder?.orderDetails?.[0]; // Lấy phần tử đầu tiên từ orderDetails nếu có
    const reviewData = {
      orderId: selectedOrder.id, // Dùng selectedOrder.id
      sizeId: orderDetails ? orderDetails.size.id : sizeId, // Nếu orderDetails có thì lấy size.id, nếu không dùng sizeId từ state
      stars: stars,
      review: review,
    };
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
      setTimeout(() => {
        window.location.reload(); // Reload lại trang
      }, 1000); // Thời gian chờ 1 giây (1000ms)

    } catch (error) {
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
      } catch (error) {
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
      const response = await axios.post(
        'http://localhost:8080/api/user/payments/payment-again',
        { orderId: orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Đính kèm token vào header
          },
        }
      );
      const vnpayUrl = response.data.vnpayUrl;
      if (vnpayUrl) {
        setError(null); // Reset error state
        window.location.href = vnpayUrl; // Chuyển hướng trực tiếp
      } else {
        setError('URL thanh toán không hợp lệ');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Có lỗi xảy ra khi gọi API');
    }
  };

  const calculateTotalPrice = (orderDetails, shippingMethod) => {
    // Tính tổng tiền sản phẩm (giá * số lượng)
    const productTotal = orderDetails.reduce((total, detail) => {
      const price = parseFloat(detail.price) || 0; // Đảm bảo giá là số và không bị NaN
      const quantity = parseInt(detail.quantity, 10) || 0; // Đảm bảo số lượng là số và không bị NaN
      return total + price * quantity; // Nhân giá với số lượng và cộng dồn
    }, 0);

    // Tính chi phí vận chuyển
    const shippingCost = parseFloat(shippingMethod?.price) || 0; // Tránh lỗi khi không có shippingMethod

    // Trả về tổng tiền (tiền sản phẩm + chi phí vận chuyển)
    return productTotal + shippingCost;
  };


  return (
    <>
      <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} />
      {!isDetailModalOpen && (
        <OrderTable
          orders={orders}
          getOrderStatus={getOrderStatus}
          calculateTotalPrice={calculateTotalPrice}
          handleOpenDetailModal={handleOpenDetailModal}
        />
      )}
      {isDetailModalOpen && selectedOrder && (
        <OrderDetails
          selectedOrder={selectedOrder}
          isDetailModalOpen={isDetailModalOpen}
          handleCloseDetailModal={() => {
            setIsDetailModalOpen(false);
            setSelectedOrder(null); // Xóa thông tin đơn hàng khi đóng
          }}
          calculateTotalPrice={calculateTotalPrice}
          handlePaymentAgain={handlePaymentAgain}
          updateOrderStatus={updateOrderStatus}
          orders={orders}
          handleOpenReviewModal={handleOpenReviewModal}
          isReviewModalOpen={isReviewModalOpen}
          handleSubmit={handleSubmit}
          review={review}
          setReview={setReview}
          stars={stars}
          setStars={setStars}
          sizeId={sizeId}
          setSizeId={setSizeId}
          hasRated={hasRated}
          setSelectedOrder={setSelectedOrder}
        />
      )}
    </>
  );
  
}
