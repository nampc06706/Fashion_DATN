import React from 'react';
import { useParams } from 'react-router-dom';

const OrderDetailsPage = () => {
  const { id } = useParams();
  // Thực hiện việc tải dữ liệu đơn hàng từ id nếu cần

  const order = {
    id,
    orderNumber: "ORD001",
    customerName: "Nguyễn Văn A",
    totalAmount: 150000,
    status: "Đã giao",
    items: [
      { id: 1, name: "Sản phẩm 1", quantity: 2, price: 50000 },
      { id: 2, name: "Sản phẩm 2", quantity: 1, price: 100000 },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chi tiết đơn hàng {order.orderNumber}</h1>
      <div className="bg-white shadow-md rounded p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Thông tin đơn hàng</h2>
        <p><strong>Tên khách hàng:</strong> {order.customerName}</p>
        <p><strong>Tổng tiền:</strong> {order.totalAmount} VND</p>
        <p><strong>Trạng thái:</strong> {order.status}</p>
      </div>
      <div className="bg-white shadow-md rounded p-4">
        <h2 className="text-xl font-semibold mb-2">Danh sách sản phẩm</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Tên sản phẩm</th>
              <th className="py-2 px-4 border-b">Số lượng</th>
              <th className="py-2 px-4 border-b">Giá</th>
              <th className="py-2 px-4 border-b">Tổng</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-4 border-b">{item.name}</td>
                <td className="py-2 px-4 border-b">{item.quantity}</td>
                <td className="py-2 px-4 border-b">{item.price} VND</td>
                <td className="py-2 px-4 border-b">{item.quantity * item.price} VND</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
