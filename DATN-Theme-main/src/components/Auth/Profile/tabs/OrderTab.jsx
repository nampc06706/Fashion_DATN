import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Sửa import cho jwtDecode

export default function OrderTab({ accountId: initialAccountId }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [accountId, setAccountId] = useState(initialAccountId);
  const token = Cookies.get("token");

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

  useEffect(() => {
    const fetchOrders = async () => {
      if (accountId) {
        try {
          const response = await axios.get(`http://localhost:8080/api/user/orders/${accountId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response.data);
          setOrders(response.data);
        } catch (error) {
          console.error("Lỗi khi lấy đơn hàng:", error);
          alert("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.");
        }
      } else {
        console.log("Không có accountId.");
      }
    };

    fetchOrders();
  }, [accountId, token]);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const getOrderStatus = (status) => {
    switch (status) {
      case '1': return "Chờ xác nhận";
      case '2': return "Đã xác nhận";
      case '3': return "Đang giao hàng";
      case '4': return "Hoàn thành";
      case '5': return "Đã hủy";
      default: return "Không xác định";
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
                    <span className={`text-sm rounded p-2 ${order.status === '4' ? 'text-green-500 bg-green-100' : 'text-red-500 bg-red-100'}`}>
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
                      onClick={() => handleOpenModal(order)}
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

      {isModalOpen && selectedOrder && (
        <>
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 z-40" onClick={handleCloseModal}></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl z-50 w-11/12 max-w-lg max-h-screen overflow-y-auto p-6 transition-transform duration-300 ease-in-out">
            <h2 className="text-3xl font-bold mb-4 text-center text-blue-800">HÓA ĐƠN THÀNH TOÁN</h2>
            <div className="flex flex-col mb-6 space-y-4">

              {/* Chi tiết đơn hàng */}
              <div className="flex justify-between items-center border-b-2 pb-2">
                <span className="font-semibold text-gray-800">Tên người nhận:</span>
                <span className="text-gray-700">{selectedOrder.address.fullname || "Tên khách hàng"}</span>
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
                        <p>{`Màu: ${detail.size?.color.name || "N/A"}`}</p>
                        <p>
                          {`Giá: ${detail.price !== undefined
                            ? Math.round(detail.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })
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

              {/* Thông báo thanh toán */}
              {selectedOrder.payment && selectedOrder.payment.id === "1" && (
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

            <div className="flex justify-end">
              <button onClick={handleCloseModal} className="bg-red-600 text-white px-6 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-red-700 transform hover:scale-105">
                Đóng
              </button>
            </div>
          </div>
        </>
      )}


    </>
  );
}
