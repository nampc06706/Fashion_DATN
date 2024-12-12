import React, { useState } from "react";

const OrderTable = ({
  orders,
  getOrderStatus,
  calculateTotalPrice,
  handleOpenDetailModal,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5; // Số lượng đơn hàng trên mỗi trang

  // Tính toán dữ liệu để hiển thị trên trang hiện tại
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Tổng số trang
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // Hàm chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="relative w-full overflow-x-auto sm:rounded-lg shadow-lg bg-white">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-gray-800">
          <tr>
            <th className="py-4 text-center">Đặt hàng</th>
            <th className="py-4 text-center">Ngày</th>
            <th className="py-4 text-center">Trạng thái</th>
            <th className="py-4 text-center">Tổng tiền</th>
            <th className="py-4 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
              <tr
                key={order.id}
                className="bg-white border-b hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="text-center py-4 font-semibold text-gray-800">
                  #{order.id}
                </td>
                <td className="text-center py-4 px-2 text-gray-700">
                  {new Date(
                    order.date[0],
                    order.date[1] - 1,
                    order.date[2],
                    order.date[3],
                    order.date[4],
                    order.date[5]
                  ).toLocaleString("vi-VN")}
                </td>
                <td className="text-center py-4 px-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "5" || order.status === "99"
                        ? "bg-red-100 text-red-600"
                        : order.status === "4"
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {getOrderStatus(order.status)}
                  </span>
                </td>
                <td className="text-center py-4 px-2 font-bold text-gray-800">
                  {calculateTotalPrice(order.orderDetails, order.shippingMethod).toLocaleString(
                    "vi-VN",
                    { style: "currency", currency: "VND" }
                  )}
                </td>
                <td className="text-center py-4">
                  <button
                    type="button"
                    onClick={() => handleOpenDetailModal(order)}
                    className="w-[116px] h-[46px] bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition-all duration-200"
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-500">
                Không có đơn hàng nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Điều hướng phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center py-4">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 mx-1 rounded ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } hover:bg-blue-400 transition-all duration-200`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTable;
