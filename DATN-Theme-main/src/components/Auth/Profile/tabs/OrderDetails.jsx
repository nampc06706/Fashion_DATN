import React from "react";
import { FaArrowLeft } from 'react-icons/fa';
const OrderDetails = ({
  selectedOrder,
  calculateTotalPrice,
  handlePaymentAgain,
  updateOrderStatus,
  isReviewModalOpen,
  handleCloseDetailModal,
  setSelectedOrder,
  handleSubmit,
  review,
  setReview,
  stars,
  setStars,
}) => {


  return (
    selectedOrder && (
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-xl space-y-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleCloseDetailModal}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 focus:outline-none transition duration-300 flex items-center space-x-2"
          >
            <FaArrowLeft className="w-5 h-5" />
          </button>

          <h2 className="text-4xl font-bold text-blue-700 mx-auto">HÓA ĐƠN THÀNH TOÁN</h2>
        </div>

        <div className="space-y-6">
          {/* Chi tiết đơn hàng */}
          <div className="border-b pb-4">
            <h3 className="text-xl font-semibold text-gray-800">Thông tin người nhận</h3>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tên người nhận:</span>
              <span className="text-gray-800">{selectedOrder.address.fullname || "Tên khách hàng"}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Số điện thoại:</span>
              <span className="text-gray-800">0{selectedOrder.address.phone || "Chưa có thông tin"}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Ghi chú:</span>
              <span className="text-gray-800">{selectedOrder.note || "Không có ghi chú"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Địa chỉ giao hàng:</span>
              <span className="text-gray-800">
                {`${selectedOrder.address.province}, ${selectedOrder.address.district}, ${selectedOrder.address.ward}, ${selectedOrder.address.note}`}
              </span>
            </div>
          </div>

          {/* Chi tiết sản phẩm */}
          <div className="space-y-4">
            {selectedOrder.orderDetails.map((detail, index) => (
              <div key={index} className="flex justify-between border-b pb-4">
                <div className="flex-grow">
                  <h4 className="text-lg font-semibold text-gray-800">{detail.size?.product?.name || "Tên sản phẩm"}</h4>
                  <div className="text-gray-700">
                    <p>{`Kích thước: ${detail.size?.name || "N/A"}`}</p>
                    <div className="w-[30px] h-[30px] rounded-full border">
                      <p
                        style={{
                          backgroundColor: detail.size?.color?.name || 'gray',
                          width: '100%',
                          height: '100%',
                          margin: 0,
                          borderRadius: '50%',
                        }}
                      />
                    </div>
                    <p>
                      {`Giá: ${detail.price !== undefined
                        ? Math.round(detail.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })
                        : "Không có thông tin"}`}
                    </p>
                    <p>{`Số lượng: ${detail.quantity}`}</p>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {detail.images && detail.images.length > 0 ? (
                    <img
                      src={`/assets/images/${detail.images[0].image}`}
                      alt={detail.size?.product?.name || "Hình ảnh sản phẩm"}
                      className="h-24 w-24 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="h-24 w-24 bg-gray-300 flex items-center justify-center rounded-lg">
                      <span className="text-gray-500">Không có hình ảnh</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Tổng tiền và phí giao hàng */}
          <div className="border-t pt-4 text-xl font-semibold text-gray-800">
            <div className="flex justify-between mb-2">
              <span>Tổng tiền:</span>
              <span>{calculateTotalPrice(selectedOrder.orderDetails).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Phí giao hàng:</span>
              <span>
                {selectedOrder.shippingMethod && selectedOrder.shippingMethod.price !== undefined
                  ? Math.round(selectedOrder.shippingMethod.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })
                  : "Không có thông tin"}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tổng cộng:</span>
              <span>
                {calculateTotalPrice(selectedOrder.orderDetails, selectedOrder.shippingMethod).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
              </span>
            </div>
          </div>

          {/* Thông tin thanh toán và giao hàng */}
          <div className="border-t pt-4 text-gray-800">
            <div className="flex justify-between mb-2">
              <span>Phương thức thanh toán:</span>
              <span>{selectedOrder.payment.method}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Phương thức giao hàng:</span>
              <span>{selectedOrder.shippingMethod.methodName}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Thời gian giao hàng dự kiến:</span>
              <span>{selectedOrder.shippingMethod.estimatedDeliveryTime}</span>
            </div>
          </div>

          {/* Thông báo trạng thái */}
          {["0", "1", "2", "3", "4"].includes(selectedOrder.status) && selectedOrder.payment.id === "1" && (
            <div className="bg-green-100 text-green-700 p-2 rounded-lg text-center mb-4">
              <span>Đã thanh toán</span>
            </div>
          )}

          {selectedOrder.payment && selectedOrder.payment.id === "2" && (
            <div className="bg-yellow-100 text-yellow-700 p-2 rounded-lg text-center mb-4">
              <span>
                Bạn cần thanh toán {calculateTotalPrice(selectedOrder.orderDetails, selectedOrder.shippingMethod).toLocaleString("vi-VN", { style: "currency", currency: "VND" })} khi nhận hàng.
              </span>
            </div>
          )}

          {/* Các nút hành động */}
          <div className="flex justify-end mt-6 space-x-4">
            {selectedOrder.status === "99" && (
              <button
                onClick={() => handlePaymentAgain(selectedOrder.id)}
                className="bg-yellow-500 text-white px-6 py-2 rounded-full shadow-md transition duration-300 ease-in-out hover:bg-yellow-600 hover:shadow-lg transform hover:scale-105 border border-yellow-500 hover:border-yellow-600">
                Thanh toán lại
              </button>
            )}

            {selectedOrder.status === "1" && (
              <div className="w-full text-left">
                <button
                  onClick={() => updateOrderStatus(selectedOrder.id)}
                  className="bg-red-500 text-white px-6 py-2 rounded-full shadow-md transition duration-300 ease-in-out hover:bg-red-600 hover:shadow-lg transform hover:scale-105 border border-red-500 hover:border-red-600">
                  Hủy đơn
                </button>
              </div>
            )}
          </div>

          {/* Form đánh giá */}
          {isReviewModalOpen && selectedOrder && selectedOrder.status === "4" && (
            <div className="space-y-4 mt-6">
              <h3 className="font-semibold text-xl text-center">Đánh giá sản phẩm</h3>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className={`cursor-pointer text-${i <= stars ? "yellow" : "gray"}-500`}
                    onClick={() => setStars(i)}>
                    ★
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Đánh giá sản phẩm"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
              </div>
              <div className="flex justify-center mt-4">
                <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-full">
                  Gửi đánh giá
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default OrderDetails;
