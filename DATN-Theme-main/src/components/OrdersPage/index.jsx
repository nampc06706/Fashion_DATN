import React from 'react';
import PageTitle from "../Helpers/PageTitle";
import LayoutHomeFive from "../Partials/LayoutHomeFive";

export default function OrdersPage() {
  // Dữ liệu giả lập cho danh sách đơn hàng
  const orders = [
    {
      orderId: "123456",
      date: "2024-10-08",
      status: "Đang xử lý",
      totalAmount: "1,200,000 VND",
      shippingMethod: "Giao hàng nhanh",
      paymentMethod: "Thanh toán khi nhận hàng",
      items: [
        {
          productName: "Sản phẩm A",
          quantity: 2,
          price: "300,000 VND",
          size: "M",
        },
        {
          productName: "Sản phẩm B",
          quantity: 1,
          price: "600,000 VND",
          size: "L",
        },
      ],
    },
    {
      orderId: "123457",
      date: "2024-10-05",
      status: "Đã giao",
      totalAmount: "800,000 VND",
      shippingMethod: "Giao hàng tiêu chuẩn",
      paymentMethod: "Chuyển khoản",
      items: [
        {
          productName: "Sản phẩm C",
          quantity: 1,
          price: "800,000 VND",
          size: "S",
        },
      ],
    },
    // Thêm nhiều hóa đơn khác nếu cần
  ];

  return (
    <LayoutHomeFive childrenClasses="pt-0 pb-0">
      <div className="checkout-page-wrapper w-full bg-white pb-[60px]">
        <div className="w-full mb-5">
          <PageTitle
            title="Đơn hàng"
            breadcrumb={[{ name: "Trang chủ", path: "/" }, { name: "Đơn hàng", path: "/orders" }]}
          />
        </div>
        <div className="checkout-main-content w-full">
          <div className="container-x mx-auto">
            <div className="w-full">
              <h1 className="text-3xl font-bold text-gray-800 mb-5">Danh sách đơn hàng</h1>
              {orders.map((order, index) => (
                <div key={index} className="border rounded-lg shadow-lg bg-gray-50 p-5 mb-5 transition-transform duration-300 hover:scale-105">
                  <h2 className="text-xl font-semibold">Thông tin đơn hàng #{order.orderId}</h2>
                  <div className="mt-3">
                    <p><strong>Ngày đặt:</strong> {order.date}</p>
                    <div className="flex items-center mt-2">
                      <div className={`w-3 h-3 rounded-full ${order.status === "Đã giao" ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></div>
                      <span className={`font-semibold ${order.status === "Đã giao" ? 'text-green-500' : 'text-yellow-500'}`}>{order.status}</span>
                    </div>
                    <p><strong>Tổng tiền:</strong> {order.totalAmount}</p>
                    <p><strong>Phương thức vận chuyển:</strong> {order.shippingMethod}</p>
                    <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>
                  </div>

                  <div className="mt-5">
                    <h3 className="font-semibold text-lg">Chi tiết sản phẩm</h3>
                    <div className="border rounded-lg mt-3">
                      <table className="min-w-full">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="py-3 px-5 text-left">Sản phẩm</th>
                            <th className="py-3 px-5 text-left">Số lượng</th>
                            <th className="py-3 px-5 text-left">Giá</th>
                            <th className="py-3 px-5 text-left">Kích cỡ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, itemIndex) => (
                            <tr key={itemIndex} className="border-b hover:bg-gray-100">
                              <td className="py-2 px-5">{item.productName}</td>
                              <td className="py-2 px-5">{item.quantity}</td>
                              <td className="py-2 px-5">{item.price}</td>
                              <td className="py-2 px-5">{item.size}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LayoutHomeFive>
  );
}
