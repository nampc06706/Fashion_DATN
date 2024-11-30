import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import OrderTable from '../component/OrderTable';

const OrderDetailsPage = () => {
  const { orderId } = useParams(); // Giả sử bạn có ID của đơn hàng trong URL
  const [order, setOrder] = useState([]);
  const [error, setError] = useState(null);

  const token = Cookies.get('token');

  // Tách hàm fetchOrderDetails ra để có thể gọi lại khi cần
  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/staff/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Sắp xếp các đơn hàng theo ngày tạo mới nhất với kiểu date dạng [year, month, day]
      const sortedOrders = response.data.sort((a, b) => {
        const dateA = new Date(a.date[0], a.date[1] - 1, a.date[2]); // Chuyển đổi thành ngày
        const dateB = new Date(b.date[0], b.date[1] - 1, b.date[2]); // Chuyển đổi thành ngày
        return dateB - dateA; // Sắp xếp theo thứ tự giảm dần
      });

      setOrder(sortedOrders);
    } catch (error) {
      setError("Lỗi khi tải chi tiết đơn hàng.");
    }
  };

  useEffect(() => {
    fetchOrderDetails(); // Gọi hàm fetchOrderDetails khi component được mount
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!order) {
    return <div>Đang tải chi tiết đơn hàng...</div>;
  }

  return (
    <div className="container-fluid mx-auto p-4">
      <OrderTable orders={order} token={token} fetchOrderDetails={fetchOrderDetails} />
    </div>
  );
};

export default OrderDetailsPage;
