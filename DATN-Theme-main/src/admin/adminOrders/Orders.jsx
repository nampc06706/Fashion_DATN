// OrderDetailsPage.js
import React from 'react';
import { useParams } from 'react-router-dom';

const orders = [
  {
    id: 1,
    orderNumber: "ORD001",
    customerName: "Nguyễn Văn A",
    totalAmount: 150000,
    status: "Đã giao",
    items: [
      { productName: "Sản phẩm 1", quantity: 2, price: 50000 },
      { productName: "Sản phẩm 2", quantity: 1, price: 100000 },
    ],
  },
  {
    id: 2,
    orderNumber: "ORD002",
    customerName: "Trần Thị B",
    totalAmount: 200000,
    status: "Chưa giao",
    items: [
      { productName: "Sản phẩm 3", quantity: 1, price: 200000 },
    ],
  },
];

const OrderDetailsPage = () => {
  const { id } = useParams();
  const order = orders.find(order => order.id === parseInt(id));

  if (!order) return <div>Đơn hàng không tồn tại.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chi tiết đơn hàng {order.orderNumber}</h1>
      <p><strong>Tên khách hàng:</strong> {order.customerName}</p>
      <p><strong>Tổng tiền:</strong> {order.totalAmount} VND</p>
      <p><strong>Trạng thái:</strong> {order.status}</p>
      <h2 className="text-xl font-semibold mt-4">Sản phẩm trong đơn hàng:</h2>
      <table className="min-w-full bg-white border border-gray-300 mt-2">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Tên sản phẩm</th>
            <th className="py-2 px-4 border-b">Số lượng</th>
            <th className="py-2 px-4 border-b">Giá</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{item.productName}</td>
              <td className="py-2 px-4 border-b">{item.quantity}</td>
              <td className="py-2 px-4 border-b">{item.price} VND</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetailsPage;