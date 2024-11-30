import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode"; // Sửa import cho jwtDecode
import Pagination from "./Pagination";


export default function OrderTab({ accountId: initialAccountId }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [accountId, setAccountId] = useState(initialAccountId);
  const [error, setError] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const token = Cookies.get("token");
  const [orderId, setOrderId] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [status, setStatus] = useState('');
  // Lọc đơn hàng theo các tiêu chí tìm kiếm
  // Lọc đơn hàng theo các tiêu chí tìm kiếm
  const filteredOrders = orders.filter((order) => {
    const matchesOrderId = orderId ? order.id.toString().includes(orderId) : true;
    const matchesOrderDate = orderDate
      ? new Date(order.date[0], order.date[1] - 1, order.date[2]).toLocaleDateString() === new Date(orderDate).toLocaleDateString()
      : true;
    const matchesStatus = status ? order.status.toString() === status : true;

    return matchesOrderId && matchesOrderDate && matchesStatus;
  });
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 6; // Số mục hiển thị trên mỗi trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
      try {
        const response = await axios.get(`http://localhost:8080/api/staff/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Sắp xếp đơn hàng theo ngày và giờ tạo mới nhất
        const sortedOrders = response.data.sort((a, b) => {
          // // Log ngày trước khi xử lý
          // console.log("Ngày đơn hàng A:", a.date);
          // console.log("Ngày đơn hàng B:", b.date);

          // Lấy năm, tháng, ngày, giờ, phút, giây từ mảng ngày (bỏ qua các phần tử không cần thiết)
          const dateA = Array.isArray(a.date)
            ? new Date(a.date[0], a.date[1] - 1, a.date[2], a.date[3], a.date[4], a.date[5])  // Năm, Tháng, Ngày, Giờ, Phút, Giây
            : new Date(a.date); // Nếu ngày không phải mảng, chuyển trực tiếp

          const dateB = Array.isArray(b.date)
            ? new Date(b.date[0], b.date[1] - 1, b.date[2], b.date[3], b.date[4], b.date[5])  // Năm, Tháng, Ngày, Giờ, Phút, Giây
            : new Date(b.date); // Nếu ngày không phải mảng, chuyển trực tiếp

          // // Log giá trị sau khi chuyển đổi
          // console.log("Ngày A sau khi chuyển đổi:", dateA);
          // console.log("Ngày B sau khi chuyển đổi:", dateB);

          // Sắp xếp theo thứ tự giảm dần (mới nhất ở trên)
          return dateB - dateA;
        });

        setOrders(sortedOrders); // Cập nhật danh sách đơn hàng đã sắp xếp
      } catch (error) {
        setError("Lỗi khi tải đơn hàng.");
        console.error("Lỗi khi lấy đơn hàng:", error);
      }
    };

    fetchOrders();
  }, [accountId, token]);




  const formatDateArray = (dateArray) => {
    const [year, month, day, hour, minute, second] = dateArray;
    return new Date(year, month - 1, day, hour, minute, second); // `month - 1` vì tháng trong Date bắt đầu từ 0
  };

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
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


  const handleStatusChange = async (orderId, newStatus) => {
    try {

      const order = orders.find(order => order.id === orderId);

      if (order.status == 4 || order.status >= newStatus) {
        toast.error("Không thể thay đổi trạng thái đơn hàng");
        return;
      }
      // Gọi API để cập nhật trạng thái đơn hàng
      const response = await axios.put('http://localhost:8080/api/staff/orders', null, {
        params: { orderId, status: newStatus },
        headers: {
          'Authorization': `Bearer ${token}`, // Thay 'token' bằng token xác thực của bạn
        },
      });

      // Giả sử `response.data` chứa đối tượng `Orders` đã cập nhật
      const updatedOrder = response.data.data;

      // Cập nhật danh sách `orders` trong state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );

      if (response.data.status === "201") {
        toast.success("Cập nhật trạng thái đơn hàng thành công");
      }
    } catch (error) {
      if (error.response) {
        // Kiểm tra mã lỗi từ server trả về
        if (error.response.status === 401) {
          toast.error("Bạn không có quyền truy cập. Vui lòng đăng nhập lại.");
        } else if (error.response.status === 400) {
          toast.error("Thông tin không hợp lệ. Vui lòng kiểm tra lại dữ liệu.");
        } else {
          toast.error("Lỗi cập nhật đơn hàng. Vui lòng thử lại.");
        }
      } else {
        toast.error("Không thể kết nối đến máy chủ.");
      }
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    }
  };

  const handlePrintBill = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Hóa Đơn Đặt Hàng</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              padding: 20px;
              background-color: #f9f9f9;
              color: #333;
              line-height: 1.6;
            }
            h2, h3 {
              text-align: center;
              color: #2c3e50;
            }
            .order-details, .product-details {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .order-details th, .order-details td, .product-details th, .product-details td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            .order-details th, .product-details th {
              background-color: #3498db;
              color: white;
              font-weight: bold;
            }
            .order-details td, .product-details td {
              background-color: #fff;
            }
            .product-details tbody tr:nth-child(even) {
              background-color: #f2f2f2;
            }
            .order-details td, .product-details td {
              text-align: right;
            }
            .order-details th, .product-details th {
              text-align: left;
            }
            .total-row {
              font-weight: bold;
              font-size: 16px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 14px;
              color: #7f8c8d;
            }
            .footer a {
              color: #3498db;
              text-decoration: none;
            }
            .footer a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <h2>Đơn Hàng #${selectedOrder.id}</h2>
  
          <table class="order-details">
            <tr><th>Tên Khách Hàng</th><td>${selectedOrder.address.fullname}</td></tr>
            <tr><th>Số Điện Thoại</th><td>0${selectedOrder.address.phone}</td></tr>
            <tr><th>Địa Chỉ Giao Hàng</th><td>${selectedOrder.address.province}, ${selectedOrder.address.district}, ${selectedOrder.address.ward}</td></tr>
            <tr><th>Ghi Chú</th><td>${selectedOrder.note}</td></tr>
            <tr><th>Phương Thức Thanh Toán</th><td>${selectedOrder.payment.method}</td></tr>
            <tr><th>Phương Thức Giao Hàng</th><td>${selectedOrder.shippingMethod.methodName}</td></tr>
            <tr><th>Thời Gian Dự Kiến Giao Hàng</th><td>${selectedOrder.shippingMethod.estimatedDeliveryTime}</td></tr>
          </table>
  
          <h3>Sản Phẩm</h3>
          <table class="product-details">
            <thead>
              <tr><th>Sản Phẩm</th><th>Kích Thước</th><th>Số Lượng</th><th>Giá</th></tr>
            </thead>
            <tbody>
              ${selectedOrder.orderDetails.map(detail => `
                <tr>
                  <td>${detail.size?.product?.name}</td>
                  <td>${detail.size?.name}</td>
                  <td>${detail.quantity}</td>
                  <td>${(detail.price ? Number(detail.price) : 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
  
          <h3>Chi Tiết Thanh Toán</h3>
          <table class="order-details">
            <tr>
              <th>Tổng Tiền Sản Phẩm</th>
              <td>${calculateTotalPrice(selectedOrder.orderDetails).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</td>
            </tr>
            <tr>
              <th>Phí Giao Hàng</th>
              <td>${selectedOrder.shippingMethod && selectedOrder.shippingMethod.price !== undefined
        ? Math.round(selectedOrder.shippingMethod.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })
        : "Không có thông tin"}</td>
            </tr>
            <tr class="total-row">
              <th>Tổng Cộng</th>
              <td>${calculateTotalPrice(selectedOrder.orderDetails, selectedOrder.shippingMethod).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</td>
            </tr>
          </table>
  
          <div class="footer">
            <p>Cảm ơn bạn đã mua hàng tại cửa hàng chúng tôi!</p>
            <p><a href="mailto:support@store.com">Liên hệ hỗ trợ</a> | <a href="https://www.store.com" target="_blank">Truy cập website</a></p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };


  return (
    <>
      <div className="relative w-full overflow-x-auto sm:rounded-lg">

        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Tìm kiếm theo mã đơn hàng */}
            <div className="flex flex-col">
              <label htmlFor="orderId" className="text-sm font-medium text-gray-700 mb-2">
                Mã đơn hàng
              </label>
              <input
                id="orderId"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tìm kiếm theo mã đơn hàng"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>

            {/* Tìm kiếm theo ngày */}
            <div className="flex flex-col">
              <label htmlFor="orderDate" className="text-sm font-medium text-gray-700 mb-2">
                Ngày đơn hàng
              </label>
              <input
                id="orderDate"
                type="date"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
              />
            </div>

            {/* Tìm kiếm theo trạng thái */}
            <div className="flex flex-col">
              <label htmlFor="status" className="text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                id="status"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Tìm kiếm theo trạng thái</option>
                <option value="1">Chờ xác nhận</option>
                <option value="2">Đã xác nhận</option>
                <option value="3">Đang giao hàng</option>
                <option value="4">Hoàn thành</option>
                <option value="5">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>


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
            {currentItems.length > 0 ? (
              currentItems.map((order) => (
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
                    <select
                      className={`text-sm rounded p-2 ${order.status === '4'
                        ? 'text-green-700 bg-green-200' // Hoàn thành
                        : order.status === '0'
                          ? 'text-emerald-700 bg-emerald-200' // Đã thanh toán, chờ xác nhận
                          : order.status === '1'
                            ? 'text-yellow-700 bg-yellow-200' // Chờ xác nhận
                            : order.status === '5'
                              ? 'text-red-700 bg-red-200' // Đã hủy
                              : order.status === '99'
                                ? 'text-gray-600 bg-gray-300' // Thanh toán thất bại
                                : 'text-blue-700 bg-blue-200' // Các trạng thái khác
                        }`}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={order.status === '99' || order.status === '4' || order.status === '5'} // Disable khi thanh toán thất bại, đã hoàn thành, hoặc đã hủy
                    >
                      <option value="0" className="text-yellow-600 bg-white">Đã thanh toán, chờ xác nhận</option>
                      <option value="1" className="text-yellow-600 bg-white">Chờ xác nhận</option>
                      <option value="2" className="text-blue-600 bg-white">Đã xác nhận</option>
                      <option value="3" className="text-orange-600 bg-white">Đang giao hàng</option>
                      <option value="4" className="text-green-600 bg-white">Hoàn thành</option>
                      {/* Ẩn "Đã hủy" nếu trạng thái là "Đã xác nhận" hoặc "Đang giao hàng" */}
                      {order.status !== '2' && order.status !== '3' && (
                        <option value="5" className="text-red-600 bg-white">Đã hủy</option>
                      )}
                      {order.status === '99' && (
                        <option value="99" className="text-gray-600 bg-white">Thanh toán thất bại ví VNPay</option>
                      )}
                    </select>
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
        {/* Điều khiển phân trang */}
        <Pagination
          totalItems={filteredOrders.length}
          itemsPerPage={itemsPerPage}
          paginate={paginate}
          currentPage={currentPage}
        />
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
              {["0", "1", "2", "3", "4"].includes(selectedOrder.status) && (
                <div className="flex justify-between items-center border-t-2 pt-2 text-green-600 font-semibold">
                  <span>Thông báo:</span>
                  <span>Đã thanh toán</span>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={handlePrintBill}
                className="bg-blue-500 text-white px-6 py-2 rounded-full shadow-md transition duration-300 ease-in-out hover:bg-blue-600 hover:shadow-lg">
                Print Bill
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-red-500 text-white px-6 py-2 rounded-full shadow-md transition duration-300 ease-in-out hover:bg-red-600 hover:shadow-lg transform hover:scale-105 border border-red-500 hover:border-red-600"
              >
                Đóng
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
